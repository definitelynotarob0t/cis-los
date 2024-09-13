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
    pitchId: number,
    disabled: boolean
}

interface SimpleUser {
    id: number;      
    email?: string;  // Optional email if needed for specific routes - consider deleting if unused
  }
  
declare global {
    namespace Express {
        interface Request {
            user?: SimpleUser; // Extend Request with simplified user type
        }
    }
}


