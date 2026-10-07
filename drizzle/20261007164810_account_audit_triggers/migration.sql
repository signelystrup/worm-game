CREATE TYPE change_type AS ENUM (
    'insert',
    'update',
    'delete'
);

CREATE TABLE IF NOT EXISTS worm_game_db.audit_account
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    accounts_affected_count INTEGER NOT NULL,
    change change_type NOT NULL,
    changed_by TEXT NOT NULL DEFAULT CURRENT_USER,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- audit trigger disable update and delete
CREATE OR REPLACE FUNCTION freeze_audit_logs()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs are immutable. UPDATE and DELETE operations are strictly prohibited.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER protect_audit_history
BEFORE UPDATE OR DELETE ON worm_game_db.audit_account
FOR EACH ROW
EXECUTE FUNCTION freeze_audit_logs();

-- audit trigger insert
CREATE OR REPLACE FUNCTION audit_account_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO worm_game_db.audit_account
        (accounts_affected_count, change)
    SELECT COUNT(*), 'insert'
    FROM new_rows;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_account_on_insert
AFTER INSERT ON worm_game_db.account
REFERENCING NEW TABLE AS new_rows
FOR EACH STATEMENT
EXECUTE FUNCTION audit_account_insert();

-- audit trigger update
CREATE OR REPLACE FUNCTION audit_account_update()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO worm_game_db.audit_account
        (accounts_affected_count, change)
    SELECT COUNT(*), 'update'
    FROM new_rows;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_account_on_update
AFTER UPDATE ON worm_game_db.account
REFERENCING NEW TABLE AS new_rows
FOR EACH STATEMENT
EXECUTE FUNCTION audit_account_update();

-- audit trigger delete
CREATE OR REPLACE FUNCTION audit_account_delete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO worm_game_db.audit_account
        (accounts_affected_count, change)
    SELECT COUNT(*), 'delete'
    FROM old_rows;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_account_on_delete
AFTER DELETE ON worm_game_db.account
REFERENCING OLD TABLE AS old_rows
FOR EACH STATEMENT
EXECUTE FUNCTION audit_account_delete();