import {select} from './settings.js';

class Finder {
  constructor(element){
    const thisFinder = this;

    thisFinder.grid = [];
    thisFinder.initGrid();
    thisFinder.renderGrid(element);
  }
  renderGrid(element){
    const thisFinder = this;
    for(let i = 0; i < 10; i++){
      const row = document.createElement('div');
      row.classList.add('row');

      for(let j = 0; j < 10; j++){
        const field = document.createElement('div');
        field.classList.add('col', 'field');
        field.setAttribute('data-row', i);
        field.setAttribute('data-col', j);
        
        for(const className in thisFinder.grid[i][j]){
          if(thisFinder.grid[i][j][className])
            field.classList.add(className);
        }
        row.appendChild(field);
      }
      
      element.appendChild(row);
    }
  }
  initGrid(){
    const thisFinder = this;
    for(let i = 0; i < 10; i++){
      const row = [];
      for(let j = 0; j < 10; j++){
        row.push({
          enabled: false,
          checked: false,
          test: true
        });
      }
      thisFinder.grid.push(row);
    }
    console.log(thisFinder.grid);
  }

}
export default Finder;