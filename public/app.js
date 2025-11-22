let selectedFile = null;

// DOM elements
const uploadArea = document.getElementById("uploadArea");
const pdfFileInput = document.getElementById("pdfFile");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const uploadBtn = document.getElementById("uploadBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const resultContent = document.getElementById("resultContent");

// Upload area click
uploadArea.addEventListener("click", () => {
  pdfFileInput.click();
});

// File input change
pdfFileInput.addEventListener("change", handleFileSelect);

// Drag and drop
uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("border-gray-900", "bg-white");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("border-gray-900", "bg-white");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("border-gray-900", "bg-white");
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    pdfFileInput.files = files;
    handleFileSelect({ target: { files } });
  }
});

// Upload button click
uploadBtn.addEventListener("click", uploadPDF);

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.type !== "application/pdf") {
    alert("Por favor, selecione um arquivo PDF válido.");
    pdfFileInput.value = "";
    return;
  }

  // Limite de 5MB para evitar erro 413
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    alert(`Arquivo muito grande. O limite é ${formatFileSize(MAX_SIZE)}.\n\nSeu arquivo: ${formatFileSize(file.size)}`);
    pdfFileInput.value = "";
    return;
  }

  selectedFile = file;
  fileName.textContent = file.name;
  fileSize.textContent = formatFileSize(file.size);
  fileInfo.classList.remove("hidden");
  fileInfo.classList.add("flex");
  uploadBtn.disabled = false;
  result.classList.add("hidden");
}

function removeFile() {
  selectedFile = null;
  pdfFileInput.value = "";
  fileInfo.classList.add("hidden");
  fileInfo.classList.remove("flex");
  uploadBtn.disabled = true;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

async function uploadPDF() {
  if (!selectedFile) {
    alert("Selecione um arquivo PDF!");
    return;
  }

  uploadBtn.disabled = true;
  loading.classList.remove("hidden");
  result.classList.add("hidden");

  try {
    const arrayBuffer = await selectedFile.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < uint8.length; i += chunkSize) {
      binary += String.fromCharCode.apply(
        null,
        Array.prototype.slice.call(uint8, i, i + chunkSize)
      );
    }
    const base64 = btoa(binary);

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: selectedFile.name,
        data: base64,
      }),
    });

    const data = await res.json();

    loading.classList.add("hidden");
    result.classList.remove("hidden");

    if (res.ok && data.summary) {
      resultContent.textContent = data.summary;
      resultContent.classList.remove("bg-red-50", "border-red-200", "text-red-900");
      resultContent.classList.add("bg-white", "border-gray-200", "text-gray-900");
    } else {
      // Mensagens de erro mais amigáveis
      let errorMsg = data.error || "Erro desconhecido";
      if (res.status === 413) {
        errorMsg = "Arquivo muito grande. Por favor, use um PDF menor que 5MB.";
      }
      resultContent.textContent = errorMsg;
      resultContent.classList.remove("bg-white", "border-gray-200", "text-gray-900");
      resultContent.classList.add("bg-red-50", "border-red-200", "text-red-900");
    }
  } catch (err) {
    loading.classList.add("hidden");
    result.classList.remove("hidden");
    resultContent.textContent = "Erro ao processar: " + (err.message || err);
    resultContent.classList.remove("bg-white", "border-gray-200", "text-gray-900");
    resultContent.classList.add("bg-red-50", "border-red-200", "text-red-900");
  } finally {
    uploadBtn.disabled = false;
  }
}

function copyToClipboard() {
  const content = resultContent.textContent;
  const btn = document.getElementById("copyBtn");
  
  navigator.clipboard.writeText(content).then(() => {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sm:w-3.5 sm:h-3.5"><polyline points="20 6 9 17 4 12"/></svg><span>Copiado!</span>';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
    }, 2000);
  }).catch(() => {
    alert("Erro ao copiar. Tente novamente.");
  });
}
