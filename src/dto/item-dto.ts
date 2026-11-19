import type { EffectDTO } from "./stage-dto.js"

export type ItemDTO = {
    id: number,
    effect: EffectDTO | null,
    name: string,
    description: string,
    spriteUrl: string,
}

export function verifyItemDTO(item: ItemDTO): boolean {
    if (typeof item.name !== 'string' || item.name.length === 0)
        return false;
    if (typeof item.description !== 'string' || item.description.length === 0)
        return false;
    if (typeof item.spriteUrl !== 'string' || item.spriteUrl.length === 0)
        return false;
    // verify effect, if not null. And either it's id is a number so it refers to something in the system, or it has it's fields plottet
    if (item.effect && !item.effect.id) {
        if (typeof item.effect.description !== 'string' || item.effect.description.length === 0)
            return false;
        if (typeof item.effect.duration !== 'number' || item.effect.duration <= 0)
            return false;
        if (typeof item.effect.strength !== 'number' || item.effect.strength <= 0)
            return false;
    }
    return true;
}