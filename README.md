# Worm Game
A simple browser based roguelike game, in which you play as a snail in the forest.

# Setup for local development
1. Install dependencies:
   ```bash
   $ npm install
   ```
2. Create a `.env` file and add your database URL:
   ```env
   DATABASE_URL=postgres://postgres:secret@localhost:5432/worm-game
   ```
3. Start the app:
   ```bash
   $ npm start
   ```

## Database connection
**Open database**
```bash
$ docker compose up -d --build
```

**Connect to SQL:**
```bash
$ psql -h localhost -p 5432 -U postgres -d worm-game
```
The password is 'secret'

**View tables:**
```bash
worm-game=# \dt
```

## Database migrations
**Create a custom SQL migration:**
```bash
$ npx drizzle-kit generate --custom --name=[create-name]
```

**Run migrations:**
```bash
$ npx drizzle-kit migrate
```

**Node application**: localhost:8080/

**PgAdmin**: localhost:5050/\
Create new connection using the connection variables.
