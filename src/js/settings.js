export const select = {
  navLinks: '.menu a',
  finder: '.finder',
  grid: '.grid',
  button: '.button',
  alert: '.header .alert',
  pages: '.page',
  templateOf: {
    finder: '#template-finder',
    alert: '#template-alert',
  }
};

export const templates = {
  finder: Handlebars.compile(document.querySelector(select.templateOf.finder).innerHTML),
  alert: Handlebars.compile(document.querySelector(select.templateOf.alert).innerHTML),
};