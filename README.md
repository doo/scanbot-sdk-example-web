# Example Apps for the Scanbot Web Document Scanner SDK

## What is it?

The [Scanbot Web Document Scanner SDK](https://scanbot.io/products/document-scanning/web-document-scanner/) makes it possible
to integrate document scanning on your website or in your web application. It features real-time document detection
with user guidance, auto-snapping, auto-cropping and perspective correction.

## How does it work?

The SDK is a native SDK built for the web via [Emscripten](https://emscripten.org/).
It relies on [WebAssembly](https://webassembly.org) and Camera access via HTML Media Capture API.

The react component is built with [React](https://reactjs.org/)
and the plain JavaScript bundle with [Preact](https://preactjs.com/).

## How to run the example apps?

### React App

The React example app relies on the `npm` [package](https://www.npmjs.com/package/scanbot-web-sdk)
of the Scanbot Web Document Scanner SDK.

To run the React example app:

```
cd react-js/
npm install
npm start
```

### Plain JavaScript App

The vanilla JavaScript app downloads the Scanbot Web SDK from an unofficial CDN:

```
https://cdn.jsdelivr.net/npm/scanbot-web-sdk@1.0.0-rc1/bundle/ScanbotSDK.min.js
```

To run the JavaScript example:

```
cd plain-js/
php -S localhost:8000
```

## Documentation

For the developer guide and full API reference of the Scanbot Web Document Scanner SDK please check out the
[documentation](https://docs.scanbot.io/document-scanner-sdk/web/introduction/).

## Please note

The Scanbot Web Document Scanner SDK will run without a license for one minute per session!

After the trial period is over all Scanbot Web SDK functions
as well as UI components (Document Scanner UI) will stop working.
You have to refresh the page to get another trial period.

To get a free "no-strings-attached" trial license, please submit the [Trial License Form](https://scanbot.io/trial/) on our website.
