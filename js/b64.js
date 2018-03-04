function setValue(body) {
    var outputMsg = document.getElementById('outputMsg');
    if (body) {
        outputMsg.value = body;
    } else {
        outputMsg.value = 'Invalid Base 64 input';
    }
}

function encodeB64() {
    var inputMsg = document.getElementById('inputMsg').value;
    chrome.storage.sync.set({
        "inputMsg": inputMsg
    });

    var body = null;
    try {
        body = btoa(encodeURIComponent(inputMsg).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
    } catch (ignoreIt) {
        console.log(ignoreIt);
    }

    setValue(body);
}


function decodeB64() {
    var inputMsg = document.getElementById('inputMsg').value;
    chrome.storage.sync.set({
        "inputMsg": inputMsg
    });

    var body = null;
    try {
        body = decodeURIComponent(atob(inputMsg).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
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

    var encodeB64Button = document.getElementById('encodeB64');
    var decodeB64Button = document.getElementById('decodeB64');
    var outputMsg = document.getElementById('inputMsg');
    var outputMsg = document.getElementById('outputMsg');

    encodeB64Button.addEventListener('click', function () {

        chrome.tabs.getSelected(null, function (tab) {
            encodeB64();
        });
    }, false);
    decodeB64Button.addEventListener('click', function () {

        chrome.tabs.getSelected(null, function (tab) {
            decodeB64();
        });
    }, false);
}, false);