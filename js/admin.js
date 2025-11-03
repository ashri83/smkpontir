// admin.js - CMS Functionality (FULL VERSION dengan Auth)
class SMKAdmin {
    constructor() {
        // Check authentication pertama kali
        const session = this.checkAuth();
        if (!session) {
            console.log('No valid session, redirecting to login...');
            return;
        }

        this.currentUser = session;
        this.currentTab = 'beranda';
        this.editingId = null; // Untuk mode edit
        this.initDefaultData();
        this.init();
    }

    checkAuth() {
        try {
            const session = JSON.parse(localStorage.getItem('admin_session'));
            if (!session || session.expires < Date.now()) {
                this.redirectToLogin();
                return null;
            }
            return session;
        } catch (e) {
            this.redirectToLogin();
            return null;
        }
    }

    redirectToLogin() {
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    init() {
        this.setupAuthUI();
        this.setupEventListeners();
        this.loadBeritaData();
        this.setDefaultDate();
        this.tampilkanTotalFoto();
        this.loadStats();
    }

    setupAuthUI() {
        // Update UI dengan info user
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: var(--secondary); width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-user" style="color: white;"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600;">${this.currentUser.nama}</div>
                        <div style="font-size: 0.8rem; color: #666;">${this.currentUser.role}</div>
                    </div>
                </div>
                <button onclick="admin.logout()" class="btn btn-sm" style="margin-left: 15px;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            `;
        }

        // Sesuaikan permissions berdasarkan role
        this.setupPermissions();
    }

    setupPermissions() {
        const canEdit = this.currentUser.role === 'superadmin' || this.currentUser.role === 'editor';
        const canDelete = this.currentUser.role === 'superadmin';

        // Disable element berdasarkan permission
        if (!canDelete) {
            document.querySelectorAll('.btn-danger').forEach(btn => {
                btn.style.display = 'none';
            });
        }

        if (!canEdit) {
            document.querySelectorAll('#formBerita, #formGaleri, #formPengumuman').forEach(form => {
                form.querySelectorAll('input, textarea, select, button').forEach(element => {
                    element.disabled = true;
                });
            });
        }
    }

    initDefaultData() {
        // Data galeri default jika belum ada
        if (!localStorage.getItem('smk_galeri') || JSON.parse(localStorage.getItem('smk_galeri')).length === 0) {
            const defaultGaleri = [
                {
                    id: 1,
                    judul: "Kegiatan Pramuka",
                    gambar: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    kategori: "kegiatan",
                    tanggal: "2023-08-15"
                },
                {
                    id: 2,
                    judul: "Workshop Kewirausahaan", 
                    gambar: "https://images.unsplash.com/photo-1541336032412-2048a678540d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
                    kategori: "kegiatan",
                    tanggal: "2023-08-10"
                },
                {
                    id: 3,
                    judul: "Prestasi Siswa",
                    gambar: "https://images.unsplash.com/photo-1588072432836-1007cdac2ad9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    kategori: "prestasi",
                    tanggal: "2023-08-05"
                },
                {
                    id: 4,
                    judul: "Kunjungan Industri",
                    gambar: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1122&q=80",
                    kategori: "kegiatan",
                    tanggal: "2023-08-01"
                },
                {
                    id: 5,
                    judul: "Pelatihan Guru",
                    gambar: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    kategori: "kegiatan",
                    tanggal: "2023-07-28"
                },
                {
                    id: 6,
                    judul: "Gedung Sekolah",
                    gambar: "https://images.unsplash.com/photo-1562813733-b31f71025d54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
                    kategori: "fasilitas",
                    tanggal: "2023-07-25"
                },
                {
                    id: 7,
                    judul: "Laboratorium Komputer",
                    gambar: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    kategori: "fasilitas",
                    tanggal: "2023-07-20"
                },
                {
                    id: 8,
                    judul: "Laboratorium Jaringan",
                    gambar: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    kategori: "fasilitas",
                    tanggal: "2023-07-15"
                }
            ];
            localStorage.setItem('smk_galeri', JSON.stringify(defaultGaleri));
            console.log('Data galeri default berhasil dibuat!');
        }

        // Data berita default jika belum ada
        if (!localStorage.getItem('smk_berita') || JSON.parse(localStorage.getItem('smk_berita')).length === 0) {
            const defaultBerita = [
                {
                    id: 1,
                    judul: "Kegiatan Pramuka SMK PONDOK PETIR",
                    tanggal: "2023-08-15",
                    gambar: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    deskripsi: "Kegiatan perkemahan Jumat-Sabtu (Persami) dilaksanakan di Bumi Perkemahan Cibubur...",
                    konten: "Kegiatan perkemahan Jumat-Sabtu (Persami) dilaksanakan di Bumi Perkemahan Cibubur dengan peserta seluruh siswa kelas X. Kegiatan ini bertujuan untuk melatih kemandirian dan kerja sama tim.",
                    penulis: "Admin",
                    status: "published"
                },
                {
                    id: 2,
                    judul: "Workshop Kewirausahaan untuk Siswa Kelas XII",
                    tanggal: "2023-08-10",
                    gambar: "https://images.unsplash.com/photo-1541336032412-2048a678540d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
                    deskripsi: "SMK PONDOK PETIR mengadakan workshop kewirausahaan dengan menghadirkan pengusaha sukses...",
                    konten: "SMK PONDOK PETIR mengadakan workshop kewirausahaan dengan menghadirkan pengusaha sukses alumni SMK. Workshop ini memberikan inspirasi dan pengetahuan praktis tentang memulai bisnis.",
                    penulis: "Admin",
                    status: "published"
                }
            ];
            localStorage.setItem('smk_berita', JSON.stringify(defaultBerita));
        }

        // Data pengumuman default
        if (!localStorage.getItem('smk_pengumuman') || JSON.parse(localStorage.getItem('smk_pengumuman')).length === 0) {
            const defaultPengumuman = [
                {
                    id: 1,
                    judul: "Penerimaan Siswa Baru Tahun Ajaran 2024/2025",
                    tanggal: new Date().toISOString().split('T')[0],
                    isi: "Pendaftaran siswa baru telah dibuka. Silakan daftar melalui website atau datang langsung ke sekolah.",
                    status: "active",
                    penting: true
                }
            ];
            localStorage.setItem('smk_pengumuman', JSON.stringify(defaultPengumuman));
        }
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.getAttribute('data-tab'));
            });
        });

        // Form submissions
        document.getElementById('formBerita')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.tambahBerita();
        });

        document.getElementById('formGaleri')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.tambahGaleri();
        });

        document.getElementById('formPengumuman')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.tambahPengumuman();
        });

        // Image preview
        document.getElementById('gambarBerita')?.addEventListener('change', (e) => {
            this.previewImage(e.target, 'previewBerita');
        });

        document.getElementById('gambarGaleri')?.addEventListener('change', (e) => {
            this.previewImage(e.target, 'previewGaleri');
        });

        // Navigation links
        document.querySelectorAll('.nav-links li').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.closest('li').getAttribute('data-tab') || 'beranda';
                this.switchTab(target);
            });
        });

        // Search functionality
        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Export data
        document.getElementById('exportData')?.addEventListener('click', () => {
            this.exportData();
        });

        // Import data
        document.getElementById('importData')?.addEventListener('click', () => {
            document.getElementById('fileImport').click();
        });

        document.getElementById('fileImport')?.addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`)?.classList.add('active');

        this.currentTab = tabName;

        // Load data berdasarkan tab
        switch(tabName) {
            case 'kelola-berita':
                this.loadBeritaData();
                break;
            case 'galeri':
                this.tampilkanTotalFoto();
                break;
            case 'pengumuman':
                this.loadPengumumanData();
                break;
            case 'statistik':
                this.loadStats();
                break;
        }
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('tanggalBerita') && (document.getElementById('tanggalBerita').value = today);
        document.getElementById('tanggalPengumuman') && (document.getElementById('tanggalPengumuman').value = today);
    }

    previewImage(input, previewId) {
        const file = input.files[0];
        const preview = document.getElementById(previewId);
        
        if (file && preview) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    }

    async tambahBerita() {
        // Check permission
        if (!this.hasPermission('editor')) {
            this.showAlert('Anda tidak memiliki izin untuk menambah berita!', 'error');
            return;
        }

        const formData = {
            judul: document.getElementById('judulBerita').value,
            tanggal: document.getElementById('tanggalBerita').value,
            deskripsi: document.getElementById('deskripsiBerita').value,
            konten: document.getElementById('kontenBerita').value,
            gambar: document.getElementById('gambarBerita').files[0] ? await this.uploadImage(document.getElementById('gambarBerita').files[0]) : 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            penulis: this.currentUser.nama,
            status: 'published'
        };

        if (this.editingId) {
            // Update existing berita
            this.updateBerita(this.editingId, formData);
            this.showAlert('Berita berhasil diperbarui!', 'success');
            this.editingId = null;
        } else {
            // Tambah berita baru
            this.simpanBerita(formData);
            this.showAlert('Berita berhasil ditambahkan!', 'success');
        }

        this.resetForm('formBerita');
    }

    async tambahGaleri() {
        // Check permission
        if (!this.hasPermission('editor')) {
            this.showAlert('Anda tidak memiliki izin untuk menambah galeri!', 'error');
            return;
        }

        const fileInput = document.getElementById('gambarGaleri');
        
        if (!fileInput?.files[0]) {
            this.showAlert('Silakan pilih foto!', 'error');
            return;
        }

        try {
            // Upload gambar
            const gambarUrl = await this.uploadImage(fileInput.files[0]);
            
            const formData = {
                id: Date.now(),
                judul: document.getElementById('judulGaleri').value,
                kategori: document.getElementById('kategoriGaleri').value,
                gambar: gambarUrl,
                tanggal: new Date().toISOString().split('T')[0],
                uploader: this.currentUser.nama
            };

            // AMBIL data yang sudah ada, TAMBAH yang baru
            let semuaGaleri = JSON.parse(localStorage.getItem('smk_galeri') || '[]');
            semuaGaleri.unshift(formData); // Tambah di awal array
            
            // SIMPAN kembali data lengkap
            localStorage.setItem('smk_galeri', JSON.stringify(semuaGaleri));
            this.updateWebsiteData('galeri', semuaGaleri);
            
            this.showAlert('Foto berhasil ditambahkan ke galeri! Total: ' + semuaGaleri.length + ' foto', 'success');
            this.resetForm('formGaleri');
            this.tampilkanTotalFoto();
            
        } catch (error) {
            this.showAlert('Error upload gambar: ' + error.message, 'error');
        }
    }

    tambahPengumuman() {
        // Check permission
        if (!this.hasPermission('editor')) {
            this.showAlert('Anda tidak memiliki izin untuk membuat pengumuman!', 'error');
            return;
        }

        const formData = {
            judul: document.getElementById('judulPengumuman').value,
            tanggal: document.getElementById('tanggalPengumuman').value,
            isi: document.getElementById('isiPengumuman').value,
            status: document.getElementById('statusPengumuman').value,
            pembuat: this.currentUser.nama,
            penting: document.getElementById('pentingPengumuman')?.checked || false
        };

        this.simpanPengumuman(formData);
        this.showAlert('Pengumuman berhasil dipublikasi!', 'success');
        this.resetForm('formPengumuman');
    }

    async uploadImage(file) {
        // Simulasi upload - di real implementation, ini akan upload ke server
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Untuk demo, kita simpan sebagai data URL
                // Di production, ini akan return URL gambar dari server
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    simpanBerita(berita) {
        let semuaBerita = JSON.parse(localStorage.getItem('smk_berita') || '[]');
        berita.id = Date.now(); // ID unik
        semuaBerita.unshift(berita); // Tambah di awal array
        localStorage.setItem('smk_berita', JSON.stringify(semuaBerita));
        
        this.updateWebsiteData('berita', semuaBerita);
        this.loadBeritaData(); // Refresh table
        this.backupData(); // Auto backup
    }

    updateBerita(id, newData) {
        let semuaBerita = JSON.parse(localStorage.getItem('smk_berita') || '[]');
        const index = semuaBerita.findIndex(b => b.id === id);
        
        if (index !== -1) {
            semuaBerita[index] = { ...semuaBerita[index], ...newData };
            localStorage.setItem('smk_berita', JSON.stringify(semuaBerita));
            this.updateWebsiteData('berita', semuaBerita);
            this.loadBeritaData(); // Refresh table
            this.backupData(); // Auto backup
        }
    }

    simpanGaleri(galeri) {
        // Data sudah disimpan di method tambahGaleri()
        this.backupData(); // Auto backup
    }

    simpanPengumuman(pengumuman) {
        let semuaPengumuman = JSON.parse(localStorage.getItem('smk_pengumuman') || '[]');
        pengumuman.id = Date.now();
        semuaPengumuman.unshift(pengumuman);
        localStorage.setItem('smk_pengumuman', JSON.stringify(semuaPengumuman));
        
        this.updateWebsiteData('pengumuman', semuaPengumuman);
        this.backupData(); // Auto backup
    }

    updateWebsiteData(jenis, data) {
        console.log(`Update ${jenis} data:`, data.length, 'items');
        localStorage.setItem(`website_${jenis}`, JSON.stringify(data));
    }

    loadBeritaData() {
        const semuaBerita = JSON.parse(localStorage.getItem('smk_berita') || '[]');
        const tableBody = document.getElementById('tableBerita');
        
        if (tableBody) {
            tableBody.innerHTML = semuaBerita.map(berita => `
                <tr>
                    <td>${this.formatTanggal(berita.tanggal)}</td>
                    <td>
                        <strong>${berita.judul}</strong>
                        <br><small>Oleh: ${berita.penulis || 'Admin'}</small>
                    </td>
                    <td>
                        <img src="${berita.gambar}" alt="${berita.judul}" 
                             style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                    </td>
                    <td>
                        <span class="status-badge ${berita.status || 'published'}">
                            ${berita.status || 'published'}
                        </span>
                    </td>
                    <td class="action-buttons">
                        <button class="btn btn-sm" onclick="admin.editBerita(${berita.id})" ${!this.hasPermission('editor') ? 'disabled' : ''}>
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="admin.hapusBerita(${berita.id})" ${!this.hasPermission('superadmin') ? 'disabled' : ''}>
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    loadPengumumanData() {
        const semuaPengumuman = JSON.parse(localStorage.getItem('smk_pengumuman') || '[]');
        const container = document.getElementById('pengumumanList');
        
        if (container) {
            container.innerHTML = semuaPengumuman.map(p => `
                <div class="pengumuman-item">
                    <div class="pengumuman-header">
                        <h4>${p.judul} ${p.penting ? '🚨' : ''}</h4>
                        <span class="pengumuman-date">${this.formatTanggal(p.tanggal)}</span>
                    </div>
                    <p>${p.isi}</p>
                    <div class="pengumuman-footer">
                        <span class="status-badge ${p.status}">${p.status}</span>
                        <span>Oleh: ${p.pembuat || 'Admin'}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    formatTanggal(tanggal) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(tanggal).toLocaleDateString('id-ID', options);
    }

    editBerita(id) {
        if (!this.hasPermission('editor')) {
            this.showAlert('Anda tidak memiliki izin untuk mengedit berita!', 'error');
            return;
        }

        const semuaBerita = JSON.parse(localStorage.getItem('smk_berita') || '[]');
        const berita = semuaBerita.find(b => b.id === id);
        
        if (berita) {
            // Isi form dengan data berita
            document.getElementById('judulBerita').value = berita.judul;
            document.getElementById('tanggalBerita').value = berita.tanggal;
            document.getElementById('deskripsiBerita').value = berita.deskripsi;
            document.getElementById('kontenBerita').value = berita.konten;
            
            this.editingId = id;
            
            // Switch ke tab tambah berita
            this.switchTab('berita');
            this.showAlert('Mode edit berita. Silakan perbarui data.', 'info');
            
            // Scroll ke form
            document.getElementById('formBerita').scrollIntoView({ behavior: 'smooth' });
        }
    }

    hapusBerita(id) {
        if (!this.hasPermission('superadmin')) {
            this.showAlert('Hanya superadmin yang dapat menghapus berita!', 'error');
            return;
        }

        if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            let semuaBerita = JSON.parse(localStorage.getItem('smk_berita') || '[]');
            semuaBerita = semuaBerita.filter(b => b.id !== id);
            localStorage.setItem('smk_berita', JSON.stringify(semuaBerita));
            
            this.loadBeritaData();
            this.updateWebsiteData('berita', semuaBerita);
            this.backupData();
            this.showAlert('Berita berhasil dihapus!', 'success');
        }
    }

    // METHOD GALERI
    tampilkanTotalFoto() {
        const semuaGaleri = JSON.parse(localStorage.getItem('smk_galeri') || '[]');
        const totalElement = document.getElementById('totalFoto');
        if (totalElement) {
            totalElement.textContent = semuaGaleri.length;
        }
    }

    tampilkanSemuaGaleri() {
        const semuaGaleri = JSON.parse(localStorage.getItem('smk_galeri') || '[]');
        const container = document.getElementById('daftarGaleri');
        
        this.tampilkanTotalFoto();
        
        if (!container) return;

        if (semuaGaleri.length === 0) {
            container.innerHTML = '<p>Belum ada foto di galeri.</p>';
            return;
        }
        
        const galeriHTML = `
            <div class="galeri-grid-admin">
                ${semuaGaleri.map((item, index) => `
                    <div class="galeri-item-admin">
                        <img src="${item.gambar}" alt="${item.judul}" 
                             onclick="admin.previewGambarBesar('${item.gambar}', '${item.judul}')">
                        <div class="galeri-info">
                            <p class="galeri-judul">${item.judul}</p>
                            <div class="galeri-meta">
                                <span class="kategori-badge">${item.kategori}</span>
                                <span class="galeri-date">${this.formatTanggal(item.tanggal)}</span>
                            </div>
                            <div class="galeri-actions">
                                <button class="btn btn-sm btn-danger" onclick="admin.hapusFotoGaleri(${item.id})" 
                                        ${!this.hasPermission('superadmin') ? 'disabled' : ''}
                                        title="Hapus Foto">
                                    <i class="fas fa-trash"></i> Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.innerHTML = galeriHTML;
    }

    previewGambarBesar(src, judul) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: zoom-out;
        `;
        
        overlay.innerHTML = `
            <div style="position: relative; max-width: 90%; max-height: 90%;">
                <img src="${src}" alt="${judul}" style="max-width: 100%; max-height: 100%; border-radius: 8px;">
                <div style="position: absolute; bottom: -40px; left: 0; color: white; text-align: center; width: 100%;">
                    ${judul}
                </div>
                <button onclick="this.closest('div').remove()" 
                        style="position: absolute; top: -40px; right: 0; background: #dc3545; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        document.body.appendChild(overlay);
    }

    hapusFotoGaleri(id) {
        if (!this.hasPermission('superadmin')) {
            this.showAlert('Hanya superadmin yang dapat menghapus foto!', 'error');
            return;
        }

        if (confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
            let semuaGaleri = JSON.parse(localStorage.getItem('smk_galeri') || '[]');
            
            // Jangan hapus jika hanya tersisa 1 foto
            if (semuaGaleri.length <= 1) {
                this.showAlert('Tidak bisa menghapus! Minimal harus ada 1 foto di galeri.', 'error');
                return;
            }
            
            semuaGaleri = semuaGaleri.filter(item => item.id !== id);
            localStorage.setItem('smk_galeri', JSON.stringify(semuaGaleri));
            this.updateWebsiteData('galeri', semuaGaleri);
            this.backupData();
            
            this.tampilkanSemuaGaleri();
            this.showAlert('Foto berhasil dihapus!', 'success');
        }
    }

    resetGaleriKeDefault() {
        if (!this.hasPermission('superadmin')) {
            this.showAlert('Hanya superadmin yang dapat reset galeri!', 'error');
            return;
        }

        if (confirm('Apakah Anda yakin ingin mengembalikan galeri ke foto default? Foto yang diupload akan hilang.')) {
            localStorage.removeItem('smk_galeri');
            this.initDefaultData(); // Buat data default lagi
            this.tampilkanSemuaGaleri();
            this.showAlert('Galeri telah direset ke foto default!', 'success');
        }
    }

    // STATISTIK
    loadStats() {
        const stats = {
            berita: JSON.parse(localStorage.getItem('smk_berita') || '[]').length,
            galeri: JSON.parse(localStorage.getItem('smk_galeri') || '[]').length,
            pengumuman: JSON.parse(localStorage.getItem('smk_pengumuman') || '[]').length,
            pengunjung: localStorage.getItem('website_visitors') || '0'
        };

        const container = document.getElementById('statsContainer');
        if (container) {
            container.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #4CAF50;">
                            <i class="fas fa-newspaper"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${stats.berita}</h3>
                            <p>Total Berita</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #2196F3;">
                            <i class="fas fa-images"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${stats.galeri}</h3>
                            <p>Foto Galeri</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #FF9800;">
                            <i class="fas fa-bullhorn"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${stats.pengumuman}</h3>
                            <p>Pengumuman</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #9C27B0;">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${stats.pengunjung}</h3>
                            <p>Pengunjung</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // BACKUP & EXPORT
    backupData() {
        const backup = {
            berita: localStorage.getItem('smk_berita'),
            galeri: localStorage.getItem('smk_galeri'),
            pengumuman: localStorage.getItem('smk_pengumuman'),
            timestamp: new Date().toISOString(),
            backupBy: this.currentUser.username
        };
        
        // Simpan backup terakhir
        localStorage.setItem('last_backup', JSON.stringify(backup));
        
        // Juga simpan ke history (max 10 backup)
        const backupHistory = JSON.parse(localStorage.getItem('backup_history') || '[]');
        backupHistory.unshift(backup);
        if (backupHistory.length > 10) {
            backupHistory.pop();
        }
        localStorage.setItem('backup_history', JSON.stringify(backupHistory));
    }

    exportData() {
        const data = {
            berita: JSON.parse(localStorage.getItem('smk_berita') || '[]'),
            galeri: JSON.parse(localStorage.getItem('smk_galeri') || '[]'),
            pengumuman: JSON.parse(localStorage.getItem('smk_pengumuman') || '[]'),
            exportDate: new Date().toISOString(),
            exportedBy: this.currentUser.username
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-smk-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showAlert('Data berhasil diexport!', 'success');
    }

    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('Import data akan mengganti semua data yang ada. Lanjutkan?')) {
                    if (data.berita) localStorage.setItem('smk_berita', JSON.stringify(data.berita));
                    if (data.galeri) localStorage.setItem('smk_galeri', JSON.stringify(data.galeri));
                    if (data.pengumuman) localStorage.setItem('smk_pengumuman', JSON.stringify(data.pengumuman));
                    
                    this.showAlert('Data berhasil diimport!', 'success');
                    this.loadBeritaData();
                    this.tampilkanTotalFoto();
                    this.loadStats();
                }
            } catch (error) {
                this.showAlert('Error membaca file: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    // UTILITIES
    hasPermission(requiredRole) {
        const roleHierarchy = {
            'viewer': 1,
            'editor': 2,
            'superadmin': 3
        };

        const userRole = this.currentUser?.role || 'viewer';
        return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
    }

    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            this.editingId = null;
        }
        document.querySelectorAll('.image-preview').forEach(preview => {
            preview.style.display = 'none';
        });
    }

    showAlert(message, type) {
        const alert = document.getElementById('alertMessage');
        if (alert) {
            alert.textContent = message;
            alert.className = `alert alert-${type}`;
            alert.style.display = 'block';
            
            setTimeout(() => {
                alert.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }

    logout() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            localStorage.removeItem('admin_session');

            // Show logout message
        this.showAlert('Logout berhasil! Mengarahkan ke halaman login...', 'success');
       
        setTimeout(()=> {
        window.location.href = 'login.html';
        },1000)
    }
}

    handleSearch(query) {
        // Implementasi search functionality
        console.log('Search:', query);
        // Bisa ditambahkan filtering data berdasarkan query
    }
}

// Initialize admin panel ketika DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.admin = new SMKAdmin();
});