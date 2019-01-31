import {getCached} from '../utilities/ce-utils.js';

function getSwagger() {
  var elementId = document.getElementById('elementId').value;

  chrome.storage.sync.set({
    "elementId": elementId
  });

  getCached('ce-eb-ub-env', env => {
    const ui = SwaggerUIBundle({
      url: `${env}/elements/api-v2/elements/${elementId}/docs?version=-1`,
      dom_id: '#swagger-ui',
      tagsSorter: 'alpha',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ]
    });

    window.ui = ui
  });
}

window.onload = function () {
  chrome.storage.sync.get("elementId", function (items) {
    if (!chrome.runtime.error) {
      console.log(items);
      if (items.elementId) {
        document.getElementById("elementId").value = items.elementId;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("getSwagger").addEventListener("click", getSwagger);
}, false);