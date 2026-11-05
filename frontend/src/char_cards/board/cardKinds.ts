import type { Character, Monster } from "../components/interfaces";

// Card types: what "Add card" offers and what a new card starts with.
export type CardContentByKind = { char: Character; mons: Monster };
export type CardKind = keyof CardContentByKind;

export const cardKinds: {
  [K in CardKind]: { label: string; blank: () => CardContentByKind[K] };
} = {
  char: {
    label: "Character",
    blank: () => ({
      name: "New Character",
      health: 0,
      attack: [],
      armor: 0,
      spell: [],
      resistances: [],
      immunities: [],
      stats: {
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        charisma: 0,
        wisdom: 0,
        constitution: 0,
      },
      prof: "",
      spellSave: 0,
      spellAttack: 0,
    }),
  },
  mons: {
    label: "Monster",
    blank: () => ({
      name: "New Monster",
      health: 0,
      attack: [],
      armor: 0,
      spell: [],
      resistances: [],
      immunities: [],
      other: [],
      spellSave: 0,
      spellAttack: 0,
    }),
  },
};
