import { ServiceContext } from '../../types/context';

type UpdateVendorCompanyCertificationTagArg = {
  vendor_company_id: string;
  certification_tag_ids: string[];
  new_certification_tag_names: string[];
};

const updateVendorCompanyCertificationTag = async (
  args: UpdateVendorCompanyCertificationTagArg,
  ctx: ServiceContext,
) => {
  const {
    certification_tag_ids: certificationTagIds,
    new_certification_tag_names,
    vendor_company_id,
  } = args;

  let newTagIds: string[] = [];
  // Check if certification tag exist
  if (new_certification_tag_names && new_certification_tag_names.length > 0) {
    const existingCertificationTag = await ctx.prisma.certificationTag.findMany(
      {
        where: {
          full_name: {
            in: new_certification_tag_names as string[],
          },
        },
      },
    );

    let verifiedNewCertificationTagNames = new_certification_tag_names;
    if (existingCertificationTag.length > 0) {
      newTagIds = newTagIds.concat(existingCertificationTag.map((c) => c.id));

      verifiedNewCertificationTagNames = new_certification_tag_names.filter(
        (n) =>
          !existingCertificationTag
            .map((c) => c.full_name)
            .includes(n as string),
      );
    }

    // Create new tag by user
    if (verifiedNewCertificationTagNames.length > 0) {
      await ctx.prisma.certificationTag.createMany({
        data: verifiedNewCertificationTagNames.map((name) => {
          return {
            full_name: name as string,
          };
        }),
      });

      const newCertificationTags = await ctx.prisma.certificationTag.findMany({
        where: {
          full_name: {
            in: verifiedNewCertificationTagNames as string[],
          },
        },
      });

      newTagIds = newTagIds.concat(
        newCertificationTags.map((c) => c.id.toString()),
      );
    }
  }

  const certificationTagConnections =
    await ctx.prisma.certificationTagConnection.findMany({
      where: {
        vendor_company_id,
      },
      include: {
        certification_tag: true,
      },
    });
  const certificationTags = certificationTagConnections.map(
    (c) => c.certification_tag,
  );
  // Disconnect the existing certification tag connections
  await ctx.prisma.certificationTagConnection.deleteMany({
    where: {
      vendor_company_id,
      certification_tag_id: {
        in: certificationTags.map((c) => c.id),
      },
    },
  });

  // Connect the new certification tags
  const tagsToBeConnected = [...certificationTagIds, ...newTagIds];
  if (tagsToBeConnected.length > 0) {
    await ctx.prisma.certificationTagConnection.createMany({
      data: tagsToBeConnected.map((id) => {
        return {
          certification_tag_id: id as string,
          vendor_company_id,
        };
      }),
    });
  }
};

type UpdateVendorCompanyLabSpecializationArgs = {
  vendor_company_id: string;
  lab_specialization_ids: string[];
  new_lab_specialization_names: string[];
};

const updateVendorCompanyLabSpecialization = async (
  args: UpdateVendorCompanyLabSpecializationArgs,
  ctx: ServiceContext,
) => {
  const {
    vendor_company_id,
    lab_specialization_ids: labSpecializationIds,
    new_lab_specialization_names,
  } = args;
  let newSpecializationIds: string[] = [];
  // Check if lab specialization exist
  if (new_lab_specialization_names && new_lab_specialization_names.length > 0) {
    const existingLabSpecialization =
      await ctx.prisma.labSpecialization.findMany({
        where: {
          full_name: {
            in: new_lab_specialization_names as string[],
          },
        },
      });

    let verifiedNewLabSpecializationNames = new_lab_specialization_names;
    if (existingLabSpecialization.length > 0) {
      newSpecializationIds = newSpecializationIds.concat(
        existingLabSpecialization.map((c) => c.id),
      );

      verifiedNewLabSpecializationNames = new_lab_specialization_names.filter(
        (n) =>
          !existingLabSpecialization
            .map((c) => c.full_name)
            .includes(n as string),
      );
    }

    // Create new specialization by user
    if (verifiedNewLabSpecializationNames.length > 0) {
      await ctx.prisma.labSpecialization.createMany({
        data: verifiedNewLabSpecializationNames.map((name) => {
          return {
            full_name: name as string,
          };
        }),
      });

      const newLabSpecializations = await ctx.prisma.labSpecialization.findMany(
        {
          where: {
            full_name: {
              in: verifiedNewLabSpecializationNames as string[],
            },
          },
        },
      );

      newSpecializationIds = newSpecializationIds.concat(
        newLabSpecializations.map((c) => c.id.toString()),
      );
    }
  }

  const labSpecializationConnections =
    await ctx.prisma.labSpecializationConnection.findMany({
      where: {
        vendor_company_id,
      },
      include: {
        lab_specialization: true,
      },
    });

  const labSpecializations = labSpecializationConnections.map(
    (c) => c.lab_specialization,
  );
  // Disconnect the existing lab specialization connections
  await ctx.prisma.labSpecializationConnection.deleteMany({
    where: {
      vendor_company_id,
      lab_specialization_id: {
        in: labSpecializations.map((c) => c.id),
      },
    },
  });

  // Connect the new lab specializations
  const specializationsToBeConnected = [
    ...labSpecializationIds,
    ...newSpecializationIds,
  ];
  if (specializationsToBeConnected.length > 0) {
    await ctx.prisma.labSpecializationConnection.createMany({
      data: specializationsToBeConnected.map((id) => {
        return {
          lab_specialization_id: id as string,
          vendor_company_id,
        };
      }),
    });
  }
};

const vendorCompanyService = {
  updateVendorCompanyLabSpecialization,
  updateVendorCompanyCertificationTag,
};

export default vendorCompanyService;
