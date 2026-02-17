const { createApp } = Vue;

const ANYDESK_WEB_URL = "https://go.anydesk.com";

function downloadReg(bit) {
  const path64 = "C:\\Program Files\\AnyDesk\\AnyDesk.exe";
  const path32 = "C:\\Program Files (x86)\\AnyDesk\\AnyDesk.exe";
  const exePath = bit === "32" ? path32 : path64;
  const reg = [
    "Windows Registry Editor Version 5.00",
    "",
    "[HKEY_CLASSES_ROOT\\anydesk]",
    "@=\"URL:AnyDesk Protocol\"",
    "\"URL Protocol\"=\"\"",
    "",
    "[HKEY_CLASSES_ROOT\\anydesk\\shell\\open\\command]",
    "@=\"\\\"" + exePath + "\\\" \\\"%1\\\"\"",
  ].join("\r\n");
  const blob = new Blob([reg], { type: "application/x-msdownload" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "anydesk-protocol-fix-" + bit + "bit.reg";
  a.click();
  URL.revokeObjectURL(a.href);
}

createApp({
  data() {
    return {
      connectId: "",
      error: "",
      copyDone: false,
    };
  },
  computed: {
    rawId() {
      return this.connectId.replace(/\s/g, "");
    },
    isIdValid() {
      return /^\d{9,14}$/.test(this.rawId);
    },
    webUrl() {
      return this.rawId
        ? ANYDESK_WEB_URL + "?id=" + encodeURIComponent(this.rawId)
        : ANYDESK_WEB_URL;
    },
  },
  methods: {
    formatId: function (e) {
      const raw = e.target.value.replace(/\D/g, "");
      this.connectId = raw.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
      this.error = "";
    },
    openAnyDesk: function () {
      if (!this.isIdValid) {
        this.error = "Please enter a valid 9–14 digit AnyDesk ID.";
        return;
      }
      this.error = "";
      window.location.href = "anydesk:" + this.rawId;
    },
    openWeb: function () {
      if (!this.isIdValid) {
        this.error = "Please enter a valid 9–14 digit AnyDesk ID.";
        return;
      }
      this.error = "";
      window.open(this.webUrl, "_blank", "noopener,noreferrer");
    },
    copyId: function () {
      if (!this.rawId) return;
      navigator.clipboard.writeText(this.rawId).then(() => {
        this.copyDone = true;
        setTimeout(() => { this.copyDone = false; }, 2000);
      });
    },
    downloadReg: downloadReg,
  },
}).mount("#app");
