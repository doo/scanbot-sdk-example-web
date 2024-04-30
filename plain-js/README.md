## Scanbot Web SDK Vanilla Javascript example

### Usage

If you want to integrate Scanbot SDK as a plain javascript library in your project, add the following script tag to your `ìndex.html`

```
<script src="https://cdn.jsdelivr.net/npm/scanbot-web-sdk@5.0.1/bundle/ScanbotSDK.min.js"></script>
```

### Downloading SDK

This folder features no `yarn`, `npm` or other dependency management systems, it just relies on the CDN link.

Additionally, if you wish to specify a different engine location, we have created a script to download `bash download-sdk.sh`. This downloads the SDK and places it inside the `wasm/` directory.

Inside the script, you can specify which bundle (document, barcode or complete) you wish to copy over and then set the engine location as follows:

```
scanbotSDK = await ScanbotSDK.initialize({
    engine: '/wasm/'
  });
```