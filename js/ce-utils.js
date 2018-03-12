exports.isJson = (body) => {
    try {
        JSON.parse(body);
    } catch (ignore) {
        console.warn(ignore, body);
        return false;
    }

    return true;
};

exports.safeParse = (body) => {
    try {
        return JSON.parse(body);
    } catch (ignore) {
        console.warn(ignore);
        return null;
    }
};