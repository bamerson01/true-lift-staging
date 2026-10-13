(function(){
var form=document.getElementById('request-form');if(!form)return;
var status=document.getElementById('request-status');var submit=form.querySelector('.request-submit');
function v(id){var el=document.getElementById(id);return el?el.value.trim():'';}
function method(){var m=form.querySelector('input[name="contact-method"]:checked');return m&&m.value==='text'?'Text':'Call';}
function say(msg,kind){status.textContent=msg;status.dataset.state=kind||'';}
form.addEventListener('submit',function(e){
 e.preventDefault();if(!form.reportValidity())return;
 if(form.elements._honey&&form.elements._honey.value)return;
 var data={'First name':v('first-name'),'Last name':v('last-name'),'Phone':v('phone'),'Email':v('email'),
  'Preferred contact':method(),'Service needed':v('service-needed'),'City or ZIP':v('city'),
  'What the door is doing':v('door-description'),'Page':location.href,
  _subject:'Service request: '+v('service-needed')+' in '+v('city'),_cc:'colin@trueliftgaragedoor.com',_template:'table',_captcha:'false'};
 if(data['Email'])data._replyto=data['Email'];
 submit.disabled=true;say('Sending your request…','busy');
 fetch('https://formsubmit.co/ajax/chris@trueliftgaragedoor.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
  .then(function(r){return r.json().catch(function(){return {};});})
  .then(function(res){
   if(String(res.success)==='true'){form.reset();say('Thanks - we received your request. True Lift will contact you to confirm availability and the next step. If the door appears unsafe, stop using it and call 435-900-4557.','ok');}
   else{say('We could not send your request. Call or text 435-900-4557, or try again.','error');}
  })
  .catch(function(){say('We could not send your request. Call or text 435-900-4557, or try again.','error');})
  .then(function(){submit.disabled=false;});
});
var textBtn=document.getElementById('request-text');
if(textBtn)textBtn.addEventListener('click',function(){
 var lines=['Service request from trueliftgaragedoor.com','Name: '+(v('first-name')+' '+v('last-name')).trim(),
  'Phone: '+v('phone'),v('email')?'Email: '+v('email'):'','Prefers: '+method(),'Service: '+v('service-needed'),
  'City or ZIP: '+v('city'),'The door: '+v('door-description')].filter(Boolean);
 window.location.href='sms:+14359004557?&body='+encodeURIComponent(lines.join('\n'));
});
})();