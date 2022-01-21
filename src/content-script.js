const preEls = document.querySelectorAll("pre");

[...preEls].forEach((preEl) => {
  const root = document.createElement("div");
  root.style.position = "relative";
  const shadowRoot = root.attachShadow({ mode: "open" });

  const cssUrl = chrome.runtime.getURL("content-script.css");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl;
  shadowRoot.appendChild(link);

  const button = document.createElement("button");
  button.innerText = "Copy";
  button.type = "button";
  shadowRoot.prepend(button);
  preEl.prepend(root);

  const codeEl = preEl.querySelector("code");

  const code = codeEl.innerText;

  button.addEventListener("click", () => {
    navigator.clipboard.writeText(code).then(() => {
      // alert("Copied!");
      notify();
      chrome.runtime.sendMessage({ action: "send-code", code });
    });
  });
});

chrome.runtime.onMessage.addListener((req, info, cb) => {
  if (req.action === "copy-all") {
    const allCode = getAllCode();
    navigator.clipboard.writeText(allCode).then(() => {
      notify();
      cb(allCode);
    });
    return true;
  }
});

function getAllCode() {
  return [...preEls]
    .map((preEl) => preEl.querySelector("code").innerText)
    .join("");
}

function notify() {
  const scriptElement = document.createElement("script");
  scriptElement.src = chrome.runtime.getURL("execute.js");
  document.body.appendChild(scriptElement);
  scriptElement.onload = () => {
    scriptElement.remove();
  };
}
