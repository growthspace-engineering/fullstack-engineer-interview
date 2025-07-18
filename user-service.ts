import db from './db';

export async function getAllUserData(userIds: number[]) {
  const results: Record<string, any>[] = [];

  for (let i = 0; i < userIds.length; i++) {
    const user = await getUserById(userIds[i]);
    results.push({ user });
  }

  return results;
}

export async function getUserById(userId: number) {
  return db('users')
    .where('id', userId)
    .first();
}
