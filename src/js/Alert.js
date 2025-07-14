import {templates} from './settings.js';

class Alert {
  constructor(selector){
    const thisAlert = this;
    thisAlert.element = document.querySelector(selector);
  }
  show(message){
    const thisAlert = this;
    thisAlert.element.innerHTML = templates.alert({alertText: message});
    thisAlert.element.classList.add('visible');
    thisAlert.element.classList.remove('invisible');
  }
  hide(){
    const thisAlert = this;
    thisAlert.element.classList.add('invisible');
  }
}

export default Alert;