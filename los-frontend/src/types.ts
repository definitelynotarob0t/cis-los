export interface Pitch {
    id: number,
    title: string | null,
    mainActivity: string | null,
    challenge: string | null,
    outcome: string | null,
    userId: number | null,
    programId: number | null
} 
export type Content = Omit<Pitch, "id">;

export interface User {
    id: number,
    email: string,
    name: string,
    passwordHash: string,
    programIds?: number[] | [],
    disabled: boolean,
    token: string,
}

export interface Session {
    id: number,
    userId: number,
    token: string
}

export interface Los {
    id: number,
    inputs: string[] | null,
    activities: string[] | null, 
    outputs: string[] | null,
    usages: string[] | null,
    outcomes: string[] | null,
    userId: number | null,
    programId: number | null
}

export interface Program {
    id: number;
    userId: number;
    pitchId: number;
    losId: number | null
    createdAt?: string;  
    updatedAt?: string;
}