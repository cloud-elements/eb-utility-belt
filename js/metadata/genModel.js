import { getCached, copyTextArea } from '../utilities/ce-utils.js';

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
    getCachedWithDefault('domain', 'ce-eb-ub-env', env => {
        document.getElementById("domain").value = env;
    });

    getCachedWithDefault('userKey', 'ce-eb-ub-us', uk => {
        document.getElementById("userKey").value = uk;
    });
    
    getCachedWithDefault('orgKey', 'ce-eb-ub-os', ok => {
        document.getElementById("orgKey").value = ok;
    });

    getCached('inputMsg-model', model => {
        document.getElementById("inputMsg-model").value = model;
    });

    getCached('objectName-model', objectName => {
        document.getElementById("objectName-model").value = objectName;
    });
}

function copyOutput() {
    copyTextArea('outputMsg-model');
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("copyoutput").addEventListener("click", copyOutput);
    document.getElementById('generateModel').addEventListener('click', generateModel);
}, false);