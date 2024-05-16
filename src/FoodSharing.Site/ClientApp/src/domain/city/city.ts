export class City {
    constructor(
        public id: string,
        public name: string
    ) { }
}

export function mapToCity(data: any) {
    return new City(data.id, data.name);
}