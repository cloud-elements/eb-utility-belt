function parseJson(body, err) {
  var outputMsg = document.getElementById('outputMsg-csvJson');
  if (body && body.length > 0) {
    outputMsg.value = JSON.stringify(body, 0, 2);
  } else {
    outputMsg.value = 'Invalid CSV';
  }
}

const csvParse = (str) => {
  const isEmpty = (s) => s.length === 0 || !s.trim();
  try {
    let uploadArr = str.split('\n').filter(line => !isEmpty(line)).concat('\n').map(line => line.split(','));
    let headers = uploadArr.splice(0, 1)[0];
    return uploadArr.slice(0, -1).map(line => {
      var obj = {};
      headers.forEach((key, j) => {
        obj[key] = line[j];
      });
      return obj;
    });
  } catch (e) {
    console.warn('CSV', e);
    return null;
  }
};

function csvToJson() {
  var inputMsg = document.getElementById('inputMsg-csvJson').value;

  chrome.storage.sync.set({
    "inputMsg-csvJson": inputMsg
  });

  const csvJson = csvParse(inputMsg);
  parseJson(csvJson, !csvJson);
}

window.onload = function () {
  chrome.storage.sync.get("inputMsg-csvJson", function (items) {
    if (!chrome.runtime.error) {
      console.log(items);
      if (items['inputMsg-csvJson'])
        document.getElementById("inputMsg-csvJson").value = items['inputMsg-csvJson'];
    }
  });
}

function copyOutput() {
  var element = document.getElementById('outputMsg-csvJson')
  element.select();
  document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('csvToJson').addEventListener('click', csvToJson);
  document.getElementById("copyoutput").addEventListener("click", copyOutput);
}, false);