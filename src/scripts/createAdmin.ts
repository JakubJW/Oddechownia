import { Command } from 'commander';
import { createClient } from '@supabase/supabase-js';
import { UserRoles } from '@/db/consts';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());

const program = new Command();
program
  .option('-e, --email <email>', 'Admin email')
  .option('-p, --password <password>', 'Admin password');

program.parse(process.argv);
const { email, password } = program.opts();

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        email,
        role: UserRoles.ADMIN,
      },
    });

    if (error) {
      console.error('Error creating user:', error.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error inserting profile:', error);
    process.exit(1);
  }

  console.log(`Admin account created: ${email}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
