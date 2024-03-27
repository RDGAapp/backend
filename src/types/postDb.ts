import { Posts } from './db';

export interface IBlogPostDb extends Omit<Posts, 'created_at'> {
  created_at: string;
}
