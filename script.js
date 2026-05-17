/**
 * Sentinel-01 · Service Selection + Google Apps Script (CORS Ready)
 * =================================================================
 * Backend: Google Apps Script dengan CORS & Google Sheets
 */

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzb4uUzCgFWEvQVCV3y8Kw8uXM26BDLlyVHNYRmkWJ_ZJiIyYoeAevjke55Kk3xMcEA/exec';

class ServiceSelector {
  constructor() {
    this.cardsContainer = document.querySelector('.grid');
    this.hiddenInput = document.getElementById('selected-services-json');
    this.form = document.getElementById('service-request-form');
    this.emailInput = document.getElementById('email');
    this.messageInput = document.getElementById('message');
    this.fileInput = document.getElementById('attachment');
    this.submitBtn = this.form.querySelector('button[type="submit"]');
    this.summaryEl = null;

    this.selectedServices = new Set();
    this.MAX_FILE_SIZE = 10 * 1024 * 1024;

    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);

    this.createSummaryElement();
    this.bindEvents();
  }

  createSummaryElement() {
    const section = this.form.closest('section');
    if (!section) return;
    this.summaryEl = document.createElement('div');
    this.summaryEl.className = 'text-sm font-medium text-emerald-300 mb-4 min-h-[1.5rem]';
    this.summaryEl.setAttribute('aria-live', 'polite');
    section.insertBefore(this.summaryEl, this.form);
  }

  bindEvents() {
    if (this.cardsContainer) {
      this.cardsContainer.addEventListener('click', this.handleCardClick);
    }
    this.form.addEventListener('submit', this.handleFormSubmit);
    this.syncFromCheckboxes();
    this.updateUI();
  }

  handleCardClick(e) {
    const card = e.target.closest('.service-card');
    if (!card) return;
    const checkbox = card.querySelector('input[type="checkbox"]');
    if (!checkbox) return;
    checkbox.checked = !checkbox.checked;
    this.syncFromCheckboxes();
    this.updateUI();
  }

  syncFromCheckboxes() {
    this.selectedServices.clear();
    const checked = document.querySelectorAll('.service-card input[type="checkbox"]:checked');
    checked.forEach(cb => {
      const card = cb.closest('.service-card');
      if (card && card.dataset.service) this.selectedServices.add(card.dataset.service);
    });
  }

  updateUI() {
    if (this.hiddenInput) {
      this.hiddenInput.value = JSON.stringify(Array.from(this.selectedServices));
    }
    if (!this.summaryEl) return;
    const count = this.selectedServices.size;
    if (count === 0) {
      this.summaryEl.textContent = '✨ Tiada perkhidmatan dipilih.';
      this.summaryEl.className = 'text-sm font-medium text-slate-400 mb-4';
    } else {
      const list = Array.from(this.selectedServices).map(s => s.split('-')[1]).join(', ');
      this.summaryEl.textContent = `✅ ${count} perkhidmatan dipilih: ${list}`;
      this.summaryEl.className = 'text-sm font-medium text-emerald-300 mb-4';
    }
  }

  validateForm() {
    if (this.selectedServices.size === 0) {
      this.showError('Sila pilih sekurang-kurangnya satu perkhidmatan.');
      return false;
    }
    const email = this.emailInput?.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.showError('Sila masukkan alamat emel yang sah.');
      return false;
    }
    if (this.fileInput.files.length > 0 && this.fileInput.files[0].size > this.MAX_FILE_SIZE) {
      this.showError('Saiz fail tidak boleh melebihi 10 MB.');
      return false;
    }
    return true;
  }

  showError(message) {
    this.clearToast();
    const toast = document.createElement('div');
    toast.id = 'form-toast';
    toast.className = 'bg-red-900/30 border border-red-800 text-red-300 rounded-lg p-3 my-4 text-sm font-medium animate-pulse';
    toast.textContent = message;
    this.submitBtn.parentNode.insertBefore(toast, this.submitBtn);
    setTimeout(() => toast.remove(), 4500);
  }

  showSuccess(message) {
    this.clearToast();
    const toast = document.createElement('div');
    toast.id = 'form-toast';
    toast.className = 'bg-emerald-900/30 border border-emerald-800 text-emerald-300 rounded-lg p-3 my-4 text-sm font-medium';
    toast.textContent = message;
    this.submitBtn.parentNode.insertBefore(toast, this.submitBtn);
    setTimeout(() => toast.remove(), 6000);
  }

  clearToast() {
    const old = document.getElementById('form-toast');
    if (old) old.remove();
  }

  setFormLoading(isLoading) {
    if (this.submitBtn) {
      this.submitBtn.disabled = isLoading;
      this.submitBtn.textContent = isLoading ? 'Menghantar...' : 'Hantar Permintaan';
    }
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    if (!this.validateForm()) return;

    this.setFormLoading(true);

    try {
      const payload = {
        from_email: this.emailInput.value.trim(),
        selected_services: Array.from(this.selectedServices).join(', '),
        message: this.messageInput?.value.trim() || 'Tiada mesej tambahan.'
      };

      if (this.fileInput.files.length > 0) {
        const file = this.fileInput.files[0];
        const base64 = await this.readFileAsBase64(file);
        payload.attachment = {
          name: file.name,
          type: file.type,
          data: base64.split(',')[1]
        };
      }

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccess('Permintaan berjaya dihantar! Kami akan hubungi anda melalui emel dalam masa 24 jam.');
        this.form.reset();
        document.querySelectorAll('.service-card input[type="checkbox"]').forEach(cb => cb.checked = false);
        this.syncFromCheckboxes();
        this.updateUI();
      } else {
        throw new Error(result.error || 'Respons tidak berjaya.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      this.showError(`Ralat: ${error.message || 'Sila cuba lagi.'}`);
    } finally {
      this.setFormLoading(false);
    }
  }

  readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ServiceSelector();
});
