import { IPlayer } from './player';
import { IBlogPostDb } from './postDb';

export interface IBlogPostBase {
  code: IBlogPostDb['code'];
  author: IBlogPostDb['author'];
  header: IBlogPostDb['header'];
  text: IBlogPostDb['text'];
  createdAt: IBlogPostDb['created_at'];
  authorRdgaNumber: IBlogPostDb['author_rdga_number'];
}

export interface IBlogPost extends IBlogPostBase {
  authorName: IPlayer['name'];
  authorSurname: IPlayer['surname'];
  authorAvatarUrl: IPlayer['avatarUrl'];
}
