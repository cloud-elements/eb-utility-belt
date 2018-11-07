function setValue(body) {
    var outputMsg = document.getElementById('outputMsg-subset');
    if (body && body.length > 0) {
        let strOut = body.filter(arr => arr.length > 0).map(s => `${s.reverse().join(',')}`).join('\n');
        outputMsg.value = strOut;
    } else {
        outputMsg.value = `Failed to generate subset`;
    }
}

const getAllSubsets = (arr) => arr.reduce((subsets, value) =>
    subsets.concat(
        subsets.map(set => [value, ...set])
    ), [
        []
    ]
);

const getSubsets = () => {
    var inputMsg = document.getElementById('inputMsg-subset').value;

    chrome.storage.sync.set({
        "inputMsg-subset": inputMsg
    });

    setValue(getAllSubsets(inputMsg.split('')).reverse());
};

window.onload = function () {
    chrome.storage.sync.get("inputMsg-subset", function (items) {
        if (!chrome.runtime.error) {
            console.log('items', items);
            if (items['inputMsg-subset'])
                document.getElementById("inputMsg-subset").value = items['inputMsg-subset'];
        }
    });
}

function copyOutput() {
    var element = document.getElementById('outputMsg-subset')
    element.select();
    document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("copyoutput").addEventListener("click", copyOutput);
    document.getElementById('findSubsets').addEventListener('click', getSubsets);
}, false);