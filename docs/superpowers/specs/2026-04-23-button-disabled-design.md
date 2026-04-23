# Button Disabled Design

**Goal**

Memastikan komponen `Button` benar-benar non-interaktif saat `disabled`, termasuk ketika dipakai dengan `href`.

**Problem**

- Untuk `<button>`, atribut `disabled` bekerja normal.
- Untuk varian `href`, komponen saat ini merender `Link`, sehingga status disabled hanya visual dan masih bisa diklik.

**Design**

1. Pertahankan render `<button>` untuk button biasa.
2. Untuk `href` yang aktif, tetap render `Link`.
3. Untuk `href` yang disabled, render elemen non-interaktif dengan styling button yang sama.
4. Tambahkan indikator aksesibilitas seperti `aria-disabled`.
5. Tambahkan regression test untuk memastikan:
   - button biasa disabled tetap disabled
   - link-button disabled tidak merender link interaktif
   - link-button aktif tetap merender link
