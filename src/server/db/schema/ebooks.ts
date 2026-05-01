import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { products } from './products';
import { relations } from 'drizzle-orm';

export const ebooks = pgTable('ebooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id')
    .references(() => products.id)
    .notNull()
    .unique(),
  path: text('path').notNull(),
});

export const ebooksRelations = relations(ebooks, ({ one }) => ({
  product: one(products, {
    fields: [ebooks.productId],
    references: [products.id],
  }),
}));
