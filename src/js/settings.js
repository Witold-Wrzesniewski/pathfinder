export const select = {
  navLinks: '.menu a',
  finder: '.finder',
  grid: '.grid',
  pages: '.page',
  templateOf: {
    finder: '#template-finder',
  }
}

export const templates = {
  finder: Handlebars.compile(document.querySelector(select.templateOf.finder).innerHTML),
};