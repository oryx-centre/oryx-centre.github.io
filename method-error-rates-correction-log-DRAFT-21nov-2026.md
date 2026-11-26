# Open methodology, error rates by field, and correction log — DRAFT

**DRAFT — NOT PUBLISHED — 21 Nov 2026**
**Purpose:** close Scite gap #4 (scite-ai-competitive-research report §7): open
methodology + published error rates by field + an auditable correction log.
**Publish needs Amartya's go.** This file is the draft only.

## 1. Open methodology — already published, linked not repeated

The method is already open at `oryxai.in/method.html` ("The Oryx Evidence
Standard", CC BY 4.0): the Check–Show–Stand frame, the five-verdict taxonomy
(Verified / Broken / Title mismatch / No URL / Unverifiable), the evidence
table, provenance block, SHA-256 report seal, and denominator discipline.
The audit itself is Paper 2 v2, DOI 10.5281/zenodo.23731235; the method is
Working Paper v3, DOI 10.5281/zenodo.23718472.

This draft does **not** rewrite the method. When published, it adds the two
things the method page does not yet carry: error rates by field (§2) and the
correction log (§3). The method page should link to both, not duplicate them.

## 2. Error rates — overall (verified) and by field (not yet available)

### Overall rates — the 194-citation audit (Paper 2 v2)

| Verdict | Count | Rate |
|---|---|---|
| Verified — source resolves, exists, and supports the claim | 50 | 25.8% |
| Broken — link does not resolve to a retrievable source | 95 | 49.0% |
| Title mismatch — source exists but does not match the citation / what it says | 17 | 8.8% |
| No URL — citation carries no link or locator | 1 | 0.5% |
| Unverifiable — cannot be confirmed or denied from what is available | 31 | 16.0% |
| **Total checked** | **194** | **100%** |

Derived rates (same denominator, 194): fabrication (Broken + No URL) 96/194 =
**49.5%**; citation precision (Verified share) **25.8%**.

Companion figure — the 66-citation study: 31 broken, 17 verified, 7 mismatch,
11 unverifiable; only **5 of 66** citations both resolved AND fully supported
the claim.

### Error rates BY FIELD — NOT YET AVAILABLE (do not publish a field table until this is done)

The 194-citation audit's 30 briefs have not been coded by field in any
published table, and no field-level verdict split exists in the workspace.
**No field breakdown is asserted here.** Publishing invented field splits
would be exactly the kind of unverified claim the audit exists to catch.

**Defined step to produce it (agent work, no publish):**
1. Take the 30 briefs in Paper 2 v2's corpus and code each brief to one field
   (e.g. AI policy, health, climate, economics, education — categories from
   the briefs themselves, not imposed afterwards).
2. Re-tabulate the five verdicts per field, with raw counts per field.
   Publish counts alongside every percentage; never a percentage alone.
3. State the per-field denominators. Any field with fewer than 10 citations
   is reported as counts only, with no rate — a rate on n<10 is noise dressed
   as evidence.
4. Human review gate (Riya Nalwa) signs the table before it is published.

Until that table exists and is reviewed, the honest public statement is:
*"Overall error rates are published. Field-level rates are being compiled
from the same corpus and will be published with their denominators."*

## 3. Auditable correction log

**Rule:** every correction to a published audit finding, method statement, or
reported figure is logged here with the date, what changed, why, and the
evidence — and the corrected version keeps the old figure visible with a
strikethrough, never silently overwritten. Corrections are versioned with the
paper (Paper 2 v2 → v2.1, etc.).

**Entries to date (21 Nov 2026): none.** No correction to a published audit
finding has been needed since Paper 2 v2. The log starts empty and stays
visible — an empty log with the rule stated is more credible than no log.

**What belongs here when it happens (template):**

| Date | Item corrected | Was | Now | Why / evidence |
|---|---|---|---|---|
| YYYY-MM-DD | e.g. "Brief 14, citation 3: verdict" | Broken | Title mismatch | Re-check on [date]: source resolves to [URL]; title differs from citation. Evidence table row updated; Paper 2 v2.1. |

**What does NOT belong here:** internal record corrections (e.g. the GovAI
pack citation fix of 18 Nov, or the IECA submission-status correction of
20 Nov) — those are workspace records, not published audit findings. Only
corrections to things the public was told go in the public log.

## 4. What publishing this needs (checklist for Amartya's go)

- [ ] Field-level table built per §2 (counts + denominators, human-reviewed).
- [ ] This draft converted to a site page (method.html links to it; it links
      back to method.html, Paper 2 v2, and Working Paper v3).
- [ ] Amartya approves the exact published text — including the "not yet
      available" field statement, which must stay until the table is real.
