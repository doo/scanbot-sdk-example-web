## Scanbot Web SDK Vanilla Javascript example

### Preparation

This folder features no `yarn`, `npm` or other dependency management systems, the SDK must be downloaded in just the plain old way.

We have created a convenience script to achieve that, though, so just run `bash download-sdk.sh` in order to download ScanbotSDK from our CDN

### Usage

If you want to integrate Scanbot SDK as a plain javascript library in your project, add the following script tag to your `ìndex.html`

```
<script src="https://cdn.jsdelivr.net/npm/scanbot-web-sdk@2.9.0-alpha4/bundle/ScanbotSDK.min.js"></script>
```

### Caveat

This example requires you to manually download the SDK and tessdata files due to internal webpack pathing restrictions. So, if you need tessdata in your project as well, you should also opt to download the files and add them via a local path, as in this example. Otherwise the CDN link is the preferred option