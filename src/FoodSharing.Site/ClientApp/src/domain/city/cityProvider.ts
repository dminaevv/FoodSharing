import { HttpClient } from "../../tools/httpClient";
import { City, mapToCity } from "./city";

export class CityProvider {
    public static async getCities(): Promise<City[]> {
        const any = await HttpClient.get("/cities/get");

        return (any as any[]).map(a => mapToCity(a));
    }

}