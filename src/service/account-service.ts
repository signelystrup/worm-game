import { account } from "../../dist/drizzle/schema.js"
import { insertNewAccount } from "../repository/account-repository.js"

export async function createNewAccount(email: string, password: string, username: string) {

    //TODO! validate password
    //TODO! validate email
    
    const account = {
        email: email,
        password: password,
        username: username
    };

    //insert account in db
    insertNewAccount(account);
}



