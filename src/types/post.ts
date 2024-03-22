import { IPlayer } from './player';

export interface IBlogPostBase {
  code: string;
  author: string | null;
  header: string;
  text: string;
  createdAt: string;
  authorRdgaNumber: number;
}

export interface IBlogPost extends IBlogPostBase {
  authorName: IPlayer['name'];
  authorSurname: IPlayer['surname'];
  authorAvatarUrl: IPlayer['avatarUrl'];
}
