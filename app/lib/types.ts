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
  fileName: string;
  s3Url: string;
  userId: number;
  fileSize: number;
  fileType: string;
  lastModified: Date;
};

export type TestType = {
  id: number;
  name: string;
};
