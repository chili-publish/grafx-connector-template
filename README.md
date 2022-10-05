# grafx-media-connector-template

* Open the repo in VS Code 
* Open terminal and run `npm install` (if you haven't, install nodejs)
* Open terminal and run `npm run watch`
* Start editing the src/*.ts connector files
* Watch the build folder compile connector modules! 

# Use in SDK

```
api = await SDK.editorAPI;
var doc = { name:'demo', id: 'demo-connector', type: 'media', source: 'url', url: 'https://raw.githubusercontent.com/chili-publish/grafx-media-connector-template/main/definitions/demo-connector.json?token=GHSAT0AAAAAABZGQKKBLSVNVU6XRS6JB2LEYZ54YVA'  };
await api.mediaConnectorRegisterConnector(JSON.stringify(doc));
await api.mediaConnectorQuery('demo-connector', '{}', '{}');
await api.mediaConnectorDownload('demo-connector', 'test', 'lowresWeb', '{}');
```