import { Post } from './db';

export interface IBlogPostDb extends Omit<Post, 'created_at'> {
  created_at: string;
}
