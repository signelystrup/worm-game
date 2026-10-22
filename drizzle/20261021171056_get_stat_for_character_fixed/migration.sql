-- Custom SQL migration file, put your code below! --

CREATE OR REPLACE FUNCTION get_stat_for_character(
    IN char_id integer,
    IN stat_name text
)
RETURNS integer
LANGUAGE plpgsql
AS
$BODY$
	BEGIN
		RETURN(
            SELECT lvl_bonus.value + arch_bonus.value AS total_value
                FROM
                -- level bonus
                ( 
                    SELECT SUM(stat.value) AS "value"
                    FROM stat
                    INNER JOIN level_up_bonus 
                        ON stat.id = level_up_bonus.stat_id
                    WHERE stat.name = stat_name
                        AND level_up_bonus.character_id = char_id
                ) AS lvl_bonus,
                        
                -- archetype defaults
                ( 
                    SELECT SUM(stat.value) AS "value" FROM stat
                    INNER JOIN archectype_stat
                        ON stat.id = archectype_stat.stat_id
                        LEFT JOIN "character"
                            ON archectype_stat.archetype_id = character.archetype_id
                        WHERE stat.name = stat_name
                            AND character.id = char_id
                ) AS arch_bonus
		);
	END;
$BODY$;
