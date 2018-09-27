import { clearLoader, getTokens, isEmpty, isEmptyObject, isEmptyStr } from './ce-utils.js';

function colorize(tokens) {
  const defaultColors = {
    BRACE: 'gray',
    BRACKET: 'gray',
    COLON: 'gray',
    COMMA: 'gray',
    STRING_KEY: 'green',
    STRING_LITERAL: 'green',
    NUMBER_LITERAL: 'blue',
    BOOLEAN_LITERAL: 'cyan',
    NULL_LITERAL: 'white',
    POST: 'green',
    GET: 'blue',
    PATCH: 'orange',
    PUT: 'orange',
    DELETE: 'red'
  };

  return tokens.map(token => token.value.fontcolor(defaultColors[token.type])).join('');
}

function sortAlphabetically(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function sortByCreatedDate(a, b) {
  if (new Date(a.createdDate).valueOf() < new Date(b.createdDate).valueOf()) return 1;
  if (new Date(a.createdDate).valueOf() > new Date(b.createdDate).valueOf()) return -1;
  return 0;
}

function getDays(sec) {
  return sec > 24 * Math.pow(60, 2) ? `${parseInt(sec / (24 * Math.pow(60, 2)))} days `: '';
}

function getHours(sec) {
  return sec > Math.pow(60, 2) ? `${parseInt((sec / Math.pow(60, 2)) % 24)} hours ` : '';
}

function getMinutes(sec) {
  return sec > 60 ? `${parseInt((sec / 60) % 60)} minutes ` : '';
}

function getSeconds(sec) {
  return `${parseInt(sec % 60)} seconds ago`;
}

function getTimeSince(providedTime) {
  let proviedTimeInMillis = new Date(providedTime).valueOf();
  let secSinceCurrent = (Date.now() - proviedTimeInMillis) / 1000;

  return getDays(secSinceCurrent) + getHours(secSinceCurrent) + getMinutes(secSinceCurrent) + getSeconds(secSinceCurrent);

}

function getStyledRequestMethod(request) {
  return colorize([{type: request.method.toUpperCase(), value: request.method.toUpperCase()}]).bold();
}

function replaceOrAppendChild(parentDiv, childDiv) {
  const existingDiv = document.getElementById(childDiv.id)
  const emptyDiv = document.getElementById('empty');
  if (emptyDiv) {
    parentDiv.replaceChild(childDiv, emptyDiv);
  } else if (existingDiv) {
    parentDiv.replaceChild(childDiv, existingDiv);
  } else {
    parentDiv.appendChild(childDiv);
  }
}

function createTitle(title) {
  const headerElement = document.createElement('header'),
        h5Element = document.createElement('h4');
  h5Element.innerHTML = title;
  headerElement.appendChild(h5Element);
  return headerElement;
}

function getBoldKeyValuePairs(value) {
  return Object.keys(value).map(key => {
    const tmp = document.createElement('div');
    
    tmp.innerHTML = `${key.bold()}: ${value[key]}`;
    return tmp;
  });
}

// Returns ARRAY of header and body
function createTitleBodyList(value, title, className) {
  const valueElement = document.createElement('div');
  valueElement.className = className;

  if (isEmpty(value)) {
    valueElement.innerHTML = 'Empty'.italics();
  } else {
    getBoldKeyValuePairs(value).forEach(pair => valueElement.appendChild(pair));
  }

  return [createTitle(title), valueElement];
}

function createBodyRawDiv(request) {
  const valueElement = document.createElement('pre');
  valueElement.className = 'rawBody';

  if (isEmpty(request.body)) {
    valueElement.innerHTML = 'Empty'.italics();
  } else {
    valueElement.innerHTML = colorize(getTokens(JSON.stringify(request.body, null, 2)));
  }

  return [createTitle('Body'), valueElement];
}

function createParams(request) {
  const containerElement = document.createElement('div');
  containerElement.className = 'params';
  createTitleBodyList(request.params, 'Parameters', 'paramsObj')
    .forEach(param => containerElement.appendChild(param));
  
    return containerElement;
}

function createHeadersParams(request) {
  const containerElement = document.createElement('div');
  containerElement.className = 'headers';
  createTitleBodyList(request.headers, 'Headers', 'headersObj')
    .forEach(header => containerElement.appendChild(header));
  
    return containerElement;
}

function createMetaDiv(request) {
  const containerElement = document.createElement('div'),
    paramsElement = createParams(request),
    headerElement = createHeadersParams(request);
  
 containerElement.id = `metaInfo-${request.id}`;
 containerElement.className = 'metaInfo';

  containerElement.appendChild(paramsElement);
  containerElement.appendChild(headerElement);

  return containerElement;
}

function createBodyDiv(request) {
  const containerElement = document.createElement('div'),
    bodyTop = createMetaDiv(request),
    bodyBottom = createBodyRawDiv(request);
  containerElement.id = `requestBody-${request.id}`;
  containerElement.className = 'requestBody';

  // Form and header info
  containerElement.appendChild(bodyTop);

  // Body [0] Header, [1] Raw Body
  bodyBottom.forEach(element => containerElement.appendChild(element));
  return containerElement;
}

function createRequestDiv(request) {
  const containerElement = document.createElement('div'),
    headerLeft = document.createElement('div'),
    headerRight = document.createElement('div'),
    deleteButton = document.createElement('button'),
    deleteIcon = document.createElement('i');
  containerElement.id = `requestHeader-${request.id}`;
  containerElement.className = 'requestHeader';

  headerLeft.className = 'requestUrl';
  headerLeft.innerHTML = `${getStyledRequestMethod(request)} ${request.url.italics()}`;

  containerElement.appendChild(headerLeft);

  headerRight.className = 'time';
  headerRight.innerHTML = `${getTimeSince(request.createdDate)}`;
  containerElement.appendChild(headerRight);

  deleteButton.className = 'pure-button deleteRequestButton';
  deleteButton.id = `deleteRequestButton-${request.id}`;
  deleteIcon.className = "fa fa-trash-alt fa-lg";
  deleteButton.addEventListener('click', deleteRequest);
  deleteButton.appendChild(deleteIcon);
  containerElement.appendChild(deleteButton);

  return containerElement;
}


function emptyListItem(text) {
  let element = document.createElement('div');
  element.id = 'empty';
  element.innerHTML = text;
  element.className = "request";
  return element;
}

function populatedListItemDivs(request) {
  const containerElement = document.createElement('div'),
    headerDiv = createRequestDiv(request),
    bodyDiv = createBodyDiv(request);

  containerElement.className = `itemWrapper`;
  containerElement.id = `itemWrapper-${request.id}`

  containerElement.appendChild(headerDiv);
  containerElement.appendChild(bodyDiv);

  return containerElement;
}

// Rebuild dom for each list item <li>
// Set id as the requestId
// Set as child of requestList <ul>
function createMultiDivElement(parentDiv, requestList) {
  let listItems = requestList.length == 0 ? [emptyListItem('Empty')] :
    requestList.map(request => populatedListItemDivs(request));

  listItems.forEach(li => replaceOrAppendChild(parentDiv, li));
}

function removeRequest(id) {
  const requestList = document.getElementById('requestList'),
    itemWrapper = document.getElementById(`itemWrapper-${id}`);

  requestList.removeChild(itemWrapper);

  if (requestList.children.length == 0) {
    requestList.appendChild(emptyListItem('Empty'));
  }
}

// Call /summary APIs
function refreshSummary(url) {
  let http = new XMLHttpRequest();
  http.open("GET", `${url}/summary`, true);
  http.setRequestHeader("Accept", "application/json")
  http.withCredentials = false;
  http.onload = function () {
    const element = document.getElementById("requestList")
    if (http.readyState == 4 && http.status == 200) {
      const requestList = JSON.parse(this.responseText);
      clearLoader();
      createMultiDivElement(element, requestList.sort((a, b) => sortByCreatedDate(a, b)));
    } else {
      replaceOrAppendChild(element, emptyListItem(this.responseText));
    }
  };

  http.send(null);
}
// Delete all requests for that bucket idk???
  // Call DELETE /bucket/{bucketName}
  // Clear bucketUrl from cache for requestBucket...
  // Close window
function deleteBucket(event) {
  getUrl(url => {
    let http = new XMLHttpRequest();
    http.open("DELETE", `${url.split('/requests')[0]}`, true);
    http.setRequestHeader("Accept", "application/json")
    http.withCredentials = false;
    http.onload = function () {
      if (http.readyState == 4 && http.status == 200) {
        // Clear cache for bucket URL
        chrome.storage.sync.set({
          "bucketUrl": ''
        });
        // Close window
        window.close();
      }
    };

    http.send(null);
  })

}

function deleteRequest(event) {
  getUrl(url => {
    let requestId = this.id.split('-')[1];
    let http = new XMLHttpRequest();
    http.open("DELETE", `${url}/${requestId}`, true);
    http.setRequestHeader("Accept", "application/json")
    http.withCredentials = false;
    http.onload = function () {
      if (http.readyState == 4 && http.status == 200) {
        removeRequest(requestId);
      }
    };

    http.send(null);
  })
}

function getUrl(cb) {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function (tabs) {
    var tab = tabs[0];
    cb(tab.url.split('?')[1]);
  });
}

function refreshSummaryEvent() {
  getUrl(url => refreshSummary(url));
}

function setLoader() {
  const loaderHolder = document.getElementById('loaderHolder'),
        loader = document.createElement('div');

  loader.className = "loader";
  loader.id = "loader";
  replaceOrAppendChild(loaderHolder, loader);
}

function init() {
  setLoader();
  getUrl(url => {
    // Set the bucketUrl at the header
    document.getElementById('requestBucketUrl').innerHTML = `Request URL: <a href="${url}">${url}</a>`.bold();
    console.log('refreshing init', url);
    // Refresh the requests summary
    refreshSummary(url);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('why call thrice?', document.readyState);
  init();
  document.getElementById("refreshSummary").addEventListener("click", refreshSummaryEvent);
  document.getElementById('deleteBucket').addEventListener('click', deleteBucket);
}, false);