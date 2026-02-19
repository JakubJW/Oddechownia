import { cache } from 'react';
import { IUserService } from '@/application/services/user.service.interface';
import { User } from '@/entities/models/user';
import { createClient } from '@/supabase/server';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { users } from '@/server/db/schema';

export class UserService implements IUserService {
  getUser = cache(async (): Promise<User | undefined> => {
    const supabase = await createClient();

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) return undefined;

    const publicUser = await db.query.users.findFirst({
      where: eq(users.id, authUser.id),
    });

    if (!publicUser) return undefined;

    return {
      id: publicUser.id,
      email: publicUser.email,
      firstName: publicUser.firstName,
      lastName: publicUser.lastName,
      regulationsAgreement: publicUser.regulationsAgreement || false,
      privacyPolicyAgreement: publicUser.privacyPolicyAgreement || false,
      stripeCustomerId: publicUser.stripeCustomerId || undefined,
      role: publicUser.role || 'user',
    };
  });

  async getUserId(): Promise<string | undefined> {
    const user = await this.getUser();
    return user?.id;
  }
}
