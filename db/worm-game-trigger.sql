 -- trigger

CREATE OR REPLACE FUNCTION give_archetype_weapon()
RETURNS TRIGGER AS $$
BEGIN
    SELECT a.weapon_id
    INTO NEW.weapon_id
    FROM worm_game_db.archetype a
    WHERE a.id = NEW.archetype_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER character_created_give_archetype_weapon
BEFORE INSERT ON worm_game_db."character"
FOR EACH ROW
EXECUTE FUNCTION give_archetype_weapon();

-- trigger end

-- audit trigger

DO $$ -- doesn't support "CREATE TYPE IF NOT EXISTS" so we have to do it this way
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'change_type'
    ) THEN
        CREATE TYPE change_type AS ENUM (
            'insert',
            'update',
            'delete'
        );
    END IF;
END
$$;


CREATE TABLE IF NOT EXISTS worm_game_db.audit_account
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    accounts_affected_count INTEGER NOT NULL,
    change change_type NOT NULL,
    changed_by TEXT NOT NULL DEFAULT CURRENT_USER,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- audit trigger insert
CREATE OR REPLACE FUNCTION audit_account_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO worm_game_db.audit_account
        (accounts_affected_count, change)
    SELECT COUNT(*), 'insert'
    FROM new_rows;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_account_on_insert
AFTER INSERT ON worm_game_db.account
REFERENCING NEW TABLE AS new_rows
FOR EACH STATEMENT
EXECUTE FUNCTION audit_account_insert();

-- audit trigger update
CREATE OR REPLACE FUNCTION audit_account_update()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO worm_game_db.audit_account
        (accounts_affected_count, change)
    SELECT COUNT(*), 'update'
    FROM new_rows;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_account_on_update
AFTER UPDATE ON worm_game_db.account
REFERENCING NEW TABLE AS new_rows
FOR EACH STATEMENT
EXECUTE FUNCTION audit_account_update();

-- audit trigger delete
CREATE OR REPLACE FUNCTION audit_account_delete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO worm_game_db.audit_account
        (accounts_affected_count, change)
    SELECT COUNT(*), 'delete'
    FROM old_rows;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_account_on_delete
AFTER DELETE ON worm_game_db.account
REFERENCING OLD TABLE AS old_rows
FOR EACH STATEMENT
EXECUTE FUNCTION audit_account_delete();

-- trigger 2 end

-- test to see it working:

-- setup

INSERT INTO worm_game_db.sprite
    (id, "path")
VALUES
    (0, 'somewhere');

INSERT INTO worm_game_db.weapon
    (id, sprite_id, damage, name, description)
VALUES
    (0, 0, 10, 'Iron Sword', 'A basic iron sword.');

INSERT INTO worm_game_db.weapon
    (id, sprite_id, damage, name, description)
VALUES
    (1, 0, 10, 'Steel Axe', 'A weapon.');

INSERT INTO worm_game_db.archetype
    (id, weapon_id, hat_sprite_id, name, description)
VALUES
    (0, 1, NULL, 'Warrior', 'A strong melee fighter.');

-- setup end

-- check setup

SELECT * FROM worm_game_db.sprite;
SELECT * FROM worm_game_db.weapon;
SELECT * FROM worm_game_db.archetype;

-- check setup end

-- actual check the trigger worked

INSERT INTO worm_game_db."character"
    (id, archetype_id, name, hostile, sprite_id)
VALUES
    (1, 0, 'Test char', false, 0);

SELECT * FROM worm_game_db."character";

-- trigger check end



-- audit tests

INSERT INTO worm_game_db.account(id, character_id, username, password)
VALUES (1, 1, 'Someone', 'pAsSwOrD');

UPDATE worm_game_db.account
SET username = 'Else'
WHERE id = 1;

DELETE FROM worm_game_db.account
WHERE id=1;

SELECT * FROM worm_game_db.audit_account;

-- end