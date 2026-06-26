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
  userId: number;
  s3_url: string;
  location: string;
  date: Date;
};

export type TestType = {
  id: number;
  name: string;
};
