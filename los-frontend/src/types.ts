export interface Pitch {
    id: number,
    title: string | null,
    mainActivity: string | null,
    challenge: string | null,
    outcome: string | null,
    userId: number
} 
export type Content = Omit<Pitch, "id">;

export interface User {
    id: number,
    email: string,
    name: string,
    passwordHash: string,
    pitchId: number | null,
    disabled: boolean
}

export interface Session {
    id: number,
    userId: number,
    token: string
}
