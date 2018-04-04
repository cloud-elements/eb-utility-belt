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

function copyOutput() {
    var element = document.getElementById('i/o-html')
    element.select();
    document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('encodeHtml').addEventListener('click', encodeHtml);
    document.getElementById('decodeHtml').addEventListener('click', decodeHtml);
    document.getElementById("copyoutput").addEventListener("click", copyOutput);
}, false);