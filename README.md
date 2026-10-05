```markdown
# Worm Game

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file and add your database URL:
   ```env
   DATABASE_URL=your_url_here
   ```
3. Start the app:
   ```bash
   npm start
   ```

## Database

**Connect to SQL:**
```bash
psql -h localhost -p 5432 -U postgres -d worm-game
```

**Create a custom SQL migration:**
```bash
npx drizzle-kit generate --custom --name=create-name
```

**Run migrations:**
```bash
npx drizzle-kit migrate
```
```