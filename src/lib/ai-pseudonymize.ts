/**
 * Aliento Health — AI Pseudonymizer
 *
 * Strips personally identifiable information (PII) from patient
 * questionnaire text before it is sent to an external AI model, and
 * restores the original values once the model has responded.
 *
 * Part of the "AI-drafted, doctor-signed" pipeline:
 *   1. `pseudonymizeText` — swap PII for [TOKEN] placeholders.
 *   2. Send the tokenized text to the AI model.
 *   3. `restoreTokens` — swap the placeholders back for the real values.
 */

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PseudonymMap {
  [token: string]: string
}

export interface KnownPii {
  name?: string
  address?: string
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Replace personally identifiable information in `input` with bracketed
 * token placeholders (`[PATIENT]`, `[ID]`, `[PHONE]`, `[EMAIL]`,
 * `[ADDRESS]`) so the text can be safely sent to an external AI model.
 *
 * Pass anything you already know about the patient via `knownPii` —
 * their name is matched case-insensitively on whole words only.
 *
 * The returned map records each token against the exact original value
 * it replaced, so `restoreTokens(text, map)` reproduces the input
 * character-for-character.
 *
 * ```ts
 * const { text, map } = pseudonymizeText(
 *   'John Smith, cell 0821234567',
 *   { name: 'John Smith' },
 * )
 * // text: '[PATIENT], cell [PHONE]'
 * ```
 */
export function pseudonymizeText(
  input: string,
  knownPii?: KnownPii,
): { text: string; map: PseudonymMap } {
  const map: PseudonymMap = {}
  let text = input

  // Known literals first so they are not partially consumed by the
  // generic pattern detectors below.
  if (knownPii?.address && knownPii.address.trim().length > 0) {
    const addressPattern = new RegExp(escapeRegExp(knownPii.address), 'g')
    text = replaceMatches(text, addressPattern, map, 'ADDRESS')
  }

  if (knownPii?.name && knownPii.name.trim().length > 0) {
    const namePattern = new RegExp(
      `\\b${escapeRegExp(knownPii.name.trim())}\\b`,
      'gi',
    )
    text = replaceMatches(text, namePattern, map, 'PATIENT')
  }

  // Email before phone/id so digit runs inside addresses are untouched.
  const emailPattern =
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g
  text = replaceMatches(text, emailPattern, map, 'EMAIL')

  // South African ID number: exactly 13 digits AND a valid Luhn checksum.
  // Non-Luhn 13-digit runs are deliberately left untouched.
  const idPattern = /\b\d{13}\b/g
  text = text.replace(idPattern, (matched) =>
    passesLuhn(matched) ? `[${issueToken(map, 'ID', matched)}]` : matched,
  )

  // Phone: 0[6-8]xxxxxxxx (10 digits, optional spaces/hyphens) or the
  // same 9 significant digits behind a +27 country-code prefix.
  text = replacePhoneNumbers(text, map)

  return { text, map }
}

/**
 * Swap every known `[TOKEN]` placeholder back to its original value.
 *
 * Tokens that are missing from the map are left as-is, so partial maps
 * and unknown placeholders never throw.
 *
 * ```ts
 * restoreTokens('[PATIENT], cell [PHONE]', map)
 * // 'John Smith, cell 0821234567'
 * ```
 */
export function restoreTokens(text: string, map: PseudonymMap): string {
  return text.replace(/\[([A-Z0-9_]+)\]/g, (matched, token: string) => {
    const value = map[token]
    return typeof value === 'string' ? value : matched
  })
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Replace every match of `pattern`, recording a token for each distinct
 * matched value. Identical values share one token; when the same base
 * token would need to stand for two different values, later values get
 * numbered suffixes (`PHONE_1`, `PHONE_2`, …).
 */
function replaceMatches(
  text: string,
  pattern: RegExp,
  map: PseudonymMap,
  base: string,
): string {
  return text.replace(pattern, (matched) => `[${issueToken(map, base, matched)}]`)
}

/**
 * Phone numbers are scanned manually because the leading-boundary check
 * must not consume the preceding character — doing so would hide a
 * second number directly after the first from a global regex.
 */
function replacePhoneNumbers(text: string, map: PseudonymMap): string {
  const pattern = /(?:\+27|0)[\s-]?[6-8]\d(?:[\s-]?\d){7}(?!\d)/g
  let result = ''
  let lastEnd = 0

  for (let match = pattern.exec(text); match !== null; match = pattern.exec(text)) {
    const start = match.index
    const previous = start > 0 ? text[start - 1] : ''

    if (/\d/.test(previous)) continue

    result += text.slice(lastEnd, start)
    result += `[${issueToken(map, 'PHONE', match[0])}]`
    lastEnd = start + match[0].length
  }

  return result + text.slice(lastEnd)
}

/**
 * Return an existing token for `value` under `base`, or register the
 * next free one. The first value seen keeps the bare token; collisions
 * are suffixed `_1`, `_2`, …
 */
function issueToken(map: PseudonymMap, base: string, value: string): string {
  for (const [token, existing] of Object.entries(map)) {
    if (
      existing === value &&
      (token === base || token.startsWith(`${base}_`))
    ) {
      return token
    }
  }

  let suffix = 0
  let token = base
  while (Object.prototype.hasOwnProperty.call(map, token)) {
    suffix += 1
    token = `${base}_${suffix}`
  }

  map[token] = value
  return token
}

/**
 * Standard Luhn mod-10 checksum over all digits (used to validate
 * candidate South African ID numbers).
 */
function passesLuhn(digits: string): boolean {
  let sum = 0
  let doubleNext = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits.charCodeAt(i) - 48
    if (doubleNext) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    doubleNext = !doubleNext
  }

  return sum % 10 === 0
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
