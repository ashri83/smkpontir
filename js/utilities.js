// utilities.js - Helper functions untuk website
class Utilities {
    static formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }

    static formatDateTime(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }

    static truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]{10,}$/;
        return re.test(phone);
    }

    static showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles if not exists
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 5px;
                    color: white;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                    max-width: 300px;
                }
                .notification-success { background: #28a745; }
                .notification-error { background: #dc3545; }
                .notification-warning { background: #ffc107; color: #000; }
                .notification-info { background: #17a2b8; }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    static getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static getCurrentAcademicYear() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        // Jika bulan >= Juli, tahun ajaran: year/year+1
        // Jika bulan < Juli, tahun ajaran: year-1/year
        if (month >= 6) { // July = 6
            return `${year}/${year + 1}`;
        } else {
            return `${year - 1}/${year}`;
        }
    }
}

// Export untuk penggunaan global
window.Utilities = Utilities;