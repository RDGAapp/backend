export interface IAuthDataDb {
  rdga_number: number;
  telegram_id: number;
  telegram_auth_date: number;
  telegram_username: string;
  telegram_first_name: string | null;
  telegram_last_name: string | null;
  telegram_photo_url: string | null;
}
