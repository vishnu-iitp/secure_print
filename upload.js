// frontend/upload.js
const fileInput = document.getElementById('fileInput');
const progressBar = document.getElementById('progressBar');
const statusText = document.getElementById('status');

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;
  if (file.type !== 'application/pdf') {
    statusText.textContent = 'Please upload a PDF file.';
    return;
  }
  if (file.size > 10 * 1024 * 1024) { // 10 MB limit
    statusText.textContent = 'File is too large. Maximum 10 MB allowed.';
    return;
  }
  
  // Prepare upload
  const formData = new FormData();
  formData.append('file', file);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/upload', true);
  
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      progressBar.style.display = 'block';
      progressBar.max = e.total;
      progressBar.value = e.loaded;
      statusText.textContent = `Uploading (${((e.loaded / e.total) * 100).toFixed(2)}%)...`;
    }
  });
  
  xhr.onload = () => {
    if (xhr.status === 200) {
      statusText.textContent = 'Thank you, your document is queued for printing.';
    } else {
      statusText.textContent = 'Upload failed: ' + xhr.responseText;
    }
    progressBar.style.display = 'none';
  };
  
  xhr.onerror = () => {
    statusText.textContent = 'Upload error.';
    progressBar.style.display = 'none';
  };

  xhr.send(formData);
});
