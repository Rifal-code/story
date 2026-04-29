oke kalo gitu berikut adalah tujaun akhirnya:

Submission ini menugaskan Anda membuat aplikasi dengan tema berbagi cerita. Tugas tersebut menjadi salah satu syarat untuk lulus dari kelas ini. Kami mengedepankan kreativitas Anda dalam membangun aplikasi, tetapi pastikan aplikasi yang dibuat memenuhi kriteria yang akan dijelaskan berikut.

dan berikut untuk kriterianya
Kriteria 1: Menerapkan SPA dan Transisi Halaman
Aplikasi yang Anda buat harus mengadopsi arsitektur Single-Page Application (SPA) seperti yang kami contohkan pada proyek latihan. Berikut adalah ketentuan yang diterapkan.

Rejected (submission akan ditolak)

Submission akan ditolak jika tidak menerapkan SPA dan/atau belum menerapkan transition view.
Submission akan ditolak jika tidak memisahkan dan/atau membuat halaman terkait authentication (register user, login user) dan homepage yang menampilkan data dari API.
Basic (+2 pts)

Dapat membuat SPA sederhana dengan navigasi antar halaman menggunakan metode hash routing, tanpa reload halaman, dan menerapkan view transition.

Detailnya:

Menerapkan konsep SPA untuk melakukan navigasi antar halaman dengan metode hash routing.
Menerapkan transisi halaman default (tanpa custom transition).
Skilled (+3 pts)

Menerapkan pemahaman SPA lebih dalam ATAU implementasi custom transisi halaman.

Detailnya:

Menerapkan arsitektur MVP dalam implementasi SPA; ATAU
Menerapkan custom transition view.
Advance (+4 pts)

Menerapkan pemahaman SPA lebih dalam DAN implementasi custom transisi halaman.

Detailnya:

Menerapkan arsitektur MVP dalam implementasi SPA; DAN
Menerapkan custom transition view.
Kriteria 2: Menampilkan Data dan Marker Pada Peta
Aplikasi memiliki halaman yang menampilkan data dari API dan disajikan pada peta digital. Anda WAJIB mengambil API sebagai sumber datanya. Pemilihan ini juga akan menentukan topik aplikasi yang akan Anda kembangkan. Oleh karena itu, kami sediakan API yang bisa dimanfaatkan.

Story API Documentation

Catatan
Saat ini baru tersedia 1 API yang dapat Anda gunakan. Ke depannya, memungkinkan untuk lebih dari satu.

Berikut adalah ketentuan yang diterapkan.

Rejected (submission akan ditolak)

Submission akan ditolak jika aplikasi belum berhasil menampilkan data dan/atau tidak terdapat penyajian data dalam peta digital.

Basic (+2 pts)

Aplikasi dapat menampilkan data dari API dalam bentuk daftar, serta memvisualisasikan lokasi data pada peta digital dengan marker dan popup.

Detailnya:

Menampilkan data dari API (minimal gambar dan 3 text); DAN
Melakukan visualisasi pada peta dengan marker dan pop-up.
Skilled (+3 pts)
Peta digital memiliki fitur interaktif.

Detailnya:

Memenuhi ketentuan basic.
Membuat 1 fungsionalitas untuk interaksi dengan peta. Fitur interaktivitas seperti:
Filter lokasi;
Highlight marker aktif; atau
sinkronisasi list dan peta.
Advance (+4 pts)

Peta digital memiliki fitur multiple tile layer.

Detailnya:

Memenuhi ketentuan skilled.
Menerapkan layer control dengan memiliki 2 atau lebih tile layer.
Catatan
Jika aplikasi Anda membutuhkan API key dalam penggunaan map service, SERTAKAN dalam STUDENT.txt. Bila tidak memiliki berkas tersebut, silakan buat baru dalam root project, ya.

Kriteria 3: Memiliki Fitur Tambah Data Baru
Selain menampilkan data ke halaman, aplikasi WAJIB punya kemampuan menambahkan data baru ke API. Tentunya, ini berpotensi membutuhkan halaman baru untuk menampilkan formulir. Pastikan halaman tersebut berisi kolom-kolom input yang dibutuhkan untuk mendapatkan data dari user.

Berikut ketentuan yang diterapkan.

Rejected (submission akan ditolak)

Belum terdapat form untuk mengisi data baru.
Tidak ada implementasi HTTP Request yang mengirim data baru ke API.
Basic (+2 pts)

Terdapat form untuk mengirimkan data baru ke API.

Detailnya:

Mengimplementasikan form tambah data yang dilengkapi dengan upload file.
Pemilihan nilai latitude dan longitude dilakukan melalui event klik di peta digital.
Mengirimkan data tersebut ke API melalui HTTP Request secara asynchronous (menggunakan Fetch API atau library eksternal)
Skilled (+3 pts)

Meningkatkan pengalaman pengguna untuk fitur penambahan data.

Detailnya:

Memenuhi ketentuan basic.
Menambahkan interaktivitas pada form, seperti:
Validasi input; atau
Pesan error yang jelas ketika pengiriman data berhasil ataupun gagal.
Advance (+4 pts)

Memiliki opsi mengirim gambar melalui kamera langsung ketika tambah data.

Detailnya:

Memenuhi ketentuan skilled.
Memiliki opsi memilih gambar yang ditangkap melalui kamera langsung (media stream).
Pastikan media stream ditutup ketika sudah tidak digunakan.
Kriteria 4: Menerapkan Aksesibilitas sesuai dengan Standar
Aplikasi harus memiliki pengalaman pengguna yang baik, salah satunya dengan memperhatikan aspek aksesibilitas.

Berikut beberapa ketentuan yang diterapkan.

Rejected (submission akan ditolak)

Tidak memberikan alternatif teks pada setiap gambar.
Tidak menggunakan HTML element yang semantik.
Tidak ada label pada setiap elemen input.
Catatan
Berikan alternatif teks dengan nilai string kosong (“”) untuk gambar yang sifatnya dekoratif atau tidak menyampaikan informasi penting.

Basic (+2 pts)

Aplikasi menerapkan aksesibilitas dasar.

Detailnya:

Menerapkan teks alternatif pada setiap gambar.
Menggunakan HTML elemen yang semantik.
Memberikan label pada setiap elemen input.
Skilled (+3 pts)

Aplikasi memiliki tampilan responsive.

Detailnya:

Menerapkan ketentuan basic.
Menerapkan tampilan yang responsif (indikasinya tidak ada elemen yang bertumpuk) pada ukuran layar:
Mobile: 375px
Tablet: 768px
Desktop: 1024px 
Advance (+4 pts)

Memperhatikan aksesibilitas lebih jauh lagi.

Detailnya:

Menerapkan ketentuan skilled.
Menerapkan fitur skip to content.
Seluruh elemen yang sifatnya interaktif dapat dioperasikan dengan keyboard.

saya harap kamu memahami semua kriteria yang diberikan,dan untuk dokumentasi apinya saya harap kamu cari sendiri berdasarkan link ini https://story-api.dicoding.dev/v1/#/,atau kalo ngga bisa lo tanya guer aja biar gue kais salinan dokumentasi apinya,dan kalo kamu bisa saya ingin designnya seperti website saweria yang memiliki tampilan clean dan card yang menarik sperti gambar yang saya kirimkan,gunakan atau install tailwindcss untuk styling,buat plan sekarang ya