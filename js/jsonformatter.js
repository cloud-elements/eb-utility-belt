function parseJson(body) {
    var json = null;
    try {
        json = JSON.parse(body);
    } catch (ignoreIt) {
        console.log('exception', ignoreIt);
    }
    var outputMsg = document.getElementById('outputMsg');
    if (json) {
        outputMsg.value = JSON.stringify(json, 0, 2);
    } else {
        outputMsg.value = 'Invalid JSON';
    }
}

function generateModel() {
    var inputMsg = document.getElementById('inputMsg').value;

    chrome.storage.sync.set({
        "inputMsg": inputMsg
    });

    parseJson(inputMsg);
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

    var generateModelButton = document.getElementById('formatJson');
    var outputMsg = document.getElementById('inputMsg');
    var outputMsg = document.getElementById('outputMsg');

    generateModelButton.addEventListener('click', function () {

        chrome.tabs.getSelected(null, function (tab) {
            generateModel();
        });
    }, false);
}, false);