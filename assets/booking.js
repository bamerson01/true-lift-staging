document.addEventListener('click',function(e){
 var a=e.target.closest&&e.target.closest('a.booking-link');if(!a)return;
 if(window.HCPWidget&&typeof window.HCPWidget.openModal==='function'){e.preventDefault();window.HCPWidget.openModal();}
});