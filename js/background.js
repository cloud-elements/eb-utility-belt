chrome.runtime.onMessage.addListener(function (request) {
    if (request.type === 'popout') {
        chrome.tabs.create({
            url: chrome.extension.getURL(request.url),
            active: true
        });
    } else {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.update(tabs[0].id, {
                url: chrome.extension.getURL(request.url)
            });
        });
    }
});