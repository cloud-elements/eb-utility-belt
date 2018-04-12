function setValue(body) {
    var outputMsg = document.getElementById('i/o-epoch');
    if (body) {
        outputMsg.value = body;
    } else {
        outputMsg.value = 'Invalid epoch input';
    }
}

function convertEpoch() {
    var inputMsg = document.getElementById('i/o-epoch').value;
    chrome.storage.sync.set({
        "i/o-epoch": inputMsg
    });

    var body = null;
    try {
        var body
        if (inputMsg < 100000000000) {
            body = dateString(new Date(inputMsg * 1000));
        } else {
            body = dateString(new Date(Number(inputMsg)));
        }
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

function dateString(d) {
    return ("0" + (d.getMonth()+1)).slice(-2) + "/" +
    ("0" + d.getDate()).slice(-2) + "/" +
    d.getFullYear() + " " +
    ("0" + d.getHours()).slice(-2) + ":" +
    ("0" + d.getMinutes()).slice(-2) + ":" +
    ("0" + d.getSeconds()).slice(-2) + " " +
    d.toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1]
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("copyoutput").addEventListener("click", copyOutput);
    document.getElementById('convertepoch').addEventListener('click', convertEpoch);
}, false);