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