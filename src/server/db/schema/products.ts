import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { files } from './files';
import { ebooks } from './ebooks';
import { liveLessons } from './live-lessons';
import { purchases } from './purchases';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull(),
  type: varchar('type').$type<'ebook' | 'live-lesson'>().notNull(),
  description: text('description'),
  priceId: text('price_id').notNull(),
  imageId: integer('image_id').references(() => files.id),
  price: integer('price').notNull(),
  isVisible: boolean('is_visible').default(true),
  subscriberAccess: varchar('subscriber_access')
    .$type<'paid' | 'free_unlimited' | 'quota_based'>()
    .notNull()
    .default('paid'),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  ebook: one(ebooks, {
    fields: [products.id],
    references: [ebooks.productId],
  }),
  liveLesson: one(liveLessons, {
    fields: [products.id],
    references: [liveLessons.productId],
  }),
  purchases: many(purchases),
  image: one(files, {
    fields: [products.imageId],
    references: [files.id],
  }),
}));
