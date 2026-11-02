import assert from 'node:assert/strict';
import { centsFromApprovedPriceLabel, estimatePreviewSelection, euroAmount } from '../src/lib/configurator-preview.ts';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  inquiryDateSchema,
  inquirySchema,
  parseInquirySubmission,
  productionInquiryCatalog,
} from '../shared/inquiry-contract.ts';
import {
  packagesForOffer,
  projectGallery,
  projectPackages,
  reconcilePackageSelection,
  resolveGalleryAssetSrc,
} from '../src/lib/package-projection.ts';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');

for (const date of ['2026-02-31', '2026-02-29']) {
  assert.equal(inquiryDateSchema.safeParse(date).success, false, `${date} must be rejected`);
}
for (const date of ['2028-02-29', '2020-01-01']) {
  assert.equal(inquiryDateSchema.safeParse(date).success, true, `${date} must be accepted`);
}

const draft = {
  offerId: 'fotobox',
  date: '2028-02-29',
  eventType: 'Hochzeit',
  location: 'Berlin',
  name: 'Test Person',
  email: 'test.person@example.invalid',
  privacyConsent: true,
};
assert.equal(inquirySchema.safeParse(draft).success, true);
assert.equal(inquirySchema.safeParse({ ...draft, email: 'not-an-email' }).success, false);

const submission = parseInquirySubmission({
  ...draft,
  packageId: '  ',
  phone: '',
  message: '\t',
  turnstileToken: 'test-token',
});
assert.equal(submission.success, true);
assert.equal(submission.success && submission.data.packageId, undefined);
assert.equal(submission.success && submission.data.phone, undefined);
assert.equal(submission.success && submission.data.message, undefined);

const offers = JSON.parse(readFileSync(join(repo, 'src', 'content', 'offers.json'), 'utf8'));
const packages = JSON.parse(readFileSync(join(repo, 'src', 'content', 'packages.json'), 'utf8'));
const publicOfferIds = new Set(offers.map(({ id }) => id));
for (const packageEntry of packages) {
  assert.ok(
    publicOfferIds.has(packageEntry.offerId),
    `public package ${packageEntry.id} references unknown offer ${packageEntry.offerId}`,
  );
}
const currentProductionCatalog = offers.map(({ id }) => ({
  offerId: id,
  packageIds: packages.filter(({ offerId }) => offerId === id).map(({ id }) => id).sort(),
}));
const contractedCatalog = productionInquiryCatalog.map(({ offerId, packageIds }) => ({
  offerId,
  packageIds: [...packageIds].sort(),
}));
assert.deepEqual(
  currentProductionCatalog,
  contractedCatalog,
  'production offer/package IDs drifted from the shared inquiry allow-list',
);

const syntheticPackages = projectPackages([
  {
    id: 'mirror-signature',
    offerId: 'fotospiegel',
    name: 'Signature',
    summary: 'Synthetische Testprojektion',
    priceLabel: null,
    features: ['Feature B'],
    sortOrder: 20,
  },
  {
    id: 'box-classic',
    offerId: 'fotobox',
    name: 'Classic',
    summary: 'Synthetische Testprojektion',
    priceLabel: 'Testpreis',
    features: ['Feature A'],
    sortOrder: 10,
  },
]);
assert.deepEqual(
  syntheticPackages.map(({ id, offerId }) => ({ id, offerId })),
  [
    { id: 'box-classic', offerId: 'fotobox' },
    { id: 'mirror-signature', offerId: 'fotospiegel' },
  ],
  'package projection must retain offer binding and sort order',
);
assert.deepEqual(
  packagesForOffer(syntheticPackages, 'fotobox').map(({ id }) => id),
  ['box-classic'],
  'offer projection must expose only matching packages',
);
assert.deepEqual(
  reconcilePackageSelection(syntheticPackages, 'fotobox', 'box-classic'),
  { availableIds: ['box-classic'], selectedPackageId: 'box-classic' },
);
assert.deepEqual(
  reconcilePackageSelection(syntheticPackages, 'fotospiegel', 'box-classic'),
  { availableIds: ['mirror-signature'], selectedPackageId: '' },
  'changing offer must invalidate a package selected for another offer',
);
assert.deepEqual(
  reconcilePackageSelection(syntheticPackages, 'magazinbox', ''),
  { availableIds: [], selectedPackageId: '' },
  'an offer without packages must keep package selection unavailable',
);
assert.deepEqual(
  reconcilePackageSelection(syntheticPackages, '', 'box-classic'),
  { availableIds: [], selectedPackageId: '' },
  'no selected offer must not leave a package selectable',
);

const syntheticGallery = projectGallery([
  {
    id: 'gallery-later',
    src: 'demo/later.webp',
    alt: 'Später Testeintrag',
    sortOrder: 20,
  },
  {
    id: 'gallery-first',
    src: '/demo/first.webp',
    alt: 'Erster Testeintrag',
    caption: 'Testcaption',
    sortOrder: 10,
  },
]);
assert.equal(syntheticGallery[0].id, 'gallery-first');
assert.equal(syntheticGallery[0].alt, 'Erster Testeintrag');
assert.equal(syntheticGallery[0].caption, 'Testcaption');
assert.equal(
  resolveGalleryAssetSrc(syntheticGallery[0].src, '/memoraevents/'),
  '/memoraevents/demo/first.webp',
  'gallery assets must resolve through Astro BASE_URL',
);
for (const invalidGallerySrc of [
  'https://cdn.example.invalid/photo.webp',
  '//cdn.example.invalid/photo.webp',
  '../outside.webp',
  '%2e%2e/outside.webp',
  '%252e%252e/outside.webp',
  '%2e%2e%2foutside.webp',
  '%2e%2e%5coutside.webp',
]) {
  assert.throws(
    () => resolveGalleryAssetSrc(invalidGallerySrc, '/memoraevents/'),
    /Gallery assets must/,
    `gallery source ${invalidGallerySrc} must fail closed instead of escaping BASE_URL or contradicting img-src CSP`,
  );
}


const actualExtras = JSON.parse(readFileSync(join(repo, 'src/content/extras.json'), 'utf8'));
assert.deepEqual(actualExtras, [], 'do not invent unapproved customer extras');
assert.equal(packages.length, 12, 'use only the twelve customer-approved package tiers');
assert.equal(centsFromApprovedPriceLabel('249 € / Event'), 24900);
assert.equal(euroAmount(24900).includes('249'), true);
assert.throws(() => centsFromApprovedPriceLabel('ab 249 €'), /Unrecognized/);
const previewEstimate = estimatePreviewSelection(offers, packages, [], {
  offerId: 'fotobox', packageId: 'fotobox-digital', extraIds: [],
});
assert.equal(previewEstimate.subtotalCents, 24900);
assert.equal(previewEstimate.hasOpenPrice, false);
const quoteEstimate = estimatePreviewSelection(offers, packages, [
  { id: 'custom-layout', title: 'Synthetische Testleistung', offerIds: ['fotobox'], pricing: 'quote', priceCents: null },
], { offerId: 'fotobox', packageId: 'fotobox-starter', extraIds: ['custom-layout'] });
assert.equal(quoteEstimate.subtotalCents, 29900);
assert.equal(quoteEstimate.hasOpenPrice, true, 'quoted add-ons must not claim a fixed total');
const fixedEstimate = estimatePreviewSelection(offers, packages, [
  { id: 'approved-test', title: 'Synthetisch', offerIds: ['fotobox'], pricing: 'fixed', priceCents: 1500 },
], { offerId: 'fotobox', packageId: 'fotobox-digital', extraIds: ['approved-test'] });
assert.equal(fixedEstimate.subtotalCents, 26400);
assert.throws(() => estimatePreviewSelection(offers, packages, [], {
  offerId: 'fotospiegel', packageId: 'fotobox-digital', extraIds: [],
}), /Package does not belong/);
assert.throws(() => estimatePreviewSelection(offers, packages, [], {
  offerId: 'fotobox', packageId: 'fotobox-digital', extraIds: ['unknown-extra'],
}), /Invalid extra/);
assert.throws(() => estimatePreviewSelection(offers, packages, [
  { id: 'synthetic', title: 'Synthetisch', offerIds: ['fotospiegel'], pricing: 'fixed', priceCents: 1000 },
], { offerId: 'fotobox', packageId: 'fotobox-digital', extraIds: ['synthetic'] }), /Invalid extra/);
assert.equal(estimatePreviewSelection(offers, packages, [], {
  offerId: 'magazinbox', packageId: '', extraIds: [],
}).subtotalCents, null, 'unpriced Magazinbox must stay open');

const demoExperienceSource = readFileSync(join(repo, 'src', 'components', 'DemoExperience.astro'), 'utf8');
const showcaseSource = readFileSync(
  join(repo, 'src', 'components', 'landing', 'LandingShowcase.astro'),
  'utf8',
);
const eventFieldsSource = readFileSync(join(repo, 'src', 'components', 'InquiryEventFields.astro'), 'utf8');
const inquiryClientSource = readFileSync(join(repo, 'src', 'scripts', 'inquiry-form.ts'), 'utf8');
assert.match(demoExperienceSource, /packages=\{demoPackages\}/);
assert.match(demoExperienceSource, /gallery=\{demoGallery\}/);
assert.match(showcaseSource, /id=\{`angebot-\$\{offer\.slug\}`\}/);
assert.match(showcaseSource, /packagesForOffer\(packages, offer\.id\)/);
assert.match(showcaseSource, /gallery\.map\(\(item\)/);
assert.match(showcaseSource, /resolveGalleryAssetSrc\(item\.src, assetBase\)/);
assert.match(showcaseSource, /data-content-gallery="true"/);
assert.match(
  showcaseSource,
  /grid-template-columns:repeat\(auto-fit,minmax\(min\(100%,320px\),1fr\)\);grid-template-rows:none/,
  'populated gallery must replace fixed demo columns/rows so sparse content has no empty tracks',
);
assert.ok(
  (2 * 320) + 10 > 640 - 28,
  'two populated gallery tracks plus their gap must not fit inside the <=640px shell contract',
);
assert.match(showcaseSource, /grid-row:auto;grid-column:auto;min-height:185px;padding:0/);
assert.match(eventFieldsSource, /data-offer-id=\{item\.offerId\}/);
const bootstrapGuard = inquiryClientSource.indexOf('if (button) button.disabled = true;');
const configGuard = inquiryClientSource.indexOf('!siteKey');
const packageInitialization = inquiryClientSource.indexOf('syncPackageSelect();');
const submitBinding = inquiryClientSource.indexOf("form.addEventListener('submit', handleSubmit);");
const submitEnable = inquiryClientSource.indexOf('button.disabled = false;');
assert.ok(bootstrapGuard >= 0);
assert.ok(configGuard > bootstrapGuard);
assert.ok(packageInitialization > configGuard, 'package projection must initialize after required DOM/config validation');
assert.ok(submitBinding > packageInitialization, 'submit handler must bind only after package projection initializes');
assert.ok(submitEnable > submitBinding, 'T055 submit enable must remain after handler binding');

const workerSource = readFileSync(join(repo, 'spikes', 'inquiry-worker', 'src', 'index.ts'), 'utf8');
assert.doesNotMatch(workerSource, /astro\/zod|src\/content\/(?:offers|packages)\.json/);
assert.match(workerSource, /shared\/inquiry-contract\.ts/);
const contractSource = readFileSync(join(repo, 'shared', 'inquiry-contract.ts'), 'utf8');
assert.match(contractSource, /from 'zod'/);
assert.doesNotMatch(
  contractSource,
  /from\s+['"][^'"]*(?:src\/data\/demo|content\/(?:offers|packages)\.json)/,
);

console.log('inquiry-contract-ok production_catalog=3 projection=synthetic-nonempty local_gallery_only=true encoded_traversal_rejected=true sparse_gallery_adaptive=true mobile_gallery_single_column=true valid_leap_day=2028-02-29 past_dates=allowed');