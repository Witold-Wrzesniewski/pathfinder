import {select, templates} from './settings.js';
import Alert from './Alert.js';
import Summary from './Summary.js';

class Finder {
  constructor(element){
    const thisFinder = this;

    thisFinder.dom = {};
    thisFinder.dom.wrapper = element;

    thisFinder.grid = [];
    thisFinder.step = 1;
    thisFinder.selectedFields = 0;
    thisFinder.start = null;
    thisFinder.finish = null;
    thisFinder.routes = [];
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
    element.innerHTML = '';
    element.innerHTML = templates.finder(pageData);
    thisFinder.alert = new Alert(select.alert);

    thisFinder.renderGrid(document.querySelector(select.grid));
    AOS.init();
    thisFinder.initActions();
    thisFinder.summary = new Summary(select.summary);
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
        field.setAttribute('data-col', i);
        field.setAttribute('data-row', j);

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
      switch(thisFinder.step) {
      case 1:
        thisFinder.step = 2;
        break;
      case 2:
        if(thisFinder.start && thisFinder.finish){
          thisFinder.drawRoute(thisFinder.start, thisFinder.finish);
          thisFinder.step = 3;
          thisFinder.summary.render({
            checkedFields: thisFinder.grid.flat().filter((elem) => elem.checked).length,
            maxLength: thisFinder.routes.at(-1).length,
            minLength: thisFinder.routes[0].length,
          });
        }
        else
          return;
        break;
      case 3:
        thisFinder.grid = [];
        thisFinder.step = 1;
        thisFinder.selectedFields = 0;
        thisFinder.start = null;
        thisFinder.finish = null;
        thisFinder.routes = [];
        thisFinder.initGrid();
        thisFinder.render(document.querySelector(select.finder));
        break;
      }

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
  checkConnection(field1, field2){
    const thisFinder = this;
    thisFinder.findRoutes(field1, field2, []);
    let result = false;

    if(thisFinder.routes.length > 0)
      result = true;
    thisFinder.routes = [];
    
    return result;
  }
 
  toggleField(element){
    const thisFinder = this;

    thisFinder.alert.hide();
    const field = thisFinder.grid[parseInt(element.getAttribute('data-col'))][parseInt(element.getAttribute('data-row'))];
    const neighbours = thisFinder.getNeighbours(field);

    if(field.checked){
      field.checked = false;
      let checkedNeighboursConnected = true;
      const checkedNeighbours = neighbours.filter((neighbour) => neighbour.checked);

      for(let i = -1; i < checkedNeighbours.length - 1; i++){
        checkedNeighboursConnected = thisFinder.checkConnection(checkedNeighbours.at(i), checkedNeighbours.at(i+1));
        if(!checkedNeighboursConnected)
          break;
      }
      if(checkedNeighboursConnected){
        thisFinder.selectedFields--;
        for(const neighbour of neighbours){
          if(!thisFinder.neighboursChecked(neighbour))
            neighbour.enabled = false;
        }
        if(!thisFinder.neighboursChecked(field))
          field.enabled = false;
      }
      else{
        field.checked = true;
        thisFinder.alert.show('Field can\'t be unselected.');
      }
      thisFinder.renderGrid(document.querySelector(select.grid));
      return;
    }

    if(field.enabled || thisFinder.selectedFields == 0){
      field.checked = true;
      field.enabled = true;
      thisFinder.selectedFields++;
      for(const neighbour of neighbours){
        if(!neighbour.checked)
          neighbour.enabled = true;
      }
      thisFinder.renderGrid(document.querySelector(select.grid));
    }
    else {
      thisFinder.alert.show('Field must adjoin already selected field');
    }
    thisFinder.renderGrid(document.querySelector(select.grid));
  }
  setStartEnd(element){
    const thisFinder = this;
    const field = thisFinder.grid[parseInt(element.getAttribute('data-col'))][parseInt(element.getAttribute('data-row'))];
    if(field.checked && thisFinder.start == null){
      thisFinder.start = field;
      element.classList.add('start-finish');
    }
    else if(field.checked && thisFinder.finish == null){
      thisFinder.finish = field;
      element.classList.add('start-finish');
    }
  }
  drawRoute(start, finish){
    const thisFinder = this;
    thisFinder.findRoutes(start, finish, []);
    thisFinder.routes.sort((a, b) => a.length - b.length);
    for(const field of thisFinder.routes[0])
      field.route = true;
    for(const row of thisFinder.grid){
      for(const field of row)
        field.enabled = false;
    }
    thisFinder.renderGrid(document.querySelector(select.grid));
  }
  findRoutes(start, finish, currentRoute){
    const thisFinder = this;

    if(currentRoute.includes(start))
      return;

    currentRoute.push(start);
    if(start === finish){
      thisFinder.routes.push(currentRoute);
      return;
    }

    const nextFields = [];
    if(start.x - 1 >= 0 && thisFinder.grid[start.x - 1][start.y].checked)
      nextFields.push(thisFinder.grid[start.x - 1][start.y]);
    if(start.x + 1 < 10 && thisFinder.grid[start.x + 1][start.y].checked)
      nextFields.push(thisFinder.grid[start.x + 1][start.y]);
    if(start.y - 1 >= 0 && thisFinder.grid[start.x][start.y - 1].checked)
      nextFields.push(thisFinder.grid[start.x][start.y - 1]);
    if(start.y + 1 < 10 && thisFinder.grid[start.x][start.y + 1].checked)
      nextFields.push(thisFinder.grid[start.x][start.y + 1]);

    nextFields.forEach(function(field){
      thisFinder.findRoutes(field, finish, [...currentRoute]);
    });
  }

}
export default Finder;