import { getCached, getAuthorizationDefaults } from '../utilities/ce-utils.js';

function setValue(body) {
  var outputMsg = document.getElementById('outputMsg-format');
  if (body && body.length > 0) {
      outputMsg.value = body;
  } else {
      outputMsg.value = `Failed to generate format`;
  }
}

// Hit the /generate-date-format API to get the info
function getDateFormat(type, sampleDate, cb) {
  let http = new XMLHttpRequest();
  getCached('ce-eb-ub-env', env => {
    http.open("GET", `${env}/elements/api-v2/eb-utils/generate-date-format/${type}?sampleDate=${encodeURIComponent(sampleDate)}`, true);
    http.setRequestHeader("Accept", "application/json");

    getAuthorizationDefaults(auth => {
      http.setRequestHeader("Authorization", auth);
      http.onload = function () {
        if (http.readyState == 4 && http.status == 200) {
          cb(JSON.parse(this.responseText).format);
        } else {
          cb(JSON.parse(this.responseText).message);
        }
      };

      http.send(null);
    });
  });
}

const generateDateFormat = () => {
  const sampleDate = document.getElementById('sampleDate').value;
  const type = document.getElementById('type').value;

  chrome.storage.sync.set({
      "sampleDate": sampleDate,
      "type": type
  });

  getDateFormat(type, sampleDate, msg => setValue(msg));
};

window.onload = function () {
  chrome.storage.sync.get("sampleDate", function (items) {
      if (!chrome.runtime.error) {
          if (items['sampleDate'])
              document.getElementById("sampleDate").value = items['sampleDate'];
      }
  });
}

function copyOutput() {
  var element = document.getElementById('outputMsg-format')
  element.select();
  document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("copyoutput").addEventListener("click", copyOutput);
  document.getElementById('genDateFormat').addEventListener('click', generateDateFormat);
}, false);