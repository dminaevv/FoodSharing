export type ConfirmDialogShowOperation = (title: string) => Promise<unknown>;
export type ConfirmDialogHideOperation = () => Promise<unknown>;

class ConfirmStore {
    public showAsync: ConfirmDialogShowOperation = (_title: string) => Promise.resolve()
    public hideAsync: ConfirmDialogHideOperation = () => Promise.resolve();

    resolveCallback: ((isConfirmed: boolean) => void) | null = null;

    public confirm = async (title: string) => {
        try {
            await this.showAsync(title);
            return new Promise((resolve) => this.resolveCallback = resolve)
        } catch (e) {
            await this.hideAsync();
            throw e;
        }
    }

    public resolve = async (isConfirmed: boolean) => {
        if (this.resolveCallback != null) this.resolveCallback(isConfirmed);
        await this.hideAsync();
    }

    register(showAsync: ConfirmDialogShowOperation, hideAsync: ConfirmDialogHideOperation) {
        this.showAsync = showAsync;
        this.hideAsync = hideAsync;
    }
}

export default new ConfirmStore();
