import {
    encodeBase64,
    decodeBase64,
    encodeUrl,
    decodeUrl,
    getEpochFromIso,
    getIsoFromEpoch,
    executeSafeFunction
} from '../utilities/ce-utils.js';

chrome.runtime.onMessage.addListener(function (request) {
    if (request.type === 'popout') {
        chrome.tabs.create({
            url: chrome.extension.getURL(request.url),
            active: true
        });
    } else {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.update(tabs[0].id, {
                url: chrome.extension.getURL(request.url)
            });
        });
    }
});

const decodeMenu = [{
        id: 'Decode Base64',
        act: (info, tab) => {
            console.log('Base64 - decode', info, tab );
            alert(executeSafeFunction(decodeBase64,  info.selectionText, 'Invalid value'));
        }
    },
    {
        id: 'Decode URL',
        act: (info, tab) => {
            console.log('URL - decode', info, tab );
            alert(executeSafeFunction(decodeUrl,  info.selectionText, 'Invalid value'));
        }
    },
];

const encodeMenu = [{
        id: 'Encode Base64',
        act: (info, tab) => {
            console.log('Base64 - encode', info, tab );
            alert(executeSafeFunction(encodeBase64,  info.selectionText, 'Invalid value'));
        }
    },
    {
        id: 'Encode URL',
        act: (info, tab) => {
            console.log('URL - encode', info, tab );
            alert(executeSafeFunction(encodeUrl,  info.selectionText, 'Invalid value'));
        }
    }
];

const convertMenu = [{
        id: 'Epoch to ISO',
        act: (info, tab) => {
            console.log('epoch to iso', info, tab );
            alert(executeSafeFunction(getIsoFromEpoch,  info.selectionText, 'Invalid value'));
        }
    },
    {
        id: 'ISO to Epoch',
        act: (info, tab) => {
            console.log('iso to epoch', info, tab );
            alert(executeSafeFunction(getEpochFromIso,  info.selectionText, 'Invalid value'));
        }
    }
];

const rootMenu = [{
        id: 'Decode',
        menu: decodeMenu
    },
    {
        id: 'Encode',
        menu: encodeMenu
    },
    {
        id: 'Convert',
        menu: convertMenu
    }
];

const listeners = {};

const addMenu = (menu, root = null) => {

    for (let item of menu) {
        let {id, menu, act } = item;

        chrome.contextMenus.create({
            id: id,
            title: id,
            contexts: ['selection'],
            parentId: root,
        });

        if (act) {
            listeners[id] = act;
        }

        if (menu) {
            addMenu(menu, id);
        }
    }

};

addMenu(rootMenu);

chrome.contextMenus.onClicked.addListener((info, tab) => {
    listeners[info.menuItemId](info, tab);
});