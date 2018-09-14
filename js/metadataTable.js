// @Deprecated
function filterHeaders(headerKeys) {
  return !['image', 'logo'].includes(headerKeys);
}

let elementsList;

// Map of header name , data path
function getHeaders() {
  return {
    id: 'id',
    hub: 'hub',
    name: 'name',
    key: 'key',
    // description: 'description',
    element_type: 'elementType',
    api_type: 'api.type',
    // active: 'active',
    beta: 'beta',
    hidden: 'displayOrder',
    bulk_upload: 'bulk.upload',
    bulk_download: 'bulk.download',
    // api_count: 'usage.traffic'
  };
}

/**
 * Sorts fields 'a' and 'b' alphabetically by the given 'field', ['field', 'path'],
 * or just by 'a' and 'b' themselves if 'field' is not set
 * case insensitive
 */
function alphabetical(a, b, propPath) {
  const property = type(propPath) === 'String' ? [propPath] : propPath;
  // TODO update this..
  const getValue = pipe(path(property), ifElse(val => type(val) === String, toUpper, identity));

  let aField = a;
  let bField = b;

  if (propPath) {
    if (a && !isNil(getValue(a))) {
      aField = getValue(a);
    }

    if (b && !isNil(getValue(b))) {
      bField = getValue(b);
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
 * @param {*} sortBy object (w/ field {str} and order {num})
 * @param {*} defaultField if value isn't present for either, use this'r
 */
function multiSorter(a, b, sortBy, defaultField) {
  // TODO update this...
  if (isNil(a[sortBy.field]) || isNil(b[sortBy.field])) {
    sortBy.field = defaultField;
  }
  if (sortBy.order % 2) {
    b = [a, (a = b)][0]; // flop them for order
  }
  if (sortBy.field === 'created') {
    return moment(a.createdDate).isBefore(b.createdDate) ? -1 : 1;
  }

  a = a[sortBy.field];
  b = b[sortBy.field];

  if (typeof a === 'number') {
    return a < b ? 1 : -1;
  }

  if (typeof a === 'string') {
    return alphabetical(a.toLowerCase(), b.toLowerCase(), sortBy.field);
  }

  return sortTruthy(a, b);
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

// Work in progress...
function sortByName(a, b, name) {
  const aValue = a && getValue(a, getHeaders(), name);
  const bValue = b && getValue(b, getHeaders(), name);


}

function sort(a, b, name) {
  if (name) {
    return sortByName(a, b, name);
  } else if (a && a.id && b && b.id) {
    return sortById(a, b);
  } else {
    return 0;
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

function getTableHeaders(headerKeys) {
  return headerKeys.map(header => {
    let tableHeaderElement = document.createElement('th');
    tableHeaderElement.innerHTML = header;
    tableHeaderElement.addEventListener('click', e => sortBy(header, e));
    return tableHeaderElement;
  });
}

function getValue(element, headerMap, headerKey) {
  let elementMetadataKey = headerMap[headerKey];

  let value = elementMetadataKey.includes('displayOrder') 
    ? element[elementMetadataKey] === 0
    : elementMetadataKey.includes('.') 
        ? elementMetadataKey.split('.').reduce((acc, key) => {
          acc = acc === '' 
              ? element[key] 
                ?  element[key]
                : ''
              : acc[key];
          return acc;
        }, '')
        : element[elementMetadataKey];

  return isNaN(value)
    ? value
    : value.toLocaleString();
}

function getTableRows(elements, headerMap) {
  return elements.sort(sort).map(element => {
    let tableRowElement = document.createElement('tr');
    let tableDataElements = Object.keys(headerMap).map(header => {
      let tableDataElement = document.createElement('td');
      tableDataElement.innerHTML = getValue(element, headerMap, header);
      return tableDataElement;
    })

    tableDataElements.forEach(td => tableRowElement.appendChild(td));
    tableRowElement.id = `tr-${element.id}`;
    return tableRowElement;
  })
}

function loadTable(elements) {
  // const headers = Object.keys(elements[0]).filter(filterHeaders),
  const headers = Object.keys(getHeaders()),
        headerRow = document.getElementById('headerRow'),
        tableBody = document.getElementById('tableBody');

  // Set the table headers...
  getTableHeaders(headers).forEach(th => headerRow.appendChild(th));
  // Set the table body....
  // getTableRows(elements, getHeaders()).forEach(tr => tableBody.appendChild(tr));
  getTableRows(elements, getHeaders()).forEach(tr => replaceOrAppendChild(tableBody, tr));
}

function getUrl(cb) {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function (tabs) {
    var tab = tabs[0];
    cb(tab.url.split('?q=')[1]);
  });
}

function sortBy(name, event) {
  console.log('wtf', event);
  if (!event) {
    return;
  }

  getUrl(url => {
    console.log('sort the moofo', url);
    const sortedElements = elementsList.sort((a, b) => sort(a, b, name));
    // loadTable(sortedElements);
  })
}

function getConcatName(elementObj) {
  return `${elementObj.key.trim()}${elementObj.hub}${elementObj.api && elementObj.api.type}${elementObj.name.trim().toLowerCase()}${elementObj.elementType.toLowerCase()}`;
}

function filterSearch(elementObj, searchParam) {
  if (!searchParam) return true;

  return searchParam && getConcatName(elementObj).includes(searchParam.toLowerCase());
}

function init() {
  getUrl(searchParam => {
    console.log('search param is ', searchParam);
    getElements(elements => {
      const filteredElements = elements.filter(elementObj => filterSearch(elementObj, searchParam) && elementObj.displayOrder > 0);
      loadTable(filteredElements);
      
      const countElement = document.getElementById('total-count');
      countElement.innerHTML = `${filteredElements.length} total element${filteredElements.length !== 1 ? 's' : ''}`;
    })
  })
}

function getElements(cb) {
  let http = new XMLHttpRequest();
  // http.open("GET", `https://api.cloud-elements.com/elements/api-v2/elements?abridged=true`, true);
  http.open("GET", `https://api.cloud-elements.com/elements/api-v2/elements/metadata?pageSize=500`, true);
  http.setRequestHeader("Accept", "application/json");
  http.setRequestHeader("Authorization", "User ZvKz4rVisc0+RKeZQpVhfB6lIVTM3426AG2ExelcDOg=, Organization 24ec958aea1252424c4e788c4f09fa3d");
  http.withCredentials = false;
  http.onload = function () {
    if (http.readyState == 4 && http.status == 200) {
      elementsList = JSON.parse(this.responseText);
      cb(elementsList);
    }
  };

  http.send(null);
}

document.addEventListener('DOMContentLoaded', function () {
  init();
}, false);