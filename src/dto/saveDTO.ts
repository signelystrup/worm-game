export interface saveGameDTO {
    characterId: number,
    inventoryid: number,
    weaponId: number,
    inventory: CharacterItem[], 
    levelup: levelUpBonus,
    completedStageId: number
}

export interface CharacterItem {
    itemId: number,
    amount: number
}

export interface levelUpBonus {
    talentId: number
    statId: number
}