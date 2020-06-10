

export interface Level { value: number, description: string }
export interface Activity {id: string, value: number, description: string }
export interface ActivitySet {
    id: string;
    levelType: LevelType;
    activities: Activity[]
}
export interface LevelType {
    id: string;
    options: Level[];
}

export interface Skill {
    id: string;
    levelType: string;
    description: string;
    prompt: string;
    activitySet: string;
}
