import { PrismaClient } from "@prisma/client";
import { readReplicas } from '@prisma/extension-read-replicas'
import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaPg } from "@prisma/adapter-pg";

/*
 * WRITE (POST): $primary
 * READ (GET): $replica
 */

const replica = new PrismaPg({
  connectionString: process.env.DATABASE_REPLICA_URL,
});

const extended = new PrismaClient()
  .$extends(withAccelerate())
  .$extends(
    readReplicas({
      replicas: [replica],
    }),
  );

const prismaGlobal = globalThis as unknown as {
  prisma: typeof extended | undefined;
}

const prisma = 
  prismaGlobal.prisma ??
  extended

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}

export { prisma };