chrome.runtime.onMessage.addListener(function (request) {
    if (request.type === 'popout') {
        chrome.tabs.create({
            url: chrome.extension.getURL(request.url),
            active: true
        });
    }
});