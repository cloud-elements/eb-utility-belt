const sendDuplicateMsg = () => {
  var views = chrome.extension.getViews({ type: "popup" });
  if (views && views.length > 0) {
    chrome.runtime.sendMessage({
      type: 'popout',
      url: 'html/duplicateFinder.html'
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('duplicate').addEventListener('click', sendDuplicateMsg);
}, false);