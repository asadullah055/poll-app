export default function createInstance() {
  const prisma = new PrismaClient();
  return prisma;
}
