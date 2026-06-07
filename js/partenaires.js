/* ════════════════════════════════════════════════════════════════
   PARTENAIRES — données + recherche + filtres + fiche détail
   ----------------------------------------------------------------
   👉 POUR AJOUTER / MODIFIER UN PARTENAIRE : éditez le tableau
   PARTENAIRES ci-dessous. Chaque partenaire = un objet { ... }.
   Les menus déroulants (secteur / zone) se remplissent tout seuls.

   Champs :
     nom      : nom du partenaire (obligatoire)
     secteur  : secteur d'activité (sert au filtre)
     zone     : zone géographique / région (sert au filtre)
     ville    : ville précise (affichée)
     icone    : un emoji représentatif (facultatif)
     desc     : description courte affichée dans la fiche
     tel      : téléphone (facultatif)
     email    : e-mail (facultatif)
     site     : site web, ex "https://..." (facultatif)
   ════════════════════════════════════════════════════════════════ */
const PARTENAIRES = [
  {
    nom: "Horizon Immobilier",
    secteur: "Agence immobilière",
    zone: "Auvergne-Rhône-Alpes",
    ville: "Lyon (69)",
    icone: "🏠",
    desc: "Agence immobilière indépendante spécialisée dans l'achat-revente et l'investissement locatif sur la métropole lyonnaise. Nous orientons nos clients investisseurs vers DP Conseil pour structurer leur financement et leur fiscalité.",
    tel: "04 00 00 00 00",
    email: "contact@horizon-immobilier.fr",
    site: ""
  },
  {
    nom: "Étude Maître Lefèvre",
    secteur: "Notaire",
    zone: "Île-de-France",
    ville: "Paris (75)",
    icone: "⚖️",
    desc: "Office notarial accompagnant familles et chefs d'entreprise sur les successions, donations et transmissions de patrimoine. Collaboration étroite pour optimiser les stratégies de transmission.",
    tel: "01 00 00 00 00",
    email: "contact@etude-lefevre.fr",
    site: ""
  },
  {
    nom: "Cabinet Durand & Associés",
    secteur: "Expert-comptable",
    zone: "Nouvelle-Aquitaine",
    ville: "Bordeaux (33)",
    icone: "📊",
    desc: "Cabinet d'expertise comptable au service des TPE/PME et professions libérales. Nous travaillons main dans la main pour l'optimisation de la rémunération du dirigeant et la préparation de la retraite.",
    tel: "05 00 00 00 00",
    email: "contact@durand-associes.fr",
    site: ""
  },
  {
    nom: "Crédit Conseil Sud",
    secteur: "Courtier en crédit",
    zone: "Provence-Alpes-Côte d'Azur",
    ville: "Marseille (13)",
    icone: "💳",
    desc: "Courtier en crédit immobilier et regroupement de crédits. Nous orientons nos clients vers DP Conseil pour l'assurance emprunteur et la mise en place d'une stratégie patrimoniale globale.",
    tel: "04 00 00 00 01",
    email: "contact@credit-conseil-sud.fr",
    site: ""
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const grid       = document.getElementById('partners-grid');
  const inputEl    = document.getElementById('partner-q');
  const sectorEl   = document.getElementById('partner-sector');
  const zoneEl     = document.getElementById('partner-zone');
  const countEl    = document.getElementById('partner-count');
  if (!grid) return;

  /* — Remplit un <select> avec les valeurs uniques d'un champ — */
  const fillSelect = (el, field, labelAll) => {
    if (!el) return;
    const values = [...new Set(PARTENAIRES.map(p => p[field]).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));
    el.innerHTML = `<option value="">${labelAll}</option>` +
      values.map(v => `<option value="${v}">${v}</option>`).join('');
  };
  fillSelect(sectorEl, 'secteur', 'Tous les secteurs');
  fillSelect(zoneEl,   'zone',    'Toutes les régions');

  const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  /* — Filtre + rendu — */
  const render = () => {
    const q      = norm(inputEl ? inputEl.value : '');
    const sector = sectorEl ? sectorEl.value : '';
    const zone   = zoneEl ? zoneEl.value : '';

    const results = PARTENAIRES.filter(p => {
      if (sector && p.secteur !== sector) return false;
      if (zone && p.zone !== zone) return false;
      if (q) {
        const hay = norm([p.nom, p.secteur, p.zone, p.ville, p.desc].join(' '));
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (countEl) {
      countEl.textContent = results.length === 0
        ? 'Aucun partenaire ne correspond à votre recherche.'
        : `${results.length} partenaire${results.length > 1 ? 's' : ''} trouvé${results.length > 1 ? 's' : ''}`;
    }

    if (results.length === 0) {
      grid.innerHTML = `
        <div class="partner-empty">
          <div class="partner-empty-icon">🔍</div>
          <p>Aucun partenaire ne correspond à ces critères pour le moment.<br/>
          Essayez d'élargir votre recherche ou <a href="#devenir-partenaire" style="color:var(--gold-600);font-weight:600;">devenez partenaire</a>.</p>
        </div>`;
      return;
    }

    grid.innerHTML = results.map((p, i) => `
      <div class="partner-card" data-idx="${PARTENAIRES.indexOf(p)}" role="button" tabindex="0">
        <div class="partner-card-logo">${p.icone || '🤝'}</div>
        <div class="partner-card-name">${p.nom}</div>
        <div class="partner-card-sector">${p.secteur || ''}</div>
        <div class="partner-card-loc">📍 ${p.ville || p.zone || ''}</div>
        <div class="partner-card-link">Voir la fiche →</div>
      </div>`).join('');
  };

  /* — Fiche détail (modale) — */
  const openDetail = (p) => {
    const contacts = [];
    if (p.tel)   contacts.push(`<a class="modal-detail-contact" href="tel:${p.tel.replace(/\s/g,'')}"><span>📞</span> ${p.tel}</a>`);
    if (p.email) contacts.push(`<a class="modal-detail-contact" href="mailto:${p.email}"><span>✉️</span> ${p.email}</a>`);
    if (p.site)  contacts.push(`<a class="modal-detail-contact" href="${p.site}" target="_blank" rel="noopener"><span>🌐</span> ${p.site.replace(/^https?:\/\//,'')}</a>`);

    const body = `
      <button class="modal-close" data-close aria-label="Fermer">×</button>
      <div class="modal-pad">
        <div class="modal-detail-head">
          <div class="modal-detail-logo">${p.icone || '🤝'}</div>
          <div>
            <div class="modal-detail-name">${p.nom}</div>
            <div class="modal-detail-meta">${p.secteur || ''}</div>
            <div class="modal-detail-loc">📍 ${p.ville ? p.ville + ' · ' : ''}${p.zone || ''}</div>
          </div>
        </div>
        ${p.desc ? `<p class="modal-detail-desc">${p.desc}</p>` : ''}
        ${contacts.length ? `<div class="modal-detail-contacts">${contacts.join('')}</div>` : ''}
      </div>`;
    showModal(body);
  };

  /* — Modale générique — */
  let overlay = document.getElementById('partner-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'partner-modal';
    overlay.innerHTML = '<div class="modal"></div>';
    document.body.appendChild(overlay);
  }
  const modalBox = overlay.querySelector('.modal');
  const showModal = (html) => { modalBox.innerHTML = html; overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeModal = () => { overlay.classList.remove('open'); document.body.style.overflow = ''; };
  overlay.addEventListener('click', (e) => { if (e.target === overlay || e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* — Clic / clavier sur une carte — */
  const handleCard = (el) => {
    const idx = parseInt(el.getAttribute('data-idx'), 10);
    if (!isNaN(idx) && PARTENAIRES[idx]) openDetail(PARTENAIRES[idx]);
  };
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.partner-card');
    if (card) handleCard(card);
  });
  grid.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('partner-card')) {
      e.preventDefault(); handleCard(e.target);
    }
  });

  /* — Écouteurs recherche — */
  [inputEl, sectorEl, zoneEl].forEach(el => {
    if (!el) return;
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  render();
});
