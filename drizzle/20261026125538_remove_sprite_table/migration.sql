-- Custom SQL migration file, put your code below! --

-- fjern table sprites
BEGIN;

ALTER TABLE IF EXISTS tile 
    DROP CONSTRAINT IF EXISTS sprite_fk,
    DROP COLUMN sprite_id,
    ADD COLUMN sprite_url text NOT NULL DEFAULT '/tile_01.png';

-- view player_inventory depends on item.sprite. 
DROP VIEW player_inventory;

ALTER TABLE IF EXISTS item 
    DROP CONSTRAINT IF EXISTS sprite_fk,
    DROP COLUMN sprite_id,
    ADD COLUMN sprite_url text NOT NULL DEFAULT '/weapon_01.png';

CREATE OR REPLACE VIEW player_inventory AS
    SELECT
        inventory.character_id,

        character.name AS character_name,

        archetype.id AS archetype_id,
        archetype.name AS archetype_name,

        weapon.id AS weapon_id,
        weapon.name AS weapon_name,
        weapon.damage AS weapon_damage,

        inventory_item.item_id,
        inventory_item.amount,

        item.name AS item_name,
        item.description AS item_description,
        item.sprite_url AS item_sprite_path,

        effect.id AS effect_id,
        effect.name AS effect_name,
        effect.description AS effect_description,
        effect.duration AS effect_duration,
        effect.strength AS effect_strength
    FROM inventory

    INNER JOIN character
        ON inventory.character_id = character.id

    INNER JOIN account
        ON character.id = account.character_id

    LEFT JOIN archetype
        ON character.archetype_id = archetype.id

    LEFT JOIN weapon
        ON character.weapon_id = weapon.id

    INNER JOIN inventory_item
        ON inventory.character_id = inventory_item.inventory_id

    INNER JOIN item
        ON inventory_item.item_id = item.id

    LEFT JOIN effect
        ON item.effect_id = effect.id;

-- end of view

ALTER TABLE IF EXISTS archetype 
    DROP CONSTRAINT IF EXISTS sprite_fk,
    DROP COLUMN hat_sprite_id,
    ADD COLUMN sprite_url text NOT NULL DEFAULT '/weapon_01.png';


ALTER TABLE IF EXISTS weapon 
    DROP CONSTRAINT IF EXISTS sprite_fk,
    DROP COLUMN sprite_id,
    ADD COLUMN sprite_url text NOT NULL DEFAULT '/weapon_01.png';


ALTER TABLE IF EXISTS "character" 
    DROP CONSTRAINT IF EXISTS sprite_fk,
    DROP COLUMN sprite_id,
    ADD COLUMN sprite_url text NOT NULL DEFAULT '/snail_01.png';

-- weapon effect should have no sprite
ALTER TABLE IF EXISTS weapon_effect 
    DROP CONSTRAINT IF EXISTS sprite_fk,
    DROP COLUMN sprite_id;

DROP TABLE IF EXISTS sprite;

COMMIT;