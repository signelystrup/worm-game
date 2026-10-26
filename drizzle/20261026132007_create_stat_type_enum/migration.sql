-- Custom SQL migration file, put your code below! --

-- create table stat_type
CREATE TABLE IF NOT EXISTS stat_type(
    id integer GENERATED ALWAYS AS IDENTITY,
    "name" text NOT NULL UNIQUE,
    "description" text NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

INSERT INTO stat_type ( "name", "description") VALUES
    ('MAX_HP', 'The most health a character can have.'),
    ('CURRENT_HP', 'How much health a character has right now.'),
    ('VISION', 'How far a character can see.'),
    ('ACTIONS', 'How many actions a character can do in a turn.');


-- remove name + desc from stat. dummy data (for stat) all becomes MAX_HP. 
ALTER TABLE IF EXISTS stat 
    DROP COLUMN "name",
    DROP COLUMN "description",
    ADD COLUMN stat_type_id integer;

UPDATE stat SET stat_type_id = 1;

ALTER TABLE IF EXISTS stat  
    ADD CONSTRAINT stat_type_fk FOREIGN KEY (stat_type_id)
        REFERENCES stat_type (id);


-- update stored function get_stat_for_character
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
                    INNER JOIN stat_type   
                        ON stat.stat_type_id = stat_type.id
                    WHERE stat_type.name = stat_name
                        AND level_up_bonus.character_id = char_id
                ) AS lvl_bonus,
                        
                -- archetype defaults
                ( 
                    SELECT SUM(stat.value) AS "value" 
                    FROM stat
                    INNER JOIN stat_type   
                        ON stat.stat_type_id = stat_type.id
                    INNER JOIN archectype_stat
                        ON stat.id = archectype_stat.stat_id
                    LEFT JOIN "character"
                        ON archectype_stat.archetype_id = character.archetype_id
                    WHERE stat_type.name = stat_name
                        AND character.id = char_id
                ) AS arch_bonus
		);
	END;
$BODY$;

