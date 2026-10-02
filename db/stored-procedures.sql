SET SEARCH_PATH = worm_game_db;

CREATE OR REPLACE PROCEDURE get_stat_for_character(
    IN char_id integer,
    IN stat_name TEXT
)
LANGUAGE plpgsql
AS
$BODY$
	BEGIN
		SELECT stat."value", stat.id, stat.name, level_up_bonus.character_id  FROM stat 
		INNER JOIN level_up_bonus ON stat.id = level_up_bonus.stat_id
		WHERE stat.name = stat_name AND level_up_bonus.character_id = char_id;
	END
$BODY$
;

CALL get_stat_for_character(1, 'hp');
