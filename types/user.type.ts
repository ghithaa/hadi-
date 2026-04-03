export interface IUserDetails {
  id: string;
  email: string;
  fullName: string;
  profileImage?: string;
  role?: string;
}

export interface ILoginResponse {
  token: string;
  refreshToken: string;
  user: IUserDetails;
}

export interface IRegisterResponse {
  message: string;
  user: IUserDetails;
}

export interface IUserResponse {
  result: {
    user: IUserDetails;
  };
}
