import {select} from './settings.js';

class Finder {
  constructor(element){
    const thisFinder = this;

    this.renderGrid(element);
  }
  renderGrid(element){
    for(let i = 1; i <= 10; i++){
      const row = document.createElement('div');
      row.classList.add('row');

      for(let j = 1; j <=10; j++){
        const field = document.createElement('div');
        field.innerText = i.toString() + ', ' + j.toString();
        field.classList.add('col', 'field');
        row.appendChild(field);
      }
      
      element.appendChild(row);
    }
  }

}
export default Finder;