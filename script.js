var msg = "testing";
var count = 5;

async function sendOne() {
  const inputBox = document.querySelector("footer div[contenteditable='true']");
  
  if (!inputBox) {
    console.log("Input box not found");
    return false;
  }

  // Focus & clear old text
  inputBox.focus();
  inputBox.innerHTML = "";

  // Insert message
  document.execCommand("insertText", false, msg);

  // Trigger typing event
  inputBox.dispatchEvent(new InputEvent("input", { bubbles: true }));

  // WAIT for WhatsApp to show the send button
  await new Promise(r => setTimeout(r, 120));

  // NOW the send button exists (after typing)
  const sendButton = document.querySelector("footer span[data-icon='wds-ic-send-filled']");

  if (!sendButton) {
    console.log("Send button not found AFTER typing");
    return false;
  }

  sendButton.click();

  // Wait for message to send
  await new Promise(r => setTimeout(r, 250));
}

async function sendMultiple() {
  for (let i = 0; i < count; i++) {
    console.log("Sending", i + 1);
    await sendOne();
  }
}

sendMultiple();
