var msg = "testing";
var count = 5;
var delayBetween = 400; // ms between messages

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function getInputBox() {
  return (
    document.querySelector("footer div[contenteditable='true'][role='textbox']") ||
    document.querySelector("footer div[contenteditable='true']") ||
    document.querySelector("#main div[contenteditable='true'][role='textbox']") ||
    document.querySelector("#main div[contenteditable='true']")
  );
}

function getSendButton() {
  const el =
    document.querySelector("footer button[aria-label='Send']") ||
    document.querySelector("#main button[aria-label='Send']") ||
    document.querySelector("footer span[data-icon='wds-ic-send-filled']") ||
    document.querySelector("footer span[data-icon='send']") ||
    document.querySelector("footer span[data-icon*='send']") ||
    document.querySelector("#main span[data-icon*='send']");
  if (!el) return null;
  return el.closest("button") || el.closest("[role='button']") || el;
}

async function waitFor(fn, timeout = 2000, step = 50) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const r = fn();
    if (r) return r;
    await sleep(step);
  }
  return null;
}

function pressEnter(el) {
  const opts = { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true };
  el.dispatchEvent(new KeyboardEvent("keydown", opts));
  el.dispatchEvent(new KeyboardEvent("keypress", opts));
  el.dispatchEvent(new KeyboardEvent("keyup", opts));
}

async function sendOne() {
  const inputBox = getInputBox();
  if (!inputBox) {
    console.log("Input box not found – open a chat first");
    return false;
  }

  inputBox.focus();

  // Clear through the editor, not innerHTML (innerHTML breaks WhatsApp's editor state)
  document.execCommand("selectAll", false, null);
  document.execCommand("delete", false, null);

  // Insert the text (execCommand fires the input event itself)
  document.execCommand("insertText", false, msg);

  // Wait until the send button appears
  const sendButton = await waitFor(getSendButton, 2000);

  if (sendButton) {
    sendButton.click();
  } else {
    console.log("Send button not found, trying Enter key");
    pressEnter(inputBox);
  }

  // Wait until the box is empty, which means the message was sent
  await waitFor(() => getInputBox()?.textContent.trim() === "", 2000);
  return true;
}

async function sendMultiple() {
  for (let i = 0; i < count; i++) {
    console.log("Sending", i + 1);
    const ok = await sendOne();
    if (!ok) break;
    await sleep(delayBetween);
  }
  console.log("Done");
}

sendMultiple();
