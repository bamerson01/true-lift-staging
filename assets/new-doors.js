// All descriptions remain readable when JavaScript is unavailable.
const doorOptions=document.querySelector('.door-options-explorer');
if(doorOptions){
 doorOptions.classList.add('is-enhanced');
 const controls=doorOptions.querySelector('.door-option-controls');
 controls.hidden=false;
 const selectOption=key=>{
  controls.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.doorOption===key)));
  doorOptions.querySelectorAll('[data-door-part]').forEach(part=>part.classList.toggle('is-active',part.dataset.doorPart===key));
  doorOptions.querySelectorAll('[data-door-copy]').forEach(copy=>{copy.hidden=copy.dataset.doorCopy!==key;});
 };
 selectOption('panels');
 controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>selectOption(button.dataset.doorOption)));
}
