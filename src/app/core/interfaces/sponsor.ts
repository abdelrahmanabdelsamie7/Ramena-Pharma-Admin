export interface Sponsor {
  id: string;
  title: string;
  description: string;
  logo: File;
  website_url: string;
  created_at?: Date;
  updated_at?: Date;
}
