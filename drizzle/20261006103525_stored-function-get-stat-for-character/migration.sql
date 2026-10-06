-- Custom SQL migration file, put your code below! --

CREATE OR REPLACE FUNCTION get_stat_for_character(
    IN char_id integer,
    IN stat_name TEXT
) 
RETURNS integer
LANGUAGE plpgsql
AS
$BODY$
	BEGIN
		RETURN(
		SELECT sum(stat."value")
		FROM stat 
		INNER JOIN level_up_bonus ON stat.id = level_up_bonus.stat_id
		WHERE stat.name = stat_name AND level_up_bonus.character_id = char_id
		);
	END;
$BODY$
;

