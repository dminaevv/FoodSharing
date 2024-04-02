
export const enumToArrayNumber = <T>(enumObj: any): T[] => {

    let enumValues: T[] = [];

    for (var n in enumObj) {
        if (typeof enumObj[n] === 'number') {
            enumValues.push(<any>enumObj[n]);
        }
    }

    return enumValues;
}

