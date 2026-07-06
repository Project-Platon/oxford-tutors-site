# Product

## Register

brand

## Users

Primarily **parents**, not students. Affluent or high-resourcing, sensitive to tone and design quality, and quick to judge the firm by the site. Three archetypes arrive with different anxieties but want the same next step (a discovery call):

- **The worried parent** of a 2e / neurodivergent child, often referred by a clinician mid-year. Scanning for recognition of their situation; needs to feel *seen* before *sold*.
- **The ambitious parent** of a gifted high-achiever, admissions-driven. Scanning for credibility and strategic seriousness; needs to believe this is judgment, not hours.
- **The referred parent**, sent by a school, clinician, or another family. Arrives pre-trusting; needs a path to the call that does not break the spell. Highest-converting and most polish-sensitive.

Secondary audiences: schools, clinicians, educational consultants, and admissions professionals evaluating the firm as a referral partner.

## Product Purpose

Oxford Tutors USA is a boutique education consultancy for gifted, high-achieving, neurodivergent, twice-exceptional, and unconventional learners. Founded by Elisabeth Gray in 2005, it offers long-term academic mentorship, admissions strategy, test prep, executive functioning, educational planning, and family consulting.

The site exists to make a discerning parent think *"this is not just tutoring; this is the kind of educational judgment my child needs,"* and to move them to one low-anxiety action: scheduling a discovery call. Success is **fewer, higher-intent inquiries**, not raw volume, because the firm is capacity-limited and referral-based. Call quality, not call count, is the metric that proves the site works.

This build (`oxford-tutors-oup`) is the confirmed "mix of both" visual direction: Oxford University Press discipline (true Oxford blue, structured rhythm) with Oxford Tutors warmth (warm ivory ground, restrained gold accents).

## Brand Personality

Elite but not arrogant. **Considered, scholarly, discreet.** Refined, calm, precise language that signals intelligence, judgment, experience, and trust. Warm enough to show neurodivergent fluency, never clinical. The voice speaks to a parent evaluating judgment, not to a teen. Premium reads as restraint: the absence of urgency, popups, and manufactured scarcity is itself the signal of discretion this audience buys.

Vocabulary to use: student, family, mentor, strategy, judgment, thinking, writing, planning, trust, long-term. Vocabulary to refuse: empower, unlock potential, holistic journey, tailored solutions, cutting-edge, transformative, and abstract-noun stacks. No em dashes in copy.

## Anti-references

Must not look or read like:

- A mass tutoring marketplace or a test-prep company.
- A therapy clinic (no diagnostic register; describe situations, not diagnoses).
- A generic AI-generated education startup: gradient heroes, glowing cards, glassmorphism, stock photos of smiling teens, emoji icons, animated count-up stats, template SaaS layouts.
- A loud admissions firm with inflated outcome multipliers, fake scarcity, popups, or urgency bars.
- The 2026 AI-editorial lane: warm-cream background + Cormorant/Fraunces italic + tracked-uppercase eyebrow on every section. (The palette here is a committed client identity, but the type and section grammar must be chosen with intent, not by reflex.)

## Design Principles

1. **Premium is restraint.** Quiet, editorial, disciplined. Hierarchy is the conversion mechanism, not button count. Visibly *not* doing what competitors do is the brand statement.
2. **Honest over persuasive.** Every stat carries a quiet definition; no invented credentials, outcomes, schools, or results. Scarcity claims must be literally true.
3. **Seen before sold.** Lead each audience moment with the family's situation so they self-recognize, then offer the calm, single next step.
4. **Founder and people are the proof.** A specific, credentialed human is the category's most skeptic-proof asset; extend that credibility to the mentors who do the work.
5. **Flawless polish is a release blocker.** For this buyer, one visible defect costs more than a missing feature. Accessibility is baseline, not a feature.

## Accessibility & Inclusion

WCAG 2.2 AA is the floor, given the clinician-referral audience. One H1, correct heading order, full keyboard operability with visible focus and no focus traps (especially in the intake flow), verified contrast, real alt text on meaningful imagery, decorative marks hidden from assistive tech, and a globally honored `prefers-reduced-motion`.

Contrast danger zone is the gold pairing: small gold text must never use the decorative `--gold` (#96792d), which fails AA on both the tinted washes and on navy. It uses `--gold-ink` (#7a611f, ~5:1) on ivory/paper and `--gold-navy` (#c8ab5f, ~8:1) on navy. Light cards (`.panel`) placed inside `.on-navy` sections must restore dark-on-light text so post-interaction messages (form success/error) stay readable. The booking/contact path must be flawless with a screen reader and keyboard, since an inaccessible intake is the most damaging possible failure point.
