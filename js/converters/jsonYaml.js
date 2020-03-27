const jsYaml = require('js-yaml');

function setValue(value) {
  const outputMsg = document.getElementById('i/o-yamlJson');
  outputMsg.value = value;
}

function jsonToYaml(input) {
  let value;

  try {
    value = jsYaml.safeDump(JSON.parse(input));
  } catch (e) {
    value = 'Invalid JSON';
  }

  setValue(value);
}

function yamlToJson(input) {
  let value;

  try {
    value = JSON.stringify(jsYaml.load(input), null, 2);
  } catch (e) {
    value = e.message || 'Invalid YAML';
  }

  setValue(value);
}

function getValueAndCache() {
  const inputMsg = document.getElementById('i/o-yamlJson').value;

  chrome.storage.sync.set({
    "i/o-yamlJson": inputMsg
  });

  return inputMsg;
}

function convertJsonToYaml() {
  jsonToYaml(getValueAndCache());
}

function convertYamlToJson() {
  yamlToJson(getValueAndCache());
}

window.onload = function () {
  chrome.storage.sync.get("i/o-yamlJson", function (items) {
    if (!chrome.runtime.error) {
      console.log(items);
      if (items['i/o-yamlJson'])
        document.getElementById("i/o-yamlJson").value = items['i/o-yamlJson'];
    }
  });
}

function copyOutput() {
  var element = document.getElementById('i/o-yamlJson')
    element.select();
    document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('convertJsonToYaml').addEventListener('click', convertJsonToYaml);
  document.getElementById('convertYamlToJson').addEventListener('click', convertYamlToJson);
  document.getElementById("copyoutput").addEventListener("click", copyOutput);
}, false);