import {select, templates} from './settings.js';

class Finder {
  constructor(element){
    const thisFinder = this;

    thisFinder.dom = {};
    thisFinder.dom.wrapper = element;

    thisFinder.grid = [];
    thisFinder.step = 1;
    thisFinder.initGrid();
    thisFinder.render(element);
  }
  initGrid(){
    const thisFinder = this;
    for(let i = 0; i < 10; i++){
      const row = [];
      for(let j = 0; j < 10; j++){
        row.push({
          enabled: true,
          checked: false,
        });
      }
      thisFinder.grid.push(row);
    }
    //console.log(thisFinder.grid);
  }
  render(element){
    const thisFinder = this;
    let pageData = null
    switch(thisFinder.step) {
      case 1:
        pageData = { title: 'Draw routes', btnText: 'Finish drawing' };
        break;
      case 2:
        pageData = { title: 'Pick start and finish', btnText: 'Compute' };
        break;
      case 3:
        pageData = { title: 'The best route is', btnText: 'Start again' };
        break;
    }
    element.innerHTML = templates.finder(pageData);
    
    thisFinder.renderGrid(document.querySelector(select.grid));
    thisFinder.initActions();
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
          else
            field.classList.remove(className);
        }
        row.appendChild(field);
      }
      
      element.appendChild(row);
    }
  }
  initActions(){
    const thisFinder = this;
    thisFinder.dom.wrapper.querySelector(select.grid).addEventListener('click', function(event){
      //console.log(event.target.getAttribute('data-row'));
      switch(thisFinder.step) {
      case 1:
        thisFinder.toggleField(event.target);
        break;
      case 2:
        thisFinder.setStartEnd();
        break;
      case 3:
        thisFinder.drawRoute();
        break;
    }
    });
    thisFinder.dom.wrapper.querySelector(select.button).addEventListener('click', function(event){
      thisFinder.step = (thisFinder.step + 1) % 3;
      if (thisFinder.step === 0)
        thisFinder.step = 3;
      thisFinder.render(thisFinder.dom.wrapper);
    });
    
  }
  toggleField(element){
    console.log('Toggling field');
  }
  setStartEnd(){
    console.log('Setting start and end');
  }
  drawRoute(){
    console.log('Drawing route');
  }

}
export default Finder;