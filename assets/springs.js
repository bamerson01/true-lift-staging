// Compare conditions without operating or animating an unsafe door.
const springExplorer=document.querySelector('.spring-explorer');
if(springExplorer){
 const controls=springExplorer.querySelector('.spring-switch');
 controls.hidden=false;
 controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
  const broken=button.dataset.springState==='broken';
  springExplorer.classList.toggle('is-broken',broken);
  controls.querySelectorAll('button').forEach(control=>control.setAttribute('aria-pressed',String(control===button)));
  const explanation=springExplorer.querySelector('figcaption');
  const strong=document.createElement('strong');
  strong.textContent=broken?'A break interrupts the spring.':'Springs counterbalance the door.';
  explanation.replaceChildren(strong,document.createTextNode(broken?' A gap may be visible in the coil. Stop using the door and arrange an inspection.':' The opener moves a door whose weight is balanced by the spring system.'));
 }));
}

// One illustrative cycle on entry; never operates the broken-spring comparison.
const cycleNote=document.querySelector('.cycle-note');
if(cycleNote){
 const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const replay=cycleNote.querySelector('.cycle-replay');
 const door=cycleNote.querySelector('.cycle-door');
 let hasPlayed=false;
 function playCycle(){
  if(reducedMotion.matches||cycleNote.classList.contains('is-playing'))return;
  hasPlayed=true;
  cycleNote.classList.add('is-playing');
 }
 door.addEventListener('animationend',()=>cycleNote.classList.remove('is-playing'));
 replay.hidden=reducedMotion.matches;
 replay.addEventListener('click',playCycle);
 const observer=new IntersectionObserver(entries=>{
  if(entries.some(entry=>entry.isIntersecting)&&!hasPlayed){playCycle();observer.disconnect();}
 },{threshold:.55});
 observer.observe(cycleNote);
 reducedMotion.addEventListener('change',()=>{
  replay.hidden=reducedMotion.matches;
  if(reducedMotion.matches)cycleNote.classList.remove('is-playing');
 });
}
