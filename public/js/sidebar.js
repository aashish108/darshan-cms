function sidebarActiveMenu() {
  const pages = [
    'page-uploadRawImages',
    'page-rawUploadedImages',
    'page-uploadProcessedImages',
    'page-uploadRawImages',
    'pageUploadToTwitter',
  ];

  for (let page of pages) {
    if (document.body.classList.contains(page)) {
      const selector = document.querySelectorAll(`a.${page}`);
      selector[0].classList.add("is-active");
    }
  }
}

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(sidebarActiveMenu);

