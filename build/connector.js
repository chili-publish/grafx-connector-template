import { DownloadType } from '../studio-sdk/types/Connector.Shared';
export class ChiliMediaConnector {
    constructor(runtime) {
        this.runtime = runtime;
    }
    async detail(id) {
        let queryEndpoint = `${this._getBaseMediaUrl()}/${id}`;
        const result = await this.runtime.fetch(queryEndpoint, { method: 'GET', referrer: 'grafx-media-connector' });
        if (result.status / 200 != 1) {
            throw new Error(`Detail failed ${result.status} ${result.statusText}`);
        }
        return JSON.parse(result.text).data;
    }
    async query(options, context) {
        const collection = options.collection;
        const page = options.pageToken;
        let queryEndpoint = '';
        if (page != null && page.length > 0) {
            queryEndpoint = `${this._getBaseMediaUrl()}/directory?limit=${options.pageSize ?? ''}&nextPageToken=${options.pageToken ?? ''}`;
        }
        else {
            queryEndpoint = `${this._getBaseMediaUrl()}/directory?search=${options.filter?.join(' ') ?? ''}&limit=${options.pageSize ?? ''}&sortBy=${options.sortBy ?? ''}&sortOrder=${options.sortOrder ?? ''}`;
        }
        if (collection != null) {
            queryEndpoint += `&folder=${collection}`;
        }
        const result = await this.runtime.fetch(queryEndpoint, { method: 'GET', referrer: 'grafx-media-connector' });
        if (result.status / 200 != 1) {
            throw new Error(`Query failed ${result.status} ${result.statusText}`);
        }
        return JSON.parse(result.text);
    }
    async download(id, previewType, context) {
        let queryEndpoint = `${this._getBaseMediaUrl()}/${id}`;
        switch (previewType) {
            case DownloadType.lowres_web:
                queryEndpoint += '/preview/medium';
                break;
            case DownloadType.highres_web:
                queryEndpoint += '/preview/highest';
                break;
            case DownloadType.outputVideo:
                queryEndpoint += '/video';
                break;
            case DownloadType.outputPdf:
                queryEndpoint += '/download';
                break;
            default:
                queryEndpoint += '/preview/medium';
        }
        const result = await this.runtime.fetch(queryEndpoint, { method: 'GET', referrer: 'grafx-media-connector' });
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
            upload: false,
            detail: true
        };
    }
    _getBaseMediaUrl() {
        let baseUrl = this.runtime.options['ENVIRONMENT_API'];
        baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        return baseUrl + `media`;
    }
}
