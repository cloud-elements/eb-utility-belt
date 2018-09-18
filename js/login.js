function makeAuthnRequest(un, pw, cb) {
  var http = new XMLHttpRequest();
  http.withCredentials = true;
  var url = `https://api.cloud-elements.com/elements/api-v2/authentication`;
  http.open("POST", url, true);
  http.setRequestHeader("content-type", "application/json");
  http.setRequestHeader("accept", "application/json");

  http.onreadystatechange = function () {
    if (http.readyState == 4) {
      var errorText = document.getElementById('errorText');
      if (http.status == 200) {
        cb(JSON.parse(this.responseText))
      } else {
        console.warn('err', http.responseText);
        errorText.innerHTML = JSON.parse(http.responseText).message;
        disableButtons(false);
      }
    }
  }
  http.send(JSON.stringify({
    username: un,
    password: pw
  }));
}

function makeSecretsRequest(authToken, cb) {
  var http = new XMLHttpRequest();
  http.withCredentials = true;
  var url = `https://api.cloud-elements.com/elements/api-v2/authentication/secrets`;
  http.open("GET", url, true);
  http.setRequestHeader("content-type", "application/json");
  http.setRequestHeader("accept", "application/json");
  http.setRequestHeader("authorization", `Bearer ${authToken}`);

  http.onreadystatechange = function () {
    if (http.readyState == 4) {
      var errorText = document.getElementById('errorText');
      if (http.status == 200) {
        cb(JSON.parse(this.responseText))
      } else {
        console.warn('err', http.responseText);
        errorText.innerHTML = JSON.parse(http.responseText).message;
        disableButtons(false);
      }
    }
  }
  http.send(null);
}

/**
 * Check if the user is logged in. If we don't have their org secret, it's safe to say we 
 * cleared their data
 * @param {*} cb 
 */
function isLoggedIn(cb) {
  chrome.storage.sync.get("ce-eb-ub-os", function (items) {
    if (!chrome.runtime.error) {
      if (items['ce-eb-ub-os']) {
        cb(true);
      } else {
        cb(false);
      }
    } else {
      document.getElementById('errorText').innerHTML = 'Chrome runtime error';
      console.warn(chrome.runtime.errorText);
      cb(false);
    }
  });
}

function redirectToIndex() {
  window.location.href = '/index.html';
}

function loginToCe() {
  const un = document.getElementById('username').value,
    pw = document.getElementById('password').value;

  disableButtons(true);
  makeAuthnRequest(un, pw, authJson => {
    const authToken = authJson.token;
    makeSecretsRequest(authToken, secretsJson => {
      const orgSecret = secretsJson.organizationSecret,
        userSecret = secretsJson.userSecret;
      chrome.storage.sync.set({
        'ce-eb-ub-os': orgSecret,
        'ce-eb-ub-us': userSecret
      });
      redirectToIndex();
    })
  });
}

function disableButtons(disableFlag) {
  document.getElementById('login').disabled = disableFlag;
}

function init() {
  isLoggedIn(isLoggedIn => {
    if (isLoggedIn) {
      redirectToIndex();
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  init();
  document.getElementById("login").addEventListener("click", loginToCe);
  document.getElementById("loginSubmit").addEventListener("keypress", e => {
    if (e.keyCode === 13) { //13 is enter
      loginToCe();
    }
  });
}, false);