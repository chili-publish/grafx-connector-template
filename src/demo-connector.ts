import { ArrayBufferPointer, ConnectorRuntimeContext, Dictionary, DownloadType, QueryOptions } from '../studio-sdk/types/Connector.Shared';
import { Media, MediaConnector, MediaConnectorCapabilities, MediaDetail, MediaPage,  } from '../studio-sdk/types/MediaConnector';

class DemoConnector implements MediaConnector {
    runtime: ConnectorRuntimeContext;

    constructor(runtime: ConnectorRuntimeContext) {
        this.runtime = runtime;
    }

    detail(id: string): Promise<MediaDetail> {
        throw new Error('Method not implemented.');
    }

    async query(options: QueryOptions, context: Dictionary): Promise<MediaPage> {

        var data = [
            { id: 'demo-1', type: 0, name: 'Demo 1', relativePath: '/root', metaData: {} },
            { id: 'demo-2', type: 0, name: 'Demo 2', relativePath: '/root', metaData: {} },
            { id: 'demo-3', type: 0, name: 'Demo 3', relativePath: '/root', metaData: {} },
        ];

        if (context['extraItem']) {
            data = [...data, { id: 'demo-4', type: 0, name: 'Demo 4 (extra)', relativePath: '/root', metaData: {} }]
        }

        if (options.filter) {
          data = data.filter((item) => {
            return item.name
              .toLowerCase()
              .includes(options.filter![0].toLowerCase());
          });
        }

        return Promise.resolve({            
          pageSize: data.length,
          data: data,
          links: { nextPage: "" },
        });
    }
    
    async download(id: string, previewType: DownloadType, context: Dictionary): Promise<ArrayBufferPointer> {
        return (
          await this.runtime.fetch(
            `https://dummyimage.com/600x400/000/fff&text=${id}`,
            {}
          )
        ).arrayBuffer;
    }

    getQueryOptions(): string[] | null {
        return ['extraItem'];
    }

    getDownloadOptions(): string[] | null {
        return [];
    }
    
    getCapabilities(): MediaConnectorCapabilities {
        return {
            copy: false,
            filtering: true,
            query: true,
            remove: false,
            upload: false,
            detail: false
        };
    }

    upload(name: string, blob: ArrayBufferPointer): Promise<Media> {
        throw new Error('Method not implemented.');
    }

    remove(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    copy(id: string, newName: string): Promise<Media> {
        throw new Error('Method not implemented.');
    }
}