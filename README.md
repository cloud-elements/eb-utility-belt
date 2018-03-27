# eb-utility-belt <sub><sup>| Element Builder Utility functions for Chrome </sup></sub>

![eb-belt](https://github.com/cloud-elements/eb-utility-belt/blob/master/resources/eb-belt.png?raw=true)

## How/Installation:
1. Download the `eb-utility-belt` folder.
1. Go to `chrome://extensions/` and check the box for Developer mode in the top right.
1. Click the `Load unpacked extension` button and select this folder for your extension to install it.

    > __PROTIP:__ You can enable a full screen, (_and debugging_) by using the id provided in `chrome://extensions/` and navigating to `chrome-extension://{id}/index.html`

## Contributing
- Chrome APIs can handle most things, but if you need/want to use node - you will need invoke some [browserify](https://github.com/browserify/browserify) magic. This will bundle all of your requires into your specified file that you will run in the browser. 
    - `npm install -g browserify`
    - Find yourself where needs be and execute something akin to `browserify ./js/sqlFormatter.js > ./js/sqlFormatter4browser.js`
    - Refer that bundle in your `.html` and you're gravy :]
