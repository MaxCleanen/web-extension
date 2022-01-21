function setContent(content) {
  chrome.storage.local.set({ content: content }, function () {
    console.log("Value is set to " + content);
  });
}

function getContent() {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(["content"], function (result) {
      console.log("Value currently is " + result.content);

      resolve(result.content ?? "empty");
      return;
    });
  });
}

chrome.commands.onCommand.addListener((command) => {
  if (command === "copy-all") {
    getCurrentTabId().then((tabId) => {
      chrome.tabs.sendMessage(tabId, { action: "copy-all" }, (allCode) => {
        setContent(allCode);
      });
    });
  }
});

chrome.runtime.onMessage.addListener((req, info, cb) => {
  if (req.action === "send-code") {
    setContent(req.code);
  }
  if (req.action === "get-content") {
    getContent().then((content) => {
      cb(content);
    });
    return true;
  }
});

async function getCurrentTabId() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  console.log("tab.id", tab.id);
  return tab.id;
}

// chrome.runtime.onInstalled.addListener(({ reason }) => {
//   if (reason === "install") {
//     chrome.tabs.create({
//       url: chrome.runtime.getURL("welcome.html"),
//     });
//     chrome.runtime.setUninstallURL("http://localhost:4450/leave");
//   }
// });

// function sendCodeToVScode(code) {
//   return fetch("http://localhost:4450/copypaste", {
//     method: "POST",
//     body: JSON.stringify({ code }),
//   }).catch((e) => {
//     console.log("vscode in not found");
//   });
// }
