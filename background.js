function track(tabId) {
  chrome.tabs.sendMessage(tabId, {
    type: 'startTracking'
  });
};

chrome.tabs.onActivated.addListener(function(tab) {
  track(tab.tabId);
});
