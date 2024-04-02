export class BlobFile {
    constructor(
        public readonly data: Blob,
        public readonly name: string
    ) { }

    public get isImage(): boolean {
        return this.data.type.startsWith("image/");
    }

    public async download(fileName: string = this.name): Promise<void> {
        const blobUrl = URL.createObjectURL(this.data);
        var a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}