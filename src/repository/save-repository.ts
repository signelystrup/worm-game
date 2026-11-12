import db from "../db/connection.js"




export async function saveCharacter() {
        await db.transaction(async (tx) => {
    tx.insert(character)
}