import fs from 'fs';
import { parse } from 'csv-parse';
import { prismaCRODb } from '../prisma';

const importVendorCompanySubspecialties = async (records: any) => {
  try {
    await Promise.all(
      records.map(async (record: any) => {
        const vendor_company_id = record['ID'];

        const vendor_company = await prismaCRODb.vendorCompany.findFirst({
          where: {
            id: vendor_company_id,
          },
        });

        if (!vendor_company) {
          console.log(`Vendor company not found: ${vendor_company_id}`);
          return;
        }

        const specialty_name = record['Specialties'];
        const subspecialty_name = record['Subspecialties'];
        const specialty = await prismaCRODb.specialty.findFirst({
          where: {
            name: {
              equals: specialty_name.trim(),
              mode: 'insensitive',
            },
          },
        });

        if (!specialty) {
          console.log(`Specialty not found: ${specialty_name}`);
          return;
        }

        const subspecialty = await prismaCRODb.subspecialty.findFirst({
          where: {
            name: {
              equals: subspecialty_name.trim(),
              mode: 'insensitive',
            },
            specialty_id: specialty.id,
          },
        });

        if (!subspecialty) {
          console.log(
            `Subspecialty not found: [${specialty_name}] ${subspecialty_name}`,
          );
          return;
        }

        if (subspecialty) {
          return await prismaCRODb.vendorCompanySubspecialty.upsert({
            where: {
              subspecialty_id_vendor_company_id: {
                subspecialty_id: subspecialty.id,
                vendor_company_id,
              },
            },
            update: {
              subspecialty_id: subspecialty.id,
              vendor_company_id,
            },
            create: {
              subspecialty_id: subspecialty.id,
              vendor_company_id,
            },
          });
        }
      }),
    );
    console.log('Import vendor company subspecialties done.');
  } catch (error) {
    console.log('Import vendor company subspecialties failed.');
    console.log(error);
  }
};

const importVendorCompanyTypes = async (records: any) => {
  try {
    const recordsToCreate: {
      company_type: string;
      vendor_company_id: string;
    }[] = [];
    await Promise.all(
      records.map(async (record: any) => {
        const vendor_company_id = record['ID'];
        const company_types = record['Type'].split(', ');
        await Promise.all(
          company_types.map(async (company_type: string) => {
            const existingRecord =
              await prismaCRODb.vendorCompanyType.findFirst({
                where: {
                  vendor_company_id,
                  company_type,
                },
              });

            if (
              company_type &&
              !existingRecord &&
              !recordsToCreate.some(
                (record) =>
                  record.company_type === company_type &&
                  record.vendor_company_id === vendor_company_id,
              )
            ) {
              recordsToCreate.push({
                company_type,
                vendor_company_id,
              });
            }
          }),
        );
      }),
    );

    await prismaCRODb.vendorCompanyType.createMany({
      data: recordsToCreate,
    });
    console.log('Import vendor company types done.');
  } catch (error) {
    console.log('Import vendor company types failed.');
    console.log(error);
  }
};

const importVendorCompanyCertifications = async (records: any) => {
  try {
    await Promise.all(
      records.map(async (record: any) => {
        const vendor_company_id = record['ID'];
        const certifications = record['Certifications'].split(', ');
        if (certifications.length > 0) {
          await Promise.all(
            certifications.map(async (certification_name: string) => {
              const existingRecord =
                await prismaCRODb.vendorCompanyCertification.findFirst({
                  where: {
                    vendor_company_id,
                    certification_name,
                  },
                });

              if (!existingRecord && certification_name) {
                await prismaCRODb.vendorCompanyCertification.create({
                  data: {
                    certification_name,
                    vendor_company_id,
                  },
                });
              }
            }),
          );
        }
      }),
    );
    console.log('Import vendor company certifications done.');
  } catch (error) {
    console.log('Import vendor company certifications failed.');
    console.log(error);
  }
};

const importVendorCompanyLocations = async (records: any) => {
  try {
    const recordsToCreate: { country: string; vendor_company_id: string }[] =
      [];
    await Promise.all(
      records.map(async (record: any) => {
        const vendor_company_id = record['ID'];
        const countries = record['Location'].split(', ');
        await Promise.all(
          countries.map(async (country: string) => {
            const existingRecord =
              await prismaCRODb.vendorCompanyLocation.findFirst({
                where: {
                  vendor_company_id,
                  country,
                },
              });

            if (
              !existingRecord &&
              !recordsToCreate.some(
                (record) =>
                  record.country === country &&
                  record.vendor_company_id === vendor_company_id,
              )
            ) {
              recordsToCreate.push({
                country,
                vendor_company_id,
              });
            }
          }),
        );
      }),
    );

    await prismaCRODb.vendorCompanyLocation.createMany({
      data: recordsToCreate,
    });
    console.log('Import vendor company locations done.');
  } catch (error) {
    console.log('Import vendor company locations failed.');
    console.log(error);
  }
};

const main = async () => {
  try {
    const csvFilePath = process.env.CRO_DB_CSV_PATH!;
    const data = await fs.promises.readFile(csvFilePath, 'utf8');

    const records: any = await new Promise((resolve, reject) => {
      parse(data, { columns: true, trim: true }, (csvErr, records) => {
        if (csvErr) {
          reject(csvErr);
        } else {
          resolve(records);
        }
      });
    });

    await importVendorCompanySubspecialties(records);
    await importVendorCompanyTypes(records);
    await importVendorCompanyCertifications(records);
    await importVendorCompanyLocations(records);
    console.log('Operation done.');
  } catch (error) {
    console.log('Operation failed.');
    console.log(error);
  } finally {
    await prismaCRODb.$disconnect();
  }
  process.exit(0);
};

main();
