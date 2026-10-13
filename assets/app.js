const dialog=document.querySelector('#preview-dialog');
const menu=document.querySelector('#mobile-menu');
const toggle=document.querySelector('.menu-toggle');
const title=document.querySelector('#dialog-title');
const content=document.querySelector('#dialog-content');
const panels={
contact:['Call or text True Lift','<p class="contact-number">435-900-4557</p><p>Choose how you’d like to get in touch.</p><div class="contact-choices"><button class="button" data-contact-method="call">Call now <span aria-hidden="true">↗</span></button><button class="button outline" data-contact-method="text">Send a text <span aria-hidden="true">↗</span></button></div><p class="muted contact-preview-note">Phone actions are demonstrations in this design preview.</p>'],
tuneup:['Tune-ups & maintenance','<p>Inspection, lubrication, alignment checks, and adjustments to help the system run smoothly.</p><p>The dedicated service page will explain the tune-up in detail. The current Lube & Tune price is $39, confirmed by Brady. The detailed package checklist is still a separate production content check.</p>'],
preview:['A preview of the direction','<p>These fifteen local mockups show the complete proposed site: Home, Services, six service pages, About, What to Expect, Service Areas, Contact, Privacy Policy, Terms and 404.</p><ul><li>Call and text controls are demonstrations. Book online opens the supplied True Lift Housecall Pro page in a new tab; an appointment requires completing its booking flow.</li><li>The Contact form is a design preview. Entries are not submitted.</li><li>Brady has confirmed Chris on the left and Colin on the right in the About portraits, and the $39 Lube &amp; Tune price. The detailed package checklist and remaining claim/photo publication checks are separate from this design review.</li><li>The legal pages contain prepared copy. Provider settings, request handling and the retention policy still require operational implementation before publication.</li><li>Selected reviews use the supplied capture. The displayed rating is dated, not a live feed. Google links open in a new tab.</li></ul>'],
call:['Call True Lift','<p class="contact-number">435-900-4557</p><p>On the live site, this control will open your phone dialer. This preview does not place a call.</p>'],
text:['Text True Lift','<p class="contact-number">435-900-4557</p><p>On the live site, this control will open a text message. This preview does not send a message.</p>'],
request:['Request service','<p>Tell us what the door is doing.</p><p>This is where the homepage will lead into the service request flow. The form destination and booking setup still need verification before they can accept requests.</p><p>No information is collected in this design preview.</p>'],
team:['Chris & Colin','<p>13 years of combined field experience. The owners do the work.</p><p>The people in the ads are the people at your door.</p><p>The full About page is outside this homepage concept. Photo consent and naming confirmation remain publication checks.</p>']
};
function openPanel(label,body){title.textContent=label;content.innerHTML=body;if(menu.open)menu.close();if(dialog.open){title.tabIndex=-1;title.focus();}else dialog.showModal()}
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>openPanel(...panels[button.dataset.action])));
document.querySelectorAll('.service-open').forEach(button=>button.addEventListener('click',()=>{const block=button.closest('.service');openPanel(button.textContent.replace('↗','').trim(),'<p>'+block.querySelector('p').textContent+'</p><p>'+button.dataset.proof+'</p><p class="muted">The live site will link to a dedicated service page. This concept previews Home, the Services overview, Broken Spring Repair, Garage Door Repair, Opener Repair, New Door Installation, Tune-ups and Off-track & Unsafe Doors.</p>')}));
content.addEventListener('click',event=>{const method=event.target.closest('[data-contact-method]');if(method)openPanel(...panels[method.dataset.contactMethod]);});
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.querySelector('.dialog-done').addEventListener('click',()=>dialog.close());
toggle.addEventListener('click',()=>{menu.showModal();toggle.setAttribute('aria-expanded','true')});menu.querySelector('.close').addEventListener('click',()=>menu.close());menu.addEventListener('close',()=>toggle.setAttribute('aria-expanded','false'));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));
for(const d of [dialog,menu]) d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});
document.querySelectorAll('.faq-item h3 button').forEach(button=>button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));document.getElementById(button.getAttribute('aria-controls')).hidden=open;button.querySelector('span').textContent=open?'+':'−'}));

// Progressive enhancement: the illustration and all copy remain visible without JS.
const system=document.querySelector('.system-visual');
const partCopy={
  springs:['Springs balance the weight.','They counterbalance the door so it can move smoothly.'],
  cables:['Cables connect the lifting system.','Lift cables run from the lower corners of the door to drums on the spring shaft.'],
  tracks:['Tracks and rollers guide the door.','The rollers travel along the tracks as the door opens and closes.'],
  panels:['Hinges connect the door sections.','The panels form the door; the hinges let the sections bend as they follow the tracks.'],
  opener:['The opener powers the movement.','Its motor and rail move the balanced door. A manual release disconnects the door from the opener.'],
  sensors:['Sensors watch the opening.','The pair of photo eyes near the floor detects obstructions in the closing path.'],
  seals:['Seals close the gaps.','Bottom and perimeter weather seals help keep out drafts, dust and water.']
};
const partServices={
  springs:['/true-lift-staging/services/broken-spring-replacement/','Explore spring repair'],
  cables:['/true-lift-staging/services/garage-door-repair/','Explore cables & door repairs'],
  tracks:['/true-lift-staging/services/garage-door-repair/','Explore track & roller repairs'],
  panels:['/true-lift-staging/services/garage-door-repair/','Explore panel & hinge repairs'],
  opener:['/true-lift-staging/services/garage-door-opener-repair/','Explore opener service'],
  sensors:['/true-lift-staging/services/garage-door-opener-repair/','Explore opener & sensor service'],
  seals:['/true-lift-staging/services/garage-door-repair/','Explore seals & door repairs']
};
if(document.body.classList.contains('services-page')){for(const entry of Object.values(partServices)){entry[0]=({'door-repairs':'garage-door-repairs','openers':'garage-door-openers'})[entry[0]]||entry[0];}}
if(system){
const partControls=system.querySelector('.part-controls');
const partDescription=system.querySelector('.part-description');
partControls.hidden=false;
partControls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
  const part=button.dataset.part;
  partControls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  system.querySelectorAll('[data-door-part]').forEach(g=>g.classList.toggle('is-active',g.dataset.doorPart===part));
  const related=system.querySelector('.diagram-service-link');const destination=partServices[part][0];related.href=destination.startsWith('/')?destination:'#'+destination;related.querySelector('span:last-child').textContent=destination.startsWith('/')?'↗':'↓';related.querySelector('.related-service-label').textContent=partServices[part][1];
  const strong=document.createElement('strong');strong.textContent=partCopy[part][0];
  partDescription.replaceChildren(strong,document.createTextNode(' '+partCopy[part][1]));
}));
const doorToggle=system.querySelector('.door-toggle');
doorToggle.hidden=false;
doorToggle.addEventListener('click',()=>{
  const open=system.classList.toggle('is-open');
  doorToggle.setAttribute('aria-expanded',String(open));
  doorToggle.querySelector('.door-toggle-label').textContent=open?'Close door':'Open door';
  doorToggle.querySelector('[aria-hidden]').textContent=open?'↓':'↑';
});

}

const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
// Apply entry animations only on arrival, never hide offscreen content in advance.
if('IntersectionObserver' in window){
  const arrivals=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    if(!reducedMotion.matches)entry.target.classList.add('motion-arrive');
    arrivals.unobserve(entry.target);
  }),{threshold:.12});
  document.querySelectorAll('.team-image,.team-copy,.section-heading>div,.system-visual,.service,.method-layout figure,.method-steps li,.process-grid li').forEach(el=>arrivals.observe(el));
}

// Load the local, silent video only on desktop. Honor motion/data preferences and pause offscreen.
const heroVideo=document.querySelector('.hero-video');
if(heroVideo){
const desktopVideo=window.matchMedia('(min-width: 768px)');
let wantsVideo=!reducedMotion.matches&&!navigator.connection?.saveData;
let heroVisible=true;
let playbackRequest=0;

async function syncVideo(){
  const request=++playbackRequest;
  if(!desktopVideo.matches||!heroVisible||document.hidden||!wantsVideo){heroVideo.pause();return;}
  if(!heroVideo.getAttribute('src'))heroVideo.src=heroVideo.dataset.src;
  try{await heroVideo.play();if(request!==playbackRequest&&(!desktopVideo.matches||!heroVisible||document.hidden||!wantsVideo))heroVideo.pause();}
  catch{/* Autoplay may be blocked; the poster remains visible. */}
}
desktopVideo.addEventListener('change',syncVideo);
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){wantsVideo=false;document.querySelectorAll('.motion-arrive').forEach(el=>el.classList.remove('motion-arrive'));}syncVideo()});
document.addEventListener('visibilitychange',syncVideo);
if('IntersectionObserver' in window){new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;syncVideo()},{threshold:0}).observe(document.querySelector('.hero'));}
syncVideo();
}

// Customer story starts only on request; original on-screen captions are preserved.
const testimonialVideo=document.querySelector('#jayci-video');
const testimonialPlay=document.querySelector('.testimonial-play');
const testimonialError=document.querySelector('.testimonial-error');
if(testimonialVideo&&testimonialPlay){
  testimonialVideo.controls=false;
  testimonialPlay.hidden=false;
  testimonialPlay.addEventListener('click',async()=>{
    testimonialPlay.hidden=true;
    testimonialVideo.controls=true;
    testimonialError.hidden=true;
    try{await testimonialVideo.play();testimonialVideo.focus();}
    catch{testimonialPlay.hidden=false;testimonialError.hidden=false;}
  });
  testimonialVideo.addEventListener('ended',()=>{testimonialVideo.controls=false;testimonialPlay.hidden=false;});
  testimonialVideo.addEventListener('error',()=>{testimonialPlay.hidden=false;testimonialError.hidden=false;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)testimonialVideo.pause();});
  if('IntersectionObserver' in window){new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)testimonialVideo.pause();},{threshold:0}).observe(testimonialVideo);}
}

// Manual carousel: all slides contribute to sizing, so changing a review never shifts the layout.
const reviewCarousel=document.querySelector('.review-carousel');
if(reviewCarousel){
  const slides=[...reviewCarousel.querySelectorAll('.review-card')];
  const counter=reviewCarousel.querySelector('#review-position');
  let reviewIndex=0;
  function showReview(index){
    reviewIndex=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>{
      const active=i===reviewIndex;
      slide.classList.toggle('is-current',active);
      slide.inert=!active;
      slide.setAttribute('aria-hidden',String(!active));
      slide.setAttribute('role','group');
      slide.setAttribute('aria-roledescription','slide');
      slide.setAttribute('aria-label',`Review ${i+1} of ${slides.length}`);
    });
    counter.textContent=`Review ${reviewIndex+1} of ${slides.length}`;
  }
  reviewCarousel.classList.add('is-enhanced');
  reviewCarousel.querySelector('.review-controls').hidden=false;
  reviewCarousel.querySelector('.review-prev').addEventListener('click',()=>showReview(reviewIndex-1));
  reviewCarousel.querySelector('.review-next').addEventListener('click',()=>showReview(reviewIndex+1));
  reviewCarousel.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();showReview(reviewIndex+(event.key==='ArrowRight'?1:-1));
    }
  });
  showReview(0);
}

// Keep the complete homepage introduction within the available first screen.
const homeIntro = document.querySelector('.home-intro');
if (homeIntro) {
  const introChrome = [document.querySelector('.preview-bar'), document.querySelector('header')].filter(Boolean);
  const sizeHomeIntro = () => {
    const height = introChrome.reduce((total, element) => total + element.getBoundingClientRect().height, 0);
    homeIntro.style.setProperty('--home-header-height', `${height}px`);
  };
  const introResizeObserver = new ResizeObserver(sizeHomeIntro);
  introChrome.forEach(element => introResizeObserver.observe(element));
  sizeHomeIntro();
}

// Keep the signature Home explorer; supporting pages share its motion timing.
if (document.querySelector('.hero-focused')) {
  const homeMotionScript = document.createElement('script');
  homeMotionScript.src = '/true-lift-staging/assets/home-motion.js?v=f466024dbefe';
  document.head.append(homeMotionScript);
} else {
  const siteMotionScript = document.createElement('script');
  siteMotionScript.src = '/true-lift-staging/assets/site-motion.js?v=d461905fde20';
  document.head.append(siteMotionScript);
}
