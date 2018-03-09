var pd = require('pretty-data').pd;

// Used browserify xmlFormatter.js > xmlFormatter4browser.js to get a browser compatible version...
function parseAndSetXml(body) {
    var xml = null;
    var outputMsg = document.getElementById('outputMsg');

    try {
        xml = pd.xml(body, true);
    } catch (ignoreIt) {
        console.warn('exception', ignoreIt);
    }

    if (xml != body) {
        outputMsg.value = xml;
    } else {
        outputMsg.value = 'Invalid XML';
    }
}

function formatXml() {
    var inputMsg = document.getElementById('inputMsg').value;

    chrome.storage.sync.set({
        "inputMsg": inputMsg
    });

    parseAndSetXml(inputMsg);
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

    var formatXmlButton = document.getElementById('formatXml');
    var outputMsg = document.getElementById('inputMsg');
    var outputMsg = document.getElementById('outputMsg');

    formatXmlButton.addEventListener('click', function () {
        chrome.tabs.getSelected(null, function (tab) {
            formatXml();
        });
    }, false);
}, false);