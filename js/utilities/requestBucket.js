function getRandomStr() {
  return Math.random().toString(36).substring(7);
}

function isEmpty(str) {
  return !str || (str && str.trim().length == 0);
}

function sendRequest(bucketName) {
  var http = new XMLHttpRequest();
  http.withCredentials = true;
  // var url = `http://localhost:3000/buckets`;
  var url = `https://specio-bin.now.sh/buckets`;
  http.open("POST", url, true);
  var bucket = isEmpty(bucketName) ? getRandomStr() : bucketName;
  http.withCredentials = false;
  http.setRequestHeader("content-type", "application/json");
  http.setRequestHeader("accept", "application/json");

  http.onreadystatechange = function () { //Call a function when the state changes.
    if (http.readyState == 4) {
      var bucketUrl = document.getElementById('bucketUrl');
      if (http.status == 200) {
        bucketUrl.value = `${url}/${bucket}/requests`;
        chrome.storage.sync.set({
          "bucketUrl": bucketUrl.value
        });
      } else if (http) {
        bucketUrl.value = http.responseText;
      } else {
        bucketUrl.value = `Error during processing bucket request`
      }
      disableButtons(false);
    } 
  }
  http.send(JSON.stringify({ name: bucket }));
}

function generateBucket() {
  var bucketName = document.getElementById('bucketName').value;
  
  chrome.storage.sync.set({
      "bucketName": bucketName
  });
  disableButtons(true);
  sendRequest(bucketName);
}

window.onload = function () {
  chrome.storage.sync.get("bucketUrl", function (items) {
      if (!chrome.runtime.error) {
          console.log(items);
          if (items.bucketUrl) {
              document.getElementById("bucketUrl").value = items.bucketUrl;
          }
      }
  });
  chrome.storage.sync.get("bucketName", function (items) {
      if (!chrome.runtime.error) {
          console.log(items);
          if (items.userKey) {
              document.getElementById("bucketName").value = items.bucketName;
          }
      }
  });
}

function disableButtons(disableFlag) {
  document.getElementById('generateBucket').disabled = disableFlag;
  document.getElementById('inspectBucket').disabled = disableFlag;
}

const sendToTrafficInspector = () => {
  const requestUrl = document.getElementById("bucketUrl").value;
  if (!isEmpty(requestUrl)) {
    var views = chrome.extension.getViews({ type: "popup" });
    if (views && views.length > 0) {
      chrome.runtime.sendMessage({
        type: 'popout',
        url: `html/utilities/trafficInspector.html?${requestUrl}`
      });
    } else {
      chrome.runtime.sendMessage({
        type: 'here',
        url: `html/utilities/trafficInspector.html?${requestUrl}`
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("generateBucket").addEventListener("click", generateBucket);
  document.getElementById('inspectBucket').addEventListener('click', sendToTrafficInspector);
}, false);