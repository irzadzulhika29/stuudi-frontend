# Button Disabled Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membuat komponen `Button` benar-benar non-interaktif saat disabled, termasuk saat memakai `href`.

**Architecture:** Tambahkan branch render khusus untuk `href + disabled` yang menghasilkan elemen non-interaktif, lalu lindungi perilaku itu dengan regression test Testing Library.

**Tech Stack:** React, Next.js, TypeScript, Vitest, Testing Library

---

### Task 1: Tambah regression tests

**Files:**

- Create: `src/shared/components/ui/__tests__/Button.test.tsx`

- [ ] Uji button biasa disabled
- [ ] Uji link button aktif
- [ ] Uji link button disabled non-interaktif

### Task 2: Implement disabled link-button behavior

**Files:**

- Modify: `src/shared/components/ui/Button.tsx`

- [ ] Tambahkan branch `href && disabled`
- [ ] Render elemen non-interaktif dengan style disabled
- [ ] Pertahankan behavior existing untuk button biasa dan link aktif

### Task 3: Verify

**Files:**

- Test: `src/shared/components/ui/__tests__/Button.test.tsx`

- [ ] Jalankan test terfokus
- [ ] Jalankan build
