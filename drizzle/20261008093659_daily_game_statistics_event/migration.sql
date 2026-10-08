CREATE EXTENSION pg_cron;
CREATE TABLE daily_statistics
(
    date date PRIMARY KEY,
    character_count integer NOT NULL,
    completed_stages integer NOT NULL
);

-- schedual event

SELECT cron.schedule(
    'daily_game_statistics',
    --'* * * * *', -- run event every minute
    '0 0 * * *', -- run event every midnight
    $$
        INSERT INTO daily_statistics
            (date, character_count, completed_stages)
        SELECT
            CURRENT_DATE,
            (SELECT COUNT(*) FROM "character"),
            (SELECT COUNT(*) FROM character_stage WHERE completed = true);
    $$
);
