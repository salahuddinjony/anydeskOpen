const { createApp } = Vue;

const ANYDESK_WEB_URL = 'https://go.anydesk.com';

createApp({
  data() {
    return {
      connectId: '',
      error: '',
      appOpened: false,
    };
  },
  computed: {
    rawId() {
      return this.connectId.replace(/\s/g, '');
    },
    isIdValid() {
      return /^\d{9,14}$/.test(this.rawId);
    },
  },
  methods: {
    formatId(e) {
      const raw = e.target.value.replace(/\D/g, '');
      this.connectId = raw.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
      this.error = '';
    },
    openAnyDesk() {
      if (!this.isIdValid) {
        this.error = 'Please enter a valid 9–14 digit AnyDesk ID.';
        return;
      }
      this.error = '';
      const url = `anydesk:${this.rawId}`;
      window.location.href = url;
      this.appOpened = true;
      // Fallback hint: if app doesn't open, user can click "Open in Browser"
      setTimeout(() => {
        if (this.appOpened) {
          this.appOpened = false;
        }
      }, 2500);
    },
    openWeb() {
      if (!this.isIdValid) {
        this.error = 'Please enter a valid 9–14 digit AnyDesk ID.';
        return;
      }
      this.error = '';
      // go.anydesk.com: open in new tab; ID can be passed if the site supports it
      const url = `${ANYDESK_WEB_URL}?id=${encodeURIComponent(this.rawId)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    },
  },
}).mount('#app');
