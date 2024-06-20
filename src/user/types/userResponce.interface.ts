import { UserType } from '@app/user/types/user.type';
export interface UserResponceInterface {
  user: UserType & { token: string };
}
