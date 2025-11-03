// load-data.js - Load data dari CMS ke website
class DataLoader {
    constructor() {
        this.init();
    }

    init() {
        this.loadBerita();
        this.loadGaleri();
        this.loadPengumuman();
    }

    loadBerita() {
        const beritaData = JSON.parse(localStorage.getItem('website_berita') || '[]');
        const container = document.querySelector('.berita-grid');
        
        if (container && beritaData.length > 0) {
            const beritaHTML = beritaData.slice(0, 3).map(berita => `
                <div class="berita-card">
                    <div class="berita-img">
                        <img src="${berita.gambar}" alt="${berita.judul}">
                    </div>
                    <div class="berita-content">
                        <div class="berita-date">${this.formatTanggal(berita.tanggal)}</div>
                        <h3>${berita.judul}</h3>
                        <p>${berita.deskripsi}</p>
                        <a href="#" class="read-more">Baca Selengkapnya →</a>
                    </div>
                </div>
            `).join('');
            
            container.innerHTML = beritaHTML;
        }
    }

    loadGaleri() {
        const galeriData = JSON.parse(localStorage.getItem('website_galeri') || '[]');
        const container = document.querySelector('.galeri-grid');
        
        if (container) {
            // Jika ada data dari CMS, gunakan itu
            if (galeriData.length > 0) {
                const galeriHTML = galeriData.map(item => `
                    <div class="galeri-item">
                        <img src="${item.gambar}" alt="${item.judul}" title="${item.judul}">
                    </div>
                `).join('');
                
                container.innerHTML = galeriHTML;
            } 
    // Jika tidak ada data, gunakan default hardcoded
            else {
                console.log('Using default galeri data');
                const defaultGaleriHTML = `
                    <div class="galeri-item">
                        <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Kegiatan Pramuka">
                    </div>
                    <div class="galeri-item">
                        <img src="https://images.unsplash.com/photo-1541336032412-2048a678540d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" alt="Workshop Kewirausahaan">
                    </div>
                    <div class="galeri-item">
                        <img src="https://images.unsplash.com/photo-1588072432836-1007cdac2ad9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Prestasi Siswa">
                    </div>
                    <div class="galeri-item">
                        <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1122&q=80" alt="Kunjungan Industri">
                    </div>
                    <div class="galeri-item">
                        <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Pelatihan Guru">
                    </div>
                    <div class="galeri-item">
                        <img src="https://images.unsplash.com/photo-1562813733-b31f71025d54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" alt="Gedung Sekolah">
                    </div>
                    <div class="galeri-item">
                        <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Laboratorium Komputer">
                    </div>
                    <div class="galeri-item">
                        <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Laboratorium Jaringan">
                    </div>
                `;
                container.innerHTML = defaultGaleriHTML;
            }
        }
    }

    loadPengumuman() {
        const pengumumanData = JSON.parse(localStorage.getItem('website_pengumuman') || '[]');
        const activePengumuman = pengumumanData.filter(p => p.status === 'active');
        
        // Tambahkan pengumuman di header atau section khusus
        if (activePengumuman.length > 0) {
            this.displayPengumuman(activePengumuman[0]);
        }
    }

    displayPengumuman(pengumuman) {
        // Buat element pengumuman
        const pengumumanElement = document.createElement('div');
        pengumumanElement.className = 'pengumuman-banner';
        pengumumanElement.innerHTML = `
            <div class="container">
                <strong>📢 PENGUMUMAN: </strong>${pengumuman.judul} - ${pengumuman.isi}
                <small style="margin-left: 10px;">(${this.formatTanggal(pengumuman.tanggal)})</small>
            </div>
        `;
        
        // Tambahkan CSS untuk banner
        if (!document.querySelector('style[data-pengumuman]')) {
            const style = document.createElement('style');
            style.setAttribute('data-pengumuman', 'true');
            style.textContent = `
                .pengumuman-banner {
                    background: var(--secondary);
                    color: white;
                    padding: 12px 0;
                    text-align: center;
                    font-size: 0.95rem;
                    position: relative;
                    z-index: 999;
                }
                .pengumuman-banner .container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .pengumuman-banner strong {
                    margin-right: 8px;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Sisipkan setelah header
        const header = document.querySelector('header');
        if (header) {
            header.parentNode.insertBefore(pengumumanElement, header.nextSibling);
        }
    }

    formatTanggal(tanggal) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(tanggal).toLocaleDateString('id-ID', options);
    }
}

// Load data ketika website ready
document.addEventListener('DOMContentLoaded', function() {
    new DataLoader();
});