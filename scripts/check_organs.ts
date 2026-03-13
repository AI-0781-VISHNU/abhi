import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const organs = await prisma.organ.findMany()
  console.log(JSON.stringify(organs.map(o => o.name)))
}
main().catch(console.error).finally(() => prisma.$disconnect())
