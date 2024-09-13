export interface Pitch {
    id: number,
    title: string | null,
    mainActivity: string | null,
    challenge: string | null,
    outcome: string | null,
    userId: number | null
} 
export type Content = Omit<Pitch, "id">;

export interface User {
    id: number,
    email: string,
    name: string,
    passwordHash: string,
    pitchId: number,
    disabled: boolean
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
    userId: number | null
}