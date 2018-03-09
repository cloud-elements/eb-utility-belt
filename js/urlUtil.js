function setValue(body) {
    var outputMsg = document.getElementById('i/o');
    if (body) {
        outputMsg.value = body;
    } else {
        outputMsg.value = 'Invalid Base 64 input';
    }
}

function encodeUrl() {
    var inputMsg = document.getElementById('i/o').value;
    chrome.storage.sync.set({
        "i/o": inputMsg
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
    var inputMsg = document.getElementById('i/o').value;
    chrome.storage.sync.set({
        "i/o": inputMsg
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
    chrome.storage.sync.get("i/o", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (!items)
                document.getElementById("i/o").value = items.inputMsg;
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var encodeUrlButton = document.getElementById('encodeUrl');
    var decodeUrlButton = document.getElementById('decodeUrl');

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