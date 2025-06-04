import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();

  console.log("Creating channels...");
  // Create channels (increased to 20)
  const channels = await Promise.all(
    Array.from({ length: 20 }).map(() =>
      prisma.channel.create({
        data: {
          id: faker.string.ulid(),
          name: faker.lorem.words(),
          createdAt: faker.date.past({ years: 1 }),
          updatedAt: faker.date.recent(),
        },
      }),
    ),
  );

  console.log("Creating channel messages...");
  // Create channel messages (increased to 50-200 messages per channel)
  await Promise.all(
    channels.flatMap((channel) =>
      Array.from({ length: faker.number.int({ min: 50, max: 200 }) }).map(() =>
        prisma.channelMessage.create({
          data: {
            id: faker.string.ulid(),
            textContent: faker.helpers.arrayElement([
              faker.lorem.paragraph(),
              faker.lorem.sentence(),
              faker.lorem.paragraphs(2),
              faker.lorem.sentences(3),
              faker.lorem.paragraphs(3),
            ]),
            channelId: channel.id,
            createdByUserId: faker.helpers.arrayElement(users).id,
            createdAt: faker.date.past({ years: 1 }),
            updatedAt: faker.date.recent(),
            deletedAt: faker.datatype.boolean(0.1) ? faker.date.recent() : null, // 10% chance of being deleted
          },
        }),
      ),
    ),
  );

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void (async () => {
      await prisma.$disconnect();
      process.exit(0);
    })();
  });
