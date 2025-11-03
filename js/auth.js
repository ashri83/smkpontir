// auth.js - Authentication System untuk CMS
class AuthSystem {
    constructor() {
        this.users = {
            'admin': { 
                password: 'smk2024', 
                role: 'superadmin',
                nama: 'Administrator Utama'
            },
            'guru': { 
                password: 'guru123', 
                role: 'editor',
                nama: 'Guru Pengajar'
            },
            'staff': { 
                password: 'staff123', 
                role: 'viewer',
                nama: 'Staff Sekolah'
            }
        };
        this.init();
    }

    init() {
        this.checkExistingLogin();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && document.getElementById('loginForm')) {
                this.handleLogin();
            }
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            this.showAlert('Username dan password harus diisi!', 'error');
            return;
        }

        if (this.authenticate(username, password)) {
            this.loginSuccess(username);
        } else {
            this.showAlert('Username atau password salah!', 'error');
        }
    }

    authenticate(username, password) {
        const user = this.users[username];
        return user && user.password === password;
    }

    loginSuccess(username) {
        const userData = this.users[username];
        
        // Simpan session
        const sessionData = {
            username: username,
            role: userData.role,
            nama: userData.nama,
            loginTime: new Date().toISOString(),
            expires: Date.now() + (24 * 60 * 60 * 1000) // 24 jam
        };
        
        localStorage.setItem('admin_session', JSON.stringify(sessionData));
        
        this.showAlert('Login berhasil! Mengarahkan ke dashboard...', 'success');
        
        // Redirect ke admin panel setelah 1 detik
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    }

    checkExistingLogin() {
        const session = this.getSession();
        if (session && this.isSessionValid(session)) {
            // Jika sudah login, redirect ke admin
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'admin.html';
            }
        } else {
            // Jika session expired, clear data
            this.logout();
        }
    }

    getSession() {
        try {
            return JSON.parse(localStorage.getItem('admin_session'));
        } catch (e) {
            return null;
        }
    }

    isSessionValid(session) {
        return session && session.expires > Date.now();
    }

    logout() {
        localStorage.removeItem('admin_session');
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    requireAuth() {
        const session = this.getSession();
        if (!session || !this.isSessionValid(session)) {
            this.logout();
            return false;
        }
        return session;
    }

    getCurrentUser() {
        return this.getSession();
    }

    hasPermission(requiredRole) {
        const session = this.getSession();
        if (!session) return false;

        const roleHierarchy = {
            'viewer': 1,
            'editor': 2,
            'superadmin': 3
        };

        return roleHierarchy[session.role] >= roleHierarchy[requiredRole];
    }

    showAlert(message, type) {
        const alert = document.getElementById('alertMessage');
        const alertText = document.getElementById('alertText');
        
        if (alert && alertText) {
            alertText.textContent = message;
            alert.className = `alert alert-${type}`;
            alert.style.display = 'block';
            
            // Auto hide setelah 5 detik untuk success
            if (type === 'success') {
                setTimeout(() => {
                    alert.style.display = 'none';
                }, 5000);
            }
        } else {
            alert(message);
        }
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Function untuk dipanggil di admin.js
function checkAdminAuth() {
    const session = auth.requireAuth();
    if (!session) {
        return false;
    }
    return session;
}

// Function untuk logout
function adminLogout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        auth.logout();
    }
}