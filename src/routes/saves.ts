import express, { type Request, type Response } from 'express';

const router = express.Router()

interface saveGameDTO {
    characterId: number,
    inventoryid: number,
    weaponId: number,
    inventory: CharacterItem[], 
    levelup: levelUpBonus,
    completedStageId: number
}

interface CharacterItem {
    itemId: number,
    amount: number
}

interface levelUpBonus {
    talentId: number
    statId: number
}

function Validator(saveGameDTO: saveGameDTO, res: Response) {
    if (!Number.isFinite(saveGameDTO.characterId)) {
        return res.status(400).send({response: 'characterId was not set' })
    }

    if (!Number.isFinite(saveGameDTO.inventoryid)) {
        return res.status(400).send({response: 'inventoryid was not set' })
    }

    if (!Number.isFinite(saveGameDTO.weaponId)) {
        return res.status(400).send({response: 'weaponId was not set' })
    }
    if (!Array.isArray(saveGameDTO.inventory)) {
        return res.status(400).send({response: 'weaponId was not set' })
    }
    for (const [index, item] of saveGameDTO.inventory.entries()) {
        if (
            item === null ||
            !Number.isFinite(item.itemId) ||
            !Number.isFinite(item.amount)
        ) {
            return res.status(400).send({
                response: `inventory item at index ${index} was not set`,
            });
        }
    }

    if (!Number.isFinite(saveGameDTO.levelup.statId || saveGameDTO.levelup.talentId)) {
        return res.status(400).send({response: 'levelup was not set' })
    }

    if (!Number.isFinite(saveGameDTO.characterId)) {
        return res.status(400).send({response: 'characterId was not set' })
    }

    if (!Number.isFinite(saveGameDTO.completedStageId)) {
        return res.status(400).send({response: 'completedStageId was not set' })
    }

    return true 
}


//router routes
router.post('/saves', (req, res) => {
    const saveGameDTO: saveGameDTO = req.body

    if (Validator(saveGameDTO, res) !== true) {
        return; 
    }

  
})


//need to export, should be the final line. 
export default router