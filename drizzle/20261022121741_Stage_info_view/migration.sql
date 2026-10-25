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

CREATE OR REPLACE VIEW stage_with_tiles AS
SELECT
    -- st.id AS stage_tile_id,
    st.stage_id,
    st.world_x,
    st.world_y,

    t.id AS tile_id,
    t.name AS tile_name,
    t.sprite_id AS tile_sprite_id,
    ts.path AS tile_sprite_path,

    te.id AS tile_effect_id,
    te.name AS tile_effect_name,
    te.description AS tile_effect_description,
    te.duration AS tile_effect_duration,
    te.strength AS tile_effect_strength,

    i.id AS item_id,
    i.name AS item_name,
    i.description AS item_description,
    i.sprite_id AS item_sprite_id,
    ispr.path AS item_sprite_path,

    ie.id AS item_effect_id,
    ie.name AS item_effect_name,
    ie.description AS item_effect_description,
    ie.duration AS item_effect_duration,
    ie.strength AS item_effect_strength

FROM stage_tile st
JOIN tile t
    ON t.id = st.tile_id
JOIN sprite ts
    ON ts.id = t.sprite_id
LEFT JOIN effect te
    ON te.id = t.effect_id
LEFT JOIN item i
    ON i.id = st.item_id
LEFT JOIN sprite ispr
    ON ispr.id = i.sprite_id
LEFT JOIN effect ie
    ON ie.id = i.effect_id;


-- player stats --
CREATE OR REPLACE VIEW character_archetype_stats AS
SELECT
    c.id AS character_id,
    c.name AS character_name,

    a.id AS archetype_id,
    a.name AS archetype_name,

    s.id AS stat_id,
    s.name AS stat_name,
    s.description AS stat_description,
    s.value AS stat_value

FROM character c
JOIN archetype a
    ON a.id = c.archetype_id
JOIN archectype_stat ast -- need fixing later
    ON ast.archetype_id = a.id
JOIN stat s
    ON s.id = ast.stat_id;

CREATE OR REPLACE VIEW character_level_stats AS
SELECT
    c.id AS character_id,
    c.name AS character_name,

    s.id AS stat_id,
    s.name AS stat_name,
    s.description AS stat_description,
    s.value AS stat_value,

    t.id,
    t.name AS talent_name,
    t.description AS talent_description

FROM character c
JOIN level_up_bonus lub
    ON lub.character_id = c.id
JOIN stat s
    ON s.id = lub.stat_id
JOIN talent t
    ON t.id = lub.talent_id