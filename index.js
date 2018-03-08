window.onload = function() { 
  document.getElementById("url-shortener").addEventListener("click", shortenUrl); 
}

function shortenUrl(){
  var http = new XMLHttpRequest();
  http.open("POST", "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBQtXLSnFxy_q1SeFaKUHQ11bod0m8rsVc", true);
  http.setRequestHeader("Content-Type", "application/json")
  http.onload = function () {
    var element = document.getElementById("url");
    
    element.classList.remove("fade-small-text");
    setTimeout(function() {
      element.classList.add("fade-small-text");
    },1);
    
    let url = JSON.parse(this.responseText).id;
    element.innerHTML = url ? url : 'Not a valid URL';  
    
    //copy the url from the DOM
    var range = document.createRange();
    range.selectNode(element);
    window.getSelection().addRange(range);
    document.execCommand("copy");
  };
  chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs) {
    // and use that tab to fill in out title and url
      var tab = tabs[0];
      http.send(`{"longUrl": "${tab.url}"}`);
  });
}
