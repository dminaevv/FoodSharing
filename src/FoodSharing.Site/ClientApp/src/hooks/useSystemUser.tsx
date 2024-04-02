import { mapToSystemUser } from "../domain/users/systemUser";

export function useSystemUser() {
    const anySystemUser = (window as any).systemUser;
    const systemUser = anySystemUser == null ? null : mapToSystemUser(anySystemUser);

    return systemUser;
}