import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import PromisePool from '@supercharge/promise-pool';
import { VendorCompany } from '../../prisma-cro/generated/client';
import { prismaCRODb } from '../prisma';
import {
  extractAndGetAvgCompanySize,
  extractRevenueValue,
} from '../helper/vendorCompany';

const argv = yargs(hideBin(process.argv))
  .option('size', {
    describe: '(Optional) Batch size',
    type: 'number',
    default: 300, // Default value if the argument is not provided
  })
  .parseSync();

const BATCH_SIZE = argv.size;

type Payload = {
  id: string;
  companyAverageSize: number;
  companyRevenueValue: number;
};

const divideDataIntoBatches = (data: Payload[], batchSize: number) => {
  const batches = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    batches.push(batch);
  }

  return batches;
};

const processBatch = async (batch: Payload[]) => {
  const task = await PromisePool.withConcurrency(10)
    .for(batch)
    .process(async (item) => {
      return await prismaCRODb.vendorCompany.update({
        where: {
          id: item.id,
        },
        data: {
          company_average_size: item.companyAverageSize,
          company_revenue_value: item.companyRevenueValue,
        },
      });
    });
  return task.results;
};

/**
 * This script transform vendor company details:
 * - company size (string) -> average company size (number)
 * - revenue (string) -> revenue value (number)
 */
const main = async () => {
  console.log('Fetching vendor companies...');
  const vendorCompanies = await prismaCRODb.vendorCompany.findMany();

  console.log('Preparing update payloads...');
  const payloads: Payload[] = vendorCompanies.map((vendorCompany) => {
    const avgCompanySize = extractAndGetAvgCompanySize(
      vendorCompany.company_size,
    );
    const revenueValue = extractRevenueValue(vendorCompany.company_revenue);
    return {
      id: vendorCompany.id,
      companyAverageSize: avgCompanySize,
      companyRevenueValue: revenueValue,
    };
  });
  const batches = divideDataIntoBatches(payloads, BATCH_SIZE);

  console.log('Start updating vendor companies...');
  const allResults: VendorCompany[] = [];
  for (const [index, batch] of batches.entries()) {
    console.log(`Processing batch ${index + 1}...`);
    const batchResults = await processBatch(batch);
    allResults.push(...batchResults);
  }

  console.log(`Successfully updated ${allResults.length} vendor companies!`);
  console.log('Exiting...');
  process.exit(0);
};

main();
