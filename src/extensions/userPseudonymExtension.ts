import { Prisma } from '@prisma/client';
import { decrypt } from '../helper/gdprHelper';
export const userPseudonymExtension = Prisma.defineExtension({
  result: {
    user: {
      first_name: {
        needs: { first_name: true },
        compute({ first_name }) {
          return decrypt(first_name) || null;
        },
      },
      last_name: {
        needs: { last_name: true },
        compute({ last_name }) {
          return decrypt(last_name) || null;
        },
      },
      email: {
        needs: { email: true },
        compute({ email }) {
          return decrypt(email);
        },
      },
      phone_number: {
        needs: { phone_number: true },
        compute({ phone_number }) {
          return decrypt(phone_number) || null;
        },
      },
      country_code: {
        needs: { country_code: true },
        compute({ country_code }) {
          return decrypt(country_code) || null;
        },
      },
    },
  },
});
