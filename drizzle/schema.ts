import { pgSchema, pgEnum, pgTable, integer, date, bigint, bigserial, text, boolean, timestamp, uniqueIndex, foreignKey, primaryKey, unique, pgPolicy, pgView } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const cron = pgSchema("cron");
export const changeType = pgEnum("change_type", ["insert", "update", "delete"])

export const jobidSeqInCron = cron.sequence("jobid_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false, })
export const runidSeqInCron = cron.sequence("runid_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false, })

export const jobInCron = cron.table.withRLS("job", {
	jobid: bigserial({ mode: 'number' }).primaryKey(),
	schedule: text().notNull(),
	command: text().notNull(),
	nodename: text().default("localhost").notNull(),
	nodeport: integer().default(inet_server_port()).notNull(),
	database: text().default(sql`current_database()`).notNull(),
	username: text().default(sql`CURRENT_USER`).notNull(),
	active: boolean().default(true).notNull(),
	jobname: text(),
}, (table) => [
	unique("jobname_username_uniq").on(table.jobname, table.username),
	pgPolicy("cron_job_policy", { using: sql`(username = CURRENT_USER)` }),
]);

export const jobRunDetailsInCron = cron.table.withRLS("job_run_details", {
	jobid: bigint({ mode: 'number' }),
	runid: bigserial({ mode: 'number' }).primaryKey(),
	jobPid: integer("job_pid"),
	database: text(),
	username: text(),
	command: text(),
	status: text(),
	returnMessage: text("return_message"),
	startTime: timestamp("start_time", { withTimezone: true }),
	endTime: timestamp("end_time", { withTimezone: true }),
}, (table) => [

	pgPolicy("cron_job_run_details_policy", { using: sql`(username = CURRENT_USER)` }),
]);

export const account = pgTable("account", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	characterId: integer("character_id").notNull().references(() => character.id),
	username: text().notNull(),
	password: text().notNull(),
	email: text().notNull(),
}, (table) => [
	unique("unique_account_cols").on(table.characterId, table.email),]);

export const archectypeStat = pgTable("archectype_stat", {
	archetypeId: integer("archetype_id").notNull().references(() => archetype.id),
	statId: integer("stat_id").notNull().references(() => stat.id),
}, (table) => [
	primaryKey({ columns: [table.archetypeId, table.statId], name: "archectype_stat_pkey"}),
]);

export const archetype = pgTable("archetype", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	weaponId: integer("weapon_id").notNull().references(() => weapon.id),
	name: text().notNull(),
	description: text().notNull(),
	spriteUrl: text("sprite_url").default("/weapon_01.png").notNull(),
});

export const auditAccount = pgTable("audit_account", {
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
	accountsAffectedCount: integer("accounts_affected_count").notNull(),
	change: changeType().notNull(),
	changedBy: text("changed_by").default(sql`CURRENT_USER`).notNull(),
	timestamp: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const character = pgTable("character", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	weaponId: integer("weapon_id").notNull().references(() => weapon.id),
	archetypeId: integer("archetype_id").notNull().references(() => archetype.id),
	name: text().notNull(),
	hostile: boolean().notNull(),
	spriteUrl: text("sprite_url").default("/snail_01.png").notNull(),
});

export const characterEffect = pgTable("character_effect", {
	characterId: integer("character_id").notNull().references(() => character.id),
	effectId: integer("effect_id").notNull().references(() => effect.id),
}, (table) => [
	primaryKey({ columns: [table.characterId, table.effectId], name: "character_effect_pkey"}),
]);

export const characterStage = pgTable("character_stage", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	characterId: integer("character_id").notNull().references(() => character.id),
	stageId: integer("stage_id").notNull().references(() => stage.id),
	completed: boolean().default(false).notNull(),
	startX: integer("start_x").default(0).notNull(),
	startY: integer("start_y").default(0).notNull(),
});

export const dailyStatistics = pgTable("daily_statistics", {
	date: date().primaryKey(),
	characterCount: integer("character_count").notNull(),
	completedStages: integer("completed_stages").notNull(),
});

export const dialogue = pgTable("dialogue", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	content: text().notNull(),
	characterStageId: integer("character_stage_id").notNull().references(() => characterStage.id),
});

export const effect = pgTable("effect", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: text().notNull(),
	description: text().notNull(),
	duration: integer().notNull(),
	strength: integer().notNull(),
});

export const inventory = pgTable("inventory", {
	characterId: integer("character_id").primaryKey().references(() => character.id),
});

export const inventoryItem = pgTable("inventory_item", {
	itemId: integer("item_id").notNull().references(() => item.id),
	inventoryId: integer("inventory_id").notNull().references(() => inventory.characterId),
	amount: integer().default(1).notNull(),
}, (table) => [
	primaryKey({ columns: [table.itemId, table.inventoryId], name: "inventory_item_pkey"}),
]);

export const item = pgTable("item", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	effectId: integer("effect_id").references(() => effect.id),
	name: text().notNull(),
	description: text().notNull(),
	spriteUrl: text("sprite_url").default("/weapon_01.png").notNull(),
});

export const levelUpBonus = pgTable("level_up_bonus", {
	characterId: integer("character_id").notNull().references(() => character.id),
	talentId: integer("talent_id").notNull().references(() => talent.id),
	statId: integer("stat_id").notNull().references(() => stat.id),
}, (table) => [
	primaryKey({ columns: [table.characterId, table.talentId], name: "character_talent_pkey"}),
]);

export const stage = pgTable("stage", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: text().notNull(),
});

export const stageTile = pgTable("stage_tile", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	stageId: integer("stage_id").notNull().references(() => stage.id),
	tileId: integer("tile_id").notNull().references(() => tile.id),
	itemId: integer("item_id").references(() => item.id),
	worldX: integer("world_x").notNull(),
	worldY: integer("world_y").notNull(),
}, (table) => [
	uniqueIndex("stage_tile_stage_position_uq").using("btree", table.stageId.asc().nullsLast(), table.worldX.asc().nullsLast(), table.worldY.asc().nullsLast()),
]);

export const stat = pgTable("stat", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	value: integer().notNull(),
	statTypeId: integer("stat_type_id").references(() => statType.id),
});

export const statType = pgTable("stat_type", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: text().notNull(),
	description: text().notNull(),
}, (table) => [
	unique("stat_type_description_key").on(table.description),	unique("stat_type_name_key").on(table.name),]);

export const talent = pgTable("talent", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	archetypeId: integer("archetype_id").notNull().references(() => archetype.id),
	name: text().default("talent_name"),
	description: text().default("talent_desc"),
});

export const tile = pgTable("tile", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	effectId: integer("effect_id").references(() => effect.id),
	name: text().notNull(),
	collsion: boolean().default(false),
	spriteUrl: text("sprite_url").default("/tile_01.png").notNull(),
});

export const weapon = pgTable("weapon", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	damage: integer().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	spriteUrl: text("sprite_url").default("/weapon_01.png").notNull(),
});

export const weaponEffect = pgTable("weapon_effect", {
	weaponId: integer("weapon_id").notNull().references(() => weapon.id),
	effectId: integer("effect_id").notNull().references(() => effect.id),
}, (table) => [
	primaryKey({ columns: [table.weaponId, table.effectId], name: "weapon_effect_pkey"}),
]);
export const playerInventory = pgView("player_inventory", {	characterId: integer("character_id"),
	characterName: text("character_name"),
	archetypeId: integer("archetype_id"),
	archetypeName: text("archetype_name"),
	weaponId: integer("weapon_id"),
	weaponName: text("weapon_name"),
	weaponDamage: integer("weapon_damage"),
	itemId: integer("item_id"),
	amount: integer(),
	itemName: text("item_name"),
	itemDescription: text("item_description"),
	itemSpritePath: text("item_sprite_path"),
	effectId: integer("effect_id"),
	effectName: text("effect_name"),
	effectDescription: text("effect_description"),
	effectDuration: integer("effect_duration"),
	effectStrength: integer("effect_strength"),
}).as(sql`SELECT inventory.character_id, "character".name AS character_name, archetype.id AS archetype_id, archetype.name AS archetype_name, weapon.id AS weapon_id, weapon.name AS weapon_name, weapon.damage AS weapon_damage, inventory_item.item_id, inventory_item.amount, item.name AS item_name, item.description AS item_description, item.sprite_url AS item_sprite_path, effect.id AS effect_id, effect.name AS effect_name, effect.description AS effect_description, effect.duration AS effect_duration, effect.strength AS effect_strength FROM inventory JOIN "character" ON inventory.character_id = "character".id JOIN account ON "character".id = account.character_id LEFT JOIN archetype ON "character".archetype_id = archetype.id LEFT JOIN weapon ON "character".weapon_id = weapon.id JOIN inventory_item ON inventory.character_id = inventory_item.inventory_id JOIN item ON inventory_item.item_id = item.id LEFT JOIN effect ON item.effect_id = effect.id`);