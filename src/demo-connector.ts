import { ArrayBufferPointer, ConnectorRuntimeContext, Dictionary } from "grafx-studio-connector-shared";
import { Media, MediaConnector, MediaConnectorCapabilities, MediaPage, QueryOptions } from "grafx-studio-mediaconnector";

class DemoConnector implements MediaConnector {
    runtime: ConnectorRuntimeContext;

    constructor(runtime: ConnectorRuntimeContext) {
        this.runtime = runtime;
    }
    async query(options: QueryOptions, context: Dictionary): Promise<MediaPage> {
        return Promise.resolve({pageSize: 3, data:[
            { id: 'demo-1', name: 'Demo 1', relativePath: "/root", metaData: {} },
            { id: 'demo-2', name: 'Demo 2', relativePath: "/root", metaData: {} },
            { id: 'demo-3', name: 'Demo 3', relativePath: "/root", metaData: {} },
        ]});
    }
    async download(id: string, previewType: "lowresWeb" | "highresWeb", context: Dictionary): Promise<ArrayBufferPointer> {
        return (await this.runtime.fetch(`https://dummyimage.com/600x400/000/fff&text=${id}`, {})).arrayBuffer;
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
        return [];
    }
    getDownloadOptions(): string[] | null {
        return [];
    }
    getCapabilities(): MediaConnectorCapabilities {
        return {
            copy: false,
            filtering: false,
            query: true,
            remove: false,
            upload: false
        };
    }
}