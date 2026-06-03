/* ══════════════════════════════════════════
   PRISE DE RENDEZ-VOUS — Conseil Patrimonial Indépendant
   Flow simplifié : Prénom + Téléphone → mailto pré-rempli + confirmation
   ⚠️  Remplacer ADVISOR_EMAIL par l'adresse email professionnelle réelle
══════════════════════════════════════════ */

const ADVISOR_EMAIL = 'dimitripelcy@gmail.com';

/* ════════════════════════════════════════
   MODAL PRISE DE RENDEZ-VOUS
════════════════════════════════════════ */
function initRdvModal() {

  /* ── Injection du HTML modal ── */
  const el = document.createElement('div');
  el.id = 'rdv-modal';
  el.className = 'rdv-overlay';
  el.innerHTML = `
    <div class="rdv-box" role="dialog" aria-modal="true" aria-labelledby="rdv-title">
      <button class="rdv-close" id="rdv-close" aria-label="Fermer">✕</button>

      <div class="rdv-header">
        <div class="rdv-badge">📞 Rappel gratuit &amp; sans engagement</div>
        <h3 class="rdv-title" id="rdv-title">Demandez à être rappelé(e)</h3>
        <p class="rdv-intro">Laissez-nous vos coordonnées — nous vous rappelons dans les plus brefs délais pour convenir d'un rendez-vous adapté à votre situation.</p>
      </div>

      <div class="rdv-form">
        <div class="rdv-field">
          <div class="rdv-label">Prénom &amp; Nom</div>
          <input type="text" id="rdv-prenom" placeholder="Votre prénom et nom" class="rdv-input" autocomplete="name" />
        </div>
        <div class="rdv-field">
          <div class="rdv-label">Numéro de téléphone</div>
          <input type="tel" id="rdv-tel" placeholder="06 XX XX XX XX" class="rdv-input" autocomplete="tel" />
        </div>

        <div class="rdv-field" style="margin-top:4px;">
          <div class="rdv-label" style="font-size:11px;text-transform:uppercase;letter-spacing:1px;opacity:0.5;margin-bottom:8px;">Message envoyé automatiquement</div>
          <div style="background:#f8f7f2;border:1px solid #e2d9c5;border-radius:8px;padding:14px 16px;font-size:13px;color:#4a5568;line-height:1.6;font-style:italic;">
            Bonjour, je souhaiterais être rappelé(e) pour prendre rendez-vous avec votre conseiller patrimonial. Merci de me recontacter dans les plus brefs délais.
          </div>
        </div>

        <button type="button" class="rdv-submit" id="rdv-submit">
          📞 Demander à être rappelé(e)
        </button>
      </div>

      <p class="rdv-note">Premier rendez-vous toujours gratuit &amp; sans engagement. Vos coordonnées sont utilisées uniquement pour vous recontacter — conformément au RGPD.</p>
    </div>
  `;
  document.body.appendChild(el);

  /* ── Injection de la confirmation ── */
  const confirm = document.createElement('div');
  confirm.id = 'rdv-confirm';
  confirm.style.cssText = `
    position:fixed;bottom:32px;right:32px;z-index:9999;
    background:linear-gradient(135deg,#1a3520,#1e3d28);
    border:1px solid rgba(74,222,128,0.3);
    border-radius:16px;padding:20px 24px;max-width:340px;
    box-shadow:0 8px 40px rgba(0,0,0,0.4);
    transform:translateY(120px);opacity:0;
    transition:all 0.5s cubic-bezier(0.34,1.56,0.64,1);
    pointer-events:none;
  `;
  confirm.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:14px;">
      <div style="font-size:28px;flex-shrink:0;">✅</div>
      <div>
        <div style="font-size:15px;font-weight:700;color:#4ade80;margin-bottom:4px;">Demande bien reçue !</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.8);line-height:1.5;">Votre demande de rappel a été transmise. Vous serez recontacté(e) dans les plus brefs délais.</div>
      </div>
    </div>
  `;
  document.body.appendChild(confirm);

  const overlay = el;

  /* ── Open / Close ── */
  function openModal(context) {
    // Pré-remplir le prénom si en session (optionnel)
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('rdv-prenom')?.focus(), 150);
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showConfirmation() {
    confirm.style.transform = 'translateY(0)';
    confirm.style.opacity = '1';
    confirm.style.pointerEvents = 'auto';
    setTimeout(() => {
      confirm.style.transform = 'translateY(120px)';
      confirm.style.opacity = '0';
      confirm.style.pointerEvents = 'none';
    }, 5000);
  }

  document.getElementById('rdv-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ── Envoi mailto + confirmation ── */
  document.getElementById('rdv-submit').addEventListener('click', () => {
    const prenom = document.getElementById('rdv-prenom').value.trim() || '';
    const tel    = document.getElementById('rdv-tel').value.trim() || '';

    const greeting  = prenom ? `Bonjour, je m'appelle ${prenom}.` : 'Bonjour,';
    const telLine   = tel ? `\nMon numéro de téléphone : ${tel}` : '';
    const subject   = prenom
      ? `Demande de rappel — ${prenom}`
      : `Demande de rappel — Conseil Patrimonial`;

    const body =
`${greeting} Je souhaiterais être rappelé(e) pour prendre rendez-vous avec votre conseiller patrimonial.${telLine}

Merci de me recontacter dans les plus brefs délais.

Cordialement${prenom ? ',\n' + prenom : '.'}`;

    window.location.href = `mailto:${ADVISOR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    closeModal();
    setTimeout(showConfirmation, 600);

    // Reset du formulaire
    document.getElementById('rdv-prenom').value = '';
    document.getElementById('rdv-tel').value = '';
  });

  /* ── Interception globale de tous les boutons "Prendre rendez-vous" ── */
  document.addEventListener('click', e => {
    const t = e.target.closest('a, button');
    if (!t) return;
    const href = t.getAttribute('href') || '';
    const isRdv =
      href === '#contact' ||
      href === 'index.html#contact' ||
      href.endsWith('#contact') ||
      t.hasAttribute('data-rdv') ||
      t.classList.contains('nav-cta');
    if (isRdv) {
      e.preventDefault();
      openModal();
    }
  }, true);
}

/* ── Animer les barres de comparaison au scroll ── */
function initCompareBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-width]').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.compare-bars, .income-gap').forEach(el => observer.observe(el));
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initCompareBars();
  initRdvModal();
});
