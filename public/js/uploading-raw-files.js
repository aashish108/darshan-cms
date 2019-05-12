function updateFileNames() {
  const files = document.getElementById("files").files;
  let html = '';
  document.getElementById("filesNames").innerHTML = '';
  console.log(files);
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      html += files[i].name+'<br>';
    }
  }
  else {
    html = 'No files uploaded yet.'
  }
  document.getElementById("filesNames").innerHTML = html;
}

updateFileNames();