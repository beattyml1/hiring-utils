export interface BaseLevel {
    name: string;
    start: number|null;
}

export interface PositionLevel extends BaseLevel {
    minStock?: number|null;
    maxStock?: number|null;
    fixedSalary?: boolean;

}

export interface ExperienceLevel extends BaseLevel {
    max?: number|null;
}

export interface CombinedLevel extends PositionLevel, ExperienceLevel {
    position: boolean;
    experience: boolean;
}

export interface ConfigModel {
    uid: string;
    name: string;
    levels: CombinedLevel[];
    showStock: boolean;
    stockDiscount: number;
    experienceWeight: number;
    positionWeight: number;
    valuation: number;
    vestingYears: number;
    defaultMarket: number;
    defaultStock: number;
    defaultPosition: number|null;
}

export function defualtConfigModel(): ConfigModel {
    const stockDiscount = .1;
    const experienceWeight = 2.5;
    const positionWeight = 1;
    const valuation = 0;
    const vestingYears = 4;
    const defaultMarket = 0;
    const defaultStock = 0;
    const defaultLevel = { start: null, minStock: null, maxStock: null, experience: true, position: true, max: null };
    return {
        levels: [
            { name: 'Intern', ...defaultLevel,  fixedSalary: true},
            { name: 'Junior', ...defaultLevel },
            { name: 'Experienced', ...defaultLevel },
            { name: 'Senior', ...defaultLevel },
            { name: 'Lead', ...defaultLevel },
            { name: 'Director', ...defaultLevel },
        ],
        stockDiscount, experienceWeight, positionWeight, valuation, vestingYears, defaultMarket, defaultStock,
        defaultPosition: null,
        showStock: true,
        name: '',
        uid: ''
    };
}
