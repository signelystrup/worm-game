import type { EffectDTO } from "./stagedto.js"

export type itemOptions = {
  // Pagination
  itemPage : number,
  itemPageSize : number,

  // Sorting
  itemSort : {
    sortBy : string,
    ascending : boolean,
  },

  // Filtering
  itemFilter : {
    name : string,
    description : string,
  },
}

export type itemDTO = {
	id: number,
	effect: EffectDTO | null,
	name: string,
	description: string,
	spriteUrl: string,
}
/* // temp

export type EffectDTO = {
    id : number,
    name : string,
    description : string,
    duration : number,
    strength : number
}

*/