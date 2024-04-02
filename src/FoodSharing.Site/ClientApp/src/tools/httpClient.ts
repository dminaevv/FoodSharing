import axios, { AxiosResponse } from "axios";
import { useNotifications } from "../hooks/useNotifications";

export class HttpClient {
    public static async get(url: string, params?: any) {
        const axiosInstance = axios.create();

        const response = await axiosInstance.get(url, {
            params,
            maxRedirects: 0,
            validateStatus: function (status) {
                return status >= 200 && status < 300;
            }
        });

        return HttpClient.handleResponse(response);
    }

    public static async post(url: string, params: any = null) {
        const response = await axios.post(url, params);

        return HttpClient.handleResponse(response);
    }

    private static async handleResponse(response: AxiosResponse) {
        const { addErrorNotification } = useNotifications();

        if (response.headers['content-type'].includes('text/html')) {
            window.location.href = response.request.responseURL;
            return Promise.reject();
        }

        const noContentStatus = 204;
        if (response.status == noContentStatus) return Promise.resolve(null);

        if (response.status == 200) return Promise.resolve(response.data);

        if (response.status == 403) {
            addErrorNotification("У Вас нет доступа к функционалу")
        }
        else {
            addErrorNotification("Произошла неизвестная ошибка")
        }

        return Promise.reject(`Запрос ${response.headers.location} вернул статус код ${response.status}`);

    }
}