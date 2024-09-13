import { Prisma } from '@prisma/client';
import { encrypt, decrypt } from '../helper/gdprHelper';
export const userPseudonymExtension = Prisma.defineExtension({
  query: {
    userPseudonyms: {
      async create({ args, query }) {
        args.data.first_name = encrypt(args.data.first_name);
        args.data.last_name = encrypt(args.data.last_name);
        args.data.email = encrypt(args.data.email);
        args.data.phone_number = encrypt(args.data.phone_number);
        args.data.country_code = encrypt(args.data.country_code);
        return query(args);
      },
      async update({ args, query }) {
        args.data.first_name = encrypt(args.data.first_name) || null;
        args.data.last_name = encrypt(args.data.last_name);
        args.data.email = encrypt(args.data.email);
        args.data.phone_number = encrypt(args.data.phone_number);
        args.data.country_code = encrypt(args.data.country_code);
        return query(args);
      },
    },
  },
  result: {
    userPseudonyms: {
      first_name: {
        needs: { first_name: true },
        compute({ first_name }) {
          console.log('first_name', first_name);
          console.log();
          return decrypt(first_name);
        },
      },
      last_name: {
        needs: { last_name: true },
        compute({ last_name }) {
          console.log(last_name);
          return decrypt(last_name);
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
          return decrypt(phone_number);
        },
      },
      country_code: {
        needs: { country_code: true },
        compute({ country_code }) {
          return decrypt(country_code);
        },
      },
    },
  },
});
