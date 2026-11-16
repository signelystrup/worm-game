export type FullStageDTO = {
    id: number,
    stageName : string,
    tiles : TilesForStageDTO[],
    characters : CharacterForStageDTO[],
}

export type TilesForStageDTO = {
    stageId : number,
    worldX : number,
    worldY : number,

    tileId : number,
    tileName : string,
    tileSpritePath : string,
    tileEffect : EffectDTO | null,
    item : ItemDTO | null
}

export type CharacterForStageDTO = {
    id: number,
    characterName : string,
    startX : number,
    startY : number,

    archetype : ArchetypeDTO,
    stats : StatDTO[] // contains both stats from archetype and level
    inventory : InventoryDTO
}

export type StatDTO = {
  id : number,
  name : string,
  description : string
}

export type WeaponDTO = {
  id : number,
  damage : number,
  name : string,
  description : string,
  spriteUrl : string,
}

export type ArchetypeDTO = {
  id : number,
  name : string,
  description : string,
  spriteUrl : string,
}

export type InventoryDTO = {
  items : ItemDTO[]
}

export type ItemDTO = {
    id : number,
    name : string,
    description : string,
    spritePath : string,
    effect : EffectDTO | null,
}

export type EffectDTO = {
    id : number,
    name : string,
    description : string,
    duration : number,
    strength : number
}