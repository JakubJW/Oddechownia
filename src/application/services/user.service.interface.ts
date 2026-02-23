import { User } from '@/entities/models/user';

export interface IUserService {
  getUser(): Promise<User | undefined>;
  getUserId(): Promise<string | undefined>;
}
