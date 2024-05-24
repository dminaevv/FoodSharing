export class AnnouncementStatistics {
    constructor(
        public announcementId: string,
        public viewsCount: number,
        public favoriteCount: number,
        public messageCount: number

    ) { }
}

export function mapToAnnouncementStatistics(data: any) {
    return new AnnouncementStatistics(
        data.announcementId,
        data.viewsCount,
        data.favoriteCount,
        data.messageCount
    )
}