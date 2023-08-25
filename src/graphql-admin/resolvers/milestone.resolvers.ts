import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import { PublicError } from "../../graphql/errors/PublicError";
import { toDollar } from "../../helper/money";
import { MilestonePaymentStatus } from "../../helper/constant";
import { getStripeInstance } from "../../helper/stripe";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  Mutation: {
    payVendor: async (_, args, context) => {
      const { id } = args;
      const milestone = await context.prisma.milestone.findFirst({
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

      invariant(milestone, new PublicError('Milestone not found!'));
      invariant(milestone.payment_status === MilestonePaymentStatus.PAID, new PublicError('Milestone has not been paid by the biotech yet'));
      invariant(
        milestone.vendor_payment_status !== MilestonePaymentStatus.PROCESSING
        && milestone.vendor_payment_status !== MilestonePaymentStatus.PAID,
        new PublicError('Milestone has paid to the vendor.'),
      );

      const vendorCompany = milestone.quote.project_connection.vendor_company;
      invariant(vendorCompany.stripe_account, new PublicError('Vendor company has no Stripe account'));

      try {
        const stripe = await getStripeInstance();
        const transfer = await stripe.transfers.create({
          amount: milestone.amount.toNumber(),
          currency: 'usd',
          destination: vendorCompany.stripe_account,
          metadata: { vendor_company_id: vendorCompany.id, milestone_id: milestone.id, quote_id: milestone.quote_id },
        });

        // Check if stripe transfer success
        invariant(transfer.id, new PublicError('Stripe Transfer: Missing transfer Id'));

        const updatedMilestone = await context.prisma.milestone.update({
          where: {
            id,
          },
          data: {
            vendor_payment_status: MilestonePaymentStatus.PROCESSING
          }
        });

        return {
          ...updatedMilestone,
          amount: toDollar(milestone.amount.toNumber())
        };
      } catch (error: any) {
        if (error.raw) {
          await context.prisma.milestone.update({
            where: {
              id,
            },
            data: {
              vendor_payment_status: error.raw.code || MilestonePaymentStatus.UNPAID
            }
          });
          throw new PublicError(`${error.raw.code} (Milestone #${milestone.id}) Transfer to connected account failed for ${vendorCompany.name}`);
        }

        throw new PublicError(error as string);
      }
    },
  }
}

export default resolvers;
