// Whole-label disclosure: click/tap/keyboard everywhere, hover on desktop pointers.
const serviceMenus=[...document.querySelectorAll('.services-nav')];
const desktopHover=window.matchMedia('(min-width:992px) and (hover:hover) and (pointer:fine)');
const menuState=new WeakMap();
function closeServiceMenu(group,restoreFocus=false){
 const state=menuState.get(group);
 if(state){clearTimeout(state.timer);state.hoverOnly=false;}
 const button=group.querySelector('.services-nav-toggle');
 button.setAttribute('aria-expanded','false');
 group.querySelector('.service-submenu').hidden=true;
 if(restoreFocus)button.focus();
}
function openServiceMenu(group,hoverOnly=false){
 serviceMenus.forEach(other=>{if(other!==group)closeServiceMenu(other);});
 const state=menuState.get(group);
 clearTimeout(state.timer);
 state.hoverOnly=hoverOnly;
 group.querySelector('.services-nav-toggle').setAttribute('aria-expanded','true');
 group.querySelector('.service-submenu').hidden=false;
}
serviceMenus.forEach(group=>{
 const button=group.querySelector('.services-nav-toggle');
 const list=group.querySelector('.service-submenu');
 const state={hoverOnly:false,timer:null};
 menuState.set(group,state);
 group.querySelector('.services-nav-fallback').hidden=true;
 button.hidden=false;
 if(location.pathname.startsWith('/true-lift-staging/services/'))group.classList.add('is-current-section');
 button.addEventListener('click',()=>{
  if(!list.hidden&&!state.hoverOnly)closeServiceMenu(group);
  else openServiceMenu(group);
 });
 group.addEventListener('pointerenter',event=>{
  if(event.pointerType==='mouse'&&desktopHover.matches){
   clearTimeout(state.timer);
   if(list.hidden)openServiceMenu(group,true);
  }
 });
 group.addEventListener('pointerleave',()=>{
  if(desktopHover.matches&&!group.contains(document.activeElement))state.timer=setTimeout(()=>closeServiceMenu(group),180);
 });
 button.addEventListener('keydown',event=>{
  if(event.key==='ArrowDown'){event.preventDefault();openServiceMenu(group);list.querySelector('a').focus();}
 });
 group.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!list.hidden){event.preventDefault();event.stopPropagation();closeServiceMenu(group,true);}
 });
 group.addEventListener('focusout',event=>{if(!group.contains(event.relatedTarget))closeServiceMenu(group);});
 list.querySelectorAll('a').forEach(link=>{
  if(new URL(link.href).pathname===location.pathname&&!link.hash)link.setAttribute('aria-current','page');
  link.addEventListener('click',()=>closeServiceMenu(group));
 });
});
document.addEventListener('click',event=>serviceMenus.forEach(group=>{if(!group.contains(event.target))closeServiceMenu(group);}));
document.querySelector('#mobile-menu')?.addEventListener('close',()=>serviceMenus.forEach(group=>closeServiceMenu(group)));
window.matchMedia('(min-width:992px)').addEventListener('change',()=>serviceMenus.forEach(group=>closeServiceMenu(group)));
