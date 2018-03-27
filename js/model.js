const isJson = (body) => {
    try {
        JSON.parse(body);
    } catch (ignore) {
        console.warn(ignore, body);
        return false;
    }

    return true;
}

function sendRequest(domain, objectName, data, userKey, orgKey) {
    var http = new XMLHttpRequest();
    // var url = `https://api-cloud--elements-com-7xyzofww7i3b.runscope.net/elements/api-v2/models/${objectName}/schema`;
    var url = `${domain}/elements/api-v2/models/${objectName}/schema`;
    http.open("POST", url, true);
    var auth = "User " + userKey + ", Organization " + orgKey;

    http.setRequestHeader("Authorization", auth);
    http.withCredentials = true;
    http.setRequestHeader("content-type", "application/json");
    http.setRequestHeader("accept", "application/json");

    http.onreadystatechange = function () { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            var outputMsg = document.getElementById('outputMsg-model');
            var bod = http.responseText;
            if (isJson(bod)) {
                bod = JSON.stringify(JSON.parse(bod), 0, 2);
            }
            outputMsg.value = bod;
        }
    }
    http.send(data)
}

function generateModel() {
    var domain = document.getElementById('domain').value;
    var userKey = document.getElementById('userKey').value;
    var orgKey = document.getElementById('orgKey').value;
    var objectName = document.getElementById('objectName-model').value;
    var inputMsg = document.getElementById('inputMsg-model').value;

    chrome.storage.sync.set({
        "domain": domain
    });
    chrome.storage.sync.set({
        "userKey": userKey
    });
    chrome.storage.sync.set({
        "orgKey": orgKey
    });
    chrome.storage.sync.set({
        "objectName-model": objectName
    });
    chrome.storage.sync.set({
        "inputMsg-model": inputMsg
    });

    sendRequest(domain, objectName, inputMsg, userKey, orgKey);
}

window.onload = function () {
    chrome.storage.sync.get("domain", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items.domain) {
                document.getElementById("domain").value = items.domain;
            }
        }
    });
    chrome.storage.sync.get("userKey", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items.userKey) {
                document.getElementById("userKey").value = items.userKey;
            }
        }
    });
    chrome.storage.sync.get("orgKey", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items.orgKey)
                document.getElementById("orgKey").value = items.orgKey;
        }
    });
    chrome.storage.sync.get("inputMsg-model", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items['inputMsg-model'])
                document.getElementById("inputMsg-model").value = items['inputMsg-model'];
        }
    });
    chrome.storage.sync.get("objectName-model", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items['objectName-model'])
                document.getElementById("objectName-model").value = items['objectName-model'];
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var generateModelButton = document.getElementById('generateModel');

    generateModelButton.addEventListener('click', function () {
        chrome.tabs.getSelected(null, function (tab) {
            generateModel();
        });
    }, false);
}, false);