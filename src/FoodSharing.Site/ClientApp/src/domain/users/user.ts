export class User {
    constructor(
        public id: string,
        public email: string,
        public firstName: string | null,
        public lastName: string | null,
        public phone: string | null,
        public avatarUrl: string | null,
        public registrationDate: Date
    ) { }

    public get getFullName() {
        if (this.firstName == null && this.lastName == null) return null;

        return `${this.lastName} ${this.firstName}`
    }
}

export function mapToUser(data: any) {
    return new User(data.id, data.email, data.firstName, data.lastName, data.phone, data.avatarUrl, new Date(data.registrationDate));
}