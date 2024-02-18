import crypto from 'crypto';
import { ITelegramAuthData } from 'types/authData';
import { IAuthDataDb } from 'types/authDataDb';

const telegramBotToken = process.env.TG_BOT_TOKEN;

export const checkTgAuthorization = (tgAuthData: ITelegramAuthData) => {
  if (!telegramBotToken) throw new Error('Telegram bot token is not defined');

  const { hash, ...rest } = tgAuthData;

  const secretKey = crypto
    .createHash('sha256')
    .update(telegramBotToken)
    .digest();

  const authDataString = Object.keys(rest)
    .filter((key) => !(rest[key as keyof typeof rest] == null))
    .map((key) => `${key}=${rest[key as keyof typeof rest]}`)
    .sort((a, b) => a.localeCompare(b))
    .join('\n');

  const hashToCheck = crypto
    .createHmac('sha256', secretKey)
    .update(authDataString)
    .digest('hex');

  return hash === hashToCheck;
};

export const mapTelegramAuthDataToDb = (
  telegramAuthData: ITelegramAuthData,
): Omit<IAuthDataDb, 'rdga_number'> => ({
  telegram_id: telegramAuthData.id,
  telegram_auth_date: telegramAuthData.auth_date,
  telegram_username: telegramAuthData.username,
  telegram_first_name: telegramAuthData.first_name ?? null,
  telegram_last_name: telegramAuthData.last_name ?? null,
  telegram_photo_url: telegramAuthData.photo_url ?? null,
});
