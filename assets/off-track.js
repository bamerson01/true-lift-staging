// Select static symptoms; never animate operation of the unsafe door.
const unsafeExplorer=document.querySelector('.unsafe-explorer');
if(unsafeExplorer){
 unsafeExplorer.classList.add('is-enhanced');
 const controls=unsafeExplorer.querySelector('.unsafe-controls');
 controls.hidden=false;
 const showUnsafe=key=>{
  controls.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.unsafe===key)));
  unsafeExplorer.querySelectorAll('[data-unsafe-art]').forEach(part=>part.classList.toggle('is-active',part.dataset.unsafeArt===key));
  unsafeExplorer.querySelectorAll('[data-unsafe-copy]').forEach(copy=>{copy.hidden=copy.dataset.unsafeCopy!==key;});
 };
 showUnsafe('crooked');
 controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>showUnsafe(button.dataset.unsafe)));
}
