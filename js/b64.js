function setValue(body) {
    var outputMsg = document.getElementById('i/o');
    if (body) {
        outputMsg.value = body;
    } else {
        outputMsg.value = 'Invalid Base 64 input';
    }
}

function encodeB64() {
    var inputMsg = document.getElementById('i/o').value;
    chrome.storage.sync.set({
        "i/o": inputMsg
    });

    var body = null;
    try {
        body = btoa(encodeURIComponent(inputMsg).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    } catch (ignoreIt) {
        console.warn(ignoreIt);
    }

    setValue(body);
}


function decodeB64() {
    var inputMsg = document.getElementById('i/o').value;
    chrome.storage.sync.set({
        "i/o": inputMsg
    });

    var body = null;
    try {
        body = decodeURIComponent(atob(inputMsg).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    } catch (ignoreIt) {
        console.warn(ignoreIt);
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

    var encodeB64Button = document.getElementById('encodeB64');
    var decodeB64Button = document.getElementById('decodeB64');
    var outputMsg = document.getElementById('i/o');

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