import { encodeUrl, decodeUrl } from '../utilities/ce-utils.js';

function setValue(body) {
    var outputMsg = document.getElementById('i/o-url');
    if (body) {
        outputMsg.value = body;
    } else {
        outputMsg.value = 'Invalid Base 64 input';
    }
}

function invokeEncodeUrl() {
    var inputMsg = document.getElementById('i/o-url').value;
    chrome.storage.sync.set({
        "i/o-url": inputMsg
    });

    var body = null;
    try {
        body = encodeUrl(inputMsg);
    } catch (ignoreIt) {
        console.log(ignoreIt);
    }

    setValue(body);
}


function invokeDecodeUrl() {
    var inputMsg = document.getElementById('i/o-url').value;
    chrome.storage.sync.set({
        "i/o-url": inputMsg
    });

    var body = null;
    try {
        body = decodeUrl(inputMsg);
    } catch (ignoreIt) {
        console.log(ignoreIt);
    }

    setValue(body);
}

window.onload = function () {
    chrome.storage.sync.get("i/o-url", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items['i/o-url'])
                document.getElementById("i/o-url").value = items['i/o-url'];
        }
    });
}

function copyOutput() {
    var element = document.getElementById('i/o-url')
    element.select();
    document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("copyoutput").addEventListener("click", copyOutput);
    document.getElementById('encodeUrl').addEventListener('click', invokeEncodeUrl);
    document.getElementById('decodeUrl').addEventListener('click', invokeDecodeUrl);
}, false);