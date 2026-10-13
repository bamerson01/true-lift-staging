// Select a wear point without operating the illustrated door.
const wearExplorer=document.querySelector('.overhaul-explorer');
if(wearExplorer){
 const controls=wearExplorer.querySelector('.wear-controls');
 controls.hidden=false;
 const showWear=key=>{
  controls.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.wear===key)));
  wearExplorer.querySelectorAll('[data-wear-part]').forEach(part=>part.classList.toggle('is-active',part.dataset.wearPart===key));
  wearExplorer.querySelectorAll('[data-wear-copy]').forEach(copy=>{copy.hidden=copy.dataset.wearCopy!==key;});
 };
 showWear('springs');
 controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>showWear(button.dataset.wear)));
}
