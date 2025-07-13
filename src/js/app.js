import Finder from './Finder.js';
import {select} from './settings.js';

export const app = {
  init: function(element){
    const finder = new Finder(element);
    this.initNav();
  },
  initNav: function(){
    const links = document.querySelectorAll(select.navLinks);
    const pages = document.querySelectorAll(select.pages);
    for(const link of links){
      link.addEventListener('click', function(event){
        event.preventDefault();
        const hash = event.target.getAttribute('href');
        for(let page of pages){
          page.classList.toggle('d-none', !page.classList.contains(hash.replace('#', '')));
        }
      });
    }
  },
};
app.init(document.querySelector(select.finder));
