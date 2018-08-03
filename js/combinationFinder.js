function setValue(body) {
    var outputMsg = document.getElementById('outputMsg-combination');
    if (body && body.length > 0) {
        let strOut = body.filter(arr => arr.length > 0).map(s => `${s.split('').join(',')}`).join('\n');
        outputMsg.value = strOut;
    } else {
        outputMsg.value = `Failed to generate combinations`;
    }
}

const tree = leafs => {
    var branches = [];
    if (leafs.length == 1) return leafs;
    for (var k in leafs) {
        var leaf = leafs[k];
        tree(leafs.join('').replace(leaf, '').split('')).concat("").map(subtree => branches.push([leaf].concat(subtree)));
    }
    return branches;
};

const getCombinations = (str) => tree(str.split('')).map(comb => comb.join(''));

const getCombos = () => {
    var inputMsg = document.getElementById('inputMsg-combination').value;

    chrome.storage.sync.set({
        "inputMsg-combination": inputMsg
    });

    setValue(getCombinations(inputMsg));
};

window.onload = function () {
    chrome.storage.sync.get("inputMsg-combination", function (items) {
        if (!chrome.runtime.error) {
            console.log('items', items);
            if (items['inputMsg-combination'])
                document.getElementById("inputMsg-combination").value = items['inputMsg-combination'];
        }
    });
}

function copyOutput() {
    var element = document.getElementById('outputMsg-combination')
    element.select();
    document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("copyoutput").addEventListener("click", copyOutput);
    document.getElementById('findCombinations').addEventListener('click', getCombos);
}, false);