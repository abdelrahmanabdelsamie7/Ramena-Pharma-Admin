export interface Admin {
  id: string;
  name: string;
  email: string;
  password: string;
  is_super_admin: boolean;
  created_at: Date;
}
