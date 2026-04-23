# CBT Start Gating Design

**Goal**

Merapikan flow awal CBT agar hasil `student/exams/access` dipakai penuh untuk mengarahkan keputusan user sebelum `student/exams/{examId}/start`, tanpa memblokir system check lebih awal.

**Context**

- User tetap masuk ke halaman system check setelah memasukkan kode exam.
- Tombol akhir `Mulai Ujian Sekarang` menjadi gate resmi.
- Backend sudah mengembalikan status penting: `can_start`, `attempts_left`, `message`, `start_time`, dan `end_time`.

**Design**

1. Halaman check tetap memanggil `accessExam(code)` saat load untuk mengambil metadata exam.
2. `SystemCheckContainer` menerima status akses yang lebih eksplisit:
   - apakah eligibility backend mengizinkan start
   - pesan backend yang harus ditampilkan
   - informasi attempt dan window waktu ujian
3. Tombol final start hanya aktif ketika:
   - fullscreen aktif
   - kamera aktif
   - status backend masih mengizinkan start
4. Saat tombol start ditekan, frontend melakukan recheck `accessExam(code)` sekali lagi sebelum memanggil `startExam(exam_id)`.
5. Jika recheck gagal eligibility:
   - `startExam` tidak dipanggil
   - pesan backend terbaru ditampilkan ke user
6. Jika recheck lolos:
   - frontend memanggil `startExam`
   - route diarahkan ke `/cbt/exam?examId=...`

**UI Behavior**

- System check tetap bisa dilakukan walaupun exam belum eligible.
- Panel kanan menampilkan:
  - course name
  - title
  - duration
  - total questions
  - attempts tersisa
  - rentang waktu exam
  - badge status `Siap Dimulai` atau `Belum Bisa Dimulai`
- Di bawah tombol start ditampilkan pesan backend sebagai alasan utama.

**Testing**

- Tambah unit test untuk util eligibility agar aturan tombol start stabil.
- Verifikasi halaman check tetap bisa masuk, tapi tombol final disabled saat backend bilang belum bisa start.
- Verifikasi recheck sebelum start menghormati status terbaru dari backend.
