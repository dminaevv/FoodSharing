import { HttpClient } from "../../tools/httpClient";
import { PagedResult } from "../../tools/results/pagedResult";
import { mapToResult } from "../../tools/results/result";
import { Announcement, mapToAnnouncement } from "./announcement";
import { AnnouncementBlank } from "./announcementBlank";
import { AnnouncementCategory, mapToAnnouncementCategory } from "./announcementCategory";
import { AnnouncementDetailInfo, mapToAnnouncementDetailInfo } from "./announcementInfo";
import { AnnouncementShortInfo, mapToAnnouncementShortInfo } from "./announcementShortInfo";

export class AnnouncementsProvider {
    public static async save(blank: AnnouncementBlank, uploadPhotos: File[]): Promise<Announcement> {
        const any = await HttpClient.formData("/announcement/save", { blank, uploadPhotos });

        return mapToAnnouncement(any);
    }

    public static async get(id: string): Promise<Announcement> {
        const any = await HttpClient.post("/announcement/get", { id });

        return mapToAnnouncement(any);
    }

    public static async getInfo(id: string): Promise<AnnouncementDetailInfo> {
        const any = await HttpClient.post("/announcement/get-info", { id });

        return mapToAnnouncementDetailInfo(any);
    }

    public static async getMyAnnouncements(): Promise<Announcement[]> {
        const any = await HttpClient.post("/announcement/get-my");

        return (any as any[]).map(a => mapToAnnouncement(a))
    }

    public static async getUserAnnouncements(userId: string, page: number, pageSize: number): Promise<PagedResult<AnnouncementShortInfo>> {
        const any = await HttpClient.get("/announcement/get-user", { userId, page, pageSize });

        const totalRows = any.totalRows;
        const values = (any.values as Announcement[]).map(v => mapToAnnouncementShortInfo(v))

        return new PagedResult(values, totalRows);
    }

    public static async getPageAnnouncements(page: number, pageSize: number): Promise<PagedResult<AnnouncementShortInfo>> {
        const any = await HttpClient.get("/announcement/get-page", { page, pageSize });

        const totalRows = any.totalRows;
        const values = (any.values as Announcement[]).map(v => mapToAnnouncementShortInfo(v))

        return new PagedResult(values, totalRows);
    }

    public static async remove(id: String) {
        const any = await HttpClient.post("/announcement/remove", { id });

        return mapToResult(any);
    }

    public static async getCategories(): Promise<AnnouncementCategory[]> {
        const any = await HttpClient.get("/announcement/get-categories");

        return (any as any[]).map(a => mapToAnnouncementCategory(a));
    }

    public static async getFavoriteAnnouncements(): Promise<AnnouncementShortInfo[]> {
        const any = await HttpClient.get("/announcement/favorite/get-all");

        return (any as Announcement[]).map(v => mapToAnnouncementShortInfo(v));
    }

    public static async toggleFavorite(announcementId: string) {
        await HttpClient.post("/announcement/favorite/toggle", { announcementId });
    }


}