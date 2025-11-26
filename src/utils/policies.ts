import type { User } from "../types";

export const isManager = (managerId: string | { _id: string }, userId: User['_id']) => {
    const id = typeof managerId === 'string' ? managerId : managerId._id;
    return id === userId;
}

// Verificar si el usuario es admin
export const isAdmin = (user: User): boolean => {
    return user.role === 'admin';
}

// Verificar si el usuario es teacher
export const isTeacher = (user: User): boolean => {
    return user.role === 'teacher';
}

// Verificar si el usuario puede crear cursos (admin o teacher)
export const canCreateCourses = (user: User): boolean => {
    return user.role === 'admin' || user.role === 'teacher';
}

// Verificar si el usuario puede modificar un recurso específico
// Admin puede modificar todo, teacher solo sus propios recursos, user no puede modificar nada
export const canModify = (user: User, resourceOwnerId: string | { _id: string }): boolean => {
    if (user.role === 'admin') {
        return true; // Admin puede modificar cualquier cosa
    }
    if (user.role === 'teacher') {
        const ownerId = typeof resourceOwnerId === 'string' ? resourceOwnerId : resourceOwnerId._id;
        return user._id === ownerId; // Teacher solo puede modificar lo suyo
    }
    return false; // Users no pueden modificar nada
}

