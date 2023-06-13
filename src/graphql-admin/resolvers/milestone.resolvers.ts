import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import { PublicError } from "../../graphql/errors/PublicError";
import { toDollar } from "../../helper/money";
import { MilestonePaymentStatus } from "../../helper/constant";
import { getStripeInstance } from "../../helper/stripe";

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

      if (!milestone) {
        throw new PublicError('Milestone not found!');
      }

      if (milestone.payment_status !== MilestonePaymentStatus.PAID) {
        throw new PublicError('Milestone has not been paid by the biotech yet');
      }

      if (milestone.vendor_payment_status === MilestonePaymentStatus.PROCESSING || milestone.vendor_payment_status === MilestonePaymentStatus.PAID) {
        throw new PublicError('Milestone has paid to the vendor');
      }

      const vendorCompany = milestone.quote.project_connection.vendor_company;

      if (!vendorCompany.stripe_account) {
        throw new PublicError('Vendor company has no Stripe account');
      }

      try {
        const stripe = await getStripeInstance();
        const transfer = await stripe.transfers.create({
          amount: milestone.amount.toNumber(),
          currency: 'usd',
          destination: vendorCompany.stripe_account,
          metadata: { vendorCompanyId: vendorCompany.id, milestoneId: milestone.id, quoteId: milestone.quote_id },
        });

        // Check if stripe transfer success
        if (!transfer?.id) {
          throw new PublicError('Stripe Transfer: Missing transfer Id');
        }

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
          // await Order.query(trx).findById(order.id).patch({ transfer_status: e.raw.code });
        }

        throw new PublicError(error as string);
      }
    },
  }
}

export default resolvers;
