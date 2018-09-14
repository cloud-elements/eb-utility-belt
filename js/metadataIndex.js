const sendTableMsg = () => {
  var views = chrome.extension.getViews({ type: "popup" });
  if (views && views.length > 0) {
    chrome.runtime.sendMessage({
      type: 'popout',
      url: 'html/metadataTable.html'
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('metadata').addEventListener('click', sendTableMsg);
}, false);