-- Custom SQL migration file, put your code below! --

BEGIN;
ALTER TABLE IF EXISTS account 
    ADD COLUMN "role" text  DEFAULT 'user';

UPDATE account 
    SET "role" = 'user'
    WHERE "role" IS NULL;


ALTER TABLE IF EXISTS account
    ALTER COLUMN "role" SET NOT NULL;

COMMIT;