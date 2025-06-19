// Theme toggle function
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  document.querySelector('.theme-toggle').textContent = isDark ? '🌙' : '🌞';
}

// Trigger the file input when the drag-drop area is clicked
function triggerFileInput() {
  document.getElementById('upload').click();
}

// Prevent default behavior for drag & drop events
document.getElementById('drag-drop').addEventListener('dragover', (event) => {
  event.preventDefault();
  document.getElementById('drag-drop').style.backgroundColor = '#e0e0e0';
});

document.getElementById('drag-drop').addEventListener('dragleave', () => {
  document.getElementById('drag-drop').style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
});

document.getElementById('drag-drop').addEventListener('drop', async (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    const output = document.getElementById('output');
    output.readOnly = true;
    output.value = '⏳ Extracting text... please wait...';
    autoResizeTextarea();

    const worker = await Tesseract.createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const { data: { text } } = await worker.recognize(file);
    output.value = text;
    autoResizeTextarea();

    await worker.terminate();
  }
});

// Handle file input change (when user selects a file)
document.getElementById('upload').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    const output = document.getElementById('output');
    output.readOnly = true;
    output.value = '⏳ Extracting text... please wait...';
    autoResizeTextarea();

    const worker = await Tesseract.createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const { data: { text } } = await worker.recognize(file);
    output.value = text;
    autoResizeTextarea();

    await worker.terminate();
  }
});

function enableEdit() {
  const output = document.getElementById('output');
  output.readOnly = false;
  autoResizeTextarea();
  output.focus();
}

function copyText() {
  const text = document.getElementById('output').value;
  const copyMsg = document.getElementById('copy-msg');
  if (!text || text === "Your extracted text will appear here...") {
    copyMsg.textContent = "⚠️ Nothing to copy yet!";
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    copyMsg.textContent = "✅ Copied!";
    setTimeout(() => {
      copyMsg.textContent = "";
    }, 2000);
  });
}

function autoResizeTextarea() {
  const output = document.getElementById('output');
  output.style.height = "auto";
  output.style.height = output.scrollHeight + "px";
}
