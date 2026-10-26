-- Custom SQL migration file, put your code below! --

ALTER TABLE IF EXISTS level_up_bonus 
    ADD CONSTRAINT character_fk FOREIGN KEY (character_id)
        REFERENCES "character" (id),
    ADD CONSTRAINT talent_fk FOREIGN KEY (talent_id)
        REFERENCES talent (id);

