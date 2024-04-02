export class PagedResult<T>{
    constructor(
        public values: T[],
        public totalRows: number
    ) { }
}