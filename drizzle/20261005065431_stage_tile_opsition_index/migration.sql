-- Custom SQL migration file, put your code below! --
CREATE UNIQUE INDEX IF NOT EXISTS stage_tile_stage_position_uq
ON stage_tile (stage_id, world_x, world_y);

-- so this index would allow us to lookup tiles faster on stages.
-- this would be useful for when we need to change a tile when a player pickup item
-- also just in general if we wanna quickly change a tile for any reason 
-- It is UNIQUE because only one tile should exist at a given position
-- within a particular stage.
