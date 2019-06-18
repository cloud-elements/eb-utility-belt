export function isJson(body) {
    try {
        JSON.parse(body);
    } catch (ignore) {
        console.warn(ignore, body);
        return false;
    }

    return true;
};

export function safeParse(body) {
    try {
        return JSON.parse(body);
    } catch (ignore) {
        console.warn(ignore);
        return null;
    }
};

/**
 * Get a nested value for a given path
 * @param {JSON Object} body 
 * @param {String} path 
 */
export function getForPath(body, path) {
    return path.includes('.') 
            ? path.split('.').reduce((acc, key) => {
                acc = acc === '' 
                    ? body[key] 
                        ?  body[key]
                        : ''
                    : acc[key];
                return acc;
                }, '')
            : body[path];
}

export function clearLoader() {
    const loaderHolder = document.getElementById('loaderHolder'),
          loader = document.getElementById('loader');
  
    if (loader) {
      loaderHolder.removeChild(loader);
    }
}

export function setLoader() {
    const loaderHolder = document.getElementById('loaderHolder'),
          loader = document.createElement('div');
  
    loader.className = "loader";
    loader.id = "loader";
    loaderHolder.appendChild(loader);
}

export function isEmptyStr(str) {
    return !str || (str && str.trim().length == 0);
}

export function isEmptyObject(obj) {
    return Array.isArray(obj) ?
        !obj || (obj && obj.length == 0) :
        !obj || (obj && Object.keys(obj).length == 0);
}

export function isEmpty(o) {
    return typeof o === 'string' 
        ? isEmptyStr(o) 
        : typeof o === 'boolean' 
            ?   o 
            :   typeof o === 'number' 
                ? false
                : isEmptyObject(o);
}

// Direct rip from json-colorizer
export function getTokens(json) {
    const tokenTypes = [
        { regex: /^\s+/, tokenType: 'WHITESPACE' },
        { regex: /^[{}]/, tokenType: 'BRACE' },
        { regex: /^[\[\]]/, tokenType: 'BRACKET' },
        { regex: /^:/, tokenType: 'COLON' },
        { regex: /^,/, tokenType: 'COMMA' },
        { regex: /^-?\d+(?:\.\d+)?(?:e[+\-]?\d+)?/i, tokenType: 'NUMBER_LITERAL' },
        { regex: /^"(?:\\.|[^"\\])*"(?=\s*:)/, tokenType: 'STRING_KEY' },
        { regex: /^"(?:\\.|[^"\\])*"/, tokenType: 'STRING_LITERAL' },
        { regex: /^true|false/, tokenType: 'BOOLEAN_LITERAL' },
        { regex: /^null/, tokenType: 'NULL_LITERAL' }
    ];

    let input = typeof json === 'string' ? json : JSON.stringify(json),
        tokens = [],
        foundToken,
        match,
        i,
        numTokenTypes = tokenTypes.length;

    do {
        foundToken = false;
        for (i = 0; i < numTokenTypes; i++) {
            match = tokenTypes[i].regex.exec(input);
            if (match) {
                tokens.push({
                    type: tokenTypes[i].tokenType,
                    value: match[0]
                });
                input = input.substring(match[0].length);
                foundToken = true;
                break;
            }
        }
    } while (input.length > 0 && foundToken);

    return tokens;
}

export function getCached(cacheName, cb) {
    chrome.storage.sync.get(cacheName, function (items) {
        if (!chrome.runtime.error) {
            if (items[cacheName]) {
                cb(items[cacheName]);
            } else {
                cb(null);
            }
        }
    });
}

export function copyTextArea(elementName) {
    let element = document.getElementById(elementName);
    element.select();
    document.execCommand("copy");
}

export function getAuthorizationDefaults(cb) {
    getCached('ce-eb-ub-us', us => {
        getCached('ce-eb-ub-os', os => {
        cb(`User ${us}, Organization ${os}`);
        });
    });
}