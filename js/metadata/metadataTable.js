import {
  clearLoader,
  getCached,
  getAuthorizationDefaults,
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
    authentication_types: 'authenticationTypes',
    api_type: 'api.type',
    beta: 'beta',
    // hidden: 'displayOrder',
    event_types: 'events',
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
 * Sort any arrays by the 'string' values in them
 * @param {Array} a Array 1
 * @param {Array} b Array 2
 * @param {String} propPath (optional) path to array
 */
function sortArrays(a, b, propPath) {
  let aField = a;
  let bField = b;

  if (propPath) {
    aField = a[propPath];
    bField = b[propPath];
  }
  
  aField = aField
    ? aField.sort((a, b) => alphabetical(a, b)).join('')
    : aField;
  bField = bField
    ? bField.sort((a, b) => alphabetical(a, b)).join('')
    : bField;

  if (aField < bField) {
    return -1;
  }
  if (aField > bField) {
    return 1;
  }

  return 0;
}

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

  if (!isEmpty(aField) && Array.isArray(aField)) {
    return sortArrays(aField, bField);
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
    tableHeaderElement.className = `tableHeaderClickable ${header} ${header === 'details' ? ' noprint' : ''}`;
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
    tableButton.className = `pure-button row-action`;
    tableButton.innerHTML = 'Go To';
    return tableButton;
  };

  const getBullets = (arr) => {
    if (!arr[0]) {
      arr.shift();
    }
    
    let list = document.createElement('ul');
    list.className = 'notes-list'

    arr.forEach(item => {
      let listItem = document.createElement('li');
      let listItemValue = document.createTextNode(item);
      listItem.appendChild(listItemValue);
      list.appendChild(listItem);
      
    });
    return list;
  };

  return elements.sort((a, b) => sort(a, b, state.sortField)).map(element => {
    let tableRowElement = document.createElement('tr');
    let tableDataElements = Object.keys(headerMap).map(header => {
      let tableDataElement = document.createElement('td');
      switch(header) {
        case 'details':
          tableDataElement.appendChild(getCheatSheetLink(element));
          break;
        case 'notes':
         let value = getValue(element, headerMap, header);
          if (value && value.includes('--')) {
            let notes = value.split('--');
            tableDataElement.appendChild(getBullets(notes));
          } else {
            tableDataElement.innerHTML = value;
          }
          break;
        default: 
          tableDataElement.innerHTML = getValue(element, headerMap, header);
          break;
      }
      
      tableDataElement.className = `${header} ${header === 'details' ? ' noprint' : ''}`;
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
  return typeof objectField === 'string' || Array.isArray(objectField)
    ? include
      ? objectField.includes(filterField)
      : objectField == filterField
    : objectField == getBoolean(filterField);
}

function filterSearch(elementObj, queryMap) {
  if (isEmpty(queryMap)) return true;

  return checkExistance(getConcatName(elementObj), queryMap.q, true) &&
         checkExistance(elementObj.hub, queryMap.hubs) &&
         //checkExistance(elementObj.elementType, queryMap.element_type) &&
         checkExistance(elementObj.authenticationTypes, queryMap.authentication_types, true) &&
         checkExistance(getForPath(elementObj, 'api.type'), queryMap.api_type) &&
         checkExistance(elementObj.beta, queryMap.beta) &&
         checkExistance(elementObj.events, queryMap.events, true) &&
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

const getEnv = (env) => {
  if (env.includes('api.cloud-elements.com') || env.includes('console.cloud-elements.com')) {
    return 'US Production';
  } else if (env.includes('api.cloud-elements.co.uk') || env.includes('console.cloud-elements.co.uk')) {
    return 'UK Production';
  } else {
    return 'Staging';
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

      // TODO me
      getCached('ce-eb-ub-env', env => {
        const countElement = document.getElementById('total-count');
        countElement.innerHTML = `${filteredElements.length} total element${filteredElements.length !== 1 ? 's' : ''} for ${getEnv(env)}`;
      });
    });

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
