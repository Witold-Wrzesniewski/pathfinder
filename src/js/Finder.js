import {select, templates} from './settings.js';

class Finder {
  constructor(element){
    const thisFinder = this;

    thisFinder.dom = {};
    thisFinder.dom.wrapper = element;

    thisFinder.grid = [];
    thisFinder.step = 1;
    thisFinder.selectedFields = 0;
    thisFinder.initGrid();
    thisFinder.render(element);
  }
  initGrid(){
    const thisFinder = this;
    for(let i = 0; i < 10; i++){
      const row = [];
      for(let j = 0; j < 10; j++){
        row.push({
          x: i,
          y: j,
          enabled: false,
          checked: false,
        });
      }
      thisFinder.grid.push(row);
    }
    //console.log(thisFinder.grid);
  }
  render(element){
    const thisFinder = this;
    let pageData = null;
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
    element.innerHTML = '';
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
          if(field.classList.contains('checked'))
            field.classList.remove('enabled');
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
      if(event.target.classList.contains('field')){
        switch(thisFinder.step) {
        case 1:
          thisFinder.toggleField(event.target);
          break;
        case 2:
          thisFinder.setStartEnd(event.target);
          break;
        case 3:
          thisFinder.drawRoute();
          break;
        }
      }
      
    });
    thisFinder.dom.wrapper.querySelector(select.button).addEventListener('click', function(event){
      thisFinder.step = (thisFinder.step + 1) % 3 || 3;

      thisFinder.render(thisFinder.dom.wrapper);
    });
    
  }
  getNeighbours(field){
    const thisFinder = this;
    const neighbours = [];
    if(field.x - 1 >= 0)
      neighbours.push(thisFinder.grid[field.x - 1][field.y]);
    if(field.x + 1 < 10)
      neighbours.push(thisFinder.grid[field.x + 1][field.y]);
    if(field.y - 1 >= 0)
      neighbours.push(thisFinder.grid[field.x][field.y - 1]);
    if(field.y + 1 < 10)
      neighbours.push(thisFinder.grid[field.x ][field.y + 1]);
    return neighbours;
  }
  neighboursChecked(field){
    const thisFinder = this;
    const neighbours = thisFinder.getNeighbours(field);
    let neighbourChecked = false;
    for(const neighbour of neighbours){
      if(neighbour.checked)
        neighbourChecked = true;
    }
    return neighbourChecked;
  }
  toggleField(element){
    const thisFinder = this;

    const field = thisFinder.grid[parseInt(element.getAttribute('data-row'))][parseInt(element.getAttribute('data-col'))];
    console.log('Toggling field: ' + field.x + ', ' + field.y);
    const neighbours = thisFinder.getNeighbours(field);

    let neighbourChecked = thisFinder.neighboursChecked(field);

    /* If checked */
    if(field.checked){
      field.checked = false;
      thisFinder.selectedFields--;
      if(!neighbourChecked){
        field.enabled = false;
      }
      for(const neighbour of neighbours){
        if(!thisFinder.neighboursChecked(neighbour))
          neighbour.enabled = false;
      }
      thisFinder.renderGrid(document.querySelector(select.grid));
      return;
    }
    // 1. Uncheck; thisFinder.selectedFields--;
    // 2. If !(checked neighbours) disable
    // 3. Disable neighbours without checked neighbous

    /* If enabled or first */
    if(field.enabled || thisFinder.selectedFields == 0){
      field.checked = true;
      thisFinder.selectedFields++;
      for(const neighbour of neighbours){
        if(!neighbour.checked)
          neighbour.enabled = true;
      }
      thisFinder.renderGrid(document.querySelector(select.grid));
    }
    else {
      console.log('Alert!');
    }
    // 1. Check; thisFinder.selectedFields++;
    // 2. Set enabled to unchecked neighbours
    /* Else */
    // Alert

    
    thisFinder.renderGrid(document.querySelector(select.grid));
  }
  setStartEnd(element){
    const thisFinder = this;
    console.log('Setting start and end');
  }
  drawRoute(){
    const thisFinder = this;
    console.log('Drawing route');
  }
  /*updateGrid(x, y, className){
    const thisFinder = this;
    thisFinder.grid[x][y][className] = thisFinder.grid[x][y][className] ? false : true;
  }*/

}
export default Finder;