/**
 * Sentinel-01 · Service Selection Controller
 * ==========================================
 * Neat, production‑ready module that manages the service card grid,
 * captures selected services into a hidden JSON field, validates
 * the request form, and submits data asynchronously with feedback.
 *
 * Completely replaces the inline script – zero reliance on inline handlers.
 * Uses clean event delegation, class‑based architecture, and modern ES2020.
 */

class ServiceSelector {
  constructor() {
    // DOM references
    this.cardsContainer = document.querySelector('.grid'); // parent grid of cards
    this.hiddenInput = document.getElementById('selected-services-json');
    this.summaryEl = null; // will be created
    this.form = document.getElementById('service-request-form');
    this.fileInput = document.getElementById('attachment');
    this.submitBtn = this.form?.querySelector('button[type="submit"]');

    // State
    this.selectedServices = new Set();

    // Maximum file size in bytes (10 MB)
    this.MAX_FILE_SIZE = 10 * 1024 * 1024;

    // Bind methods to maintain context
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);

    // Initialize
    this.createSummaryElement();
    this.bindEvents();
  }

  /**
   * Creates a summary text element and inserts it before the form.
   */
  createSummaryElement() {
    if (!this.form) return;
    const section = this.form.closest('section');
    if (!section) return;

    this.summaryEl = document.createElement('div');
    this.summaryEl.className = 'text-sm font-medium text-emerald-700 mb-4 min-h-[1.5rem]';
    this.summaryEl.setAttribute('aria-live', 'polite');
    section.insertBefore(this.summaryEl, this.form);
  }

  /**
   * Attach event listeners (delegation for cards, submit for form).
   */
  bindEvents() {
    // Use event delegation on the cards container for performance
    if (this.cardsContainer) {
      this.cardsContainer.addEventListener('click', this.handleCardClick);
    }

    if (this.form) {
      this.form.addEventListener('submit', this.handleFormSubmit);
    }

    // On page load, check if any checkboxes are already checked (edge case)
    this.syncFromCheckboxes();
    this.updateUI();
  }

  /**
   * Handles clicks inside the card grid: toggles the service if a card is clicked.
   */
  handleCardClick(event) {
    // Find the closest service card ancestor
    const card = event.target.closest('.service-card');
    if (!card) return;

    const checkbox = card.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    // Toggle the checkbox state
    checkbox.checked = !checkbox.checked;

    // Update our internal Set and UI
    this.syncFromCheckboxes();
    this.updateUI();
  }

  /**
   * Synchronizes the internal selectedServices Set from DOM checkboxes.
   */
  syncFromCheckboxes() {
    this.selectedServices.clear();
    const checkboxes = document.querySelectorAll('.service-card input[type="checkbox"]:checked');
    checkboxes.forEach(cb => {
      const card = cb.closest('.service-card');
      if (card && card.dataset.service) {
        this.selectedServices.add(card.dataset.service);
      }
    });
  }

  /**
   * Updates the hidden JSON input and the summary text.
   */
  updateUI() {
    // Update hidden input
    if (this.hiddenInput) {
      this.hiddenInput.value = JSON.stringify(Array.from(this.selectedServices));
    }

    // Update summary
    if (!this.summaryEl) return;
    const count = this.selectedServices.size;
    if (count === 0) {
      this.summaryEl.textContent = '✨ Tiada perkhidmatan dipilih. Sila klik kad untuk memilih.';
      this.summaryEl.className = 'text-sm font-medium text-slate-500 mb-4 min-h-[1.5rem]';
    } else {
      const abbreviated = Array.from(this.selectedServices).map(s => s.split('-')[1]).join(', ');
      this.summaryEl.textContent = `✅ ${count} perkhidmatan dipilih: ${abbreviated}`;
      this.summaryEl.className = 'text-sm font-medium text-emerald-700 mb-4 min-h-[1.5rem]';
    }
  }

  /**
   * Validates the form before submission.
   * @returns {boolean} true if valid
   */
  validateForm() {
    // 1. At least one service selected
    if (this.selectedServices.size === 0) {
      this.showError('Sila pilih sekurang-kurangnya satu perkhidmatan sebelum menghantar permintaan.');
      return false;
    }

    // 2. Email format (simple regex)
    const emailInput = document.getElementById('email');
    if (emailInput && emailInput.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        this.showError('Sila masukkan alamat emel yang sah.');
        return false;
      }
    } else {
      this.showError('Sila isi ruangan emel perniagaan.');
      return false;
    }

    // 3. File size (if any)
    if (this.fileInput && this.fileInput.files.length > 0) {
      const file = this.fileInput.files[0];
      if (file.size > this.MAX_FILE_SIZE) {
        this.showError('Saiz fail tidak boleh melebihi 10 MB. Sila mampatkan fail atau gunakan pautan awan.');
        return false;
      }
    }

    return true;
  }

  /**
   * Displays a temporary error message near the submit button.
   */
  showError(message) {
    // Remove any existing error toast
    const oldToast = document.getElementById('form-error-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.id = 'form-error-toast';
    toast.className = 'bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 my-4 text-sm font-medium animate-pulse';
    toast.textContent = message;

    // Insert before the submit button
    if (this.submitBtn && this.submitBtn.parentNode) {
      this.submitBtn.parentNode.insertBefore(toast, this.submitBtn);
    }

    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 4000);
  }

  /**
   * Handles the form submission: validates, then submits via fetch (no page reload).
   */
  async handleFormSubmit(event) {
    event.preventDefault();

    if (!this.validateForm()) return;

    // Disable submit button and show loading state
    this.setFormLoading(true);

    try {
      const formData = new FormData(this.form);
      // Ensure selected_services is JSON string
      formData.set('selected_services', JSON.stringify(Array.from(this.selectedServices)));

      // Submit to the form's action (Formspree or custom endpoint)
      const response = await fetch(this.form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        this.showSuccess('Permintaan berjaya dihantar! Kami akan menghubungi anda dalam masa 24 jam.');
        this.form.reset();
        // Uncheck all checkboxes
        document.querySelectorAll('.service-card input[type="checkbox"]').forEach(cb => cb.checked = false);
        this.syncFromCheckboxes();
        this.updateUI();
      } else {
        const errorText = await response.text().catch(() => 'Ralat pelayan');
        this.showError(`Penghantaran gagal: ${errorText}`);
      }
    } catch (error) {
      this.showError('Ralat rangkaian. Sila cuba lagi.');
    } finally {
      this.setFormLoading(false);
    }
  }

  /**
   * Toggles loading state of the form.
   */
  setFormLoading(isLoading) {
    if (this.submitBtn) {
      if (isLoading) {
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Menghantar...';
        this.submitBtn.classList.add('opacity-70', 'cursor-wait');
      } else {
        this.submitBtn.disabled = false;
        this.submitBtn.textContent = 'Hantar Permintaan';
        this.submitBtn.classList.remove('opacity-70', 'cursor-wait');
      }
    }
  }

  /**
   * Shows a success toast after submission.
   */
  showSuccess(message) {
    // Remove any existing toasts
    const oldToast = document.getElementById('form-success-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.id = 'form-success-toast';
    toast.className = 'bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 my-4 text-sm font-medium';
    toast.textContent = message;

    if (this.submitBtn && this.submitBtn.parentNode) {
      this.submitBtn.parentNode.insertBefore(toast, this.submitBtn);
    }

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 6000);
  }
}

// ----------------------------------------------------------------------
// BOOTSTRAP
// ----------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the service selector
  new ServiceSelector();
});
