import express, { type Request, type Response } from 'express';

const router = express.Router();

interface FullStageDTO {
    id: number,
    stageName : string,
    tiles : TilesForStageDTO[],
    characters : CharacterForStageDTO[],
}

interface TilesForStageDTO {
    stageId : number,
    worldX : number,
    worldY : number,

    tileId : number,
    tileName : string,
    tileSpritePath : string,
    tileEffect : EffectDTO,
    item : ItemDTO
}

interface CharacterForStageDTO {
    id: number,
    characterName : string,
    startX : number,
    startY : number,

    archetype : ArchetypeDTO,
    stats : StatDTO[] // contains both stats from archetype and level
    inventory : InventoryDTO
}

interface StatDTO {
  id : number,
  name : string,
  description : string
}

interface WeaponDTO {
  id : number,
  damage : number,
  name : string,
  description : string,
  spriteUrl : string,
}

interface ArchetypeDTO {
  id : number,
  name : string,
  description : string,
  spriteUrl : string,
}

interface InventoryDTO {
  items : ItemDTO[]
}

interface ItemDTO {
    id : number,
    name : string,
    description : string,
    spritePath : string,
    effect : EffectDTO
}

interface EffectDTO {
    id : number,
    name : string,
    description : string,
    duration : number,
    strength : number
}

router.get('/:stageId', (req: Request, res: Response) => {
  //res.send({ data: '<stage data> for: ' });
  res.send({ data: '<stage data> for: ' + req.params.stageId });
});

export default router;