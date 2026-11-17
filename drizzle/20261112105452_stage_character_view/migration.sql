-- all characters for a given stage view --
CREATE VIEW stage_with_characters AS
SELECT
    s.name,
    cs.stage_id,
    cs.character_id,
    cs.start_x,
    cs.start_y,

    c.weapon_id,
    w.damage AS weapon_damage,
    w.name AS weapon_name,
    w.description AS weapon_description,
    w.sprite_url AS weapon_sprite_url,

    c.archetype_id,
    c.hostile,
    c.sprite_url,

    a.name AS archetype_name,
    a.description AS archetype_description,
    a.sprite_url AS archetype_sprite_url
FROM stage s
LEFT JOIN character_stage cs ON cs.stage_id = s.id
LEFT JOIN character c ON c.id = cs.character_id
LEFT JOIN archetype a ON a.id = c.archetype_id
LEFT JOIN weapon w ON w.id = c.weapon_id;

-- player stats --
CREATE OR REPLACE VIEW character_archetype_stats AS
SELECT
    c.id AS character_id,
    c.name AS character_name,
    
    a.id AS archetype_id,

    s.id AS stat_id,
    st.name AS stat_name,
    st.description AS stat_description,
    s.value AS stat_value

FROM character c
JOIN archetype a
    ON a.id = c.archetype_id
JOIN archetype_stat ast
    ON ast.archetype_id = a.id
JOIN stat s
    ON s.id = ast.stat_id
JOIN stat_type st
    ON st.id = s.stat_type_id;

CREATE OR REPLACE VIEW character_level_stats AS
SELECT
    c.id AS character_id,
    c.name AS character_name,

    s.id AS stat_id,
    st.name AS stat_name,
    st.description AS stat_description,
    s.value AS stat_value,

    t.id,
    t.name AS talent_name,
    t.description AS talent_description

FROM character c
JOIN level_up_bonus lub
    ON lub.character_id = c.id
JOIN stat s
    ON s.id = lub.stat_id
JOIN stat_type st
    ON st.id = s.stat_type_id
JOIN talent t
    ON t.id = lub.talent_id