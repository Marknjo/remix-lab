import type { People } from '@prisma/client';
import { db } from '~/utils/db.server';

export async function getAllPeople() {
  return db.people.findMany();
}

export async function createPerson(
  person: Pick<People, 'firstName' | 'lastName'>
) {
  return db.people.create({ data: person });
}

export async function deletePerson(userId: string) {
  if (!userId) {
    return null;
  }

  return db.people.delete({ where: { id: userId } });
}
