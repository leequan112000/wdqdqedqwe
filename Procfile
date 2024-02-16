web: node dist/server.js

release: npx prisma migrate deploy --schema=./prisma-main/schema.prisma && npx prisma migrate deploy --schema=./prisma-cro/schema.prisma
