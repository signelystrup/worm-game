CREATE OR REPLACE PROCEDURE get_stat_for_character(
    IN character_id NUMERIC,
    IN stat_name TEXT
)
AS
  
BEGIN 
    SELECT "value" 
    FROM stat
    WHERE level_up_bonus.character_id = character_id && stat.name = stat_name;
END;



get_total_levels
get_stats

get_max_life
get_current_life

find_path

delete_player
update_high_score


CREATE OR REPLACE PROCEDURE pr_name() 
LANGUAGE plpgsql
AS $BODY$ $BODY$;

CREATE OR REPLACE PROCEDURE get_hp_in_hearts(IN hp NUMERIC)

