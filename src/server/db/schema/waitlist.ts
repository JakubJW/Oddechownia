import { boolean, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const waitlist = pgTable('waitlist', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name').notNull(),
  email: varchar('email').unique().notNull(),
  emailMarketingAgreement: boolean('email_marketing_agreement').default(false),
});
