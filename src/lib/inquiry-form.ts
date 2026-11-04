import type { InquiryDraft } from './inquiry';

export type InquirySubmission = Omit<InquiryDraft, 'privacyConsent'> & {
  privacyConsent: boolean;
  turnstileToken: string;
};

export type InquiryOutcomeCode =
  | 'received'
  | 'turnstile-required'
  | 'validation-failed'
  | 'human-verification-failed'
  | 'human-verification-unavailable'
  | 'rate-limited'
  | 'storage-failed'
  | 'network-failed'
  | 'receipt-uncertain'
  | 'submission-id-conflict'
  | 'backend-failed'
  | 'duplicate-ignored';

export interface InquiryOutcome {
  ok: boolean;
  code: InquiryOutcomeCode;
  message: string;
  inquiryId?: string;
  focus: 'status' | 'turnstile' | 'none';
}

interface FormEntries {
  get(name: string): FormDataEntryValue | null;
  has(name: string): boolean;
}

type Fetcher = (input: string, init: RequestInit) => Promise<Response>;

export interface InquiryControllerView {
  setSubmitting(submitting: boolean): void;
  publish(outcome: InquiryOutcome): void;
  renewVerification(): void;
  resetAfterSuccess(): void;
}

function text(entries: FormEntries, name: string): string {
  const value = entries.get(name);
  return typeof value === 'string' ? value : '';
}

function optionalText(entries: FormEntries, name: string): string | undefined {
  const value = text(entries, name).trim();
  return value.length > 0 ? value : undefined;
}

export function buildInquirySubmission(
  entries: FormEntries,
  turnstileToken: string,
): InquirySubmission {
  return {
    offerId: text(entries, 'offerId'),
    packageId: optionalText(entries, 'packageId'),
    date: text(entries, 'date'),
    eventType: text(entries, 'eventType') as InquiryDraft['eventType'],
    location: text(entries, 'location').trim(),
    name: text(entries, 'name').trim(),
    email: text(entries, 'email').trim(),
    phone: optionalText(entries, 'phone'),
    message: optionalText(entries, 'message'),
    privacyConsent: entries.has('privacyConsent'),
    turnstileToken,
  };
}

const outcomes = {
  received: (inquiryId: string): InquiryOutcome => ({
    ok: true,
    code: 'received',
    inquiryId,
    focus: 'status',
    message:
      'Deine Anfrage wurde empfangen. Sie ist noch keine verbindliche Buchung; wir melden uns persönlich bei dir.',
  }),
  turnstileRequired: (): InquiryOutcome => ({
    ok: false,
    code: 'turnstile-required',
    focus: 'turnstile',
    message: 'Bitte schließe zuerst die Sicherheitsprüfung ab.',
  }),
  validationFailed: (message = 'Bitte prüfe deine Angaben und versuche es erneut.'): InquiryOutcome => ({
    ok: false,
    code: 'validation-failed',
    focus: 'status',
    message,
  }),
  verificationFailed: (): InquiryOutcome => ({
    ok: false,
    code: 'human-verification-failed',
    focus: 'turnstile',
    message: 'Die Sicherheitsprüfung wurde abgelehnt. Bitte führe sie erneut durch.',
  }),
  verificationUnavailable: (): InquiryOutcome => ({
    ok: false,
    code: 'human-verification-unavailable',
    focus: 'turnstile',
    message:
      'Die Sicherheitsprüfung ist vorübergehend nicht verfügbar. Bitte warte kurz und versuche es erneut.',
  }),
  rateLimited: (): InquiryOutcome => ({
    ok: false,
    code: 'rate-limited',
    focus: 'status',
    message: 'Zu viele Anfragen in kurzer Zeit. Bitte warte eine Minute und versuche es erneut.',
  }),
  storageFailed: (): InquiryOutcome => ({
    ok: false,
    code: 'storage-failed',
    focus: 'status',
    message:
      'Deine Anfrage konnte gerade nicht sicher gespeichert werden. Bitte versuche es später erneut.',
  }),
  backendFailed: (): InquiryOutcome => ({
    ok: false,
    code: 'backend-failed',
    focus: 'status',
    message: 'Der Anfragedienst ist gerade nicht erreichbar. Bitte versuche es später erneut.',
  }),
  networkFailed: (): InquiryOutcome => ({
    ok: false,
    code: 'network-failed',
    focus: 'status',
    message:
      'Die Verbindung ist fehlgeschlagen. Es ist unklar, ob die Anfrage angekommen ist; bitte sende sie nicht sofort mehrfach und versuche es später erneut.',
  }),
  receiptUncertain: (): InquiryOutcome => ({
    ok: false,
    code: 'receipt-uncertain',
    focus: 'status',
    message:
      'Der Anfragedienst hat keine eindeutige Empfangsbestätigung geliefert. Deine Anfrage könnte bereits gespeichert sein. Bitte sende sie nicht sofort erneut, um doppelte Anfragen zu vermeiden.',
  }),
  submissionIdConflict: (): InquiryOutcome => ({
    ok: false,
    code: 'submission-id-conflict',
    focus: 'status',
    message: 'Diese Anfragekennung gehört bereits zu anderen Angaben. Bitte beginne eine neue Anfrage, statt dieselbe Übermittlung mehrfach zu senden.',
  }),
  duplicateIgnored: (): InquiryOutcome => ({
    ok: false,
    code: 'duplicate-ignored',
    focus: 'none',
    message: '',
  }),
};

async function errorCode(response: Response): Promise<string | undefined> {
  try {
    const body = (await response.json()) as { error?: unknown };
    return typeof body.error === 'string' ? body.error : undefined;
  } catch {
    return undefined;
  }
}

export async function requestInquiry(
  endpoint: string,
  submission: InquirySubmission,
  fetcher: Fetcher = fetch,
): Promise<InquiryOutcome> {
  let response: Response;
  try {
    response = await fetcher(endpoint, {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify(submission),
      cache: 'no-store',
      credentials: 'omit',
    });
  } catch {
    return outcomes.networkFailed();
  }

  if (response.status === 201) {
    try {
      const body = (await response.json()) as {
        inquiryId?: unknown;
        status?: unknown;
        bookingCreated?: unknown;
      };
      if (
        typeof body.inquiryId === 'string' &&
        body.status === 'received' &&
        body.bookingCreated === false
      ) {
        return outcomes.received(body.inquiryId);
      }
    } catch {
      // A malformed success response must never produce a success message.
    }
    // A 201 may follow successful persistence even if its receipt is unreadable.
    return outcomes.receiptUncertain();
  }
  // Other 2xx statuses may mean the data was accepted; do not suggest safe resubmission.
  if (response.ok) return outcomes.receiptUncertain();

  const code = await errorCode(response);
  if (response.status === 409 && code === 'submission-id-conflict') return outcomes.submissionIdConflict();
  if (response.status === 422) {
    if (code === 'unknown-offer') {
      return outcomes.validationFailed('Das gewählte Angebot ist nicht mehr verfügbar. Bitte wähle erneut.');
    }
    if (code === 'invalid-package-for-offer') {
      return outcomes.validationFailed('Das gewählte Paket passt nicht zum Angebot. Bitte wähle erneut.');
    }
    return outcomes.validationFailed();
  }
  if (response.status === 403 && code === 'human-verification-failed') {
    return outcomes.verificationFailed();
  }
  if (response.status === 503 && code === 'human-verification-unavailable') {
    return outcomes.verificationUnavailable();
  }
  if (response.status === 429) return outcomes.rateLimited();
  if (response.status === 500 && code === 'storage-failed') return outcomes.storageFailed();
  if (response.status >= 500) return outcomes.receiptUncertain();
  if (response.status === 413) {
    return outcomes.validationFailed('Die Anfrage ist zu umfangreich. Bitte kürze deine Nachricht.');
  }
  return outcomes.backendFailed();
}

export function createInquiryController(
  endpoint: string,
  view: InquiryControllerView,
  fetcher: Fetcher = fetch,
) {
  let submitting = false;
  let previousDraft: string | null = null;
  let submissionId: string | null = null;

  return {
    isSubmitting: () => submitting,
    async submit(submission: InquirySubmission): Promise<InquiryOutcome> {
      if (submitting) return outcomes.duplicateIgnored();
      if (!submission.turnstileToken) {
        const outcome = outcomes.turnstileRequired();
        view.publish(outcome);
        return outcome;
      }

      // Only a changed draft gets a new key; retrying the same draft reuses it.
      // Keep the fingerprint in memory only: no customer data in browser storage.
      const draft = JSON.stringify({
        offerId: submission.offerId, packageId: submission.packageId ?? null,
        date: submission.date, eventType: submission.eventType,
        location: submission.location, name: submission.name,
        email: submission.email, phone: submission.phone ?? null,
        message: submission.message ?? null, privacyConsent: submission.privacyConsent,
      });
      if (draft !== previousDraft || !submissionId) {
        previousDraft = draft;
        submissionId = crypto.randomUUID();
      }

      submitting = true;
      view.setSubmitting(true);
      let outcome: InquiryOutcome;
      try {
        outcome = await requestInquiry(endpoint, { ...submission, submissionId }, fetcher);
        view.renewVerification();
        if (outcome.ok) {
          previousDraft = null;
          submissionId = null;
          view.resetAfterSuccess();
        }
        view.publish(outcome);
        return outcome;
      } finally {
        submitting = false;
        view.setSubmitting(false);
      }
    },
  };
}