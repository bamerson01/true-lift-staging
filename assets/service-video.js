// User-started service films. Native controls also work without JavaScript.
document.querySelectorAll('[data-service-film]').forEach(film=>{
 const video=film.querySelector('video');
 const play=film.querySelector('.service-film-play');
 const error=film.querySelector('.service-film-error');
 video.controls=false;
 play.hidden=false;
 play.addEventListener('click',async()=>{
  play.hidden=true;video.controls=true;error.hidden=true;
  try{await video.play();video.focus();}
  catch{play.hidden=false;error.hidden=false;}
 });
 video.addEventListener('ended',()=>{video.controls=false;play.hidden=false;});
 video.addEventListener('error',()=>{play.hidden=false;error.hidden=false;});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)video.pause();},{threshold:0}).observe(video);}
});
