var he = require('he');
const ceUtils = require('./ce-utils');

function setValue(body) {
    var outputMsg = document.getElementById('i/o');
    if (body) {
        outputMsg.value = body;
    } else {
        outputMsg.value = 'Invalid Base 64 input';
    }
}

// Used browserify ./js/html.js > ./js/html4browser.js to get a browser compatible version...
function encodeHtml() {
    var inputMsg = document.getElementById('i/o').value;
    chrome.storage.sync.set({
        "i/o": inputMsg
    });

    var body = null;
    try {
        body = he.encode(inputMsg);
    } catch (ignoreIt) {
        console.warn(ignoreIt);
    }

    setValue(body);
}


function decodeHtml() {
    var inputMsg = document.getElementById('i/o').value;
    chrome.storage.sync.set({
        "i/o": inputMsg
    });

    var body = null;
    try {
        body = he.decode(inputMsg);
    } catch (ignoreIt) {
        console.warn(ignoreIt);
    }

    if (body && ceUtils.isJson(body)) {
        body = JSON.stringify(JSON.parse(body), 0, 2);
    }


    setValue(body);
}

window.onload = function () {
    chrome.storage.sync.get("i/o", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (!items)
                document.getElementById("i/o").value = items.inputMsg;
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {

    var encodeHtmlButton = document.getElementById('encodeHtml');
    var decodeHtmlButton = document.getElementById('decodeHtml');

    encodeHtmlButton.addEventListener('click', function () {
        chrome.tabs.getSelected(null, function (tab) {
            encodeHtml();
        });
    }, false);

    decodeHtmlButton.addEventListener('click', function () {
        chrome.tabs.getSelected(null, function (tab) {
            decodeHtml();
        });
    }, false);
}, false);