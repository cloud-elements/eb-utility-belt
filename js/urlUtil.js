function setValue(body) {
    var outputMsg = document.getElementById('outputMsg');
    if (body) {
        outputMsg.value = body;
    } else {
        outputMsg.value = 'Invalid Base 64 input';
    }
}

function encodeUrl() {
    var inputMsg = document.getElementById('inputMsg').value;
    chrome.storage.sync.set({
        "inputMsg": inputMsg
    });

    var body = null;
    try {
        body = encodeURIComponent(inputMsg);
    } catch (ignoreIt) {
        console.log(ignoreIt);
    }

    setValue(body);
}


function decodeUrl() {
    var inputMsg = document.getElementById('inputMsg').value;
    chrome.storage.sync.set({
        "inputMsg": inputMsg
    });

    var body = null;
    try {
        body = decodeURIComponent(inputMsg);
    } catch (ignoreIt) {
        console.log(ignoreIt);
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

    var encodeUrlButton = document.getElementById('encodeUrl');
    var decodeUrlButton = document.getElementById('decodeUrl');
    var outputMsg = document.getElementById('inputMsg');
    var outputMsg = document.getElementById('outputMsg');

    encodeUrlButton.addEventListener('click', function () {

        chrome.tabs.getSelected(null, function (tab) {
            encodeUrl();
        });
    }, false);
    decodeUrlButton.addEventListener('click', function () {

        chrome.tabs.getSelected(null, function (tab) {
            decodeUrl();
        });
    }, false);
}, false);