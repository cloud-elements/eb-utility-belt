var he = require('he');
const ceUtils = require('./ce-utils');

function setValue(body) {
    var outputMsg = document.getElementById('i/o-html');
    if (body) {
        outputMsg.value = body;
    } else {
        outputMsg.value = 'Invalid HTML input';
    }
}

// Used browserify ./js/html.js > ./js/html4browser.js to get a browser compatible version...
function encodeHtml() {
    var inputMsg = document.getElementById('i/o-html').value;
    chrome.storage.sync.set({
        "i/o-html": inputMsg
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
    var inputMsg = document.getElementById('i/o-html').value;
    chrome.storage.sync.set({
        "i/o-html": inputMsg
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
    chrome.storage.sync.get("i/o-html", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items['i/o-html'])
                document.getElementById("i/o-html").value = items['i/o-html'];
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