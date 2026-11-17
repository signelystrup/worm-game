import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, inArray } from "drizzle-orm";
import { stageWithCharacters, stageWithTiles, characterArchetypeStats, stage, characterLevelStats, playerInventory } from '../../dist/drizzle/schema.js';
import * as stageDto from '../dto/stageDto.js';

const db = drizzle(process.env.DATABASE_URL!);

export async function getFullStage(stageId: number): Promise<stageDto.FullStageDTO | null> {
    // 1. Stage
    const [stageData] = await db
        .select()
        .from(stage)
        .where(eq(stage.id, stageId));

    if (!stageData) {
        return null; // Stage not found
    }

    // 2. Tiles
    const tileRows = await db
        .select()
        .from(stageWithTiles)
        .where(eq(stageWithTiles.stageId, stageId));

    const tiles: stageDto.TilesForStageDTO[] = tileRows.map(row => ({
        stageId: row.stageId!,
        worldX: row.worldX!,
        worldY: row.worldY!,

        tileId: row.tileId!,
        tileName: row.tileName!,
        tileSpritePath: row.tileSpriteUrl!,

        tileEffect: row.tileEffectId === null ? null : {
            id: row.tileEffectId!,
            name: row.tileEffectName!,
            description: row.tileEffectDescription!,
            duration: row.tileEffectDuration!,
            strength: row.tileEffectStrength!,
        } as stageDto.EffectDTO | null,

        item: row.itemId === null ? null : {
            id: row.itemId!,
            name: row.itemName!,
            description: row.itemDescription!,
            spritePath: row.itemSpriteUrl!,
            effect: row.itemEffectId === null ? null : {
                id: row.itemEffectId,
                name: row.itemEffectName!,
                description: row.itemEffectDescription!,
                duration: row.itemEffectDuration!,
                strength: row.itemEffectStrength!,
            } as stageDto.EffectDTO | null,
        } as stageDto.ItemDTO | null,
    }));

    // 3. Characters
    const characterRows = await db
        .select()
        .from(stageWithCharacters)
        .where(eq(stageWithCharacters.stageId, stageId));

    // Remove empty rows caused by LEFT JOIN when a stage has no characters
    const charactersInStage = characterRows.filter(
        row => row.characterId !== null
    );

    const characterIds = charactersInStage.map(row => row.characterId!);
    // 4. Archetype stats
    const archetypeStats = characterIds.length
        ? await db
            .select()
            .from(characterArchetypeStats)
            .where(inArray(characterArchetypeStats.characterId, characterIds))
        : [];

    // 5. Character level-up stats
    const levelStats = characterIds.length
        ? await db
            .select()
            .from(characterLevelStats)
            .where(inArray(characterLevelStats.characterId, characterIds))
        : [];

    // 6. Character inventories
    const inventoryRows = characterIds.length
        ? await db
            .select()
            .from(playerInventory)
            .where(inArray(playerInventory.characterId, characterIds))
        : [];

    // 7. Assemble characters
    const characters: stageDto.CharacterForStageDTO[] = charactersInStage.map(row => {

        const characterStats = [
            ...archetypeStats
                .filter(stat => stat.archetypeId === row.archetypeId)
                .map(stat => ({
                    id: stat.statId!,
                    name: stat.statName!,
                    description: stat.statDescription!,
                })),

            ...levelStats
                .filter(stat => stat.characterId === row.characterId)
                .map(stat => ({
                    id: stat.statId!,
                    name: stat.statName!,
                    description: stat.statDescription!,
                })),
        ];

        const characterInventory = inventoryRows
            .filter(item => item.characterId === row.characterId)
            .map(item => ({
                id: item.itemId!,
                name: item.itemName!,
                description: item.itemDescription!,
                spritePath: item.itemSpritePath!,
                effect: item.effectId === null ? null : {
                    id: item.effectId,
                    name: item.effectName!,
                    description: item.effectDescription!,
                    duration: item.effectDuration!,
                    strength: item.effectStrength!,
                },
            }));

        return {
            id: row.characterId!,
            characterName: row.name!,
            startX: row.startX!,
            startY: row.startY!,

            archetype: {
                id: row.archetypeId!,
                name: row.archetypeName!,
                description: row.archetypeDescription!,
                spriteUrl: row.archetypeSpriteUrl!,
            },

            stats: characterStats,

            inventory: {
                items: characterInventory,
            },
            weapon: {
                id : row.weaponId!,
                damage : row.weaponDamage!,
                name : row.weaponName!,
                description : row.weaponDescription!,
                spriteUrl : row.weaponSpriteUrl!,
            },
        };
    });

    return {
        id: stageData.id,
        stageName: stageData.name,
        tiles,
        characters,
    };
}