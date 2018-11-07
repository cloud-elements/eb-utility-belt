function setValue(body) {
    var outputMsg = document.getElementById('i/o-b64');
    if (body) {
        outputMsg.value = body;
    } else {
        outputMsg.value = 'Invalid Base 64 input';
    }
}

function encodeB64() {
    var inputMsg = document.getElementById('i/o-b64').value;
    chrome.storage.sync.set({
        "i/o-b64": inputMsg
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
    var inputMsg = document.getElementById('i/o-b64').value;
    chrome.storage.sync.set({
        "i/o-b64": inputMsg
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
    chrome.storage.sync.get("i/o-b64", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items['i/o-b64'])
                document.getElementById("i/o-b64").value = items['i/o-b64'];
        }
    });
}

function copyOutput() {
    var element = document.getElementById('i/o-b64')
    element.select();
    document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("copyoutput").addEventListener("click", copyOutput);
    document.getElementById('encodeB64').addEventListener('click', encodeB64);
    document.getElementById('decodeB64').addEventListener('click', decodeB64);
}, false);