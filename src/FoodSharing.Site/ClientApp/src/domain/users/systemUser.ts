import { User, mapToUser } from "./user";

export class SystemUser {
    constructor(
        public id: string,
        public email: string,
        public user: User
    ) { }
}

export function mapToSystemUser(data: any) {
    return new SystemUser(data.id, data.email, mapToUser(data.user));
}