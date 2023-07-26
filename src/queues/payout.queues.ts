import { AdminTeam, MilestonePaymentStatus } from "../helper/constant";
import { createQueue } from "../helper/queue";
import { prisma } from "../connectDB";
import { getStripeInstance } from "../helper/stripe";
import { sendAdminGeneralNoticeEmail } from "../mailer/admin";
import invariant from "../helper/invariant";

type PayoutJob = {
  data: any;
}

const payoutQueue = createQueue<PayoutJob>('payout');

payoutQueue.process(async (job, done) => {
  const { data } = job.data;
  const id = data.milestoneId;

  const milestone = await prisma.milestone.findFirst({
    where: {
      id,
    },
    include: {
      quote: {
        include: {
          project_connection: {
            include: {
              vendor_company: true
            }
          }
        }
      }
    }
  });

  invariant(milestone, 'Milestone not found.');
  invariant(milestone.payment_status === MilestonePaymentStatus.PAID, 'Milestone has not been paid by the biotech yet.');
  invariant(
    milestone.vendor_payment_status !== MilestonePaymentStatus.PROCESSING
    && milestone.vendor_payment_status !== MilestonePaymentStatus.PAID,
    'Milestone has paid to the vendor.',
  );

  const vendorCompany = milestone.quote.project_connection.vendor_company;
  invariant(vendorCompany.stripe_account, 'Vendor company has no Stripe account.');

  try {
    const stripe = await getStripeInstance();
    const transfer = await stripe.transfers.create({
      amount: milestone.amount.toNumber(),
      currency: 'usd',
      destination: vendorCompany.stripe_account,
      metadata: { vendor_company_id: vendorCompany.id, milestone_id: milestone.id, quote_id: milestone.quote_id },
    });

    // Check if stripe transfer success
    invariant(transfer?.id, 'Stripe Transfer: Missing transfer Id.');

    await prisma.milestone.update({
      where: {
        id,
      },
      data: {
        vendor_payment_status: MilestonePaymentStatus.PROCESSING
      }
    });

    done();
  } catch (error: any) {
    let errorMessage = '';
    const admins = await prisma.admin.findMany({
      where: {
        team: AdminTeam.SCIENCE
      }
    });

    await prisma.milestone.update({
      where: {
        id,
      },
      data: {
        vendor_payment_status: MilestonePaymentStatus.UNPAID
      }
    });

    if (error.raw) {
      errorMessage = `${error.raw.code} (Milestone #${milestone.id}) Transfer to connected account failed for ${vendorCompany.name}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    await Promise.all(
      admins.map((admin) => sendAdminGeneralNoticeEmail(admin, {
        subject: `Vendor payout to ${vendorCompany.name} has failed`,
        preheader: "Vendor payout failed",
        button_label: "Retry payout",
        content_title: `Vendor payout failure`,
        content_body: `We regret to inform you that the vendor payout to ${vendorCompany.name} with milestone: ${milestone.title} (${milestone.id}) has failed due to “${errorMessage}”`,
        content_footer: "Please kindly reach out to the vendor or engineering team if necessary to investigate and resolve this issue",
      }))
    );

    done(error instanceof Error ? error : new Error(errorMessage));
  }
});

export const payVendorJob = (data: {
  milestoneId: string;
}) => {
  payoutQueue.add({ data });
}
