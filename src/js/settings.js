export const select = {
  navLinks: '.menu a',
  finder: '.finder',
  grid: '.grid',
  button: '.button',
  alert: '.header .alert',
  summary: '.summary',
  summaryContent: '.content',
  popupClose: '#img-close',
  pages: '.page',
  templateOf: {
    finder: '#template-finder',
    alert: '#template-alert',
    summary: '#template-summary',
  }
};

export const templates = {
  finder: Handlebars.compile(document.querySelector(select.templateOf.finder).innerHTML),
  alert: Handlebars.compile(document.querySelector(select.templateOf.alert).innerHTML),
  summary: Handlebars.compile(document.querySelector(select.templateOf.summary).innerHTML),
};