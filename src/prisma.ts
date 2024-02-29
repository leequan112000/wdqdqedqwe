import { PrismaClient as PrismaClientMainDb } from "@prisma/client";
import { PrismaClient as PrismaClientCRODb } from "../prisma-cro/generated/client";

const prisma = new PrismaClientMainDb({
  log: [
    {
      emit: "stdout",
      level: "info",
    },
  ],
});

const prismaCRODb = new PrismaClientCRODb({
  log: [
    {
      emit: "stdout",
      level: "info",
    },
  ],
});


export { prisma, prismaCRODb };
