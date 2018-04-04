var pd = require('pretty-data').pd;

// Used browserify ./js/xmlFormatter.js > ./js/xmlFormatter4browser.js to get a browser compatible version...
function parseAndSetXml(body) {
    var xml = null;
    var outputMsg = document.getElementById('outputMsg-xml');

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
    var inputMsg = document.getElementById('inputMsg-xml').value;

    chrome.storage.sync.set({
        "inputMsg-xml": inputMsg
    });

    parseAndSetXml(inputMsg);
}

window.onload = function () {
    chrome.storage.sync.get("inputMsg-xml", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items['inputMsg-xml'])
                document.getElementById("inputMsg-xml").value = items['inputMsg-xml'];
        }
    });
}

function copyOutput() {
    var element = document.getElementById('outputMsg-xml')
    element.select();
    document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("copyoutput").addEventListener("click", copyOutput);
    document.getElementById('formatXml').addEventListener('click', formatXml);
}, false);