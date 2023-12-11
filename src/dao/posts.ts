import db from 'database';
import postMapping from 'mapping/post';

class PostsDao {
  #tableName;

  constructor() {
    this.#tableName = 'posts';
  }

  async getAll(): Promise<BlogPost[]> {
    const query = db(this.#tableName);
    const results = query.select(postMapping);

    return results;
  }

  async create(post: BlogPostDb): Promise<string> {
    const createdPost = await db(this.#tableName)
      .insert(post)
      .returning('header');

    return createdPost[0].header;
  }

  async update(post: BlogPostDb): Promise<BlogPostDb> {
    const updatedPost = await db(this.#tableName)
      .where({ code: post.code })
      .update(post)
      .returning('*');

    return updatedPost[0];
  }

  async delete(code: string): Promise<void> {
    await db(this.#tableName).where({ code }).del();
  }

  async getByCode(code: string): Promise<BlogPost> {
    const post = await db(this.#tableName).select(postMapping).where({ code });

    return post[0];
  }
}

export default new PostsDao();
