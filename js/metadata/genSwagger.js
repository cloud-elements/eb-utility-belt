import { getCached, copyTextArea } from './ce-utils.js';
let swaggerTemplate = `{"/{resourceName}/{id}":{"delete":{"operationId":"/{resourceName}/{id}-DELETE","parameters":[{"description":"The authorization tokens. The format for the header value is 'Element &lt;token&gt;, User &lt;user secret&gt;'","in":"header","name":"Authorization","required":true,"type":"string"},{"description":"The {objectName} ID","in":"path","name":"id","required":true,"type":"string"}],"responses":{"200":{"description":"OK - Everything worked as expected"},"400":{"description":"Bad Request - Often due to a missing request parameter"},"401":{"description":"Unauthorized - An invalid element token, user secret and/or org secret provided"},"403":{"description":"Forbidden - Access to the resource by the provider is forbidden"},"404":{"description":"Not found - The requested resource is not found"},"405":{"description":"Method not allowed - Incorrect HTTP verb used, e.g., GET used when POST expected"},"406":{"description":"Not acceptable - The response content type does not match the 'Accept' header value"},"409":{"description":"Conflict - If a resource being created already exists"},"415":{"description":"Unsupported media type - The server cannot handle the requested Content-Type"},"500":{"description":"Server error - Something went wrong on the Cloud Elements server"},"502":{"description":"Provider server error - Something went wrong on the Provider or Endpoint's server"}},"summary":"Delete a {objectName} associated with a given ID","tags":["{elementKey}"]},"get":{"operationId":"/{resourceName}/{id}-GET","parameters":[{"description":"The authorization tokens. The format for the header value is 'Element &lt;token&gt;, User &lt;user secret&gt;'","in":"header","name":"Authorization","required":true,"type":"string"},{"description":"The {objectName} ID","in":"path","name":"id","required":true,"type":"string"}],"responses":{"200":{"description":"OK - Everything worked as expected","schema":{"$ref":"#/definitions/{ModelName}"}},"400":{"description":"Bad Request - Often due to a missing request parameter"},"401":{"description":"Unauthorized - An invalid element token, user secret and/or org secret provided"},"403":{"description":"Forbidden - Access to the resource by the provider is forbidden"},"404":{"description":"Not found - The requested resource is not found"},"405":{"description":"Method not allowed - Incorrect HTTP verb used, e.g., GET used when POST expected"},"406":{"description":"Not acceptable - The response content type does not match the 'Accept' header value"},"409":{"description":"Conflict - If a resource being created already exists"},"415":{"description":"Unsupported media type - The server cannot handle the requested Content-Type"},"500":{"description":"Server error - Something went wrong on the Cloud Elements server"},"502":{"description":"Provider server error - Something went wrong on the Provider or Endpoint's server"}},"summary":"Retrieve a defined {objectName} associated with a given ID","tags":["{elementKey}"]},"patch":{"operationId":"/{resourceName}/{id}-PATCH","parameters":[{"description":"The authorization tokens. The format for the header value is 'Element &lt;token&gt;, User &lt;user secret&gt;'","in":"header","name":"Authorization","required":true,"type":"string"},{"description":"The {objectName} ID","in":"path","name":"id","required":true,"type":"string"},{"description":"The {objectName} object, with the fields to be updated","in":"body","name":"body","required":true,"schema":{"$ref":"#/definitions/{ModelName}"}}],"responses":{"200":{"description":"OK - Everything worked as expected","schema":{"$ref":"#/definitions/{ModelName}"}},"400":{"description":"Bad Request - Often due to a missing request parameter"},"401":{"description":"Unauthorized - An invalid element token, user secret and/or org secret provided"},"403":{"description":"Forbidden - Access to the resource by the provider is forbidden"},"404":{"description":"Not found - The requested resource is not found"},"405":{"description":"Method not allowed - Incorrect HTTP verb used, e.g., GET used when POST expected"},"406":{"description":"Not acceptable - The response content type does not match the 'Accept' header value"},"409":{"description":"Conflict - If a resource being created already exists"},"415":{"description":"Unsupported media type - The server cannot handle the requested Content-Type"},"500":{"description":"Server error - Something went wrong on the Cloud Elements server"},"502":{"description":"Provider server error - Something went wrong on the Provider or Endpoint's server"}},"summary":"Update a {objectName} given a set of partial attributes associated with a given ID","tags":["{elementKey}"]}},"/{resourceName}":{"get":{"operationId":"/{resourceName}-GET","parameters":[{"description":"The authorization tokens. The format for the header value is 'Element &lt;token&gt;, User &lt;user secret&gt;'","in":"header","name":"Authorization","required":true,"type":"string"},{"description":"The CEQL expression to filter the return values","in":"query","name":"where","required":false,"type":"string"},{"description":"The start page for pagination, defaults to 1 if not supplied","in":"query","name":"nextPage","required":false,"type":"string"},{"description":"The number of items returned in a query. Defaults to 100 if not supplied","format":"int64","in":"query","name":"pageSize","required":false,"type":"integer"}],"responses":{"200":{"description":"OK - Everything worked as expected","schema":{"items":{"$ref":"#/definitions/{ModelName}"},"type":"array"}},"400":{"description":"Bad Request - Often due to a missing request parameter"},"401":{"description":"Unauthorized - An invalid element token, user secret and/or org secret provided"},"403":{"description":"Forbidden - Access to the resource by the provider is forbidden"},"404":{"description":"Not found - The requested resource is not found"},"405":{"description":"Method not allowed - Incorrect HTTP verb used, e.g., GET used when POST expected"},"406":{"description":"Not acceptable - The response content type does not match the 'Accept' header value"},"409":{"description":"Conflict - If a resource being created already exists"},"415":{"description":"Unsupported media type - The server cannot handle the requested Content-Type"},"500":{"description":"Server error - Something went wrong on the Cloud Elements server"},"502":{"description":"Provider server error - Something went wrong on the Provider or Endpoint's server"}},"summary":"Search for {objectName}s","tags":["{elementKey}"]},"post":{"operationId":"/{resourceName}-POST","parameters":[{"description":"The authorization tokens. The format for the header value is 'Element &lt;token&gt;, User &lt;user secret&gt;'","in":"header","name":"Authorization","required":true,"type":"string"},{"description":"The {objectName} object to be created","in":"body","name":"body","required":true,"schema":{"$ref":"#/definitions/{ModelName}"}}],"responses":{"200":{"description":"OK - Everything worked as expected","schema":{"$ref":"#/definitions/{ModelName}"}},"400":{"description":"Bad Request - Often due to a missing request parameter"},"401":{"description":"Unauthorized - An invalid element token, user secret and/or org secret provided"},"403":{"description":"Forbidden - Access to the resource by the provider is forbidden"},"404":{"description":"Not found - The requested resource is not found"},"405":{"description":"Method not allowed - Incorrect HTTP verb used, e.g., GET used when POST expected"},"406":{"description":"Not acceptable - The response content type does not match the 'Accept' header value"},"409":{"description":"Conflict - If a resource being created already exists"},"415":{"description":"Unsupported media type - The server cannot handle the requested Content-Type"},"500":{"description":"Server error - Something went wrong on the Cloud Elements server"},"502":{"description":"Provider server error - Something went wrong on the Provider or Endpoint's server"}},"summary":"Create a {objectName}","tags":["{elementKey}"]}}}`;

function generateSwagger() {
	var modelName = document.getElementById('modelName').value;
	var elementKey = document.getElementById('elementKey').value;
	var objectName = document.getElementById('objectName').value;
	var resourceName = document.getElementById('resourceName').value;
	var outputMsg = document.getElementById('outputMsg-swagger');

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
	getCached('modelName', modelName => {
		document.getElementById("modelName").value = modelName;
	});

	getCached('objectName', objectName => {
		document.getElementById("objectName").value = objectName;
	});
	
	getCached('elementKey', elementKey => {
		document.getElementById("elementKey").value = elementKey;
	});

	getCached('resourceName', resourceName => {
		document.getElementById("resourceName").value = resourceName;
	});
}

function copyOutput() {
    copyTextArea('outputMsg-swagger');
}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("copyoutput").addEventListener("click", copyOutput);
	document.getElementById('generateSwagger').addEventListener('click', generateSwagger);
}, false);