let idList = [];

const exists = (id) => {
    if (idList.includes(id)) {
        return true;
    } else {
        idList.push(id);
        return false;
    }
}

const safeParse = (body) => {
    try {
        return JSON.parse(body);
    } catch (ignore) {
        console.warn(ignore);
        return null;
    }
};

function findDuplicates() {
    var inputMsg1 = document.getElementById('inputMsg1').value;
    var inputMsg2 = document.getElementById('inputMsg2').value;
    var pk = document.getElementById('pk').value;
    var outputMsg = document.getElementById('outputMsg');

    chrome.storage.sync.set({
        "pk": pk
    });

    let msg = null;
    let arr = [];

    inputMsg1 = safeParse(inputMsg1);
    inputMsg2 = safeParse(inputMsg2);

    // idc if you just passed one or both, just an array plz
    if (inputMsg1 && inputMsg2 && inputMsg1 instanceof Array && inputMsg2 instanceof Array) {
        arr = inputMsg1.concat(inputMsg2);
    } else if (inputMsg1 && inputMsg1 instanceof Array) {
        arr = inputMsg1;
    } else if (inputMsg2 && inputMsg2 instanceof Array) {
        arr = inputMsg2;
    }

    if (arr.length != 0) {
        arr.forEach(o => {
            let vendorPk = o[pk];
            if (vendorPk && exists(vendorPk)) {
                msg = `Duplicate ${vendorPk} found`;
            }
        });
    } else {
        msg = 'Invalid input, either inputs should be an array';
    }

    if (msg) {
        outputMsg.value = msg;
    } else {
        outputMsg.value = 'No duplicates found :]';
    }
}

window.onload = function () {
    chrome.storage.sync.get("pk", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items.pk)
                document.getElementById("pk").value = items.pk;
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('duplicate').addEventListener('click', findDuplicates);
}, false);