import { User } from '@/entities/models/user';

export interface IUsersRepository {
  getUserById(id: string): Promise<User | undefined>;
}
