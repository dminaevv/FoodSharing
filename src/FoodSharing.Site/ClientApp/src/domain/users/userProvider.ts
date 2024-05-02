import { HttpClient } from "../../tools/httpClient";
import { Result, mapToResult } from "../../tools/results/result";
import { UserBlank } from "./userBlank";
import { UserInfo, mapToUserInfo } from "./userInfo";

export class UserProvider {
    public static async save(blank: UserBlank): Promise<Result> {
        const any = await HttpClient.formData("/profile/settings/save", blank);

        return mapToResult(any);
    }

    public static async login(email: string, password: string): Promise<Result> {
        const any = await HttpClient.post("/login", { email, password });

        return mapToResult(any);
    }

    public static async logout() {
        await HttpClient.get("/logout");
    }


    public static async register(email: string, password: string): Promise<Result> {
        const any = await HttpClient.post("/register", { email, password });

        return mapToResult(any);
    }

    public static async getUserInfo(userId: string): Promise<UserInfo> {
        const any = await HttpClient.get("/user/get-info", { userId });

        return mapToUserInfo(any);
    }
}