import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	account: {
		character: r.one.character({
			from: r.account.characterId,
			to: r.character.id
		}),
	},
	character: {
		accounts: r.many.account(),
		effects: r.many.effect({
			from: r.character.id.through(r.characterEffect.characterId),
			to: r.effect.id.through(r.characterEffect.effectId)
		}),
		stages: r.many.stage({
			from: r.character.id.through(r.characterStage.characterId),
			to: r.stage.id.through(r.characterStage.stageId)
		}),
		inventories: r.many.inventory(),
		levelUpBonuses: r.many.levelUpBonus(),
	},
	archetype: {
		stats: r.many.stat({
			from: r.archetype.id.through(r.archectypeStat.archetypeId),
			to: r.stat.id.through(r.archectypeStat.statId)
		}),
		weapon: r.one.weapon({
			from: r.archetype.weaponId,
			to: r.weapon.id,
			alias: "archetype_weaponId_weapon_id"
		}),
		weapons: r.many.weapon({
			from: r.archetype.id.through(r.character.archetypeId),
			to: r.weapon.id.through(r.character.weaponId),
			alias: "archetype_id_weapon_id_via_character"
		}),
		talents: r.many.talent(),
	},
	stat: {
		archetypes: r.many.archetype(),
		levelUpBonuses: r.many.levelUpBonus(),
		statType: r.one.statType({
			from: r.stat.statTypeId,
			to: r.statType.id
		}),
	},
	weapon: {
		archetypesWeaponId: r.many.archetype({
			alias: "archetype_weaponId_weapon_id"
		}),
		archetypesViaCharacter: r.many.archetype({
			alias: "archetype_id_weapon_id_via_character"
		}),
		effects: r.many.effect(),
	},
	effect: {
		characters: r.many.character(),
		items: r.many.item(),
		tiles: r.many.tile(),
		weapons: r.many.weapon({
			from: r.effect.id.through(r.weaponEffect.effectId),
			to: r.weapon.id.through(r.weaponEffect.weaponId)
		}),
	},
	stage: {
		characters: r.many.character(),
		stageTiles: r.many.stageTile(),
	},
	dialogue: {
		characterStage: r.one.characterStage({
			from: r.dialogue.characterStageId,
			to: r.characterStage.id
		}),
	},
	characterStage: {
		dialogues: r.many.dialogue(),
	},
	inventory: {
		character: r.one.character({
			from: r.inventory.characterId,
			to: r.character.id
		}),
		items: r.many.item({
			from: r.inventory.characterId.through(r.inventoryItem.inventoryId),
			to: r.item.id.through(r.inventoryItem.itemId)
		}),
	},
	item: {
		inventories: r.many.inventory(),
		effect: r.one.effect({
			from: r.item.effectId,
			to: r.effect.id
		}),
		stageTiles: r.many.stageTile(),
	},
	levelUpBonus: {
		character: r.one.character({
			from: r.levelUpBonus.characterId,
			to: r.character.id
		}),
		stat: r.one.stat({
			from: r.levelUpBonus.statId,
			to: r.stat.id
		}),
		talent: r.one.talent({
			from: r.levelUpBonus.talentId,
			to: r.talent.id
		}),
	},
	talent: {
		levelUpBonuses: r.many.levelUpBonus(),
		archetype: r.one.archetype({
			from: r.talent.archetypeId,
			to: r.archetype.id
		}),
	},
	stageTile: {
		item: r.one.item({
			from: r.stageTile.itemId,
			to: r.item.id
		}),
		stage: r.one.stage({
			from: r.stageTile.stageId,
			to: r.stage.id
		}),
		tile: r.one.tile({
			from: r.stageTile.tileId,
			to: r.tile.id
		}),
	},
	tile: {
		stageTiles: r.many.stageTile(),
		effect: r.one.effect({
			from: r.tile.effectId,
			to: r.effect.id
		}),
	},
	statType: {
		stats: r.many.stat(),
	},
}))