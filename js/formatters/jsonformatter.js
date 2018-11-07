import { getTokens, safeParse } from '../utilities/ce-utils.js';

function colorize(tokens) {
    const defaultColors = {
        BRACE: 'white',
        BRACKET: 'white',
        COLON: 'white',
        COMMA: 'white',
        STRING_KEY: 'lightblue',
        STRING_LITERAL: 'lightsalmon',
        NUMBER_LITERAL: 'lightgreen',
        BOOLEAN_LITERAL: 'dodgerblue',
        NULL_LITERAL: 'dodgerblue',
        POST: 'green',
        GET: 'blue',
        PATCH: 'orange',
        PUT: 'orange',
        DELETE: 'red'
    };

    return tokens.map(token => token.value.fontcolor(defaultColors[token.type])).join('');
}


function parseJson(body) {
    let json = safeParse(body),
        outputMsg = document.getElementById('outputMsg-json');

    if (json) {
        outputMsg.innerHTML = colorize(getTokens(JSON.stringify(json, null, 2)));
    } else {
        outputMsg.innerHTML = colorize([{ type: 'DELETE', value: 'Invalid JSON'}]);
    }
}

function formatJson() {
    const inputMsg = document.getElementById('inputMsg-json').value;

    chrome.storage.sync.set({
        "inputMsg-json": inputMsg
    });

    parseJson(inputMsg);
}

window.onload = function () {
    chrome.storage.sync.get("inputMsg-json", function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
            if (items['inputMsg-json'])
                document.getElementById("inputMsg-json").value = items['inputMsg-json'];
        }
    });
}

// Hacking this to just use the inputMsg directly, but mocks selection :[
function copyOutput() {
    let json = JSON.parse(document.getElementById('inputMsg-json').value);
    let outputMsgElement = document.getElementById('outputMsg-json');
    let range = document.createRange();
    range.selectNodeContents(outputMsgElement);
    let selection = window.getSelection(); 
    selection.removeAllRanges();
    selection.addRange(range);
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('formatJson').addEventListener('click', formatJson);
    document.getElementById("copyoutput").addEventListener("click", copyOutput);    
}, false);