export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  password_hash: string;
};

export type Photo = {
  id: number;
  file_name: string;
  s3_key: string;
  user_id: number;
  file_size: number;
  file_type: string;
  last_modified: Date;
};