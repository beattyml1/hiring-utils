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

export interface EmailShare {
    email: string;
    shareId: string;
}

export interface SharingInfo {
    public: string;
    shares: EmailShare[];
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
    sharingInfo?: SharingInfo|null;
}

export const defaultSharingInfo = () => ({ public: '', shares: []});
export const defaultShare = () => ({ email: '', shareId: ''});

export const defaultLevel = () => ({
    name: '',
    start: null,
    minStock: null,
    maxStock: null,
    experience: true,
    position: true,
    max: null
});

export function defaultConfigModel(): ConfigModel {
    const stockDiscount = .1;
    const experienceWeight = 2.5;
    const positionWeight = 1;
    const valuation = 0;
    const vestingYears = 4;
    const defaultMarket = 0;
    const defaultStock = 0;
    return {
        levels: [
            { ...defaultLevel(), name: 'Intern', experience: false,  fixedSalary: true},
            { ...defaultLevel(), name: 'Junior', experience: false },
            { ...defaultLevel(), name: 'No Exp. (Bootcamp)', position: false },
            { ...defaultLevel(), name: 'No Exp. (4 Year)', position: false },
            { ...defaultLevel(), name: 'Experienced' },
            { ...defaultLevel(), name: 'Senior' },
            { ...defaultLevel(), name: 'Lead' },
            { ...defaultLevel(), name: 'Director' },
        ],
        stockDiscount, experienceWeight, positionWeight, valuation, vestingYears, defaultMarket, defaultStock,
        defaultPosition: null,
        showStock: true,
        name: '',
        uid: '',
        sharingInfo: defaultSharingInfo()
    };
}
