import { VendorCompany } from "../../prisma-cro/generated/client";
import { prismaCRODb } from "../prisma";

const extractAndGetAvgCompanySize = (vendorCompany: VendorCompany) => {
  const companySizeRange = vendorCompany.company_size || "0-0";
  const [min, max] = companySizeRange.replace(/,/g, "").split(/–|-/).map(Number);
  const avg = (min + max) / 2.0;
  return avg; // Use the average value for comparison
};

const extractRevenueValue = (revenueCode: string | null): number => {
  switch (revenueCode) {
    case "r_00000000":
      return 0;
    case "r_00001000":
      return 1_000_000;
    case "r_00010000":
      return 10_000_000;
    case "r_00050000":
      return 50_000_000;
    case "r_00100000":
      return 100_000_000;
    case "r_00500000":
      return 500_000_000;
    case "r_010000000":
      return 1_000_000_000;
    case "r_100000000":
      return Infinity;
    default:
      return 0;
  }
};


/**
 * This script transform vendor company details:
 * - company size (string) -> average company size (number)
 * - revenue (string) -> revenue value (number)
 */
const main = async () => {
  console.log("Fetching vendor companies...");
  const vendorCompanies = await prismaCRODb.vendorCompany.findMany();

  console.log("Preparing update payloads...");
  const payloads = vendorCompanies.map((vendorCompany) => {
    const avgCompanySize = extractAndGetAvgCompanySize(vendorCompany);
    const revenueValue = extractRevenueValue(vendorCompany.company_revenue);
    return {
      id: vendorCompany.id,
      companyAverageSize: avgCompanySize,
      companyRevenueValue: revenueValue,
    };
  });

  console.log("Start updating vendor companies...");
  await prismaCRODb.$transaction(async (trx) => {
    const updateTasks = payloads.map(async (d) => {
      return await trx.vendorCompany.update({
        where: {
          id: d.id,
        },
        data: {
          company_average_size: d.companyAverageSize,
          company_revenue_value: d.companyRevenueValue,
        },
      });
    });

    const updated = await Promise.all(updateTasks);
    console.log(`Successfully updated ${updated.length} vendor companies!`);
  });

  console.log("Exiting...");
  process.exit(0);
};

main();
