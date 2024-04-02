export class AnnouncementCategory {
    constructor(
        public id: string,
        public name: string,
        public iconUrl: string
    ) { }
}

export function mapToAnnouncementCategory(data: any) {
    return new AnnouncementCategory(data.id, data.name, data.iconUrl);
}