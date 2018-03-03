var pd = require('pretty-data').pd;

// Used browserify sqlFormatter.js > sqlFormatter4browser.js to get a browser compatible version...
function parseAndSetSql(body) {
    var sql = null;
    var outputMsg = document.getElementById('outputMsg');

    try {
        sql = pd.sql(body);
    } catch (ignoreIt) {
        console.log('exception', ignoreIt);
    }

    if (sql) {
        outputMsg.value = sql;
    } else {
        outputMsg.value = 'Invalid SQL';
    }
}

function formatSql() {
    var inputMsg = document.getElementById('inputMsg').value;

    chrome.storage.sync.set({
        "inputMsg": inputMsg
    });

    parseAndSetSql(inputMsg);
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

    var formatSqlButton = document.getElementById('formatSql');
    var outputMsg = document.getElementById('inputMsg');
    var outputMsg = document.getElementById('outputMsg');

    formatSqlButton.addEventListener('click', function () {
        chrome.tabs.getSelected(null, function (tab) {
            formatSql();
        });
    }, false);
}, false);