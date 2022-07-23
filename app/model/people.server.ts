import { db } from '~/utils/db.server';

export async function getAllPeople() {
  return db.people.findMany();
}
