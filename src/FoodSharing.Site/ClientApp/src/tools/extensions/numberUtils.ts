export { };

declare global {
    interface Number {
        butNotLess(than: number): number;
        butNotMore(than: number): number;
        toRound(to: number): number;
    }
}

Number.prototype.butNotLess = function (than: number) {
    return Math.max(+this, than);
}

Number.prototype.butNotMore = function (than: number) {
    return Math.min(+this, than);
}

Number.prototype.toRound = function (to: number) {
    return Number(this.toFixed(to))
}
