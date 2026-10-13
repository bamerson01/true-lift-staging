/* Homepage motion prototype. Core content/interactions work without this file. */
(async () => {
  if (!document.querySelector('.hero-focused')) return;
  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
  try {
    await load('/true-lift-staging/assets/vendor/gsap/gsap.min.js');
    await Promise.all([
      load('/true-lift-staging/assets/vendor/gsap/ScrollTrigger.min.js'),
      load('/true-lift-staging/assets/vendor/gsap/DrawSVGPlugin.min.js')
    ]);
  } catch { return; } // Retain the original CSS motion and working controls.
  const { gsap, ScrollTrigger, DrawSVGPlugin } = window;
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet'; sheet.href = '/true-lift-staging/assets/home-motion.css?v=025197a22c73';
  document.head.append(sheet);
  await document.fonts.ready;

  const explorer = document.querySelector('.system-visual');
  const svg = explorer.querySelector('.door-diagram');
  const controls = explorer.querySelector('.part-controls');
  const description = explorer.querySelector('.part-description');
  const service = explorer.querySelector('.diagram-service-link');
  const panels = explorer.querySelector('.door-panels');
  const toggle = explorer.querySelector('.door-toggle');
  const carriage = document.createElementNS(svg.namespaceURI, 'g');
  carriage.classList.add('motion-carriage');
  panels.before(carriage); carriage.append(panels);
  const replay = document.createElement('button');
  replay.type = 'button'; replay.className = 'system-replay';
  replay.textContent = '↻ Replay reveal'; replay.hidden = true;
  replay.setAttribute('aria-label', 'Replay the garage door illustration reveal');
  const toolbarActions = document.createElement('div');
  toolbarActions.className = 'diagram-motion-actions';
  toggle.before(toolbarActions); toolbarActions.append(replay, toggle);
  const hint = document.createElement('p');
  hint.className = 'system-hint'; hint.textContent = 'Choose a part to see how it works.';
  controls.before(hint);
  document.body.classList.add('home-motion-ready');

  const media = gsap.matchMedia();
  media.add({ animate: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 768px)' }, context => {
    if (!context.conditions.animate) return;
    const desktop = context.conditions.desktop;
    document.body.classList.add('home-motion-active');
    replay.hidden = false;
    const disposers = [];
    const bind = (element, event, callback) => {
      const safe = context.add(null, callback);
      element.addEventListener(event, safe);
      disposers.push(() => element.removeEventListener(event, safe));
    };
    const resetShapes = [...svg.querySelectorAll('[pathLength]')].map(el => [el, el.getAttribute('pathLength')]);
    resetShapes.forEach(([el]) => el.removeAttribute('pathLength'));
    const frame = [...svg.querySelectorAll('.diagram-frame path')];
    const markers = [...svg.querySelectorAll('.part-marker')];
    const groups = [...svg.querySelectorAll('svg > [data-door-part]')];
    const geometry = group => [...group.querySelectorAll('path,rect,circle')].filter(el =>
      !el.closest('.part-marker') && !el.classList.contains('sensor-beam'));
    let reveal;
    const finishReveal = () => { if (reveal && reveal.progress() < 1) reveal.progress(1); };
    const revealSystem = context.add(null, () => {
      finishReveal();
      if (reveal) reveal.kill();
      reveal = gsap.timeline({ defaults: { ease: 'power2.out' } });
      reveal.fromTo(frame, { drawSVG: '0%' }, { drawSVG: '100%', duration: .8, stagger: .08 }, 0);
      groups.forEach((group, i) => {
        reveal.fromTo(geometry(group), { drawSVG: '0%' }, { drawSVG: '100%', duration: .65 }, .18 + i * .11);
      });
      reveal.fromTo(markers, { opacity: .2 }, { opacity: 1, duration: .4, stagger: .035 }, .75);
      reveal.fromTo(explorer, { '--system-trace': '0%' }, { '--system-trace': '100%', duration: 1.2 }, 0);
    });
    ScrollTrigger.create({ trigger: explorer, start: 'top 78%', once: true, onEnter: revealSystem });
    bind(replay, 'click', revealSystem);

    // Existing app.js owns selected state, live text and links. This layer only
    // animates the resulting state; rapid clicks overwrite prior transitions.
    const partGroups = [...svg.querySelectorAll('[data-door-part]')];
    gsap.set(partGroups, { color: i => partGroups[i].classList.contains('is-active') ? '#9dcc55' : '#84969e' });
    gsap.set(carriage, { y: explorer.classList.contains('is-open') ? -169 : 0 });
    bind(controls, 'click', event => {
      const button = event.target.closest('button[data-part]');
      if (!button) return;
      finishReveal();
      const selected = button.dataset.part;
      partGroups.forEach(group => gsap.to(group, {
        color: group.dataset.doorPart === selected ? '#a8d65e' : '#73858d',
        duration: .35, overwrite: true
      }));
      const chosen = partGroups.filter(group => group.dataset.doorPart === selected);
      const leaders = chosen.flatMap(group => [...group.querySelectorAll('.part-leader')]);
      const rings = chosen.flatMap(group => [...group.querySelectorAll('.part-marker circle')]);
      gsap.fromTo(leaders, { drawSVG: '0%' }, { drawSVG: '100%', duration: .45, overwrite: true });
      gsap.fromTo(rings, { strokeWidth: 3.5 }, { strokeWidth: 1.5, duration: .65, overwrite: true });
      gsap.fromTo([description, service], { opacity: .65 }, { opacity: 1, duration: .3, stagger: .04, overwrite: true });
      gsap.fromTo(explorer, { '--system-trace': '12%' }, { '--system-trace': '100%', duration: .55, overwrite: true });
    });
    bind(toggle, 'click', () => {
      finishReveal();
      gsap.to(carriage, { y: explorer.classList.contains('is-open') ? -169 : 0, duration: .95, ease: 'power2.inOut', overwrite: true });
    });

    // Brief whole-element entrance, with no character splitting or scroll lock.
    gsap.fromTo('.hero-copy > .eyebrow, .hero-copy > h1, .hero-copy > .lead',
      { opacity: .6 }, { opacity: 1, duration: .3, stagger: .04, ease: 'power2.out', clearProps: 'transform,opacity' });

    const arrive = (trigger, targets, extra = {}) => ScrollTrigger.create({
      trigger, start: 'top 88%', once: true,
      onEnter: context.add(null, () => gsap.fromTo(targets, { opacity: .65 },
        { opacity: 1, duration: .3, stagger: .04, ease: 'power2.out', clearProps: 'transform,opacity', ...extra }))
    });
    arrive('.team-layout', '.team-image, .team-copy');
    arrive('.service-grid', '.service');
    arrive('.method-layout', '.method-layout figure, .method-steps li');
    arrive('.testimonial-layout', '.video-review, .review-carousel');
    document.querySelectorAll('.process-grid li').forEach(step => {
      arrive(step, step);
      ScrollTrigger.create({ trigger: step, start: 'top 84%', once: true,
        onEnter: context.add(null, () => gsap.fromTo(step, { '--step-progress': '0%' },
          { '--step-progress': '100%', duration: .75, ease: 'power2.out' })) });
    });
    document.querySelectorAll('.team-image img, .method-layout figure img').forEach(photo => {
      ScrollTrigger.create({ trigger: photo, start: 'top 85%', once: true,
        onEnter: context.add(null, () => gsap.fromTo(photo, { scale: 1.025 },
          { scale: 1, duration: .9, ease: 'power2.out', clearProps: 'transform' })) });
    });
    ScrollTrigger.refresh();
    return () => {
      disposers.forEach(dispose => dispose());
      resetShapes.forEach(([el, value]) => el.setAttribute('pathLength', value));
      replay.hidden = true;
      document.body.classList.remove('home-motion-active');
    };
  });
})();
