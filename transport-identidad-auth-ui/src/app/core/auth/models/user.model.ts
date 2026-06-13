export interface User {
  id: string;
  email: string;
  role: string;
  company_id: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
