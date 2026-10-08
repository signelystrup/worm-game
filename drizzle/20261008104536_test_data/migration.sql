-- Custom SQL migration file, put your code below! --
BEGIN;

TRUNCATE TABLE
    dialogue,
    stage_tile,
    inventory_item,
    level_up_bonus,
    archectype_stat,
    character_stage,
    character_effect,
    account,
    inventory,
    "character",
    weapon_effect,
    talent,
    archetype,
    weapon,
    tile,
    item,
    stat,
    stage,
    sprite,
    effect
RESTART IDENTITY CASCADE;

-- Effects
INSERT INTO effect (name, description, duration, strength) VALUES
    ('Haste', 'Temporarily increases movement speed.', 10, 2),
    ('Poison', 'Deals damage over time.', 5, 3),
    ('Burn', 'Deals fire damage over time.', 4, 4);

-- Sprites
INSERT INTO sprite (path) VALUES
    ('sprites/weapons/iron_sword.png'),       -- 1
    ('sprites/weapons/hunting_bow.png'),      -- 2
    ('sprites/weapons/apprentice_staff.png'), -- 3
    ('sprites/hats/knight_helmet.png'),       -- 4
    ('sprites/hats/mage_hat.png'),            -- 5
    ('sprites/characters/hero.png'),          -- 6
    ('sprites/characters/goblin.png'),        -- 7
    ('sprites/items/health_potion.png'),      -- 8
    ('sprites/items/antidote.png'),           -- 9
    ('sprites/items/fire_bomb.png'),          -- 10
    ('sprites/tiles/grass.png'),              -- 11
    ('sprites/tiles/poison_swamp.png'),       -- 12
    ('sprites/tiles/lava.png');               -- 13

-- Stages
INSERT INTO stage (name) VALUES
    ('Greenfield Meadow'),
    ('Ashen Ruins');

-- Stats
INSERT INTO stat (name, description, value) VALUES
    ('Health', 'Maximum health points.', 100),
    ('Speed', 'Movement speed.', 10),
    ('Strength', 'Physical attack power.', 15),
    ('Defense', 'Damage resistance.', 5);

-- Weapons
INSERT INTO weapon (sprite_id, damage, name, description) VALUES
    (1, 20, 'Iron Sword', 'A reliable close-range weapon.'),
    (2, 14, 'Hunting Bow', 'A light bow for ranged attacks.'),
    (3, 18, 'Apprentice Staff', 'A staff suited to elemental magic.');

-- Items
INSERT INTO item (sprite_id, effect_id, name, description) VALUES
    (8, 1, 'Health Potion', 'A small potion that restores vitality.'),
    (9, 2, 'Antidote', 'Helps protect against poison.'),
    (10, 3, 'Fire Bomb', 'Explodes and ignites nearby enemies.');

-- Tiles
INSERT INTO tile (effect_id, name, sprite_id) VALUES
    (NULL, 'Grass', 11),
    (2, 'Poison Swamp', 12),
    (3, 'Lava', 13);

-- Archetypes
INSERT INTO archetype (weapon_id, hat_sprite_id, name, description) VALUES
    (1, 4, 'Knight', 'A sturdy fighter who excels in close combat.'),
    (3, 5, 'Mage', 'A spellcaster who uses elemental attacks.');

-- Talents
INSERT INTO talent (archetype_id) VALUES
    (1),
    (1),
    (2),
    (2);

-- Weapon effects
INSERT INTO weapon_effect (weapon_id, effect_id, sprite_id) VALUES
    (1, 1, 1),
    (2, 2, 2),
    (3, 3, 3);

-- Characters
INSERT INTO "character" (weapon_id, archetype_id, name, hostile, sprite_id) VALUES
    (1, 1, 'Ari', false, 6),
    (2, 1, 'Goblin Scout', true, 7);

-- Inventories: one per character
INSERT INTO inventory (character_id) VALUES
    (1),
    (2);

-- Test account; the password value is a placeholder, not a secure hash
INSERT INTO account (character_id, username, password) VALUES
    (1, 'test_player', 'test-only-password');

-- Character effects
INSERT INTO character_effect (character_id, effect_id) VALUES
    (1, 1),
    (2, 2);

-- Character progress in stages
INSERT INTO character_stage
    (character_id, stage_id, completed, start_x, start_y)
VALUES
    (1, 1, true, 5, 8),
    (1, 2, false, 0, 0),
    (2, 1, false, 12, 4);

-- Archetype stats
INSERT INTO archectype_stat (archetype_id, stat_id) VALUES
    (1, 1),
    (1, 3),
    (1, 4),
    (2, 1),
    (2, 2),
    (2, 3);

-- Level-up bonuses
INSERT INTO level_up_bonus (character_id, talent_id, stat_id) VALUES
    (1, 1, 3),
    (1, 2, 4),
    (2, 3, 2);

-- Inventory contents
INSERT INTO inventory_item (item_id, inventory_id, amount) VALUES
    (1, 1, 3),
    (2, 1, 1),
    (3, 1, 2),
    (1, 2, 1);

-- Tiles placed in stages
INSERT INTO stage_tile (stage_id, tile_id, item_id, world_x, world_y) VALUES
    (1, 1, NULL, 0, 0),
    (1, 1, 1, 1, 0),
    (1, 2, NULL, 2, 0),
    (2, 3, 3, 5, 3);

-- Dialogue linked to character_stage rows
INSERT INTO dialogue (content, character_stage_id) VALUES
    ('The meadow is quiet today. Stay alert.', 1),
    ('The ruins are ahead. I should prepare first.', 2),
    ('You will not pass!', 3);

COMMIT;
