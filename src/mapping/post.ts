import { IBlogPostBase } from 'types/post';
import { IBlogPostDb } from 'types/postDb';

export default {
  code: 'code',
  header: 'header',
  text: 'text',
  author: 'author',
  createdAt: 'created_at',
  authorRdgaNumber: 'author_rdga_number',
} satisfies Record<keyof IBlogPostBase, keyof IBlogPostDb>;
