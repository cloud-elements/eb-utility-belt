import { getIsoFromEpoch, getEpochFromIso } from '../utilities/ce-utils.js';

function setValue(body) {
    var outputMsg = document.getElementById('i/o-epoch');
    if (body) {
        outputMsg.value = body;
    } else {
        outputMsg.value = 'Invalid epoch input';
    }
}

function convertIso() {
    var inputMsg = document.getElementById('i/o-epoch').value;
    chrome.storage.sync.set({
        "i/o-epoch": inputMsg
    });

    var body = null;
    try {
        body = getEpochFromIso(inputMsg);
    } catch (ignoreIt) {
        console.warn(ignoreIt);
    }

    setValue(body);
}

function convertEpoch() {
    var inputMsg = document.getElementById('i/o-epoch').value;
    chrome.storage.sync.set({
        "i/o-epoch": inputMsg
    });
    var body = null;
    try {
        body = getIsoFromEpoch(inputMsg);
    } catch (ignoreIt) {
        console.warn(ignoreIt);
    }

    setValue(body);
}

window.onload = function () {
    chrome.storage.sync.get("i/o-epoch", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items['i/o-epoch'])
                document.getElementById("i/o-epoch").value = items['i/o-epoch'];
        }
    });
}

function copyOutput() {
    var element = document.getElementById('i/o-epoch')
    element.select();
    document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("copyoutput").addEventListener("click", copyOutput);
    document.getElementById('convertepoch').addEventListener('click', convertEpoch);
    document.getElementById('convertIso').addEventListener('click', convertIso);
}, false);