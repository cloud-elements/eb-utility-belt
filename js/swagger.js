var swaggerTemplate = '{"/{resourceName}/{id}":{"delete":{"operationId":"/{resourceName}/{id}-DELETE","parameters":[{"description":"The authorization tokens. The format for the header value is \'Element &lt;token&gt;, User &lt;user secret&gt;\'","in":"header","name":"Authorization","required":true,"type":"string"},{"description":"The ID of the {objectName} to delete in the Finance system.","in":"path","name":"id","required":true,"type":"string"}],"responses":{"200":{"description":"OK - Everything worked as expected"},"400":{"description":"Bad Request - Often due to a missing request parameter"},"401":{"description":"Unauthorized - An invalid element token, user secret and/or org secret provided"},"403":{"description":"Forbidden - Access to the resource by the provider is forbidden"},"404":{"description":"Not found - The requested resource is not found"},"405":{"description":"Method not allowed - Incorrect HTTP verb used, e.g., GET used when POST expected"},"406":{"description":"Not acceptable - The response content type does not match the \'Accept\' header value"},"409":{"description":"Conflict - If a resource being created already exists"},"415":{"description":"Unsupported media type - The server cannot handle the requested Content-Type"},"500":{"description":"Server error - Something went wrong on the Cloud Elements server"},"502":{"description":"Provider server error - Something went wrong on the Provider or Endpoint\'s server"}},"summary":"Delete a {objectName} associated with a given ID from the Finance system. ","tags":["{elementKey}"]},"get":{"operationId":"/{resourceName}/{id}-GET","parameters":[{"description":"The authorization tokens. The format for the header value is \'Element &lt;token&gt;, User &lt;user secret&gt;\'","in":"header","name":"Authorization","required":true,"type":"string"},{"description":"The Id of the {objectName} to retrieve from the finance system.","in":"path","name":"id","required":true,"type":"string"}],"responses":{"200":{"description":"OK - Everything worked as expected","schema":{"$ref":"#/definitions/{ModelName}"}},"400":{"description":"Bad Request - Often due to a missing request parameter"},"401":{"description":"Unauthorized - An invalid element token, user secret and/or org secret provided"},"403":{"description":"Forbidden - Access to the resource by the provider is forbidden"},"404":{"description":"Not found - The requested resource is not found"},"405":{"description":"Method not allowed - Incorrect HTTP verb used, e.g., GET used when POST expected"},"406":{"description":"Not acceptable - The response content type does not match the \'Accept\' header value"},"409":{"description":"Conflict - If a resource being created already exists"},"415":{"description":"Unsupported media type - The server cannot handle the requested Content-Type"},"500":{"description":"Server error - Something went wrong on the Cloud Elements server"},"502":{"description":"Provider server error - Something went wrong on the Provider or Endpoint\'s server"}},"summary":"Retrieve a defined {objectName} associated with a given ID from the Finance system. ","tags":["{elementKey}"]},"patch":{"operationId":"/{resourceName}/{id}-PATCH","parameters":[{"description":"The authorization tokens. The format for the header value is \'Element &lt;token&gt;, User &lt;user secret&gt;\'","in":"header","name":"Authorization","required":true,"type":"string"},{"description":"The ID of the {objectName} to update in the Finance system.","in":"path","name":"id","required":true,"type":"string"},{"description":"The {objectName} object, with those fields that are to be updated.","in":"body","name":"body","required":true,"schema":{"$ref":"#/definitions/{ModelName}"}}],"responses":{"200":{"description":"OK - Everything worked as expected","schema":{"$ref":"#/definitions/{ModelName}"}},"400":{"description":"Bad Request - Often due to a missing request parameter"},"401":{"description":"Unauthorized - An invalid element token, user secret and/or org secret provided"},"403":{"description":"Forbidden - Access to the resource by the provider is forbidden"},"404":{"description":"Not found - The requested resource is not found"},"405":{"description":"Method not allowed - Incorrect HTTP verb used, e.g., GET used when POST expected"},"406":{"description":"Not acceptable - The response content type does not match the \'Accept\' header value"},"409":{"description":"Conflict - If a resource being created already exists"},"415":{"description":"Unsupported media type - The server cannot handle the requested Content-Type"},"500":{"description":"Server error - Something went wrong on the Cloud Elements server"},"502":{"description":"Provider server error - Something went wrong on the Provider or Endpoint\'s server"}},"summary":"Update a {objectName} given a set of partial attributes associated with a given ID in the Finance system.","tags":["{elementKey}"]}},"/{resourceName}":{"get":{"operationId":"/{resourceName}-GET","parameters":[{"description":"The authorization tokens. The format for the header value is \'Element &lt;token&gt;, User &lt;user secret&gt;\'","in":"header","name":"Authorization","required":true,"type":"string"},{"description":"The CEQL Expression to filter the return values","in":"query","name":"where","required":false,"type":"string"},{"description":"The start page for pagination, defaults to 1 if not supplied","in":"query","name":"nextPage","required":false,"type":"string"},{"description":"The number of items returned in a query. Defaults to 100 if not supplied","format":"int64","in":"query","name":"pageSize","required":false,"type":"integer"}],"responses":{"200":{"description":"OK - Everything worked as expected","schema":{"items":{"$ref":"#/definitions/{ModelName}"},"type":"array"}},"400":{"description":"Bad Request - Often due to a missing request parameter"},"401":{"description":"Unauthorized - An invalid element token, user secret and/or org secret provided"},"403":{"description":"Forbidden - Access to the resource by the provider is forbidden"},"404":{"description":"Not found - The requested resource is not found"},"405":{"description":"Method not allowed - Incorrect HTTP verb used, e.g., GET used when POST expected"},"406":{"description":"Not acceptable - The response content type does not match the \'Accept\' header value"},"409":{"description":"Conflict - If a resource being created already exists"},"415":{"description":"Unsupported media type - The server cannot handle the requested Content-Type"},"500":{"description":"Server error - Something went wrong on the Cloud Elements server"},"502":{"description":"Provider server error - Something went wrong on the Provider or Endpoint\'s server"}},"summary":"Find {objectName} in the Finance System.","tags":["{elementKey}"]},"post":{"operationId":"/{resourceName}-POST","parameters":[{"description":"The authorization tokens. The format for the header value is \'Element &lt;token&gt;, User &lt;user secret&gt;\'","in":"header","name":"Authorization","required":true,"type":"string"},{"description":"The {objectName} object to be created.<br>","in":"body","name":"body","required":true,"schema":{"$ref":"#/definitions/{ModelName}"}}],"responses":{"200":{"description":"OK - Everything worked as expected","schema":{"$ref":"#/definitions/{ModelName}"}},"400":{"description":"Bad Request - Often due to a missing request parameter"},"401":{"description":"Unauthorized - An invalid element token, user secret and/or org secret provided"},"403":{"description":"Forbidden - Access to the resource by the provider is forbidden"},"404":{"description":"Not found - The requested resource is not found"},"405":{"description":"Method not allowed - Incorrect HTTP verb used, e.g., GET used when POST expected"},"406":{"description":"Not acceptable - The response content type does not match the \'Accept\' header value"},"409":{"description":"Conflict - If a resource being created already exists"},"415":{"description":"Unsupported media type - The server cannot handle the requested Content-Type"},"500":{"description":"Server error - Something went wrong on the Cloud Elements server"},"502":{"description":"Provider server error - Something went wrong on the Provider or Endpoint\'s server"}},"summary":"Create a {objectName} in the Finance system.","tags":["{elementKey}"]}}}';

function generateSwagger() {
	var modelName = document.getElementById('modelName').value;
	var elementKey = document.getElementById('elementKey').value;
	var objectName = document.getElementById('objectName').value;
	var resourceName = document.getElementById('resourceName').value;
	var outputMsg = document.getElementById('outputMsg');

	chrome.storage.sync.set({
		"modelName": modelName
	});
	chrome.storage.sync.set({
		"elementKey": elementKey
	});
	chrome.storage.sync.set({
		"objectName": objectName
	});
	chrome.storage.sync.set({
		"resourceName": resourceName
	});

	var o = new RegExp("{resourceName}", 'g');
	var res = swaggerTemplate.replace(o, resourceName);
	o = new RegExp("{objectName}", 'g');
	res = res.replace(o, objectName);
	o = new RegExp("{ModelName}", 'g');
	res = res.replace(o, modelName);
	o = new RegExp("{elementKey}", 'g');
	res = res.replace(o, elementKey);
	var jsonPretty = JSON.stringify(JSON.parse(res), null, 2);
	outputMsg.value = jsonPretty;
}

window.onload = function () {
	chrome.storage.sync.get("modelName", function (items) {
		if (!chrome.runtime.error) {
			console.log(items);
			if (!items)
				document.getElementById("modelName").value = items.modelName;
		}
	});
	chrome.storage.sync.get("objectName", function (items) {
		if (!chrome.runtime.error) {
			console.log(items);
			if (!items)
				document.getElementById("objectName").value = items.objectName;
		}
	});
	chrome.storage.sync.get("elementKey", function (items) {
		if (!chrome.runtime.error) {
			console.log(items);
			if (!items)
				document.getElementById("elementKey").value = items.elementKey;
		}
	});
	chrome.storage.sync.get("resourceName", function (items) {
		if (!chrome.runtime.error) {
			console.log(items);
			if (!items)
				document.getElementById("resourceName").value = items.resourceName;
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {

	var checkPageButton = document.getElementById('generateSwagger');
	var outputMsg = document.getElementById('outputMsg');
	checkPageButton.addEventListener('click', function () {

		chrome.tabs.getSelected(null, function (tab) {
			generateSwagger();
		});
	}, false);
}, false);