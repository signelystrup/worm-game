-- Custom SQL migration file, put your code below! --

-- unique constraints on account
-- add mail to account

BEGIN;
ALTER TABLE IF EXISTS account
    ADD column email text;

ALTER TABLE IF EXISTS account 
    ADD CONSTRAINT unique_acc_email UNIQUE email,
    ADD CONSTRAINT unique_acc_character UNIQUE character_id; 

UPDATE account SET email = 'test@mail.com' WHERE id = 1;

ALTER TABLE IF EXISTS account 
    ADD CONSTRAINT not_null_mail NOT NULL email;

COMMIT;
