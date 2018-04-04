var pd = require('pretty-data').pd;

// Used browserify ./js/sqlFormatter.js > ./js/sqlFormatter4browser.js to get a browser compatible version...
function parseAndSetSql(body) {
    var sql = null;
    var outputMsg = document.getElementById('outputMsg-sql');

    try {
        sql = pd.sql(body);
    } catch (ignoreIt) {
        console.warn('exception', ignoreIt);
    }

    if (sql) {
        outputMsg.value = sql;
    } else {
        outputMsg.value = 'Invalid SQL';
    }
}

function formatSql() {
    var inputMsg = document.getElementById('inputMsg-sql').value;

    chrome.storage.sync.set({
        "inputMsg-sql": inputMsg
    });

    parseAndSetSql(inputMsg);
}

window.onload = function () {
    chrome.storage.sync.get("inputMsg-sql", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items['inputMsg-sql'])
                document.getElementById("inputMsg-sql").value = items['inputMsg-sql'];
        }
    });
}

function copyOutput() {
    var element = document.getElementById('outputMsg-sql')
    element.select();
    document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('formatSql').addEventListener('click', formatSql);
    document.getElementById("copyoutput").addEventListener("click", copyOutput);
}, false);