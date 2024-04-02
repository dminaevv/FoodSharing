import { HttpClient } from "../../tools/httpClient";
import { Result, mapToResult } from "../../tools/results/result";
import { UserInfo, mapToUserInfo } from "./userInfo";

export class UserProvider {
    public static async login(email: string, password: string): Promise<Result> {
        const any = await HttpClient.post("/login", { email, password });

        return mapToResult(any);
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