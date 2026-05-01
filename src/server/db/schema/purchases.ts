import { relations, sql } from 'drizzle-orm';
import { pgTable, text, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { products } from './products';
import { users } from './users';

export const purchases = pgTable(
  'purchases',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    email: varchar('email').notNull(),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    checkoutSessionId: text('checkout_session_id'),
    acquisitionMethod: text('acquisition_method')
      .$type<
        | 'payment'
        | 'subscription_quota'
        | 'subscription_benefit'
        | 'free_public'
      >()
      .notNull(),
    createdAt: text('created_at')
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (t) => [unique('unique_user_product').on(t.userId, t.productId)]
);

export const purchasesRelations = relations(purchases, ({ one }) => ({
  product: one(products, {
    fields: [purchases.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
}));
