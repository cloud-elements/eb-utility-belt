function cleanCache() {
  chrome.storage.sync.clear(() => {
    console.log('clearing cache', chrome.runtime.error);
    setMsgAndLogout(chrome.runtime.error ? 'Error cleaning cache' : 'Cache cleared');
  });
}

function setMsgAndLogout(msg) {
  var element = document.getElementById("tmp");

  element.innerHTML = msg;
  resetClassForAnimations(element);
  setTimeout(() => {
    redirectToLogin();
  }, 2000)
}

function sendFullScreenMsg() {
  var views = chrome.extension.getViews({ type: "popup" });
  if (views && views.length > 0) {
    chrome.runtime.sendMessage({
      type: 'popout',
      url: 'index.html'
    });
  }
}

function shortenUrl(){
  var http = new XMLHttpRequest();
  http.open("POST","https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyDqCKRSMead2B8Ko6MgaJqsDVdUxz2lAdQ", true);
  http.setRequestHeader("Content-Type", "application/json")
  http.onload = function () {
    var element = document.getElementById("tmp");

    let url = JSON.parse(this.responseText).shortLink;
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
    http.send(`{"longDynamicLink": "https://xek99.app.goo.gl/?link=${encodeURIComponent(tab.url)}", "suffix": {
      "option": "SHORT"
    }}`)
    //http.send(`{"dynamicLinkInfo": {"dynamicLinkDomain": "xek99", "link":"${tab.url}", "iosInfo":{"iosBundleId":"io.cloudelements.eb-utility-belt"} } }`);
  });
}

function copyTextToClipBoard(text) {
  return navigator.clipboard.writeText(text)
    .then(r => console.log(`copied ${text}`));
}

function copyToClipboard(element, text) {
  if (text) {
    // Pure hack to make sure it gets copied :[
    copyTextToClipBoard(text);
  }

  var range = document.createRange();
  range.selectNode(element);
  window.getSelection().addRange(range);
  document.execCommand("copy");
}

function resetClassForAnimations(element){
  if (element.classList) {
    element.classList.remove("fade-small-text");
    setTimeout(function() {
      element.classList.add("fade-small-text");
    },1);
  } else {
    element.className = '';
    setTimeout(() => {
      element.className = "fade-small-text";
    }, 1)
  }
}

function replaceOrAppendChild(parentDiv, childDiv) {
  const existingDiv = document.getElementById(childDiv.id)
  if (existingDiv) {
    parentDiv.replaceChild(childDiv, existingDiv);
  } else {
    parentDiv.appendChild(childDiv);
  }
}

function createMultiDivElement(parentDiv, text, imgSrc) {
  let tmpContainer = document.createElement('div'),
      tmpText = document.createElement('div'),
      tmpImg = document.createElement('img');

  tmpContainer.id = 'tmpContainer';
  tmpContainer.className = 'tmpContainer';

  tmpImg.src = imgSrc;
  tmpImg.alt = text;
  tmpImg.id = 'tmpImg';
  tmpImg.className = 'emoji';

  tmpText.id = 'tmpText';
  tmpText.innerHTML = text;

  tmpContainer.appendChild(tmpImg);
  tmpContainer.appendChild(tmpText);
  replaceOrAppendChild(parentDiv, tmpContainer);
}

function getRandom(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomEmoji(emojiObj) {
  const keys = Object.keys(emojiObj);
  return keys[getRandom(keys.length)];
}

function generateEmoji() {
  var http = new XMLHttpRequest();
  http.open("GET", "https://api.github.com/emojis", true);
  http.setRequestHeader("Accept", "application/json")
  http.onload = function() {
    var element = document.getElementById("tmp");
    
    const emojiObj = JSON.parse(this.responseText);
    const randomEmoj = getRandomEmoji(emojiObj);
    
    createMultiDivElement(element, `:${randomEmoj}:`, emojiObj[randomEmoj]);
    resetClassForAnimations(element);
    copyToClipboard(document.getElementById('tmpText'), `:${randomEmoj}:`);
  };

  http.send(null);
}

function isLoggedIn(cb) {
  chrome.storage.sync.get("ce-eb-ub-os", function (items) {
    if (!chrome.runtime.error) {
      if (items['ce-eb-ub-os']) {
        cb(true);
      } else {
        cb(false);
      }
    } else {
      document.getElementById('tmp').innerHTML = 'Chrome runtime error';
      console.warn(chrome.runtime.errorText);
      cb(false);
    }
  });
}

function redirectToLogin() {
  window.location.href = '/html/login.html';
}

function logoutAndRedirect() {
  chrome.storage.sync.set({
    'ce-eb-ub-os': null,
    'ce-eb-ub-us': null
  });

  setMsgAndLogout('Logging out');
}

function init() {
  isLoggedIn(isLoggedIn => {
    if (!isLoggedIn) {
      redirectToLogin();
    }
  });
}

window.onload = function() {
  init();
  document.getElementById("full-screen").addEventListener("click", sendFullScreenMsg);
  document.getElementById("emoji-generator").addEventListener("click", generateEmoji);
  document.getElementById("url-shortener").addEventListener("click", shortenUrl);
  document.getElementById("cleanup-cache").addEventListener("click", cleanCache);
  if (document.getElementById("logout")) {
    document.getElementById("logout").addEventListener("click", logoutAndRedirect);
  }
}