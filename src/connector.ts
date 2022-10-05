import { ArrayBufferPointer, ConnectorRuntimeContext, Dictionary } from "grafx-studio-connector-shared";
import { Media, MediaConnector, MediaConnectorCapabilities, MediaPage, QueryOptions } from "grafx-studio-mediaconnector";

class ChiliMediaConnector implements MediaConnector {
    runtime: ConnectorRuntimeContext;

    constructor(runtime: ConnectorRuntimeContext) {
        this.runtime = runtime;
    }

    async query(options: QueryOptions, context: Dictionary): Promise<MediaPage> {
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

    async download(id: string, previewType: "lowresWeb"|"highresWeb", context: Dictionary): Promise<ArrayBufferPointer> {
        let queryEndpoint = `${this._getBaseMediaUrl()}/${id}`;

        switch (previewType) {
            case "lowresWeb":
                queryEndpoint += '/preview/medium';
                break;
            case "highresWeb":
                queryEndpoint += '/preview/high';
                break
            default:
                queryEndpoint += '/preview/medium';
        }

        const result = await this.runtime.fetch(queryEndpoint, { method: 'GET' });

        if (result.status / 200 != 1) {
            throw new Error(`Download failed ${result.status} ${result.statusText}`);
        }

        return result.arrayBuffer;
    }
    upload(name: string, blob: Int8Array): Promise<Media> {
        throw new Error("Method not implemented.");
    }
    remove(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    copy(id: string, newName: string): Promise<Media> {
        throw new Error("Method not implemented.");
    }
    getQueryOptions(): string[] | null {
        return ['a query option'];
    }
    getDownloadOptions(): string[] | null {
        return ['a download option'];
    }
    getCapabilities(): MediaConnectorCapabilities {
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