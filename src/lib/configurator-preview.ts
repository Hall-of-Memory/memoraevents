/**
 * Preview-only selection arithmetic. The productive inquiry worker never trusts
 * browser prices; a production add-on contract requires separate approval.
 */
export interface ConfiguratorOffer {
  id: string;
  title: string;
}

export interface ConfiguratorPackage {
  id: string;
  offerId: string;
  name: string;
  priceLabel: string | null;
}

export interface ConfiguratorExtra {
  id: string;
  title: string;
  offerIds: string[];
  pricing: 'fixed' | 'quote';
  priceCents: number | null;
}

export interface ConfiguratorSelection {
  offerId: string;
  packageId: string;
  extraIds: readonly string[];
}

export function centsFromApprovedPriceLabel(label: string | null): number | null {
  if (label === null) return null;
  const match = /^([1-9]\d{0,4}) € \/ Event$/.exec(label);
  if (!match) throw new Error('Unrecognized approved package price label');
  return Number(match[1]) * 100;
}

export function euroAmount(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents < 0) throw new Error('Invalid amount');
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

/** Validate the full selection against the content catalogue before estimating. */
export function estimatePreviewSelection(
  offers: readonly ConfiguratorOffer[],
  packages: readonly ConfiguratorPackage[],
  extras: readonly ConfiguratorExtra[],
  selection: ConfiguratorSelection,
) {
  const offer = offers.find((entry) => entry.id === selection.offerId);
  if (!offer) throw new Error('Unknown selected offer');

  const selectedPackage = selection.packageId
    ? packages.find((entry) => entry.id === selection.packageId && entry.offerId === offer.id)
    : undefined;
  if (selection.packageId && !selectedPackage) throw new Error('Package does not belong to selected offer');

  const uniqueExtras = new Set(selection.extraIds);
  if (uniqueExtras.size !== selection.extraIds.length) throw new Error('Duplicate extra selection');
  const selectedExtras = [...uniqueExtras].map((id) => {
    const extra = extras.find((entry) => entry.id === id);
    if (!extra || !extra.offerIds.includes(offer.id)) throw new Error('Invalid extra for selected offer');
    if (extra.pricing === 'fixed' && (!Number.isSafeInteger(extra.priceCents) || extra.priceCents === null || extra.priceCents < 0)) {
      throw new Error('Invalid fixed extra price');
    }
    if (extra.pricing === 'quote' && extra.priceCents !== null) throw new Error('Unapproved quoted extra price');
    return extra;
  });

  const packageCents = selectedPackage ? centsFromApprovedPriceLabel(selectedPackage.priceLabel) : null;
  const extrasCents = selectedExtras.reduce((sum, extra) => sum + (extra.pricing === 'fixed' ? (extra.priceCents ?? 0) : 0), 0);
  const subtotalCents = packageCents === null ? null : packageCents + extrasCents;
  if (subtotalCents !== null && !Number.isSafeInteger(subtotalCents)) throw new Error('Invalid subtotal');

  return {
    offer,
    selectedPackage,
    selectedExtras,
    subtotalCents,
    hasOpenPrice: packageCents === null || selectedExtras.some((extra) => extra.pricing === 'quote'),
  };
}
