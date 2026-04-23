# CBT Start Gating Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Memakai hasil `accessExam` sebagai gate final sebelum `startExam`, sambil memperjelas status eligibility exam di halaman system check.

**Architecture:** Tambahkan util eligibility yang menerima `ExamAccessData`, gunakan util itu di halaman check dan `SystemCheckContainer`, lalu lakukan recheck `accessExam` tepat sebelum `startExam`. Komponen tetap client-driven dan tidak mengubah runtime exam yang sudah stabil.

**Tech Stack:** Next.js App Router, React client components, TypeScript, Vitest, Testing Library

---

### Task 1: Tambahkan util eligibility access exam

**Files:**

- Create: `src/features/user/cbt/utils/accessExamStatus.ts`
- Create: `src/features/user/cbt/utils/__tests__/accessExamStatus.test.ts`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation**
- [ ] **Step 4: Run test to verify it passes**

### Task 2: Wire check page to recheck eligibility before start

**Files:**

- Modify: `src/app/cbt/check/page.tsx`
- Modify: `src/features/user/dashboard/services/dashboardService.ts`

- [ ] **Step 1: Add failing test coverage where practical via util-level behavior**
- [ ] **Step 2: Recheck `accessExam(code)` before `startExam(exam_id)`**
- [ ] **Step 3: Surface backend message when start is rejected**
- [ ] **Step 4: Keep success route on `examId` path**

### Task 3: Refine SystemCheckContainer status rendering

**Files:**

- Modify: `src/features/user/cbt/containers/SystemCheckContainer.tsx`

- [ ] **Step 1: Consume eligibility state from parent**
- [ ] **Step 2: Disable final start button when backend disallows start**
- [ ] **Step 3: Show attempts, window, status badge, and backend message**
- [ ] **Step 4: Keep fullscreen and camera checks as local prerequisites**

### Task 4: Verify

**Files:**

- Test: `src/features/user/cbt/utils/__tests__/accessExamStatus.test.ts`

- [ ] **Step 1: Run focused vitest suite**
- [ ] **Step 2: Run broader CBT regression suite**
- [ ] **Step 3: Run `npm run build`**
