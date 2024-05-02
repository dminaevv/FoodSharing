import { User } from "./user";

export class UserBlank {
    constructor(
        public id: string | null,
        public email: string | null,
        public firstName: string | null,
        public lastName: string | null,
        public phone: string | null,
        public avatarFile: File | null,
        public avatarUrl: string | null
    ) { }
}

export function mapToUserBlank(user: User) {
    return new UserBlank(user.id, user.email, user.firstName, user.lastName, user.phone, null, user.avatarUrl);
}