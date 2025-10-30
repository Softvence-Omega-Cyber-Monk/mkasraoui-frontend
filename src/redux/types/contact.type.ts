export type TContact = {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
};

export type TContactResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: any;
};
