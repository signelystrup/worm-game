-- Custom SQL migration file, put your code below! --

CREATE TABLE IF NOT EXISTS account (
    id integer NOT NULL,
    character_id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    CONSTRAINT account_pkey PRIMARY KEY (id)
);