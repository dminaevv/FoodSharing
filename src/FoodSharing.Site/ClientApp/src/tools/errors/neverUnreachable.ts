
export class NeverUnreachable extends Error {
    // Если в коде будет достижим вызов конструктора - ts выдаст ошибку
    constructor(value: never) {
        super(`Unreachable statement: ${value}`);
    }
}