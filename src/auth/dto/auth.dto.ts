export class LoginDTO {
    email: string;
    password: string;
  }

export class RegistrationDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

export class AuthDTO {
    access_token: string;
    refresh_token: string;
}
export class PayloadDataDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
}