const uuid = require('uuid');

function setValue(body) {
  var outputMsg = document.getElementById('i/o-uuid');
  if (body && body.length > 0) {
      outputMsg.value = body;
  } else {
      outputMsg.value = `Failed to generate UUID`;
  }
}
const generateUuid = () => {
  const generatedUuid = uuid.v1();

  chrome.storage.sync.set({
    "uuid": generatedUuid,
  });

  setValue(generatedUuid);
};

window.onload = function () {
  chrome.storage.sync.get("uuid", function (items) {
      if (!chrome.runtime.error) {
          if (items['uuid'])
              document.getElementById("i/o-uuid").value = items['uuid'];
      }
  });
}

function copyOutput() {
  var element = document.getElementById('i/o-uuid')
  element.select();
  document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("copyoutput").addEventListener("click", copyOutput);
  document.getElementById('generateUuid').addEventListener('click', generateUuid);
}, false);