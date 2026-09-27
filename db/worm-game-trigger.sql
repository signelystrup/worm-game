 -- trigger
CREATE OR REPLACE FUNCTION give_archetype_weapon()
RETURNS TRIGGER AS $$
BEGIN
    SELECT a.weapon_id
    INTO NEW.weapon_id
    FROM archetype a
    WHERE a.id = NEW.archetype_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER character_created_give_archetype_weapon
BEFORE INSERT ON "character"
FOR EACH ROW
EXECUTE FUNCTION give_archetype_weapon();

-- trigger end

-- test to see it working:

-- setup

INSERT INTO sprite
    (id, "path")
VALUES
    (0, 'somewhere');

INSERT INTO weapon
    (id, sprite_id, damage, name, description)
VALUES
    (0, 0, 10, 'Iron Sword', 'A basic iron sword.');

INSERT INTO weapon
    (id, sprite_id, damage, name, description)
VALUES
    (1, 0, 10, 'Steel Axe', 'A weapon.');

INSERT INTO archetype
    (id, weapon_id, hat_sprite_id, name, description)
VALUES
    (0, 1, NULL, 'Warrior', 'A strong melee fighter.');

-- setup end

-- check setup

SELECT * FROM sprite;
SELECT * FROM weapon;
SELECT * FROM archetype;

-- check setup end

-- actual check the trigger worked

INSERT INTO "character"
    (id, archetype_id, name, hostile, sprite_id)
VALUES
    (1, 0, 'Test char', false, 0);

SELECT * FROM "character";

-- trigger check end