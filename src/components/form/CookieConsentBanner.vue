<template>
  <!-- Diese Komponente zeigt das Banner zur Einwilligung in Cookies an -->
  <div v-if="showConsentBanner" class="cookie-consent-banner">
    <!-- Banner ist nur sichtbar, wenn die Einwilligung noch nicht erteilt wurde -->
    <div class="banner-content">
      <!-- Inhalt des Banners -->
      <p>
        {{ $t('cookies.cookieConsentMessagePart1') }}
        <!-- Nachrichtenteil 1 -->
        <span @click="showPolicyDialog = true" class="cookies-link">{{ $t('cookies.cookieLabel') }}</span>
        <!-- Link zur Cookie-Richtlinie -->
        {{ $t('cookies.cookieConsentMessagePart2') }}
        <!-- Nachrichtenteil 2 -->
      </p>
      <button @click="acceptCookies">{{ $t('cookies.accept') }}</button>
      <!-- Button zum Akzeptieren der Cookies -->
    </div>
    <CookiePolicyDialog :visible="showPolicyDialog" @accept="acceptCookies" @decline="hidePolicyDialog"
      @close="hidePolicyDialog" />
    <!-- Dialog für die Cookie-Richtlinie -->
  </div>
</template>
  
<script>
import CookiePolicyDialog from './CookiePolicyDialog.vue';
export default {
  name: 'CookieConsentBanner',
  data() {
    return {
      showConsentBanner: !this.hasConsent(), // Bestimmt, ob das Banner angezeigt werden soll
      showPolicyDialog: false // Steuert die Sichtbarkeit des Cookie-Richtlinien-Dialogs
    };
  },
  components: {
    CookiePolicyDialog // Komponente für den Dialog der Cookie-Richtlinie
  },
  methods: {
    hasConsent() {
      // Prüft, ob die Einwilligung in Cookies bereits erteilt wurde
      return localStorage.getItem('cookieConsent') === 'true';
    },
    acceptCookies() {
      // Methode zum Akzeptieren der Cookies
      localStorage.setItem('cookieConsent', 'true');
      this.showConsentBanner = false; // Banner wird ausgeblendet
    },
    hidePolicyDialog() {
      // Methode zum Schließen des Cookie-Richtlinien-Dialogs
      this.showPolicyDialog = false;
    },
  }
};
</script>
  
<style scoped>
.cookie-consent-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #25292b;
  color: white;
  opacity: 0.9;
  padding: 15px;
  text-align: center;
  z-index: 1000;
}

.banner-content button {
  margin-left: 10px;
  margin-right: 100px;
  padding-left: 30px;
  padding-right: 30px;
}

.banner-content button:hover {
  background-color: #4CAF50;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.banner-content p {
  margin: 0;
  flex-grow: 1;
}

.cookies-link {
  cursor: pointer;
  text-decoration: underline;
}
</style>
  
  