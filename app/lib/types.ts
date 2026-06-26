export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  password_hash: string;
};

export type ImageType = {
  id: number;
  file_name: string;
  s3_url: string;
  user_id: number;
  file_size: number;
  file_type: string;
  last_modified: Date;
};

export type TestType = {
  id: number;
  name: string;
};
