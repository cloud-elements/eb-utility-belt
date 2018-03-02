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
            var outputMsg = document.getElementById('outputMsg');
            outputMsg.value = http.responseText;
        }
    }
    http.send(data)
}

function generateModel() {
    var domain = document.getElementById('domain').value;
    var userKey = document.getElementById('userKey').value;
    var orgKey = document.getElementById('orgKey').value;
    var objectName = document.getElementById('objectName').value;
    var inputMsg = document.getElementById('inputMsg').value;

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
        "objectName": objectName
    });
    chrome.storage.sync.set({
        "inputMsg": inputMsg
    });

    sendRequest(domain, objectName, inputMsg, userKey, orgKey);
}

window.onload = function () {
    chrome.storage.sync.get("domain", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (!items) {
                document.getElementById("domain").value = items.domain;
            }
        }
    });
    chrome.storage.sync.get("userKey", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (!items) {
                document.getElementById("userKey").value = items.userKey;
            }
        }
    });
    chrome.storage.sync.get("orgKey", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (!items)
                document.getElementById("orgKey").value = items.orgKey;
        }
    });
    chrome.storage.sync.get("inputMsg", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (!items)
                document.getElementById("inputMsg").value = items.inputMsg;
        }
    });
    chrome.storage.sync.get("objectName", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (!items)
                document.getElementById("objectName").value = items.objectName;
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {

    var generateModelButton = document.getElementById('generateModel');
    var outputMsg = document.getElementById('outputMsg');

    generateModelButton.addEventListener('click', function () {

        chrome.tabs.getSelected(null, function (tab) {
            generateModel();
        });
    }, false);
}, false);