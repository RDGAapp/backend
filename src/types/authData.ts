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
  rdgaNumber: number;
  telegramId: number;
  telegramAuthDate: number;
  telegramUsername: string;
  telegramFirstName: string | null;
  telegramLastName: string | null;
  telegramPhotoUrl: string | null;
}

export interface IUserBaseInfo {
  rdgaNumber: number;
  avatarUrl: string | null;
}
