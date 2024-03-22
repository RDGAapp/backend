export interface IBlogPostDb {
  code: string;
  author: string | null;
  header: string;
  text: string;
  created_at: string;
  author_rdga_number: number;
}
