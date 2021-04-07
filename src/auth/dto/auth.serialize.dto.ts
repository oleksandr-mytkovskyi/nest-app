import { Exclude } from 'class-transformer';

export class UserSerializeDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  @Exclude()
  password: string;

  constructor(partial: Partial<UserSerializeDTO>) {
    Object.assign(this, partial);
  }
}