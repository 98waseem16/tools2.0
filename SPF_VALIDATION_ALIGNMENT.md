# SPF Validation Alignment with M3AAWG Best Practices

## Overview
This document ensures the SPF checker UI/UX aligns with industry best practices from M3AAWG (Messaging, Malware and Mobile Anti-Abuse Working Group) August 2017.

---

## Status Color Meanings

### ✅ Green (Success) - `status: 'pass'`
**What it means:** This mechanism is correctly configured with no issues.

**When to show:**
- Valid IP addresses (ip4:, ip6:) with proper CIDR notation
- Working include: mechanisms that resolve correctly
- Properly formatted a: and mx: mechanisms
- **Both `~all` (soft fail) AND `-all` (hard fail)** - BOTH ARE GOOD!
- All mechanisms when total lookups ≤ 10

**M3AAWG Alignment:**
- `~all` is explicitly recommended during SPF rollout (Section 4)
- `-all` is recommended once confident in configuration (Section 4)
- Both are acceptable long-term configurations

---

### ⚠️ Yellow (Warning) - `status: 'warning'`
**What it means:** This mechanism has issues but isn't critically broken.

**When to show:**
- Deprecated mechanisms (ptr:) that still work but are discouraged (Section 3.2.3)
- Wide CIDR blocks (/8, /16) that over-authorize (Section 3.2.2)
- Record size approaching limits (>255 chars) (Section 3.1)
- Individual mechanisms with DNS resolution issues
- Redirect positioning problems (Section 3.2.1)

**NEVER show for:**
- ❌ ALL includes just because total lookups > 10 (global issue, not per-mechanism)
- ❌ `~all` qualifier (this is perfectly acceptable!)

**M3AAWG Alignment:**
- Warnings guide users toward better configurations without claiming failure
- Wide netblocks are cautionary, not errors (Section 3.2.2)

---

### ❌ Red (Error/Fail) - `status: 'fail'`
**What it means:** This mechanism is critically misconfigured.

**When to show:**
- **`+all` or `?all` qualifiers** - allows anyone to send (Section 3.2.2)
- Syntax errors in mechanisms
- Unresolvable domains in include:/a:/mx: (Section 3.2.1)
- Invalid CIDR notation
- Total DNS lookups > 10 (RFC 7208 hard limit)

**M3AAWG Alignment:**
- `+all` is explicitly called out as a "massive security hole" (Section 3.2.2)
- Multiple SPF records cause unpredictable behavior (Section 3.2.1)

---

### ⚪ Gray (Neutral) - `status: 'neutral'` or `status: 'info'`
**What it means:** Informational, no action required.

**When to show:**
- DMARC integration recommendations (Section 4)
- General best practice suggestions
- Educational information

---

## Validation Rules by Mechanism Type

### `all` Mechanism

| Qualifier | Status | Color | Reasoning |
|-----------|--------|-------|-----------|
| `-all` | ✅ pass | Green | Hard fail - strongest protection |
| `~all` | ✅ pass | Green | Soft fail - acceptable, recommended during rollout |
| `+all` | ❌ fail | Red | Allows anyone to send - critical security issue |
| `?all` | ❌ fail | Red | Neutral - provides zero protection |

**M3AAWG Reference:** Section 3.2.2, Section 4

**Implementation:**
```typescript
// Both ~all and -all are acceptable
if (mechanism.qualifier === '~' || mechanism.qualifier === '-') {
  return 'success'
}
```

---

### `include:` Mechanisms

**Default Status:** ✅ Green (success)

**Show Warning (Yellow) if:**
- The specific include domain has DNS resolution issues (NXDOMAIN)
- The include is in the bp-unvetted-includes check (>5 includes total)

**Show Error (Red) if:**
- The include domain is completely unresolvable
- Syntax error in the include value

**NEVER show warning just because:**
- ❌ Total DNS lookups > 10 (this is a GLOBAL issue, not per-mechanism)

**M3AAWG Reference:** Section 3.2.2 (unvetted includes)

**Correct Logic:**
```typescript
// WRONG: Blanket marking all includes as warnings
if ((mechanism.type === 'include') && lookupCount > 10) {
  return 'warning' // ❌ DON'T DO THIS
}

// RIGHT: Only show warnings for specific mechanism issues
const mechanismChecks = checks.filter(c =>
  c.message.includes(mechanism.value)
)
if (mechanismChecks.some(c => c.status === 'warning')) {
  return 'warning' // ✅ CORRECT
}
```

---

### `ip4:` and `ip6:` Mechanisms

**Default Status:** ✅ Green (success)

**Show Warning (Yellow) if:**
- CIDR block is /8 or /16 (IPv4) - authorizes millions of IPs
- CIDR block is /48 or smaller (IPv6) - very wide range

**Show Error (Red) if:**
- Invalid IP address format
- Invalid CIDR notation (mask out of range)
- Missing IP address value

**M3AAWG Reference:** Section 3.2.2 (wide netblocks)

---

### `a:` and `mx:` Mechanisms

**Default Status:** ⚠️ Yellow (warning) IF >2 a:/mx: mechanisms

**Why Warning:**
- Each a:/mx: consumes 1 DNS lookup
- Slower SPF evaluation
- Better to use ip4:/ip6: directly when possible

**M3AAWG Reference:** Section 3.2.3 (performance)

---

### `ptr:` Mechanism

**Status:** ⚠️ Yellow (warning) - ALWAYS

**Why:**
- Deprecated by RFC 7208
- Slow (reverse DNS + forward DNS)
- Unreliable, may timeout

**M3AAWG Reference:** Section 3.2.3

---

### `redirect:` Mechanism

**Default Status:** ✅ Green (success)

**Show Warning (Yellow) if:**
- redirect: is not the last mechanism
- redirect: coexists with all mechanism (conflicting)

**M3AAWG Reference:** Section 3.2.1

---

## Global Checks (Not Per-Mechanism)

### DNS Lookup Limit
- **Status:** ❌ Fail if lookupCount > 10
- **Status:** ⚠️ Warning if lookupCount > 8 (approaching limit)
- **Status:** ✅ Pass if lookupCount ≤ 10

**Important:** This is a GLOBAL check - don't propagate it to individual mechanisms

---

### Record Size
- **Status:** ❌ Fail if > 400 characters (critical)
- **Status:** ⚠️ Warning if > 255 characters (DNS TXT limit)
- **Status:** ✅ Pass if ≤ 255 characters

**M3AAWG Reference:** Section 3.1

---

### Multiple SPF Records
- **Status:** ❌ Fail if >1 SPF TXT record exists
- **Impact:** Unpredictable SPF evaluation

**M3AAWG Reference:** Section 3.2.1

---

## Scoring Logic

Score ranges from 0-5:

```typescript
let score = 0
if (recordString && valid) score = 1
if (lookupCount <= 10) score = 2

// Both ~all and -all score equally well
if (allQualifier === '~all' || allQualifier === '-all') {
  score = 3
  if (lookupCount <= 8) score = 4
  if (lookupCount <= 5) score = 5
}
```

**Key Point:** `~all` and `-all` receive the SAME scoring (3-5 based on optimization)

---

## Recommendation Logic

### ✅ CORRECT Recommendations:

**For `+all` or `?all`:**
```
"Update SPF to use '-all' or '~all' for proper email authentication"
```

**For excessive lookups:**
```
"Reduce SPF DNS lookups by consolidating includes or using IP ranges"
```

**For approaching lookup limit:**
```
"Optimize SPF record to stay well below the 10 lookup limit"
```

### ❌ INCORRECT Recommendations:

**DON'T recommend changing `~all` to `-all`:**
```
// WRONG - removed this
"Consider using -all (hard fail) instead of ~all (soft fail)"
```

**Reasoning:**
- M3AAWG explicitly recommends `~all` during rollout
- `~all` is perfectly acceptable long-term
- The choice between `~all` and `-all` depends on organizational risk tolerance

---

## UI Component Alignment

### CompactStatsBar
- Shows overall status badge (Valid/Invalid)
- DNS lookup count with color coding:
  - Green: ≤8
  - Yellow: 9-10
  - Red: >10
- Service count (informational)

### MechanismLine
- Each mechanism shows:
  - Status icon (✓, ⚠, ✗, ○)
  - Qualifier with color (+green, -red, ~yellow, ?gray)
  - Mechanism type (INCLUDE, IP4, ALL, etc.)
  - Value (with service popover for includes)
  - Expand button for includes/redirects

### ServicePopover
- Shows service info on hover
- Logo, name, category
- Can show M3AAWG warnings specific to that service
- DOES NOT show global warnings (like total lookups)

---

## Testing Checklist

### Test Domain: `datarobot.com`
- [x] `~all` shows as GREEN ✓
- [x] `-all` shows as GREEN ✓
- [x] Include mechanisms show as GREEN (unless specific issues)
- [x] Global "DNS lookups exceeded" shows as RED (fail)
- [x] Individual includes NOT yellow just because lookups > 10
- [x] Score: 2/5 (has record, but exceeds lookup limit)

### Test Domain: `google.com`
- [ ] Should show GREEN for all valid mechanisms
- [ ] `~all` or `-all` shows as GREEN
- [ ] Score: 4-5/5 (well-optimized)

### Test Domain with `+all`:
- [ ] `+all` mechanism shows as RED ✗
- [ ] Error message explains security risk
- [ ] Recommendation to change to `-all` or `~all`

---

## M3AAWG Document Mapping

| Section | Topic | Implementation |
|---------|-------|----------------|
| 3.1 | Record Construction | Record size checks, single record validation |
| 3.2.1 | Syntax Issues | Multiple records, unresolvable hosts, Type 99, redirect positioning |
| 3.2.2 | Over-Authorization | Wide CIDR blocks (/8, /16), `+all` detection, unvetted includes |
| 3.2.3 | Deprecated Features | PTR mechanism warning, SenderID (spf2.0) detection, A/MX performance |
| 4 | Recommendations | DMARC integration, `~all` during rollout, `-all` when confident |

---

## Key Principles

1. **`~all` IS GOOD** - Never mark as warning or error
2. **`-all` IS GOOD** - Same scoring as `~all`
3. **`+all` IS BAD** - Always mark as critical error
4. **Global issues are GLOBAL** - Don't propagate to individual mechanisms
5. **Individual mechanism issues** - Only show warnings/errors for specific problems with that mechanism
6. **M3AAWG alignment** - Every check references the source document section
7. **Educational, not prescriptive** - Guide users, don't force arbitrary preferences

---

## Files Updated

1. `/lib/api/parsers/spf.ts` - Fixed `~all` check status and scoring
2. `/lib/utils/spf-status.ts` - Fixed mechanism status detection logic
3. `/lib/validation/spf-best-practices.ts` - Added M3AAWG knowledge base
4. `/lib/utils/spf.ts` - Added CIDR analysis helpers

---

## Summary

The SPF checker now properly aligns with M3AAWG best practices:
- ✅ Both `~all` and `-all` show as green (success)
- ✅ Include mechanisms only show warnings for specific issues
- ✅ Global checks (lookup limit) don't cascade to individual mechanisms
- ✅ All validation checks reference M3AAWG document sections
- ✅ Educational recommendations guide users without being prescriptive
