import type { Course, User } from "../types";

export const isManager = (managerId: Course['manager'], UserId: User['_id']) => managerId === UserId

