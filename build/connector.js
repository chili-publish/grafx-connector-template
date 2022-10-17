export class ChiliMediaConnector {
    constructor(runtime) {
        this.runtime = runtime;
    }
    async query(options, context) {
        let queryEndpoint = `${this._getBaseMediaUrl()}/directory?search=${options.filter?.join(' ') ?? ''}&limit=${options.pageSize ?? ''}&pageToken=${options.pageToken ?? ''}&sortBy=${options.sortBy ?? ''}&sortOrder=${options.sortOrder ?? ''}`;
        const collection = options.collection;
        if (collection != null) {
            queryEndpoint += `&folder=${collection}`;
        }
        const result = await this.runtime.fetch(queryEndpoint, { method: 'GET', referrer: 'ChiliDamConnector' });
        if (result.status / 200 != 1) {
            throw new Error(`Query failed ${result.status} ${result.statusText}`);
        }
        return JSON.parse(result.text);
    }
    async download(id, previewType, context) {
        let queryEndpoint = `${this._getBaseMediaUrl()}/${id}`;
        switch (previewType) {
            case "lowresWeb":
                queryEndpoint += '/preview/medium';
                break;
            case "highresWeb":
                queryEndpoint += '/preview/high';
                break;
            default:
                queryEndpoint += '/preview/medium';
        }
        const result = await this.runtime.fetch(queryEndpoint, { method: 'GET' });
        if (result.status / 200 != 1) {
            throw new Error(`Download failed ${result.status} ${result.statusText}`);
        }
        return result.arrayBuffer;
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
        return ['a query option'];
    }
    getDownloadOptions() {
        return ['a download option'];
    }
    getCapabilities() {
        return {
            copy: false,
            filtering: true,
            query: true,
            remove: false,
            upload: false
        };
    }
    _getBaseMediaUrl() {
        const baseUrl = this.runtime.options['baseUrl'];
        const environment = this.runtime.options['environment'];
        return baseUrl + `/environment/${environment}/media`;
    }
}
