export interface Pharmacy {
  id: string;
  title: string;
  location_name: string;
  address: string;
  phone_number: string;
  logo: File;
  latitude: number;
  longitude: number;
  created_at?: Date;
  updated_at?: Date;
}
