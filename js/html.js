var he = require('he');

function setValue(body) {
    var outputMsg = document.getElementById('outputMsg');
    if (body) {
        outputMsg.value = body;
    } else {
        outputMsg.value = 'Invalid Base 64 input';
    }
}

// Used browserify ./js/html.js > ./js/html4browser.js to get a browser compatible version...
function encodeHtml() {
    var inputMsg = document.getElementById('inputMsg').value;
    chrome.storage.sync.set({
        "inputMsg": inputMsg
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
    var inputMsg = document.getElementById('inputMsg').value;
    chrome.storage.sync.set({
        "inputMsg": inputMsg
    });

    var body = null;
    try {
        body = he.decode(inputMsg);
    } catch (ignoreIt) {
        console.warn(ignoreIt);
    }

    setValue(body);
}

window.onload = function () {
    chrome.storage.sync.get("inputMsg", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (!items)
                document.getElementById("inputMsg").value = items.inputMsg;
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {

    var encodeHtmlButton = document.getElementById('encodeHtml');
    var decodeHtmlButton = document.getElementById('decodeHtml');
    var outputMsg = document.getElementById('inputMsg');
    var outputMsg = document.getElementById('outputMsg');

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