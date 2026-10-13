/* Supporting-page motion. Existing scripts own controls and content state. */
(async () => {
  if (document.querySelector('.hero-focused')) return;
  const main = document.querySelector('main');
  if (!main) return;
  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src; script.onload = resolve; script.onerror = reject;
    document.head.append(script);
  });
  const illustrations = [...main.querySelectorAll('.system-visual, .spring-explorer, .overhaul-explorer, .opener-system, .door-options-explorer, .maintenance-explorer, .unsafe-explorer')];
  try {
    await load('/true-lift-staging/assets/vendor/gsap/gsap.min.js');
    await Promise.all([
      load('/true-lift-staging/assets/vendor/gsap/ScrollTrigger.min.js'),
      ...(illustrations.length ? [load('/true-lift-staging/assets/vendor/gsap/DrawSVGPlugin.min.js')] : [])
    ]);
  } catch { return; } // Content stays visible and the original controls still work.
  const { gsap, ScrollTrigger, DrawSVGPlugin } = window;
  gsap.registerPlugin(ScrollTrigger);
  if (DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);
  await document.fonts.ready;
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet'; sheet.href = '/true-lift-staging/assets/site-motion.css?v=ce55c1045ef8';
  document.head.append(sheet);
  document.body.classList.add('site-motion-ready');

  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', context => {
    document.body.classList.add('site-motion-active');
    const disposers = [];
    const once = (element, callback) => ScrollTrigger.create({
      trigger: element, start: 'top 88%', once: true,
      onEnter: context.add(null, callback)
    });
    const entrance = elements => gsap.fromTo(elements,
      { opacity: .65 },
      { opacity: 1, duration: .3, stagger: .04, ease: 'power2.out', clearProps: 'transform,opacity' });
    const hero = main.querySelector('#top');
    if (hero) {
      const title = hero.querySelector('h1');
      const copy = title?.parentElement;
      const lines = copy ? [...copy.children].filter(el => el.matches('.eyebrow,h1,p:not(.breadcrumbs)')) : [];
      if (lines.length) once(title, () => entrance(lines));
      const photo = hero.querySelector('figure, .services-hero-photo');
      if (photo) once(photo, () => entrance(photo));
    }
    // Legal prose and utility forms stay still; just their page heading arrives.
    if (!main.querySelector('.legal-document')) {
      const selector = [
        '.section-heading', '.service-detail', '.service-index > a', '.service-card', '.service-directory article',
        '.process-grid > li', '.spring-steps > li', '.visit-timeline > li',
        '.maintenance-visit-steps > li', '.unsafe-steps > li', '.door-consultation-steps > li',
        '.opener-inspection > li', '.option-grid > article', '.opener-choice-grid > article',
        '.upgrade-grid > article', '.about-review-grid > figure', '.spring-quote',
        '.area-group', '.areas-availability article', '.spring-team-layout',
        '.about-story-layout > figure', '.expect-truck-layout > figure',
        '.services-closing h2', '.opener-equipment-photo', '.spring-photo-example'
      ].join(',');
      const targets = [...main.querySelectorAll(selector)].filter(el => !hero?.contains(el));
      targets.filter(el => !targets.some(parent => parent !== el && parent.contains(el))).forEach(el => {
        once(el, () => entrance(el));
      });
    }
    illustrations.forEach(panel => {
      const svg = panel.querySelector('svg');
      if (!svg) return;
      // Trace only the static linework. Never translate an unsafe or broken door.
      const paths = [...svg.querySelectorAll('path,rect,line,polyline,circle,ellipse')].filter(el =>
        !el.closest('defs,clipPath,mask') && !el.classList.contains('sensor-beam') &&
        getComputedStyle(el).stroke !== 'none');
      const normalized = paths.filter(el => el.hasAttribute('pathLength')).map(el => [el,el.getAttribute('pathLength')]);
      normalized.forEach(([el]) => el.removeAttribute('pathLength'));
      let trace;
      once(panel, () => {
        trace = gsap.fromTo(paths, { drawSVG: '0%' }, {
          drawSVG: '100%', duration: .8, stagger: { amount: .35 }, ease: 'power2.out',
          clearProps: 'strokeDasharray,strokeDashoffset'
        });
      });
      const scope = panel.closest('.opener-diagnostic') || panel;
      const buttons = scope.querySelectorAll('button[data-part],button[data-spring-state],button[data-wear],button[data-opener-symptom],button[data-door-option],button[data-maintenance],button[data-unsafe]');
      buttons.forEach(button => {
        const respond = context.add(null, () => {
          if (trace) trace.progress(1);
          const descriptions = [...scope.querySelectorAll('[data-wear-copy],[data-opener-copy],[data-door-copy],[data-maintenance-copy],[data-unsafe-copy],.part-description,.spring-explorer figcaption')].filter(el => !el.hidden);
          if (descriptions.length) gsap.fromTo(descriptions, { opacity: .65 }, {
            opacity: 1, duration: .3, ease: 'power2.out', overwrite: true,
            clearProps: 'transform,opacity'
          });
        });
        button.addEventListener('click', respond);
        disposers.push(() => button.removeEventListener('click', respond));
      });
      disposers.push(() => normalized.forEach(([el,value]) => el.setAttribute('pathLength',value)));
    });
    // Lazy-loaded media can change section positions after initialization.
    const refresh = () => ScrollTrigger.refresh();
    main.addEventListener('service-card-change', refresh);
    disposers.push(() => main.removeEventListener('service-card-change', refresh));
    main.querySelectorAll('img').forEach(img => {
      if (!img.complete) { img.addEventListener('load',refresh,{once:true}); disposers.push(() => img.removeEventListener('load',refresh)); }
    });
    ScrollTrigger.refresh();
    return () => {
      disposers.forEach(dispose => dispose());
      document.body.classList.remove('site-motion-active');
    };
  });
})();
