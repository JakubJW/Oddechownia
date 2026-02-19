import { eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { IUsersRepository } from '@/application/repositories/users.repository.interface';
import { User } from '@/entities/models/user';

export class UsersRepository implements IUsersRepository {
  async getUserById(id: string): Promise<User | undefined> {
    const user = await db.query.users.findFirst({ where: eq(users.id, id) });

    if (!user) return undefined;

    return {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      lastName: user.lastName,
      regulationsAgreement: user.regulationsAgreement || false,
      privacyPolicyAgreement: user.privacyPolicyAgreement || false,
      stripeCustomerId: user.stripeCustomerId || undefined,
      role: user.role || 'user',
    };
  }
}
