export interface Monster {
    name: string;
    health: number;
    attack: Attack[];
    armor: number;
    spell: string[];
    resistances: string[];
    immunities: string[];
    other: string[];
    spellSave: number;
    spellAttack: number;
}


export interface Character {
    name: string;
    health: number;
    attack: Attack[];
    armor: number;
    spell: string[];
    resistances: string[];
    immunities: string[];
    stats: Stats;
    prof: string;
    spellSave: number;
    spellAttack: number;
}

interface Attack{
    name: string;
    decription: string;
    damage: string;
    bonus: number;
}


interface Stats{
    strength: number;
    dexterity: number;
    intelligence: number;
    charisma: number;
    wisdom: number;
    constitution: number;
}
