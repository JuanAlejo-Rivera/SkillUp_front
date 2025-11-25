import type { User } from "../types";

export const isManager = (managerId: string | { _id: string }, userId: User['_id']) => {
    const id = typeof managerId === 'string' ? managerId : managerId._id;
    return id === userId;
}

