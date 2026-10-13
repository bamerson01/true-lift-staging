// Keep all service explanations available without JavaScript.
const maintenanceExplorer=document.querySelector('.maintenance-explorer');
if(maintenanceExplorer){
 maintenanceExplorer.classList.add('is-enhanced');
 const controls=maintenanceExplorer.querySelector('.maintenance-controls');
 controls.hidden=false;
 const showMaintenance=key=>{
  controls.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.maintenance===key)));
  maintenanceExplorer.querySelectorAll('[data-maintenance-part]').forEach(part=>part.classList.toggle('is-active',part.dataset.maintenancePart===key));
  maintenanceExplorer.querySelectorAll('[data-maintenance-copy]').forEach(copy=>{copy.hidden=copy.dataset.maintenanceCopy!==key;});
 };
 showMaintenance('inspect');
 controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>showMaintenance(button.dataset.maintenance)));
}

