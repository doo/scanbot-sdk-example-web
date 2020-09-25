## Scanbot Web SDK Examples

### What is it?

Scanbot Web SDK is [Scanbot SDK](https://scanbot.io/), 
a document scanning and processing SDK, for your Browser.

### How does it work?

The SDK is a native SDK built for the web via [Emscripten](https://emscripten.org/).
It relies on WebAssembly and Camera access.

The react component is built with [React](https://reactjs.org/) 
and the plain javascript bundle with [Preact](https://preactjs.com/).

### React

The react example app relies on `npm` 

To run the react example app:
```
cd react-js/
npm install
npm start
```

### Javascript
 
The vanilla javascript downloads Scanbot Web SDK from an unofficial CDN:
```
https://cdn.jsdelivr.net/npm/scanbot-web-sdk@1.0.0-rc1/bundle/ScanbotSDK.min.js
```

To run the javascript example:
```
cd plain-js/
php -S localhost:8000
```

### Please note
Scanbot SDK will run without a license for one minute per session!

After the trial period is over all Scanbot SDK functions 
as well as UI components (Document Scanner UI) will stop working or may be terminated. 
You have to refresh the page to get another trial period.

To get an unrestricted **no-strings-attached** 30 day trial license, 
please submit the [Trial License Form](https://scanbot.io/en/sdk/demo/trial) on our website.
