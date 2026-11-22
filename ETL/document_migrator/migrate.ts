import { MongoClient } from 'mongodb';
import db from "./../../src/db/connection"
import {character, account, inventory, weapon, archetype} from './../../src/db/schema.js'; //'../../drizzle/schema.js'
import { eq } from 'drizzle-orm';


interface CharecterDocument {
    _id: number; 
    name: string;
    hostile: boolean;
    spriteUrl: string;
    weapon: {
        id: number;
        name: string;
        damage: number;
        description: string;
        spriteUrl: string;
    } | null;
    archetype: {
        id: number;
        name: string;
        description: string;
        spriteUrl: string;
    } | null;
    inventory: any[]; 
    effects: any[];
    stats: Record<string, any>;
}

async function migrateCharecters() {
    const mongoClient = new MongoClient('mongodb://mongo:secret@localhost:27017/?authSource=admin');
    
    try {
        await mongoClient.connect();
        const mongoDb = mongoClient.db('worm-game');
        

        const charCollection = mongoDb.collection<CharecterDocument>('characters');

        const sqlData = await db
            .select({
                char: character,
                wep: weapon,
                arc: archetype,
            })
            .from(character)
            .leftJoin(weapon, eq(character.weaponId, weapon.id))
            .leftJoin(archetype, eq(character.archetypeId, archetype.id));

        const charactersToInsert: CharecterDocument[] = sqlData.map((row) => {
            return {
                _id: row.char.id, 
                name: row.char.name,
                hostile: row.char.hostile,
                spriteUrl: row.char.spriteUrl,
                weapon: row.wep ? {
                    id: row.wep.id,
                    name: row.wep.name,
                    damage: row.wep.damage,
                    description: row.wep.description,
                    spriteUrl: row.wep.spriteUrl,
                } : null,
                archetype: row.arc ? {
                    id: row.arc.id,
                    name: row.arc.name,
                    description: row.arc.description,
                    spriteUrl: row.arc.spriteUrl,
                } : null,
                inventory: [], 
                effects: [],
                stats: {}
            };
        });

        const result = await charCollection.insertMany(charactersToInsert);
        

    } catch (error) {
    } finally {
        await mongoClient.close();
    }
}

migrateCharecters()