CREATE TABLE worm_game_db.daily_statistics
(
    date date PRIMARY KEY,
    character_count integer NOT NULL,
    completed_stages integer NOT NULL
);

-- schedual event

SELECT cron.schedule(
    'daily-game-statistics',
    --'* * * * *', -- run event every minute
    '0 0 * * *', -- run event every midnight
    $$
        INSERT INTO worm_game_db.daily_statistics
            (date, character_count, completed_stages)
        SELECT
            CURRENT_DATE,
            (SELECT COUNT(*) FROM worm_game_db."character"),
            (SELECT COUNT(*) FROM worm_game_db.character_stage WHERE completed = true);
    $$
);
