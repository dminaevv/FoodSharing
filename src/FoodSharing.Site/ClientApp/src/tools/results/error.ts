export class Error {
    constructor(
        public key: string | null,
        public message: string) {
    }
}

export const mapToErrors = (errors: any[]): Error[] => {
    return errors.map(error => new Error(
        error.Key ? error.Key : error.key,
        error.Message ? error.Message : error.message)
    );
};
