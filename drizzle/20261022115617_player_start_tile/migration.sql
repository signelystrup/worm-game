INSERT INTO effect (name, description, duration, strength) VALUES
    ('Player_spawn', 'Indicates that the player should spawn on this tile, every stage should have 1 single tile with this effect.', 1, 1);

INSERT INTO tile (effect_id, name, sprite_id)
SELECT e.id, 'Player_spawn_tile', 11
FROM effect e
WHERE e.name = 'Player_spawn';