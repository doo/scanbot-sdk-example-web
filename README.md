# Scanbot Barcode & Document Scanner SDK Example App for the Web

This example app shows how to integrate the [Scanbot Barcode Scanner SDK](https://scanbot.io/developer/javascript-barcode-scanner/) & [Scanbot Document Scanner SDK](https://scanbot.io/developer/javascript-document-scanner/) into your web applications.

## What is the Scanbot SDK?

The [Scanbot Web Document Scanner SDK](https://scanbot.io/developer/javascript-document-scanner/) makes it possible to integrate document scanning on your website or in your web application. It features real-time document detection with user guidance, auto-snapping, auto-cropping and perspective correction.

The [Scanbot Web Barcode Scanner SDK](https://scanbot.io/developer/javascript-barcode-scanner/) lets you integrate barcode scanning features into your website or web application. It is a simple to use high level API, providing a collection of classes and functions for scanning and parsing 1D and 2D barcodes from a mobile device's camera or other image sources like your photo library.

## Trial License

The Scanbot SDK will run without a license for one minute per session!

After the trial period is over all Scanbot Web SDK functions as well as UI components (Document Scanner UI) will stop working. You have to refresh the page to get another trial period.

To test the Scanbot SDK without crashing, you can get a free “no-strings-attached” trial license. Please submit the [Trial License Form](https://scanbot.io/trial/) on our website.

## Free Developer Support

We provide free "no-strings-attached" developer support for the implementation & testing of the Scanbot SDK.
If you encounter technical issues with integrating the Scanbot SDK or need advice on choosing the appropriate
framework or features, please visit our [Support Page](https://docs.scanbot.io/support/).

## How does it work?

The SDK is a native SDK built for the web via [Emscripten](https://emscripten.org/). It relies on [WebAssembly](https://webassembly.org) and Camera access via HTML Media Capture API.

The react component is built with [React](https://reactjs.org/) and the plain JavaScript bundle with [Preact](https://preactjs.com/).

## Documentation

For the developer guide and full API reference of the Scanbot Web Barcode & Document Scanner SDK, please check out the
[documentation](https://docs.scanbot.io/document-scanner-sdk/web/introduction/).

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



### Vue.js App

Like the React example app, the Vue.js example app relies on the `npm` [package](https://www.npmjs.com/package/scanbot-web-sdk)
of the Scanbot Web Document Scanner SDK.

To run the Vue.js example app:

```
cd vue-js/
npm install
npm run dev
```



### Plain JavaScript App

The vanilla JavaScript app needs to download the SDK from npm. To do this, run the script

```
plain-js/download-sdk.sh
```

To run the JavaScript example:

```
cd plain-js/
php -S localhost:8000
```
