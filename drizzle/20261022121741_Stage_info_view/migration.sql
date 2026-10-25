-- View to get all of a given stages character data:

CREATE VIEW stage_with_characters AS
SELECT
    s.name,
    cs.stage_id,
    cs.character_id,
    cs.start_x,
    cs.start_y,

    c.weapon_id,
    c.archetype_id,
    c.hostile,
    c.sprite_id
FROM stage s
LEFT JOIN character_stage cs ON cs.stage_id = s.id
LEFT JOIN character c ON c.id = cs.character_id;



-- CREATE VIEW stage_with_tiles ...
