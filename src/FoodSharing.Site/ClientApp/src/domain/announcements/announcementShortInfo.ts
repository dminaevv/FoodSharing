
export class AnnouncementShortInfo {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public address: string,
        public mainImgUrl: string,
        public createdAt: Date,
        public isFavorite: boolean
    ) { }
}

export function mapToAnnouncementShortInfo(data: any) {
    return new AnnouncementShortInfo(
        data.id,
        data.name,
        data.description,
        data.address,
        data.mainImgUrl,
        data.createdAt,
        data.isFavorite
    )
}