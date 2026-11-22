import { MongoClient } from 'mongodb';
import db from "./../../src/db/connection"
import {character, account, inventory, weapon, archetype} from './../../src/db/schema.js'; //'../../drizzle/schema.js'
import { eq } from 'drizzle-orm';

//define how the document will look in the mongodb. we transform from a sql structure to a document stucture. 
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
    //need to establish connection to the mongo db. username and password in plain text do not do this in production
    const mongoClient = new MongoClient('mongodb://mongo:secret@localhost:27017/?authSource=admin');
    
    try {
        //establish connection 
        await mongoClient.connect();
        //to the db: 
        const mongoDb = mongoClient.db('worm-game');
        
        //tell what the collection should be called
        const charCollection = mongoDb.collection<CharecterDocument>('characters');
        //get the char information. vi left joiner to get relevant information such as weapon and arcetype for each charecter. 
        const sqlData = await db
            .select({
                char: character,
                wep: weapon,
                arc: archetype,
            })
            .from(character)
            .leftJoin(weapon, eq(character.weaponId, weapon.id))
            .leftJoin(archetype, eq(character.archetypeId, archetype.id));
        // map the sql to a document style. so weapon and arcetype is on the charecter collection now
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
                //add arketype if exists some charecter might not have archetypes yet? otherwise it is just null
                archetype: row.arc ? {
                    id: row.arc.id,
                    name: row.arc.name,
                    description: row.arc.description,
                    spriteUrl: row.arc.spriteUrl,
                } : null,
                //make inventory, effect and stats as empty arrys so they can be added later. this one is allready big
                inventory: [], 
                effects: [],
                stats: {}
            };
        });
        //insert the whole shabang in one bulk operation (insertmany)
        const result = await charCollection.insertMany(charactersToInsert);
        

    } catch (error) {
    } finally {
        await mongoClient.close();
    }
}

migrateCharecters()