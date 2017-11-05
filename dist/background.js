chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log('update');
  chrome.tabs.executeScript(null, {file: "bundle.js"})
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {file: "bundle.js"})
});
