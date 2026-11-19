import { pgSchema, pgEnum, pgTable, bigint, integer, bigserial, date, text, boolean, timestamp, uniqueIndex, foreignKey, primaryKey, unique, pgPolicy, pgView } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
export const cron = pgSchema("cron");
export const changeType = pgEnum("change_type", ["insert", "update", "delete"]);
export const jobidSeqInCron = cron.sequence("jobid_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false, });
export const runidSeqInCron = cron.sequence("runid_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false, });
export const jobInCron = cron.table.withRLS("job", {
    jobid: bigserial({ mode: 'number' }).primaryKey(),
    schedule: text().notNull(),
    command: text().notNull(),
    nodename: text().default("localhost").notNull(),
    nodeport: integer().default(sql `inet_server_port()`).notNull(),
    database: text().default(sql `current_database()`).notNull(),
    username: text().default(sql `CURRENT_USER`).notNull(),
    active: boolean().default(true).notNull(),
    jobname: text(),
}, (table) => [
    unique("jobname_username_uniq").on(table.jobname, table.username),
    pgPolicy("cron_job_policy", { using: sql `(username = CURRENT_USER)` }),
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
    pgPolicy("cron_job_run_details_policy", { using: sql `(username = CURRENT_USER)` }),
]);
export const account = pgTable("account", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    characterId: integer("character_id").notNull().references(() => character.id),
    username: text().notNull(),
    password: text().notNull(),
    email: text().notNull(),
}, (table) => [
    unique("unique_acc_character").on(table.characterId), unique("unique_acc_email").on(table.email),
]);
export const archetype = pgTable("archetype", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    weaponId: integer("weapon_id").notNull().references(() => weapon.id),
    name: text().notNull(),
    description: text().notNull(),
    spriteUrl: text("sprite_url").default("/weapon_01.png").notNull(),
});
export const archetypeStat = pgTable("archetype_stat", {
    archetypeId: integer("archetype_id").notNull().references(() => archetype.id),
    statId: integer("stat_id").notNull().references(() => stat.id),
}, (table) => [
    primaryKey({ columns: [table.archetypeId, table.statId], name: "archectype_stat_pkey" }),
]);
export const auditAccount = pgTable("audit_account", {
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    accountsAffectedCount: integer("accounts_affected_count").notNull(),
    change: changeType().notNull(),
    changedBy: text("changed_by").default(sql `CURRENT_USER`).notNull(),
    timestamp: timestamp().default(sql `CURRENT_TIMESTAMP`).notNull(),
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
    primaryKey({ columns: [table.characterId, table.effectId], name: "character_effect_pkey" }),
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
    primaryKey({ columns: [table.itemId, table.inventoryId], name: "inventory_item_pkey" }),
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
    primaryKey({ columns: [table.characterId, table.talentId], name: "character_talent_pkey" }),
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
    unique("stat_type_description_key").on(table.description), unique("stat_type_name_key").on(table.name),
]);
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
    primaryKey({ columns: [table.weaponId, table.effectId], name: "weapon_effect_pkey" }),
]);
export const characterArchetypeStats = pgView("character_archetype_stats", { characterId: integer("character_id"),
    characterName: text("character_name"),
    archetypeId: integer("archetype_id"),
    statId: integer("stat_id"),
    statName: text("stat_name"),
    statDescription: text("stat_description"),
    statValue: integer("stat_value"),
}).as(sql `SELECT c.id AS character_id, c.name AS character_name, a.id AS archetype_id, s.id AS stat_id, st.name AS stat_name, st.description AS stat_description, s.value AS stat_value FROM "character" c JOIN archetype a ON a.id = c.archetype_id JOIN archetype_stat ast ON ast.archetype_id = a.id JOIN stat s ON s.id = ast.stat_id JOIN stat_type st ON st.id = s.stat_type_id`);
export const characterLevelStats = pgView("character_level_stats", { characterId: integer("character_id"),
    characterName: text("character_name"),
    statId: integer("stat_id"),
    statName: text("stat_name"),
    statDescription: text("stat_description"),
    statValue: integer("stat_value"),
    id: integer(),
    talentName: text("talent_name"),
    talentDescription: text("talent_description"),
}).as(sql `SELECT c.id AS character_id, c.name AS character_name, s.id AS stat_id, st.name AS stat_name, st.description AS stat_description, s.value AS stat_value, t.id, t.name AS talent_name, t.description AS talent_description FROM "character" c JOIN level_up_bonus lub ON lub.character_id = c.id JOIN stat s ON s.id = lub.stat_id JOIN stat_type st ON st.id = s.stat_type_id JOIN talent t ON t.id = lub.talent_id`);
export const playerInventory = pgView("player_inventory", { characterId: integer("character_id"),
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
}).as(sql `SELECT inventory.character_id, "character".name AS character_name, archetype.id AS archetype_id, archetype.name AS archetype_name, weapon.id AS weapon_id, weapon.name AS weapon_name, weapon.damage AS weapon_damage, inventory_item.item_id, inventory_item.amount, item.name AS item_name, item.description AS item_description, item.sprite_url AS item_sprite_path, effect.id AS effect_id, effect.name AS effect_name, effect.description AS effect_description, effect.duration AS effect_duration, effect.strength AS effect_strength FROM inventory JOIN "character" ON inventory.character_id = "character".id JOIN account ON "character".id = account.character_id LEFT JOIN archetype ON "character".archetype_id = archetype.id LEFT JOIN weapon ON "character".weapon_id = weapon.id JOIN inventory_item ON inventory.character_id = inventory_item.inventory_id JOIN item ON inventory_item.item_id = item.id LEFT JOIN effect ON item.effect_id = effect.id`);
export const stageWithCharacters = pgView("stage_with_characters", { name: text(),
    stageId: integer("stage_id"),
    characterId: integer("character_id"),
    startX: integer("start_x"),
    startY: integer("start_y"),
    weaponId: integer("weapon_id"),
    weaponDamage: integer("weapon_damage"),
    weaponName: text("weapon_name"),
    weaponDescription: text("weapon_description"),
    weaponSpriteUrl: text("weapon_sprite_url"),
    archetypeId: integer("archetype_id"),
    hostile: boolean(),
    spriteUrl: text("sprite_url"),
    archetypeName: text("archetype_name"),
    archetypeDescription: text("archetype_description"),
    archetypeSpriteUrl: text("archetype_sprite_url"),
}).as(sql `SELECT s.name, cs.stage_id, cs.character_id, cs.start_x, cs.start_y, c.weapon_id, w.damage AS weapon_damage, w.name AS weapon_name, w.description AS weapon_description, w.sprite_url AS weapon_sprite_url, c.archetype_id, c.hostile, c.sprite_url, a.name AS archetype_name, a.description AS archetype_description, a.sprite_url AS archetype_sprite_url FROM stage s LEFT JOIN character_stage cs ON cs.stage_id = s.id LEFT JOIN "character" c ON c.id = cs.character_id LEFT JOIN archetype a ON a.id = c.archetype_id LEFT JOIN weapon w ON w.id = c.weapon_id`);
export const stageWithTiles = pgView("stage_with_tiles", { stageId: integer("stage_id"),
    worldX: integer("world_x"),
    worldY: integer("world_y"),
    tileId: integer("tile_id"),
    tileName: text("tile_name"),
    tileSpriteUrl: text("tile_sprite_url"),
    tileEffectId: integer("tile_effect_id"),
    tileEffectName: text("tile_effect_name"),
    tileEffectDescription: text("tile_effect_description"),
    tileEffectDuration: integer("tile_effect_duration"),
    tileEffectStrength: integer("tile_effect_strength"),
    itemId: integer("item_id"),
    itemName: text("item_name"),
    itemDescription: text("item_description"),
    itemSpriteUrl: text("item_sprite_url"),
    itemEffectId: integer("item_effect_id"),
    itemEffectName: text("item_effect_name"),
    itemEffectDescription: text("item_effect_description"),
    itemEffectDuration: integer("item_effect_duration"),
    itemEffectStrength: integer("item_effect_strength"),
}).as(sql `SELECT st.stage_id, st.world_x, st.world_y, t.id AS tile_id, t.name AS tile_name, t.sprite_url AS tile_sprite_url, te.id AS tile_effect_id, te.name AS tile_effect_name, te.description AS tile_effect_description, te.duration AS tile_effect_duration, te.strength AS tile_effect_strength, i.id AS item_id, i.name AS item_name, i.description AS item_description, i.sprite_url AS item_sprite_url, ie.id AS item_effect_id, ie.name AS item_effect_name, ie.description AS item_effect_description, ie.duration AS item_effect_duration, ie.strength AS item_effect_strength FROM stage_tile st JOIN tile t ON t.id = st.tile_id LEFT JOIN effect te ON te.id = t.effect_id LEFT JOIN item i ON i.id = st.item_id LEFT JOIN effect ie ON ie.id = i.effect_id`);
//# sourceMappingURL=schema.js.map