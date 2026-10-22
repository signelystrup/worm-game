-- Custom SQL migration file, put your code below! --

ALTER TABLE IF EXISTS tile ADD COLUMN collsion boolean DEFAULT false;
