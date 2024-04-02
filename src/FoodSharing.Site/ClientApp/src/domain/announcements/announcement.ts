export class Announcement {
    constructor(
        public id: string,
        public name: string,
        public ownerUserId: string,
        public description: string,
        public categoryId: string,
        public gramsWeight: number,
        public imagesUrls: string[]
    ) { }
}

export function mapToAnnouncement(data: any) {
    return new Announcement(
        data.id,
        data.name,
        data.ownerUserId,
        data.description,
        data.categoryId,
        data.gramsWeight,
        data.imagesUrls
    )
}