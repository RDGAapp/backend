import { IAuthDataDb } from './authDataDb';
import { IPlayer } from './player';

export interface ITelegramAuthData {
  id: number;
  auth_date: number;
  hash: string;
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  photo_url?: string | null;
}

export interface IAuthData {
  rdgaNumber: IAuthDataDb['rdga_number'];
  telegramId: IAuthDataDb['telegram_id'];
  telegramAuthDate: IAuthDataDb['telegram_auth_date'];
  telegramUsername: IAuthDataDb['telegram_username'];
  telegramFirstName: IAuthDataDb['telegram_first_name'];
  telegramLastName: IAuthDataDb['telegram_last_name'];
  telegramPhotoUrl: IAuthDataDb['telegram_photo_url'];
}

export interface IUserBaseInfo {
  rdgaNumber: IPlayer['rdgaNumber'];
  avatarUrl: IAuthDataDb['telegram_photo_url'];
}
