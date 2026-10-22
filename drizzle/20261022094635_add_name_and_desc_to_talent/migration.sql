-- Custom SQL migration file, put your code below! --

ALTER TABLE IF EXISTS talent ADD COLUMN "name" text DEFAULT 'talent_name';
ALTER TABLE IF EXISTS talent ADD COLUMN "description" text DEFAULT 'talent_desc';
