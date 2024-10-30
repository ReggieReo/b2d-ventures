// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  pgTableCreator,
  numeric,
  serial,
  timestamp,
  varchar,
  date,
  integer,
  text,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `b2d_ventures_${name}`);

export const user = createTable("user", {
  userID: varchar("userID", { length: 256 }).primaryKey(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const business = createTable("business", {
  businessID: serial("businessID").primaryKey(),
  userID: varchar("userID", { length: 256 }).references(() => user.userID),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  company: varchar("company", { length: 256 }),
  title: varchar("title", { length: 256 }),
  website: varchar("website", { length: 256 }),
  target_fund: integer("target_fund"),
  min_investment: integer("min_investment"),
  allocation: integer("allocation"),
  valuation: integer("valuation"),
  deadline: date("deadline"),
  industry: varchar("industry", { length: 256 }),
});

export const investment = createTable("investment", {
  investmentID: serial("investmentID").primaryKey(),
  businessID: serial("businessID").references(() => business.businessID),
  userID: varchar("userID", { length: 256 }).references(() => user.userID),
  fund: integer("fund").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const media = createTable("media", {
  mediaID: serial("mediaID").primaryKey(),
  businessID: serial("businessID").references(() => business.businessID),
  userID: varchar("userID", { length: 256 }).references(() => user.userID),
  url: varchar("url", { length: 1024 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const dataroomRequest = createTable("dataroom_request", {
  requestID: serial("requestID").primaryKey(),
  userID: varchar("userID", { length: 256 }).references(() => user.userID),
  businessID: serial("businessID").references(() => business.businessID),
  requestStatus: integer("requestStatus").default(0).notNull()
});

export const businessRelation = relations(business, ({ many, one }) => ({
  posts: many(investment),
  user: one(user, {
    fields: [business.userID],
    references: [user.userID],
  }),
}));

export const investmentRelation = relations(investment, ({ one }) => ({
  business: one(business, {
    fields: [investment.businessID],
    references: [business.businessID],
  }),
  user: one(user, {
    fields: [investment.userID],
    references: [user.userID],
  }),
}));

export const userRelation = relations(user, ({ many, one }) => ({
  business: one(business),
  investment: many(investment),
}));
