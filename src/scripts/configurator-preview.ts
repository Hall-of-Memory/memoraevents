import {
  estimatePreviewSelection,
  euroAmount,
  type ConfiguratorExtra,
  type ConfiguratorOffer,
  type ConfiguratorPackage,
} from '../lib/configurator-preview';

const root = document.querySelector<HTMLElement>('[data-configurator-preview]');
if (root) {
  const offerInputs = Array.from(root.querySelectorAll<HTMLInputElement>('input[name="wizardOffer"]'));
  const packageInputs = Array.from(root.querySelectorAll<HTMLInputElement>('input[name="wizardPackage"]'));
  const extraInputs = Array.from(root.querySelectorAll<HTMLInputElement>('input[name="wizardExtra"]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-wizard-step]'));
  const progress = Array.from(document.querySelectorAll<HTMLElement>('[data-wizard-progress]'));
  const back = root.querySelector<HTMLButtonElement>('[data-wizard-back]');
  const next = root.querySelector<HTMLButtonElement>('[data-wizard-next]');
  const error = root.querySelector<HTMLElement>('[data-wizard-error]');
  const price = root.querySelector<HTMLElement>('[data-wizard-price]');
  const selectionLabel = root.querySelector<HTMLElement>('[data-wizard-selection]');
  const eventType = root.querySelector<HTMLSelectElement>('select[name="wizardEvent"]');
  const eventDate = root.querySelector<HTMLInputElement>('input[name="wizardDate"]');
  const eventLocation = root.querySelector<HTMLInputElement>('input[name="wizardLocation"]');

  const offers: ConfiguratorOffer[] = offerInputs.map((input) => ({
    id: input.value,
    title: input.dataset.offerTitle ?? input.value,
  }));
  const packages: ConfiguratorPackage[] = packageInputs.filter((input) => input.value).map((input) => ({
    id: input.value,
    offerId: input.dataset.offerId ?? '',
    name: input.dataset.packageName ?? input.value,
    priceLabel: input.dataset.packagePriceLabel ?? null,
  }));
  const extras: ConfiguratorExtra[] = extraInputs.map((input) => ({
    id: input.value,
    title: input.closest('label')?.querySelector('strong')?.textContent ?? input.value,
    offerIds: input.closest('label')?.getAttribute('data-extra-offers')?.split(',') ?? [],
    pricing: input.dataset.extraPricing === 'fixed' ? 'fixed' : 'quote',
    priceCents: input.dataset.extraPriceCents ? Number(input.dataset.extraPriceCents) : null,
  }));

  if (back && next && error && price && selectionLabel && eventType && eventDate && eventLocation && panels.length === 4) {
    let activeStep = 0;
    const chosenOffer = () => offerInputs.find((input) => input.checked)?.value ?? '';
    const chosenPackage = () => packageInputs.find((input) => input.checked)?.value ?? '';
    const chosenExtras = () => extraInputs.filter((input) => input.checked).map((input) => input.value);
    const summaryValue = (name: string, text: string) => {
      const target = root.querySelector<HTMLElement>('[data-review-' + name + ']');
      if (target) target.textContent = text;
    };
    const clearError = () => { error.hidden = true; error.textContent = ''; };
    const showError = (message: string) => {
      error.textContent = message;
      error.hidden = false;
      error.tabIndex = -1;
      error.focus();
    };

    const syncOfferOptions = () => {
      const id = chosenOffer();
      root.querySelectorAll<HTMLElement>('[data-packages-for]').forEach((group) => {
        group.hidden = group.dataset.packagesFor !== id;
      });
      packageInputs.forEach((input) => {
        if (input.dataset.offerId !== id) input.checked = false;
      });
      extraInputs.forEach((input) => {
        const label = input.closest<HTMLElement>('[data-extra-offers]');
        const allowed = (label?.dataset.extraOffers ?? '').split(',').includes(id);
        if (label) label.hidden = !allowed;
        if (!allowed) input.checked = false;
      });
    };

    const updateSummary = () => {
      const offerId = chosenOffer();
      if (!offerId) {
        selectionLabel.textContent = 'Wähle ein Produkt aus.';
        price.textContent = 'Preis nach Paketauswahl';
        return;
      }
      const summary = estimatePreviewSelection(offers, packages, extras, {
        offerId,
        packageId: chosenPackage(),
        extraIds: chosenExtras(),
      });
      const selectedName = summary.selectedPackage ? summary.selectedPackage.name : 'Beratung gewünscht';
      const extraNote = summary.selectedExtras.length ? ' · ' + summary.selectedExtras.length + ' Extra(s)' : '';
      selectionLabel.textContent = summary.offer.title + ' · ' + selectedName + extraNote;
      price.textContent = summary.subtotalCents !== null
        ? euroAmount(summary.subtotalCents) + (summary.hasOpenPrice ? ' + weitere Kosten auf Anfrage' : ' (Zwischensumme)')
        : 'Individuelles Angebot';

      summaryValue('offer', summary.offer.title);
      summaryValue('package', summary.selectedPackage?.name ?? 'Individuell abzustimmen');
      summaryValue('extras', summary.selectedExtras.length ? summary.selectedExtras.map((item) => item.title).join(', ') : 'Keine freigegebenen Extras ausgewählt');
      summaryValue('price', summary.subtotalCents === null ? 'Individuelles Angebot' : euroAmount(summary.subtotalCents) + ' · unverbindliche Zwischensumme');
      const date = eventDate.value ? new Date(eventDate.value + 'T12:00:00') : null;
      const niceDate = date && !Number.isNaN(date.valueOf()) ? new Intl.DateTimeFormat('de-DE').format(date) : 'Datum offen';
      summaryValue('event', [eventType.value || 'Anlass offen', niceDate, eventLocation.value.trim() || 'Ort offen'].join(' · '));
    };

    const renderStep = (focus = true) => {
      panels.forEach((panel, index) => { panel.hidden = index !== activeStep; });
      progress.forEach((item, index) => {
        item.classList.toggle('is-done', index < activeStep);
        if (index === activeStep) item.setAttribute('aria-current', 'step');
        else item.removeAttribute('aria-current');
      });
      back.disabled = activeStep === 0;
      next.hidden = activeStep === panels.length - 1;
      root.dataset.activeStep = String(activeStep);
      clearError();
      updateSummary();
      if (focus) {
        const heading = panels[activeStep]?.querySelector<HTMLElement>('h2');
        if (heading) { heading.tabIndex = -1; heading.focus(); }
      }
    };

    const nextStep = () => {
      clearError();
      if (activeStep === 0 && !chosenOffer()) {
        showError('Bitte wähle zuerst ein Produkt aus.');
        return;
      }
      if (activeStep === 1) {
        const date = eventDate.value;
        const today = new Date();
        const localToday = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
        if (!eventType.value || !date || date < localToday || eventLocation.value.trim().length < 2) {
          showError('Bitte gib Anlass, ein nicht vergangenes Datum und die Stadt der Veranstaltung an.');
          return;
        }
      }
      if (activeStep === 2) {
        // A package may be intentionally left open for an individual offer.
        updateSummary();
      }
      if (activeStep < panels.length - 1) activeStep += 1;
      renderStep();
    };

    const params = new URL(window.location.href).searchParams;
    const preselectedOffer = params.get('produkt');
    const preselectedPackage = params.get('paket');
    const offerFromLink = offerInputs.find((input) => input.value === preselectedOffer);
    if (offerFromLink) offerFromLink.checked = true;
    if (offerFromLink && preselectedPackage) {
      const selected = packageInputs.find((input) => input.value === preselectedPackage && input.dataset.offerId === offerFromLink.value);
      if (selected) selected.checked = true;
    }
    syncOfferOptions();
    renderStep(false);
    offerInputs.forEach((input) => input.addEventListener('change', () => {
      syncOfferOptions();
      clearError();
      updateSummary();
    }));
    [...packageInputs, ...extraInputs, eventType, eventDate, eventLocation].forEach((input) => {
      input.addEventListener('change', updateSummary);
      if (input === eventLocation) input.addEventListener('input', updateSummary);
    });
    back.addEventListener('click', () => {
      if (activeStep > 0) { activeStep -= 1; renderStep(); }
    });
    next.addEventListener('click', nextStep);
  }
}
