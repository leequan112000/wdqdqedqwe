import { Prisma } from '@prisma/client';
import { Client } from '@googlemaps/google-maps-services-js';

import invariant from '../helper/invariant';
import { prisma } from '../prisma';
import { availabilitiesCreateData } from '../helper/availability';

const client = new Client({});

const main = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        availability: {
          none: {},
        },
      },
      include: {
        customer: {
          include: {
            biotech: true,
          },
        },
        vendor_member: {
          include: {
            vendor_company: true,
          },
        },
      },
    });

    invariant(process.env.GOOGLE_MAPS_API_KEY, 'no api');

    const data = users.reduce<{ user_id: string; company_address: string }[]>(
      (acc, cur) => {
        const isCustomer = !!cur.customer?.biotech;
        const isVendor = !!cur.vendor_member?.vendor_company;
        let companyAddress;
        switch (true) {
          case isCustomer: {
            companyAddress = cur.customer!.biotech.address;
            break;
          }
          case isVendor: {
            companyAddress = cur.vendor_member!.vendor_company!.address;
            break;
          }
          default:
        }

        if (companyAddress) {
          return [...acc, { user_id: cur.id, company_address: companyAddress }];
        }

        return acc;
      },
      [],
    );

    const tasks = data.map(async (d) => {
      try {
        const geocode = await client.geocode({
          params: {
            address: d.company_address,
            key: process.env.GOOGLE_MAPS_API_KEY!,
          },
        });
        if (geocode.data.results.length > 0) {
          const location = geocode.data.results[0].geometry.location;

          const tzResp = await client.timezone({
            params: {
              key: process.env.GOOGLE_MAPS_API_KEY!,
              location,
              timestamp: new Date(),
            },
          });
          const timezone = tzResp.data.timeZoneId;

          return { ...d, timezone };
        }
      } catch (error) {
        console.log(error);
      }

      return { ...d, timezone: undefined };
    });

    const results = await Promise.all(tasks);

    const createInputData = results
      .filter((r) => !!r.timezone)
      .reduce<Prisma.AvailabilityCreateManyInput[]>((acc, r) => {
        const availabilities = availabilitiesCreateData(r.timezone!, r.user_id);
        return [...acc, ...availabilities];
      }, []);

    await prisma.availability.createMany({
      data: createInputData,
    });

    console.log('Operation done.');
  } catch (error) {
    console.log('Operation failed.');
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
  process.exit(0);
};

main();
