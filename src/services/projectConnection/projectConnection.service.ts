import { ServiceContext } from '../../types/context';

type CheckIfUserInProjectConnectionArgs = {
  user_id: string;
  project_connection_id: string;
};

export const checkIfUserInProjectConnection = async (
  args: CheckIfUserInProjectConnectionArgs,
  ctx: ServiceContext,
) => {
  const { project_connection_id, user_id } = args;

  const cc = await ctx.prisma.customerConnection.findFirst({
    where: {
      customer: {
        user_id,
      },
      project_connection_id,
    },
  });

  const vmc = await ctx.prisma.vendorMemberConnection.findFirst({
    where: {
      vendor_member: {
        user_id,
      },
      project_connection_id,
    },
  });

  return !!cc || !!vmc;
};
