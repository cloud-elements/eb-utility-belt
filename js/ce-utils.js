exports.isJson = (body) => {
    try {
        JSON.parse(body);
    } catch (ignore) {
        console.warn(ignore, body);
        return false;
    }

    return true;
};