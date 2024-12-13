import { relations, sql } from "drizzle-orm";
import {
  pgEnum,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  date,
  integer,
  text,
  boolean,
  uuid
} from "drizzle-orm/pg-core";
import {
  encryptedText,
  encryptedInteger,
  encryptedBoolean,
  encryptedDate
} from "./encrypted-types";

export const createTable = pgTableCreator((name) => `secure_${name}`);

export const user = createTable("user", {
  userID: text("userID").primaryKey(),
  name: encryptedText("name"),
  privacy: encryptedBoolean("privacy").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const business = createTable("business", {
  businessID: uuid("businessID").primaryKey().defaultRandom(),
  userID: text("userID").references(() => user.userID, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  company: encryptedText('company'),
  website: encryptedText('website'),
  target_stock: encryptedInteger("target_stock"),
  allocation: encryptedInteger("allocation"),
  valuation: encryptedInteger("valuation"),
  deadline: date("deadline"),
  industry: encryptedText('industry'),
  slogan: encryptedText("slogan"),
  problem: encryptedText("problem"),
  solution: encryptedText("solution"),
  stage: encryptedText("stage"),
  team: encryptedText("team"),
  investors: encryptedText("investors"),
  business_status: integer("business_status").default(0).notNull(),
});

export const investment = createTable("investment", {
  investmentID: uuid("investmentID").primaryKey().defaultRandom(),
  businessID: uuid("businessID").references(() => business.businessID, {
    onDelete: "cascade",
  }),
  userID: text("userID").references(() => user.userID, {
    onDelete: "cascade",
  }),
  fund: encryptedInteger("fund").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const media = createTable("media", {
  mediaID: uuid("mediaID").primaryKey().defaultRandom(),
  businessID: uuid("businessID").references(() => business.businessID, {
    onDelete: "cascade",
  }),
  userID: text("userID").references(() => user.userID, {
    onDelete: "cascade",
  }),
  url: encryptedText('url'),
  name: encryptedText('name'),
  type: encryptedText("type"),
  status: integer("status").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const dataroomRequest = createTable("dataroom_request", {
  requestID: uuid("requestID").primaryKey().defaultRandom(),
  userID: text("userID").references(() => user.userID, {
    onDelete: "cascade",
  }),
  businessID: uuid("businessID").references(() => business.businessID, {
    onDelete: "cascade",
  }),
  requestStatus: integer("requestStatus").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const businessRelation = relations(business, ({ many, one }) => ({
  investment: many(investment),
  user: one(user, {
    fields: [business.userID],
    references: [user.userID],
  }),
}));

export const dataroomRequestRelation = relations(
  dataroomRequest,
  ({ many, one }) => ({
    user: one(user, {
      fields: [dataroomRequest.userID],
      references: [user.userID],
    }),
    business: one(business, {
      fields: [dataroomRequest.businessID],
      references: [business.businessID],
    }),
  }),
);

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
  dataroomRequest: many(dataroomRequest),
  media: many(media),
}));

export const mediaRelation = relations(media, ({ one }) => ({
  user: one(user, {
    fields: [media.userID],
    references: [user.userID],
  }),
}));
