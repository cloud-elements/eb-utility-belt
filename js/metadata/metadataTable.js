import {
  clearLoader,
  getCached,
  isEmpty,
  isEmptyObject,
  isEmptyStr,
  setLoader,
  getForPath
} from '../utilities/ce-utils.js';

let state = {
  elementsList: null,
  sortField: {
    'field': null,
    'order': 1
  }
};

// Map of { header name , data path }
function getHeaders() {
  return {
    id: 'id',
    hub: 'hub',
    name: 'name',
    key: 'key',
    // description: 'description',
    element_type: 'elementType',
    authentication_type: 'authenticationType',
    api_type: 'api.type',
    // active: 'active',
    beta: 'beta',
    // hidden: 'displayOrder',
    events: 'events.supported',
    bulk_upload: 'bulk.upload',
    bulk_download: 'bulk.download',
    notes: 'notes',
    // api_count: 'usage.traffic',
    // instance_count: 'usage.instanceCount',
    // customer_count: 'usage.customerCount'
    'details': ''
  };
}

/**
 * Sorts fields 'a' and 'b' alphabetically by the given 'field', ['field', 'path'],
 * or just by 'a' and 'b' themselves if 'field' is not set
 * case insensitive
 */
function alphabetical(a, b, propPath) {
  let aField = a;
  let bField = b;

  if (propPath) {
    let ay = getValue(a, getHeaders(), propPath);
    if (a && !isEmpty(ay)) {
      aField = ay;
    }
    let bee = getValue(b, getHeaders(), propPath);
    if (b && !isEmpty(bee)) {
      bField = bee;
    }
  }
  if (aField < bField) {
    return -1;
  }
  if (aField > bField) {
    return 1;
  }

  return 0;
};

/**
 * Sort by truthy values (booleans or undefined/null) with boolean / non-nulls desc
 * @param {*} a 1st field
 * @param {*} b 2nd field
 * @param {*} propPath (optional) field name
 */
function sortTruthy(a, b, propPath) {
  let aField = a;
  let bField = b;

  if (propPath) {
    aField = a[propPath];
    bField = b[propPath];
  }

  if (aField && !bField) {
    return -1;
  } else if (!aField && bField) {
    return 1;
  }

  return 0;
};

/**
 * Flexible sorter for various fields
 * @param {Object} sortBy object (w/ field {str} and order {num})
 */
function multiSorter(a, b, sortBy) {
  if (sortBy.order % 2) {
    b = [a, (a = b)][0]; // flop them for order
  }

  let aField = getValue(a, getHeaders(), sortBy.field);
  let bField = getValue(b, getHeaders(), sortBy.field);

  if (!isEmpty(aField) && typeof aField === 'number') {
    return aField < bField ? 1 : -1;
  }

  if (!isEmpty(aField) && typeof aField === 'string') {
    return alphabetical(aField.toLowerCase(), bField.toLowerCase(), sortBy.field);
  }

  return sortTruthy(aField, bField);
};

// Ascending search
function sortById(a, b) {
  if (a.id > b.id) {
    return 1;
  } else if (a.id < b.id) {
    return -1;
  } else {
    return 0;
  }
}

// General sort :shrug:
function sort(a, b, sortBy) {
  if (sortBy && sortBy.field) {
    return multiSorter(a, b, sortBy);
  } else if (a && a.id && b && b.id) {
    return sortById(a, b);
  } else {
    return 0;
  }
}

function getTableHeaders(headerKeys) {
  return headerKeys.map(header => {
    let tableHeaderElement = document.createElement('th');
    tableHeaderElement.innerHTML = header.split('_').join(' ');
    tableHeaderElement.addEventListener('click', e => sortBy(header));
    tableHeaderElement.className = "tableHeaderClickable " + header;
    return tableHeaderElement;
  });
}

// Close your eyes here, we're getting nested objects and modifying the mofo
function getValue(element, headerMap, headerKey) {
  let elementMetadataKey = headerMap[headerKey];

  return elementMetadataKey.includes('beta') 
    ? element[elementMetadataKey] && element[elementMetadataKey]
    : elementMetadataKey.includes('.') 
        ? elementMetadataKey.split('.').reduce((acc, key) => {
          acc = acc === '' 
              ? element[key] 
                ?  element[key]
                : ''
              : acc[key];
          return acc;
    }, '') :
    isEmpty(element[elementMetadataKey]) ?
    '' :
    element[elementMetadataKey];
}

function getTableRows(elements, headerMap) {
  const getCheatSheetLink = (element) => {
    let tableButton = document.createElement('a');
    getCached('ce-eb-ub-env', env => {
      tableButton.href = `${env}/elements/api-v2/elements/${element.id}/cheat-sheet`;
    });
    tableButton.className = `pure-button button-ghost`;
    tableButton.innerHTML = 'Go To';
    return tableButton; 
  };
  return elements.sort((a, b) => sort(a, b, state.sortField)).map(element => {
    let tableRowElement = document.createElement('tr');
    let tableDataElements = Object.keys(headerMap).map(header => {
      let tableDataElement = document.createElement('td');
      if (header === 'details') {
        tableDataElement.appendChild(getCheatSheetLink(element));
      } else {
        tableDataElement.innerHTML = getValue(element, headerMap, header); 
      }
      tableDataElement.className = header;
      return tableDataElement;
    })

    tableDataElements.forEach(td => tableRowElement.appendChild(td));
    tableRowElement.id = `tr-${element.id}`;
    return tableRowElement;
  })
}

// Clean out any existing nodes on the parent so we can re-inject
function clearElementNodes(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Sets and loads the table with info
function loadTable(elements) {
  const headers = Object.keys(getHeaders()),
        headerRow = document.getElementById('headerRow'),
        tableBody = document.getElementById('tableBody');

  clearElementNodes(headerRow);
  clearElementNodes(tableBody);

  // Set the table headers...
  getTableHeaders(headers).forEach(th => headerRow.appendChild(th));
  // Set the table body....
  getTableRows(elements, getHeaders()).forEach(tr => tableBody.appendChild(tr));
  // getTableRows(elements, getHeaders()).forEach(tr => replaceOrAppendChild(tableBody, tr));
}

function getConcatName(elementObj) {
  return `${elementObj.key.trim()}${elementObj.name.trim()}`;
}

function getFilterMap(searchParam) {
  return searchParam.split('&').reduce((acc, pair) => {
    let key = pair.split('=')[0];
    let value = pair.split('=')[1];
    // Skip on all
    if (value !== 'all' && !isEmpty(value)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

function getBoolean(filterField) {
  return filterField === 'true';
}

function checkExistance(objectField, filterField, include) {
  if (isEmpty(filterField)) return true;
  if (typeof (objectField) !== 'boolean' && isEmpty(objectField)) return false; // False here will NOT include empty results
  return typeof objectField === 'string' 
    ? include 
      ? objectField.includes(filterField) 
      : objectField == filterField
    : objectField == getBoolean(filterField);
}

function filterSearch(elementObj, queryMap) {
  if (isEmpty(queryMap)) return true;

  return checkExistance(getConcatName(elementObj), queryMap.q, true) &&
         checkExistance(elementObj.hub, queryMap.hubs) &&
         checkExistance(elementObj.elementType, queryMap.element_type) &&
         checkExistance(elementObj.authenticationType, queryMap.authentication_type) &&
         checkExistance(getForPath(elementObj, 'api.type'), queryMap.api_type) &&
         checkExistance(elementObj.beta, queryMap.beta) &&
         checkExistance(getForPath(elementObj, 'events.supported'), queryMap.events) &&
         checkExistance(getForPath(elementObj, 'bulk.upload'), queryMap.bulk_upload) &&
         checkExistance(getForPath(elementObj, 'bulk.download'), queryMap.bulk_download);
}

// Searching appends a ?q= whatever to the extension URL, let's pluck that
function getSearchParam(cb) {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function (tabs) {
    var tab = tabs[0];
    cb(tab.url.split('?')[1]);
  });
}

/**
 * Triggered when the header is clicked
 * @param {string} name 
 * @param {JSEvent} event 
 */
function sortBy(name, event) {
  state.sortField.field = name;
  state.sortField.order++;
  getSearchParam(searchParam => {
    console.log('search param is: ', searchParam);

    const queryMap = isEmpty(searchParam) ? null : getFilterMap(searchParam);

    const sortedElements = state.elementsList.filter(elementObj => filterSearch(elementObj, queryMap) && elementObj.displayOrder > 0);
    loadTable(sortedElements);
  })
}

function getAuthorizationDefaults(cb) {
  getCached('ce-eb-ub-us', us => {
    getCached('ce-eb-ub-os', os => {
      cb(`User ${us}, Organization ${os}`);
    });
  });  
}

// Hit the /elements/metadata API to get the info
function getElements(cb) {
  let http = new XMLHttpRequest();
  // http.open("GET", `https://api.cloud-elements.com/elements/api-v2/elements?abridged=true`, true);
  getCached('ce-eb-ub-env', env => {
    http.open("GET", `${env}/elements/api-v2/elements/metadata?pageSize=500`, true);
    http.setRequestHeader("Accept", "application/json");
  
    getAuthorizationDefaults(auth => {
      http.setRequestHeader("Authorization", auth);
      http.onload = function () {
        if (http.readyState == 4 && http.status == 200) {
          state.elementsList = JSON.parse(this.responseText);
          cb(state.elementsList);
        }
      };
  
      http.send(null);
    });
  });  
}

function setDropdowns(queryMap) {
  if (queryMap) {
    Object.keys(queryMap).forEach(key => {
      document.getElementById(key).value = queryMap[key];
    });
  }
}

function getPrintedDate() {
  const date = new Date().toLocaleString();
  const printedDate = document.getElementById('printedDate');
  printedDate.innerHTML = `Printed on: ${date}`;
}

function setDisplayFilter(queryMap) {
  const displayFilters = document.getElementById('displayFilters');
  console.log(!isEmpty(queryMap));
  if(!isEmpty(queryMap)) {
    console.log(!isEmpty(queryMap))
    for (var q in queryMap) {
      const queryDiv = document.createElement('div');
      queryDiv.className = "queryName printonly";
      const querySpan = document.createElement('span');
      querySpan.className = "queryTerm";

      queryDiv.innerHTML = `${q.split('_').join(' ')}: `;
      querySpan.innerHTML = queryMap[q];

      queryDiv.appendChild(querySpan);
      displayFilters.appendChild(queryDiv);
    }
  }    
}

function init() {
  setLoader();
  getSearchParam(searchParam => {
    const queryMap = isEmpty(searchParam) ? null : getFilterMap(searchParam);
    console.log('search param is ', searchParam);
    console.log('query map is ', queryMap)
    setDropdowns(queryMap);
    setDisplayFilter(queryMap);
    getElements(elements => {
      const filteredElements = elements.filter(elementObj => filterSearch(elementObj, queryMap) && elementObj.displayOrder > 0);
      clearLoader();
      loadTable(filteredElements);

      const countElement = document.getElementById('total-count');
      countElement.innerHTML = `${filteredElements.length} total element${filteredElements.length !== 1 ? 's' : ''}`;
      
    })

    getPrintedDate();
  })
}

function clearSearch() {
  window.location.href = window.location.href.split('?')[0]
}

function printPage() {
  window.print();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('clearSearch').addEventListener('click', clearSearch);
  document.getElementById('printTable').addEventListener('click', printPage);
  init();
}, false);