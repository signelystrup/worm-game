-- CREATE VIEW stage_with_tiles ...

CREATE OR REPLACE VIEW stage_with_tiles AS
SELECT
    st.stage_id,
    st.world_x,
    st.world_y,

    t.id AS tile_id,
    t.name AS tile_name,
    t.sprite_url AS tile_sprite_url,

    te.id AS tile_effect_id,
    te.name AS tile_effect_name,
    te.description AS tile_effect_description,
    te.duration AS tile_effect_duration,
    te.strength AS tile_effect_strength,

    i.id AS item_id,
    i.name AS item_name,
    i.description AS item_description,
    i.sprite_url AS item_sprite_url,

    ie.id AS item_effect_id,
    ie.name AS item_effect_name,
    ie.description AS item_effect_description,
    ie.duration AS item_effect_duration,
    ie.strength AS item_effect_strength

FROM stage_tile st
JOIN tile t
    ON t.id = st.tile_id
LEFT JOIN effect te
    ON te.id = t.effect_id
LEFT JOIN item i
    ON i.id = st.item_id
LEFT JOIN effect ie
    ON ie.id = i.effect_id;