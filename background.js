function track(tabId) {
  console.log('Tracking: ' + tabId);
  chrome.tabs.sendMessage(tabId, {
    type: 'startTracking'
  });
};

chrome.tabs.onActivated.addListener(function(tab) {
  track(tab.tabId);
});

// chrome.tabs.onCreated.addListener(function(tab) {         
//     track(tab.id);
// });

function handleSelectedText(text) {
  if(text != '') {
    $.get('https://www.haskell.org/hoogle/?mode=json&hoogle=' + text + '&start=1&count=10', function(data) {
      console.log(data);
    });
  }
}

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.type == 'textSelected') {
    handleSelectedText(message.data);
  } else {
    alert('error');
  }
});
