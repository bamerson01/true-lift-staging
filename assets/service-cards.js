/* Explicit, keyboard-accessible detail cards; no hover-only information.
   Multi-column grids keep every card in place and show details in a full-width
   panel after the selected card's row. Single-column layouts expand in place. */
(() => {
  const grid = document.querySelector('.service-index');
  const cards = [...document.querySelectorAll('.service-card')];
  if (!grid || !cards.length) return;
  const panel = document.createElement('div');
  panel.className = 'service-card service-card-panel is-open';
  panel.hidden = true;
  const backs = new Map(cards.map(card => [card, card.querySelector('.service-card-back')]));
  let current = null;

  const columns = () => getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;
  const label = (card, open) => {
    const button = card.querySelector('.card-open');
    button.setAttribute('aria-expanded', String(open));
    button.firstChild.textContent = open ? 'Hide details ' : 'View details ';
    button.querySelector('span').textContent = open ? '−' : '+';
  };

  const place = card => {
    const back = backs.get(card);
    const front = card.querySelector('.service-card-front');
    const cols = columns();
    const hadFocus = back.contains(document.activeElement) ? document.activeElement : null;
    if (cols > 1) {
      const index = cards.indexOf(card);
      const rowEnd = Math.min(cards.length - 1, Math.ceil((index + 1) / cols) * cols - 1);
      card.classList.remove('is-open');
      card.classList.add('is-selected');
      front.hidden = false;
      panel.append(back);
      cards[rowEnd].after(panel);
      panel.hidden = false;
    } else {
      card.classList.remove('is-selected');
      card.classList.add('is-open');
      front.hidden = true;
      card.append(back);
      panel.hidden = true;
    }
    back.hidden = false;
    if (hadFocus) hadFocus.focus({ preventScroll: true });
  };

  const close = (card, focus = true) => {
    const back = backs.get(card);
    back.hidden = true;
    card.append(back);
    card.querySelector('.service-card-front').hidden = false;
    card.classList.remove('is-open', 'is-selected');
    panel.hidden = true;
    label(card, false);
    current = null;
    card.dispatchEvent(new Event('service-card-change', { bubbles: true }));
    if (focus) card.querySelector('.card-open').focus({ preventScroll: true });
  };

  const open = card => {
    if (current && current !== card) close(current, false);
    current = card;
    place(card);
    label(card, true);
    card.dispatchEvent(new Event('service-card-change', { bubbles: true }));
    backs.get(card).querySelector('.card-close').focus({ preventScroll: true });
    const target = panel.hidden ? card : panel;
    const rect = target.getBoundingClientRect();
    if (rect.top < 90 || rect.top > innerHeight * 0.6) target.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  cards.forEach(card => {
    const button = card.querySelector('.card-open');
    const back = backs.get(card);
    button.hidden = false;
    card.querySelector('.card-fallback').hidden = true;
    button.addEventListener('click', () => (current === card ? close(card) : open(card)));
    back.querySelector('.card-close').addEventListener('click', () => close(card));
    back.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); close(card); }
    });
  });

  let pending = 0;
  addEventListener('resize', () => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => { if (current) place(current); });
  });
})();
