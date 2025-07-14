import {select, templates} from './settings.js';

class Summary{
  constructor(selector){
    const thisSummary = this;
    thisSummary.dom = {};
    thisSummary.dom.wrapper = document.querySelector(selector);
    
    thisSummary.init();
  }
  init(){
    const thisSummary = this;
    thisSummary.dom.content = thisSummary.dom.wrapper.querySelector(select.summaryContent);
    thisSummary.dom.wrapper.querySelector(select.popupClose).addEventListener('click', function(event){
      thisSummary.dom.wrapper.classList.add('d-none');
    });
  }
  render(data){
    const thisSummary = this;

    thisSummary.dom.content.innerHTML = templates.summary(data);
    thisSummary.dom.wrapper.classList.remove('d-none');
  }
}

export default Summary;