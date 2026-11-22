-- Custom SQL migration file, put your code below! --

ALTER TABLE  IF EXISTS account
    ALTER COLUMN character_id DROP NOT NULL;


