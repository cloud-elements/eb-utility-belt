const jsYaml = require('js-yaml');

function parseYaml(body) {
  let outputMsg = document.getElementById('outputMsg-yaml');

  try {
    let yaml = jsYaml.load(body);
    outputMsg.innerHTML = jsYaml.safeDump(yaml);
  } catch (e) {
    outputMsg.innerHTML = e.message || 'Invalid YAML';
  }
}
function formatYaml() {
  const inputMsg = document.getElementById('inputMsg-yaml').value;

  chrome.storage.sync.set({
    "inputMsg-yaml": inputMsg
  });

  parseYaml(inputMsg);
}

window.onload = function () {
  chrome.storage.sync.get("inputMsg-yaml", function (items) {
    if (!chrome.runtime.error) {
      console.log(items);
      if (items['inputMsg-yaml'])
        document.getElementById("inputMsg-yaml").value = items['inputMsg-yaml'];
    }
  });
}

// Hacking this to just use the inputMsg directly, but mocks selection :[
function copyOutput() {
  let yaml = document.getElementById('inputMsg-yaml').value;
  let outputMsgElement = document.getElementById('outputMsg-yaml');
  let range = document.createRange();
  range.selectNodeContents(outputMsgElement);
  let selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  navigator.clipboard.writeText(outputMsgElement.value);
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('formatYaml').addEventListener('click', formatYaml);
  document.getElementById("copyoutput").addEventListener("click", copyOutput);
}, false);