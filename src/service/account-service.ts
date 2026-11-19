import { account } from "../../dist/drizzle/schema.js"
import type { Account } from "../db/model.js";
import type { SimpleAccountDTO, UpdateAccountDTO } from "../dto/account-dto.js";
import { insertNewAccount, selectAccountWithId, updateAccount as repoUpdateAccount} from "../repository/account-repository.js"


export async function findAccountById(accountId: number) : Promise<SimpleAccountDTO> {
    return selectAccountWithId(accountId).then(account => {
        // map db account as SimpleAccountDTO
        return {
            username: account.username,
            email: account.email,
        }
    });
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
    return insertNewAccount(account);
}

export async function updateAccount(accountDTO: UpdateAccountDTO) {
    const currentAccount = await selectAccountWithId(accountDTO.id);

    if (accountDTO.email) {
        //TODO! hashing
    }

    // Take values from DTO, if set. Otherwise use existing values from db. 
    const accountChangeSet : Account = {
        email: accountDTO.email? accountDTO.email : currentAccount.email,
        password: accountDTO.password? accountDTO.password : currentAccount.password,
        username: accountDTO.username? accountDTO.username : currentAccount.username,
        characterId: currentAccount.characterId,
    };

    return repoUpdateAccount(accountDTO.id, accountChangeSet);
}


