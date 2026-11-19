import { account } from "../../dist/drizzle/schema.js"
import type { Account } from "../db/model.js";
import type { SimpleAccountDTO, UpdateAccountDTO } from "../dto/account-dto.js";
import { insertNewAccount, selectAccountWithId, updateAccount as repoUpdateAccount} from "../repository/account-repository.js"


export async function findAccountById(accountId: number) : Promise<SimpleAccountDTO> {



}

export async function createNewAccount(email: string, password: string, username: string) {

    //TODO! validate password
    //TODO! validate email
    
    const account = {
        email: email,
        password: password,
        username: username,
        characterId: null
    };

    //insert account in db
    insertNewAccount(account);
}

export async function updateAccount(accountDTO: UpdateAccountDTO) {
    const currentAccount = await selectAccountWithId(accountDTO.id);

    if (accountDTO.newEmail) {
        //TODO! hashing
    }

    // Take values from DTO, if set. Otherwise use existing values from db. 
    const accountChangeSet : Account= {
        email: accountDTO.newEmail? accountDTO.newEmail : currentAccount.email,
        password: accountDTO.newPassword? accountDTO.newPassword : currentAccount.password,
        username: accountDTO.newUsername? accountDTO.newUsername : currentAccount.username,
        characterId: currentAccount.characterId,
    };

    repoUpdateAccount(accountDTO.id, accountChangeSet);
}


