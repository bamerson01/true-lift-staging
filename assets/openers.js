// Progressive enhancement: all explanations remain available without JavaScript.
const openerDiagnostic=document.querySelector('.opener-diagnostic');
if(openerDiagnostic){
 const controls=openerDiagnostic.querySelector('.opener-symptom-controls');
 controls.hidden=false;
 function selectSymptom(key){
  controls.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.openerSymptom===key)));
  openerDiagnostic.querySelectorAll('[data-opener-part]').forEach(part=>part.classList.toggle('is-active',part.dataset.openerPart===key));
  openerDiagnostic.querySelectorAll('[data-opener-copy]').forEach(copy=>{copy.hidden=copy.dataset.openerCopy!==key;});
 }
 selectSymptom('motor');
 controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>selectSymptom(button.dataset.openerSymptom)));
}
