import { IAuthData } from 'types/authData';
import { IAuthDataDb } from 'types/authDataDb';

export default {
  rdgaNumber: 'rdga_number',
  telegramId: 'telegram_id',
  telegramAuthDate: 'telegram_auth_date',
  telegramUsername: 'telegram_username',
  telegramFirstName: 'telegram_first_name',
  telegramLastName: 'telegram_last_name',
  telegramPhotoUrl: 'telegram_photo_url',
} satisfies Record<keyof IAuthData, keyof IAuthDataDb>;
