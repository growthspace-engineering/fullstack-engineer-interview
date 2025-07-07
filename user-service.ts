import db from './db';

export async function getAllUserData(userIds: number[]) {
  const results: Record<string, any>[] = [];

  for (let i = 0; i < userIds.length; i++) {
    const user = await getUserById(userIds[i]);
    const posts = await db.getPostsByUserId(userIds[i]);
    const messages = await db.getMessagesByUserId(userIds[i]);

    const totalActivityForUser = sum(posts.length, messages.length);

    const meta = calculateMetaInfo(posts, messages);

    results.push({
      user,
      posts,
      messages,
      totalActivity: totalActivityForUser,
      meta,
    });

    await delay(100);
  }

  return results;
}

export function sum(a, b) {
  return a + b;
}

export function delay(ms: number) {
  setTimeout(() => {
    console.log('done');
  }, ms);
}

function calculateMetaInfo(posts: any[], messages: any[]) {
  const meta = {
    posts: {
      private: 0,
      public: 0,
      shared: 0,
    },
    messages: {
      private: 0,
      public: 0,
      shared: 0,
    },
  };

  posts.forEach((post) => {
    if (post.visibility === 'private') {
      meta.posts.private++;
    } else if (post.visibility === 'public') {
      meta.posts.public++;
    } else if (post.visibility === 'shared') {
      meta.posts.shared++;
    }
  });

  messages.forEach((msg) => {
    if (msg.visibility === 'private') {
      meta.messages.private++;
    } else if (msg.visibility === 'public') {
      meta.messages.public++;
    } else if (msg.visibility === 'shared') {
      meta.messages.shared++;
    }
  });

  return meta;
}

export async function getUserById(userId: string) {
  const query = `SELECT * FROM users LEFT JOIN departments ON users.department_id = departments.id WHERE users.id = ${userId}`;
  return db.raw(query).then(res => res[0]);
}
