function sendRequest(domain, objectName, data, userKey, orgKey) {
    var http = new XMLHttpRequest();
    var url = `${domain}/elements/api-v2/models/${objectName}/schema`;
    http.open("POST", url, true);

    http.setRequestHeader("Authorization", `User ${userKey}, Organization ${orgKey}`);
    http.withCredentials = true;
    http.setRequestHeader("content-type", "application/json");
    http.setRequestHeader("accept", "application/json");

    http.onreadystatechange = function () { //Call a function when the state changes.
        var outputMsg = document.getElementById('outputMsg-model');
        if (http.readyState == 4 && http.status == 200) {
            outputMsg.value = JSON.stringify(JSON.parse(http.responseText), 0, 2);
        } else {
            outputMsg.value = JSON.parse(http.responseText).message;
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

function getCached(cacheName, cb) {
    chrome.storage.sync.get(cacheName, function (items) {
        if (!chrome.runtime.error) {
            if (items[cacheName]) {
                cb(items[cacheName]);
            } else {
                cb(null);
            }
        }
    });
}

function getCachedWithDefault(cacheName, defaultName, cb) {
    getCached(cacheName, us => {
        if (us) {
            cb(us);
        } else {
            getCached(defaultName, defaultUs => {
                cb(defaultUs)
            });
        }
    });
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
    getCachedWithDefault('userKey', 'ce-eb-ub-us', uk => {
        document.getElementById("userKey").value = uk;
    });
    // chrome.storage.sync.get("userKey", function (items) {
    //     if (!chrome.runtime.error) {
    //         console.log(items);
    //         if (items.userKey) {
    //             document.getElementById("userKey").value = items.userKey;
    //         }
    //     }
    // });

    getCachedWithDefault('orgKey', 'ce-eb-ub-os', ok => {
        document.getElementById("orgKey").value = ok;
    });
    // chrome.storage.sync.get("orgKey", function (items) {
    //     if (!chrome.runtime.error) {
    //         console.log(items);
    //         if (items.orgKey)
    //             document.getElementById("orgKey").value = items.orgKey;
    //     }
    // });
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

function copyOutput() {
    var element = document.getElementById('outputMsg-model')
    element.select();
    document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("copyoutput").addEventListener("click", copyOutput);
    document.getElementById('generateModel').addEventListener('click', generateModel);
}, false);