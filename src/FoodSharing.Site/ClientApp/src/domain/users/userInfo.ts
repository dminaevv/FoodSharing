export class UserInfo {
    constructor(
        public id: string,
        public email: string,
        public firstName: string,
        public lastName: string,
        public phone: string,
        public avatarUrl: string | null,
        public registrationDate: Date
    ) { }

    public get getFullName() {
        if (this.firstName == null && this.lastName == null) return null;

        return `${this.lastName} ${this.firstName}`
    }
}

export function mapToUserInfo(data: any) {
    return new UserInfo(data.id, data.email, data.firstName, data.lastName, data.phone, data.avatarUrl, new Date(data.registrationDate))
}