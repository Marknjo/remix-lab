import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    initPeople().map(person => db.people.create({ data: person }))
  );
}

function initPeople() {
  return [
    {
      firstName: 'James',
      lastName: 'Cooper',
    },
    {
      firstName: 'Desmond',
      lastName: 'Kramely',
    },
  ];
}

/// Seed db
seed()
  .then(() => {
    console.log('Database seed successful 😊😊😊');
  })
  .catch(err =>
    console.error(`💥💥💥 DB seeding error, ${err.message} \n, ${err.stack}`)
  );
