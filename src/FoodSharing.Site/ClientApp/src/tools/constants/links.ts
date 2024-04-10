export class InfrastructureLinks {
    static home = '/';
    static forbidden = '/Error/403';
    static notFound = '/Error/404';
    static unknown = '/Error/:error';

    static statusCode(status: number): string {
        return `/Error/${status}`;
    }
}

export class AuthLinks {
    static login = '/login';
    static register = '/register';
    static resetPassword = '/resetPassword';
}

export class ProfileLinks {
    static main = '/profile';
}

export class AnnouncementLinks {
    static announcement = '/announcement/:id';
    static create = '/announcement/add';
    static edit = '/announcement/edit/:id';

    static toEdit(id: string) {
        return `/announcement/edit/${id}`;
    }

    static toAnnouncement(id: string) {
        return `/announcement/${id}`;
    };
}


export class ChatLinks {
    static main = '/chats';
    static chat = '/chat/:chatId';
}

export class UsersLinks {
    static user = '/user/:id';

    static toUser(id: string) {
        return `/user/${id}`;
    };
}
