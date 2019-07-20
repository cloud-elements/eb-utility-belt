/*
const fs = require('fs');
let rawdata = fs.readFileSync(__dirname + '/test/sample-expansion-query-result.json');
let student = JSON.parse(rawdata);
console.log(student);
*/

const expandStatement = "http://localhost:8550/dbdeploysql/expandStatement";

/**
 * driverCalls
 */

function callonSQLStatement() {

    var json = "{\"expansionResults\":[{\"query\":\"INSERT INTO element_resource_parameter (name, vendor_name, description, required, type, vendor_type, data_type, vendor_data_type, source, element_resource_id) VALUES ('google.adwords.developer.token', 'developerToken', 'Developer token is expected as a header by Google though on top of OAuth 2.0 information.', '0', 'configuration', 'header', 'string', 'string', 'request', (SELECT id FROM element_resource WHERE path = '/hubs/general/report-types/{reportType}/reports' AND method = 'GET' AND type = 'api' AND owner_account_id = (SELECT account_id FROM ce_core_user WHERE email_address = 'system') AND element_id = (SELECT element_id FROM element WHERE element_key = 'googleadwords' AND deleted = false AND element_owner_account_id = (SELECT account_id FROM ce_core_user WHERE email_address = 'system'))))\",\"tableName\":\"element_resource_parameter\",\"affectedcolumns\":{\"data_type\":\"'string'\",\"description\":\"'Developer token is expected as a header by Google though on top of OAuth 2.0 information.'\",\"element_resource_id\":{\"query\":\"(SELECT id FROM element_resource WHERE path = '/hubs/general/report-types/{reportType}/reports' AND method = 'GET' AND type = 'api' AND owner_account_id = (SELECT account_id FROM ce_core_user WHERE email_address = 'system') AND element_id = (SELECT element_id FROM element WHERE element_key = 'googleadwords' AND deleted = false AND element_owner_account_id = (SELECT account_id FROM ce_core_user WHERE email_address = 'system')))\",\"tableName\":\"element_resource\",\"affectedcolumns\":{},\"selectColumns\":[\"id\"],\"whereClauses\":{\"element_id\":{\"query\":\"SELECT element_id FROM element WHERE element_key = 'googleadwords' AND deleted = false AND element_owner_account_id = (SELECT account_id FROM ce_core_user WHERE email_address = 'system')\",\"tableName\":\"element\",\"affectedcolumns\":{},\"selectColumns\":[\"element_id\"],\"whereClauses\":{\"deleted\":\"false\",\"element_key\":\"'googleadwords'\",\"element_owner_account_id\":{\"query\":\"SELECT account_id FROM ce_core_user WHERE email_address = 'system'\",\"tableName\":\"ce_core_user\",\"affectedcolumns\":{},\"selectColumns\":[\"account_id\"],\"whereClauses\":{\"email_address\":\"'system'\"}}}},\"method\":\"'GET'\",\"owner_account_id\":{\"query\":\"SELECT account_id FROM ce_core_user WHERE email_address = 'system'\",\"tableName\":\"ce_core_user\",\"affectedcolumns\":{},\"selectColumns\":[\"account_id\"],\"whereClauses\":{\"email_address\":\"'system'\"}},\"path\":\"'/hubs/general/report-types/{reportType}/reports'\",\"type\":\"'api'\"}},\"name\":\"'google.adwords.developer.token'\",\"required\":\"'0'\",\"source\":\"'request'\",\"type\":\"'configuration'\",\"vendor_data_type\":\"'string'\",\"vendor_name\":\"'developerToken'\",\"vendor_type\":\"'header'\"},\"selectColumns\":[],\"whereClauses\":{}}],\"numberOfUpdates\":0,\"numberOfQueries\":1,\"numberOfInserts\":1,\"numberOfDeletes\":0}";
    var json1 = callIRS();
    var expansionResults = getExpansionResults(JSON.parse(json));
    var cols = getAffectedCols(expansionResults[0]);
    renderUIFromAffectedCols(cols);
}

function callIRS() {
    var sqlStmt = document.getElementById("inputSql-stmt").value;
    var body = {sqlStatement: sqlStmt};

    fetch(expandStatement, {
        "method": "POST",
        "body": JSON.stringify(body)
    }).then(resp => console.log(resp));
}

/**
 * render functions
 */

function renderUIFromAffectedCols(affectedcolsObject) {
    var parentElement = document.getElementById("metadataTable");
    clearData(parentElement);
    var steroidElement = updateExistingDomWithCustomFunctions(parentElement);

    for (var fieldName in affectedcolsObject) {

        var valueRow = prepareElement("tr");
        var fieldNameCell = prepareElement("td").addData(fieldName);

        valueRow.appendChild(fieldNameCell);
        var fieldValue = affectedcolsObject[fieldName];
        if (fieldValue instanceof Object) {
            fieldValue = fieldValue["query"];
        }
        var fieldValueCell = prepareElement("td").addData(fieldValue);

        valueRow.appendChild(fieldValueCell);
        steroidElement.performNuke(valueRow);
    }

}

/**
 * generic dom functions
 * Usage: prepareElement("myelem").addClass(")
 */

function prepareElement(elementName) {
    var element = document.createElement(elementName);
    Object.defineProperty(element, "addClass", {value: addClass});
    Object.defineProperty(element, "addData", {value: addData});
    return element;
}

function updateExistingDomWithCustomFunctions(existingElement) {
    Object.defineProperty(existingElement, "performNuke", {value: performNuke});
    return existingElement;
}

function performNuke(elementToNukeIntoDom) {
    this.appendChild(elementToNukeIntoDom);
    return this;
}

function addChild(element) {
    this.appendChild(element);
    return this;
}

function addClass(userClassName) {
    this.className = userClassName;
    return this;
}

function addData(data) {
    this.innerText = data;
    return this;
}

function clearData(element) {
    element.innerText = "";
    element.innerHTML = "";
}

/**
 *  Data Driven and Data extraction functions
 */
function getExpansionResults(rawdata) {
    return rawdata["expansionResults"];
}

function getAffectedCols(eachExpansionResult) {
    return eachExpansionResult["affectedcolumns"];
}

