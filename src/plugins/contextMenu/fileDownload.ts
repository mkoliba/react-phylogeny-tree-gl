export function download(dataURL: string, filename = 'file') {
  const anchorElement = document.createElement('a');
  anchorElement.download = filename;
  anchorElement.href = dataURL;
  document.body.appendChild(anchorElement); // Required for this to work in FireFox
  anchorElement.click();
  document.body.removeChild(anchorElement);
}

export function createBlobURL(data, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([ data ], { type });
  const windowURL = window.URL || window.webkitURL;
  return windowURL.createObjectURL(blob);
}