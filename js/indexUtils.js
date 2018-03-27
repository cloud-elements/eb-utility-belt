window.onload = function() { 
  document.getElementById("url-shortener").addEventListener("click", shortenUrl); 
  document.getElementById("clean-cache").addEventListener("click", cleanCache);
}

function cleanCache() {
  chrome.storage.sync.clear(() => {
    console.log('clearing cache', chrome.runtime.error);
    var element = document.getElementById("url");

    element.innerHTML = chrome.runtime.error ? 'Error cleaning cache' : 'Cache cleared';
    resetClassForAnimations(element);
  });
}

function shortenUrl(){
  var http = new XMLHttpRequest();
  http.open("POST", "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBQtXLSnFxy_q1SeFaKUHQ11bod0m8rsVc", true);
  http.setRequestHeader("Content-Type", "application/json")
  http.onload = function () {
    var element = document.getElementById("url");
    
    let url = JSON.parse(this.responseText).id;
    element.innerHTML = url ? url : 'Not a valid URL';  
    
    resetClassForAnimations(element);
    copyToClipboard(element);
  };

  sendUrl(http);  
}

function sendUrl(http) {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function(tabs) {
    var tab = tabs[0];
    http.send(`{"longUrl": "${tab.url}"}`);
  });
}

function copyToClipboard(element) {
    var range = document.createRange();
    range.selectNode(element);
    window.getSelection().addRange(range);
    document.execCommand("copy");
}

function resetClassForAnimations(element){
  element.classList.remove("fade-small-text");
  setTimeout(function() {
    element.classList.add("fade-small-text");
  },1);
}