import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  decimal,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: varchar("site_name", { length: 255 }).default("AffiliateShop.lk"),
  facebookUrl: text("facebook_url"),
  youtubeUrl: text("youtube_url"),
  instagramUrl: text("instagram_url"),
});

export const settings = pgTable(
  "settings",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 120 }).notNull(),
    value: text("value"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    keyUnique: uniqueIndex("settings_key_unique").on(table.key),
  }),
);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  order: integer("order").default(0).notNull(),
  isEnabled: boolean("is_enabled").default(true).notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: varchar("short_name", { length: 100 }),
  description: text("description"),
  brand: varchar("brand", { length: 120 }),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 12, scale: 2 }),
  discountPercent: integer("discount_percent"),
  discountLabel: varchar("discount_label", { length: 50 }),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  affiliateUrl: text("affiliate_url").notNull(),
  imageUrls: text("image_urls").array().notNull().default([]),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isHot: boolean("is_hot").default(false).notNull(),
  clicks: integer("clicks").default(0).notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: varchar("title", { length: 255 }),
  subtitle: text("subtitle"),
  buttonText: varchar("button_text", { length: 80 }),
  buttonUrl: text("button_url"),
  order: integer("order").default(0).notNull(),
  isEnabled: boolean("is_enabled").default(true).notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clickLogs = pgTable("click_logs", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }),
  userAgent: text("user_agent"),
  ip: varchar("ip", { length: 120 }),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  clickLogs: many(clickLogs),
}));

export const clickLogsRelations = relations(clickLogs, ({ one }) => ({
  product: one(products, {
    fields: [clickLogs.productId],
    references: [products.id],
  }),
}));
