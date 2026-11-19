import fs from 'fs'
import path from 'path';


const drizzle_out = path.join(process.cwd(), 'drizzle');
const db_dir = path.join(process.cwd(), 'src', 'db');
const schema_name = 'schema.ts';
const relations_name = 'relations.ts';

const schema_file = path.join(drizzle_out, schema_name)
const relations_file = path.join(drizzle_out, relations_name)


if (fs.existsSync(schema_file)) {
    const destination = path.join(db_dir, schema_name)
    console.log("moving schema")
    fs.renameSync(schema_file, destination)
}

if (fs.existsSync(relations_file)) {
    const destination = path.join(db_dir, relations_name)
    console.log("moving relations")
    fs.renameSync(relations_file, destination)
}


