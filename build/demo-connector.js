class DemoConnector {
    constructor(runtime) {
        this.runtime = runtime;
    }
    async query(options, context) {
        return Promise.resolve({ pageSize: 3, data: [
                { id: 'demo-1', type: 0, name: 'Demo 1', relativePath: "/root", metaData: {} },
                { id: 'demo-2', type: 0, name: 'Demo 2', relativePath: "/root", metaData: {} },
                { id: 'demo-3', type: 0, name: 'Demo 3', relativePath: "/root", metaData: {} },
            ] });
    }
    async download(id, previewType, context) {
        return (await this.runtime.fetch(`https://dummyimage.com/600x400/000/fff&text=${id}`, {})).arrayBuffer;
    }
    upload(name, blob) {
        throw new Error("Method not implemented.");
    }
    remove(id) {
        throw new Error("Method not implemented.");
    }
    copy(id, newName) {
        throw new Error("Method not implemented.");
    }
    getQueryOptions() {
        return [];
    }
    getDownloadOptions() {
        return [];
    }
    getCapabilities() {
        return {
            copy: false,
            filtering: false,
            query: true,
            remove: false,
            upload: false
        };
    }
}
export {};
