import { MongoClient } from 'mongodb';
import db from "./../../src/db/connection"
import {character, account, inventory} from '../../dist/drizzle/schema.js'; //'../../drizzle/schema.js'

async function migrate() {
    const mongoClient = new MongoClient('mongodb://localhost:27017');
    await mongoClient.connect();
    const collection = mongoClient.db('worm-game').collection('charecters');

    const allchs = await db.select().from(character);
}