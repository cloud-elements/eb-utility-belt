const sendTableMsg = () => {
  var views = chrome.extension.getViews({ type: "popup" });
  if (views && views.length > 0) {
    chrome.runtime.sendMessage({
      type: 'popout',
      url: 'html/metadata/metadataTable.html'
    });
  }
}

const sendSwaggerUi = () => {
  var views = chrome.extension.getViews({ type: "popup" });
  if (views && views.length > 0) {
    chrome.runtime.sendMessage({
      type: 'popout',
      url: '/html/metadata/swaggerui.html'
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('metadata').addEventListener('click', sendTableMsg);
  document.getElementById('swaggerUi').addEventListener('click', sendSwaggerUi);
}, false);