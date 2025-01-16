export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Content {
  _id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  type: string;
  userId: string;
}
