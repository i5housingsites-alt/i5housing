/* i5 Housing & Properties — shared site script (every page) */
/* ---------- Hamburger menu (same list as the live site menu) ---------- */
(function(){
  const btn=document.getElementById("menuBtn"),nav=document.querySelector(".header .nav");if(!btn||!nav)return;
  const links=[["Home","index.html"],["Projects","index.html#projects"],["Contact Us","contact.html"],["i5 Builders","https://i5builders.in/"],["About Us","about.html"],["Blog","https://i5housing.com/blog/"],["MD Profile","about.html#founder"],["NRI Guidelines","nri.html"],["Awards","awards.html"],["Gallery","gallery.html"],["Completed Projects","completed-projects.html"],["Testimonials","testimonials.html"],["FAQ","faq.html"],["Careers","careers.html"],["Privacy","privacy.html"],["Terms and Conditions","terms.html"]];
  const here=location.pathname.split("/").pop()||"index.html";
  const panel=document.createElement("nav");panel.className="menu-panel";panel.id="menuPanel";panel.setAttribute("aria-label","Site menu");
  panel.innerHTML=links.map(([t,h])=>"<a href=\""+h+"\""+(h.startsWith("http")?" target=\"_blank\" rel=\"noopener\"":"")+(h===here?" class=\"is-current\" aria-current=\"page\"":"")+">"+t+"</a>").join("");
  /* links already in the header nav are hidden on desktop by CSS (.in-nav); .md = nav hides it below 1050px */
  const inNav=new Map([...document.querySelectorAll("#navLinks a")].map(a=>[a.getAttribute("href"),a.classList.contains("hide-md")]));
  panel.querySelectorAll("a").forEach(a=>{const h=a.getAttribute("href");if(inNav.has(h)){a.classList.add("in-nav");if(inNav.get(h))a.classList.add("md")}});
  nav.appendChild(panel);
  const set=o=>{panel.classList.toggle("show",o);btn.setAttribute("aria-expanded",o);btn.setAttribute("aria-label",o?"Close menu":"Open menu")};
  btn.addEventListener("click",()=>set(!panel.classList.contains("show")));
  panel.addEventListener("click",e=>{if(e.target.closest("a"))set(false)});
  document.addEventListener("click",e=>{if(!nav.contains(e.target))set(false)});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&panel.classList.contains("show")){set(false);btn.focus()}});
})();
/* ---------- Header: slide up while scrolling down, back down on scroll up or when scrolling stops ---------- */
(function(){
  const h=document.querySelector(".header");if(!h)return;
  let last=scrollY,t=null;
  addEventListener("scroll",()=>{
    const y=scrollY,open=document.querySelector(".menu-panel.show");
    if(y>last&&y>120&&!open)h.classList.add("is-up");else if(y<last)h.classList.remove("is-up");
    last=y;clearTimeout(t);t=setTimeout(()=>h.classList.remove("is-up"),250);
  },{passive:true});
})();
/* ---------- FAQ accordions ---------- */
document.querySelectorAll('.faq-question').forEach(q=>{const it=q.parentElement;q.setAttribute('aria-expanded',it.classList.contains('open'));q.addEventListener('click',()=>{const o=it.classList.toggle('open');q.setAttribute('aria-expanded',o)})});
/* ---------- Home contact form (demo) ---------- */
(function(){const f=document.getElementById('contactForm');if(!f)return;f.addEventListener('submit',e=>{e.preventDefault();document.getElementById('formStatus').textContent='Thank you! Your response is noted — our team will get back to you shortly.'})})();
/* ---------- Footer year ---------- */
(function(){const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear()})();

/* ---------- Awards carousel ---------- */
(function(){
  const root=document.getElementById('awCarousel');if(!root)return;
  const slides=[...root.querySelectorAll('.aw-slide')],tabs=[...root.querySelectorAll('.aw-tab')],DUR=6000,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i=0,t=null,paused=false,sx=null;root.style.setProperty('--aw-dur',DUR+'ms');
  function go(n){i=(n+slides.length)%slides.length;
    slides.forEach((s,k)=>{const on=k===i;s.classList.toggle('is-active',on);on?s.removeAttribute('aria-hidden'):s.setAttribute('aria-hidden','true')});
    tabs.forEach(b=>b.classList.remove('is-active'));void root.offsetWidth;tabs[i].classList.add('is-active');tabs.forEach((b,k)=>b.setAttribute('aria-current',k===i));
    plan();}
  function plan(){clearTimeout(t);if(!paused&&!reduce)t=setTimeout(()=>go(i+1),DUR)}
  function pause(p){paused=p;root.classList.toggle('is-paused',p);p?clearTimeout(t):go(i)}
  tabs.forEach(b=>b.addEventListener('click',()=>go(+b.dataset.i)));
  root.querySelectorAll('.aw-arrow').forEach(b=>b.addEventListener('click',()=>go(i+ +b.dataset.dir)));
  root.addEventListener('mouseenter',()=>pause(true));root.addEventListener('mouseleave',()=>pause(false));
  root.addEventListener('focusin',()=>pause(true));root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget))pause(false)});
  root.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(i-1);if(e.key==='ArrowRight')go(i+1)});
  root.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  root.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>40)go(i+(dx<0?1:-1))});
  /* start only once the section is on screen */
  if('IntersectionObserver' in window){let started=false;new IntersectionObserver((es,o)=>{if(es[0].isIntersecting&&!started){started=true;go(0);o.disconnect()}},{threshold:.35}).observe(root)}else go(0);
  document.addEventListener('visibilitychange',()=>{document.hidden?clearTimeout(t):plan()});
})();

/* ---------- Voice of trust player ---------- */
(function(){
  const player=document.getElementById('votPlayer');if(!player)return;
  const items=[...document.querySelectorAll('.vot-item')],titleEl=document.getElementById('votTitle'),subEl=document.getElementById('votSub'),ytLink=document.getElementById('votYt');
  function embed(url){
    const src=url+(url.includes('?')?'&':'?')+'autoplay=1&rel=0&playsinline=1';
    player.innerHTML='<iframe width="560" height="315" src="'+src+'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    player.dataset.embed=url;
  }
  player.addEventListener('click',e=>{if(e.target.closest('.vot-poster'))embed(player.dataset.embed)});
  items.forEach(btn=>btn.addEventListener('click',()=>{
    items.forEach(b=>{const on=b===btn;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',on)});
    const [t,sub]=btn.dataset.title.split(' — ');titleEl.textContent=t;subEl.textContent=sub||'';
    ytLink.href='https://www.youtube.com/watch?v='+btn.dataset.id;
    embed(btn.dataset.embed);
    if(innerWidth<=950)player.scrollIntoView({behavior:'smooth',block:'center'});
    btn.scrollIntoView({behavior:'smooth',block:'nearest',inline:'nearest'});
  }));
})();

/* ---------- Hero banner slider ---------- */
(function(){
  const slider=document.getElementById('bannerSlider');if(!slider)return;
  const slides=[...slider.querySelectorAll('.banner-slide')],controls=slider.parentElement.querySelector('.banner-controls'),
        dotsWrap=controls.querySelector('.banner-dots'),count=controls.querySelector('.banner-count'),
        DURATION=5000,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,pad=n=>String(n).padStart(2,'0');
  let i=0,timer=null,paused=false,startX=null;
  controls.style.setProperty('--dur',DURATION+'ms');
  const dots=slides.map((s,n)=>{const d=document.createElement('button');d.type='button';d.className='banner-dot';d.setAttribute('role','tab');
    d.setAttribute('aria-label','Show banner '+(n+1)+': '+s.getAttribute('aria-label'));d.addEventListener('click',()=>go(n,true));dotsWrap.appendChild(d);return d});
  function go(n,user){
    i=(n+slides.length)%slides.length;
    slides.forEach((s,k)=>{const on=k===i;s.classList.toggle('is-active',on);s.setAttribute('aria-hidden',!on);s.tabIndex=on?0:-1;
      if(on){const img=s.querySelector('img');img.loading='eager'}});
    dots.forEach((d,k)=>{d.classList.remove('is-active');d.setAttribute('aria-selected',k===i)});
    void dotsWrap.offsetWidth;dots[i].classList.add('is-active'); /* restart progress fill */
    count.innerHTML='<b>'+pad(i+1)+'</b> / '+pad(slides.length);
    schedule();
  }
  function schedule(){clearTimeout(timer);if(!paused&&!reduce)timer=setTimeout(()=>go(i+1),DURATION)}
  function setPaused(p){paused=p;controls.classList.toggle('is-paused',p);if(p)clearTimeout(timer);else go(i)}
  slider.querySelector('.prev').addEventListener('click',e=>{e.preventDefault();go(i-1,true)});
  slider.querySelector('.next').addEventListener('click',e=>{e.preventDefault();go(i+1,true)});
  slider.addEventListener('mouseenter',()=>setPaused(true));slider.addEventListener('mouseleave',()=>setPaused(false));
  slider.addEventListener('focusin',()=>setPaused(true));slider.addEventListener('focusout',e=>{if(!slider.contains(e.relatedTarget))setPaused(false)});
  slider.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){go(i-1,true)}else if(e.key==='ArrowRight'){go(i+1,true)}});
  slider.addEventListener('touchstart',e=>{startX=e.touches[0].clientX},{passive:true});
  slider.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX;startX=null;if(Math.abs(dx)>40){go(i+(dx<0?1:-1),true)}});
  document.addEventListener('visibilitychange',()=>{document.hidden?clearTimeout(timer):schedule()});
  go(0);
})();

/* ---------- Gallery tabs ---------- */
(function(){
  document.querySelectorAll('[data-gtabs]').forEach(wrap=>{
    const tabs=[...wrap.querySelectorAll('.gtab')];
    const panels=tabs.map(t=>document.getElementById(t.getAttribute('aria-controls')));
    function show(i){tabs.forEach((t,k)=>{const on=k===i;t.classList.toggle('is-active',on);t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;if(panels[k])panels[k].hidden=!on});}
    tabs.forEach((t,i)=>{t.addEventListener('click',()=>{show(i);history.replaceState(null,'','#'+t.dataset.slug)});
      t.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const n=(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;show(n);tabs[n].focus()}})});
    const fromHash=()=>tabs.findIndex(t=>'#'+t.dataset.slug===location.hash);
    show(Math.max(fromHash(),0));
    window.addEventListener('hashchange',()=>{const k=fromHash();if(k>-1)show(k)});
  });
})();

/* ---------- Lightbox (any link with data-lightbox="group") ---------- */
(function(){
  const links=[...document.querySelectorAll('a[data-lightbox]')];if(!links.length)return;
  const lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Photo viewer');
  lb.innerHTML='<img alt=""><button type="button" class="lb-close" aria-label="Close">×</button><button type="button" class="lb-prev" aria-label="Previous photo">‹</button><button type="button" class="lb-next" aria-label="Next photo">›</button><div class="lb-count" aria-live="polite"></div>';
  document.body.appendChild(lb);
  const img=lb.querySelector('img'),count=lb.querySelector('.lb-count');let group=[],i=0,last=null;
  function show(n){i=(n+group.length)%group.length;const a=group[i];img.src=a.href;img.alt=(a.querySelector('img')||{}).alt||'';count.textContent=(i+1)+' / '+group.length}
  function open(a){last=a;group=links.filter(l=>l.dataset.lightbox===a.dataset.lightbox&&l.offsetParent!==null);show(group.indexOf(a));lb.classList.add('open');document.body.style.overflow='hidden';lb.querySelector('.lb-close').focus()}
  function close(){lb.classList.remove('open');document.body.style.overflow='';img.removeAttribute('src');if(last)last.focus()}
  links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();open(a)}));
  lb.querySelector('.lb-close').addEventListener('click',close);
  lb.querySelector('.lb-prev').addEventListener('click',()=>show(i-1));
  lb.querySelector('.lb-next').addEventListener('click',()=>show(i+1));
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)});
  let sx=null;lb.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>40)show(i+(dx<0?1:-1))});
})();

/* ---------- Video cards: play YouTube in place ---------- */
(function(){
  document.querySelectorAll('.vcard[data-embed]').forEach(card=>card.addEventListener('click',()=>{
    if(card.querySelector('iframe'))return;
    const u=card.dataset.embed;const src=u+(u.includes('?')?'&':'?')+'autoplay=1&rel=0&playsinline=1';
    card.innerHTML='<iframe src="'+src+'" title="'+(card.getAttribute('aria-label')||'YouTube video')+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
  }));
})();

/* ---------- FAQ categories: highlight + scroll ---------- */
(function(){
  const cats=[...document.querySelectorAll('.faq-cat')];if(!cats.length)return;
  const groups=cats.map(c=>document.getElementById(c.dataset.target));
  cats.forEach((c,i)=>c.addEventListener('click',()=>{groups[i].scrollIntoView({behavior:'smooth',block:'start'})}));
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){const k=groups.indexOf(e.target);cats.forEach((c,j)=>c.classList.toggle('is-active',j===k))}})},{rootMargin:'-30% 0px -60% 0px'});groups.forEach(g=>g&&io.observe(g))}
})();

/* ---------- Completed projects search ---------- */
(function(){
  const input=document.getElementById('projSearch');if(!input)return;
  const tiles=[...document.querySelectorAll('.ptile')],empty=document.getElementById('projEmpty'),count=document.getElementById('projCount');
  function run(){const q=input.value.trim().toLowerCase();let n=0;tiles.forEach(t=>{const ok=!q||t.dataset.search.includes(q);t.hidden=!ok;if(ok)n++});empty.hidden=n>0;count.textContent=n}
  input.addEventListener('input',run);run();
})();

/* ---------- Quick enquiry forms (demo: shows a confirmation) ---------- */
(function(){
  document.querySelectorAll('form.qform').forEach(f=>f.addEventListener('submit',e=>{
    e.preventDefault();
    const phone=f.querySelector('input[type=tel]');
    if(phone&&!/^[0-9+\s-]{10,15}$/.test(phone.value.trim())){phone.setCustomValidity('Enter a valid 10-digit mobile number');phone.reportValidity();phone.addEventListener('input',()=>phone.setCustomValidity(''),{once:true});return}
    f.classList.add('sent');
  }));
})();

/* ---------- Sticky social dock (built once here so every page gets it) ---------- */
(function(){
  if(document.querySelector('.dock'))return;
  const ICON={
    instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.2"/><path d="M17.5 6.5h.01"/></svg>',
    facebook:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 2.5h-3a4.5 4.5 0 0 0-4.5 4.5v3H7v4h2.5v7.5h4V14H16l1-4h-3.5V7a1 1 0 0 1 1-1H17z"/></svg>',
    youtube:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.6 17a24 24 0 0 1 0-10A2 2 0 0 1 4 5.6a49.6 49.6 0 0 1 16 0A2 2 0 0 1 21.4 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16 0A2 2 0 0 1 2.6 17"/><path d="m10 15 5-3-5-3z"/></svg>',
    linkedin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>'
  };
  const links=[
    ['whatsapp','WhatsApp','https://wa.me/917200141515','<img src="images/icons/whatsapp.png" alt="">'],
    ['instagram','Instagram','https://www.instagram.com/i5housingpropertytrend/',ICON.instagram],
    ['facebook','Facebook','https://www.facebook.com/i5housingandproperties',ICON.facebook],
    ['youtube','YouTube','https://www.youtube.com/@i5housingproperties',ICON.youtube],
    ['linkedin','LinkedIn','https://www.linkedin.com/company/i5-housing-properties/',ICON.linkedin],
    ['call','Call us','tel:7667005000','<img src="images/icons/phone.png" alt="">']
  ];
  const ctaHref=document.getElementById('contact')?'#contact':'contact.html#enquire';
  const dock=document.createElement('nav');
  dock.className='dock';dock.setAttribute('aria-label','Contact and social media');
  dock.innerHTML='<a class="dock-logo" href="index.html" aria-label="i5 Housing & Properties home"><img src="images/i5-logo-transparent.png" alt=""></a>'+
    '<div class="dock-links">'+links.map(([k,label,href,icon])=>'<a class="dock-link" data-net="'+k+'" href="'+href+'"'+(href.startsWith('http')?' target="_blank" rel="noopener"':'')+' aria-label="'+label+'" title="'+label+'">'+icon+'<span>'+label+'</span></a>').join('')+'</div>'+
    '<a class="dock-cta" href="'+ctaHref+'"><span class="full">Book a Site Visit</span><span class="short">Site Visit</span><i class="ico-arrow" aria-hidden="true"></i></a>';
  document.body.appendChild(dock);document.body.classList.add('has-dock');
  /* step aside while the footer is on screen so its links stay reachable */
  const footer=document.querySelector('.footer');
  if(footer&&'IntersectionObserver' in window){
    new IntersectionObserver(es=>dock.classList.toggle('is-hidden',es[0].isIntersecting),{rootMargin:'0px 0px -60px 0px'}).observe(footer);
  }
})();

/* ---------- Scroll reveal: fade content up as it enters the viewport ---------- */
(function(){
  if(!('IntersectionObserver' in window))return;
  const els=new Set(document.querySelectorAll('main section .container > *, main section [class*="-grid"] > *'));
  /* don't double-animate a grid and its own children */
  els.forEach(el=>{if(/-grid\b/.test(el.className)&&el.children.length)els.delete(el)});
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
  els.forEach(el=>{
    const k=[...el.parentElement.children].indexOf(el);
    el.style.setProperty('--rd',Math.min(k,5)*0.08+'s');
    el.classList.add('reveal');io.observe(el);
  });
})();

/* ---------- Stats: count up from 0 when the row scrolls into view ---------- */
(function(){
  const els=[...document.querySelectorAll('.stat strong')];
  if(!els.length||!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;io.unobserve(e.target);
    const el=e.target,[,num,suf]=el.dataset.final.match(/^([\d.]+)(.*)$/),end=+num,t0=performance.now(),DUR=1800;
    (function tick(t){const p=Math.min((t-t0)/DUR,1),v=end*(1-Math.pow(1-p,3));el.textContent=(p<1?Math.floor(v):end)+suf;if(p<1)requestAnimationFrame(tick)})(t0);
  }),{threshold:.6});
  els.forEach(el=>{const m=el.textContent.trim().match(/^([\d.]+)(.*)$/);if(!m)return;el.dataset.final=m[0];el.textContent='0'+m[2];io.observe(el)});
})();
