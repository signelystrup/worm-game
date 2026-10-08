-- Custom SQL migration file, put your code below! --
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

    sprite.id AS item_sprite_id,
    sprite.path AS item_sprite_path,

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

LEFT JOIN sprite
    ON item.sprite_id = sprite.id

LEFT JOIN effect
    ON item.effect_id = effect.id;

--veiw to get all of a players inventory information in one go.
-- i imagine we use this when we display the inventory screen
-- needs testing but for that need test values to test with 
