function parseJson(body) {
    var json = null;
    try {
        json = JSON.parse(body);
    } catch (ignoreIt) {
        console.warn('exception', ignoreIt);
    }
    var outputMsg = document.getElementById('outputMsg-json');
    if (json) {
        outputMsg.value = JSON.stringify(json, 0, 2);
    } else {
        outputMsg.value = 'Invalid JSON';
    }
}

function formatJson() {
    var inputMsg = document.getElementById('inputMsg-json').value;

    chrome.storage.sync.set({
        "inputMsg-json": inputMsg
    });

    parseJson(inputMsg);
}

window.onload = function () {
    chrome.storage.sync.get("inputMsg-json", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items['inputMsg-json'])
                document.getElementById("inputMsg-json").value = items['inputMsg-json'];
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var formatJsonButton = document.getElementById('formatJson');

    formatJsonButton.addEventListener('click', function () {
        chrome.tabs.getSelected(null, function (tab) {
            formatJson();
        });
    }, false);
}, false);