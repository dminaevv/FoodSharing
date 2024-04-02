export type BlockUiOperation = () => Promise<unknown>;

class BlockUiStore {
    public showOperation: BlockUiOperation = () => Promise.resolve();
    public hideOperation: BlockUiOperation = () => Promise.resolve();

    public block = async (operation: () => Promise<void> | void) => {
        try {
            await this.showOperation();
            await operation();
        } finally {
            await this.hideOperation();
        }
    }

    register(showOperation: BlockUiOperation, hideOperation: BlockUiOperation) {
        this.showOperation = showOperation;
        this.hideOperation = hideOperation;
    }
}

export default new BlockUiStore();
