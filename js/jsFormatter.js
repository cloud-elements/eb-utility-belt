var beautify = require('js-beautify').js_beautify;

function cleanUp(body) {
    body = body.replace(new RegExp("''", 'g'), "'");
    // Here we're trying to handle comments for js-beautify - which...doesn't :[
    body = body.split('\\n').map(line => {
        if (line.includes('//')) {
            line = line.replace('\/\/', '/*');
            line = line.concat('*/');
        }
        return line;
    }).join('  ');
    // body.replace(/(?:\r\n|\r|\\n)/g, "  "); // just \n doesn't work :[
    return body;
}

// Used browserify ./js/jsFormatter.js > ./js/jsFormatter4browser.js to get a browser compatible version...
function parseAndSetJs(body) {
    var js = null;
    var outputMsg = document.getElementById('outputMsg-js');
    try {
        js = beautify(cleanUp(body), { indent_size: 2, jslint_happy: true });
    } catch (ignoreIt) {
        console.warn('exception', ignoreIt);
    }

    if (js) {
        outputMsg.value = js;
    } else {
        outputMsg.value = 'Invalid JS';
    }
}

function formatJs() {
    var inputMsg = document.getElementById('inputMsg-js').value;

    chrome.storage.sync.set({
        "inputMsg-js": inputMsg
    });

    parseAndSetJs(inputMsg);
}

window.onload = function () {
    chrome.storage.sync.get("inputMsg-js", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items['inputMsg-js'])
                document.getElementById("inputMsg-js").value = items['inputMsg-js'];
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var formatJsButton = document.getElementById('formatJs');

    formatJsButton.addEventListener('click', function () {
        chrome.tabs.getSelected(null, function (tab) {
            formatJs();
        });
    }, false);
}, false);