
export class AnnouncementShortInfo {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public mainImgUrl: string,
        public createdAt: Date
    ) { }
}

export function mapToAnnouncementShortInfo(data: any) {
    return new AnnouncementShortInfo(
        data.id,
        data.name,
        data.description,
        data.mainImgUrl,
        data.createdAt
    )
}