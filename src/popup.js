chrome.runtime.sendMessage({ action: "get-content" }, (content) => {
  render({ content: content });
});

const title = document.getElementById("text");
function render({ content: content }) {
  title.innerText = `${content}`;
}

chrome.storage.onChanged.addListener(({ content }) => {
  if (content) {
    render({ content: content.newValue });
  }
});
