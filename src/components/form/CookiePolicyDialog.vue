<template>
    <!-- Diese Komponente zeigt ein Dialogfenster für die Cookie-Richtlinie an -->
    <div v-if="visible" class="cookie-policy-dialog" @click="closeDialog">
      <!-- Klick auf den Dialog schließt das Fenster -->
      <div class="cookie-policy-content" @click.stop>
        <!-- Verhindert, dass das Klicken im Dialogfenster das Fenster schließt -->
        <h2>{{ $t('cookies.cookiePolicy.title') }}</h2>
        <!-- Titel des Dialogs -->
        <p class="preserve-newlines">{{ $t('cookies.cookiePolicy.content') }}</p>
        <!-- Inhalt des Dialogs -->
        <div class="button-container">
          <!-- Container für die Buttons -->
          <button @click="declineCookies">{{ $t('cookies.cookiePolicy.declineButton') }}</button>
          <!-- Button zum Ablehnen der Cookies -->
          <button ref="acceptButton" class="accept-button" @click="acceptCookies">{{ $t('cookies.cookiePolicy.acceptButton') }}</button>
          <!-- Button zum Akzeptieren der Cookies -->
        </div>
      </div>
    </div>
  </template>
    
  <script>
  export default {
      props: {
          visible: Boolean // Prop, das bestimmt, ob das Dialogfenster sichtbar ist
      },
      watch: {
          visible(newVal) {
              // Beobachtet Änderungen der Sichtbarkeit
              if (newVal) {
                  // Wenn das Dialogfenster sichtbar wird
                  this.$nextTick(() => {
                      // Fokussiert den Akzeptieren-Button, sobald er sichtbar wird
                      if (this.$refs.acceptButton) {
                          this.$refs.acceptButton.focus();
                      }
                  });
              }
          }
      },
      methods: {
          acceptCookies() {
              // Methode, die ausgelöst wird, wenn der Benutzer Cookies akzeptiert
              this.$emit('accept');
          },
          declineCookies() {
              // Methode, die ausgelöst wird, wenn der Benutzer Cookies ablehnt
              this.$emit('decline');
          },
          closeDialog() {
              // Methode zum Schließen des Dialogs
              this.$emit('close');
          },
      }
  }
  </script>
  
<style scoped>
.cookie-policy-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
}

.cookie-policy-dialog h2 {
    color: #1e9fc2;
}

.cookie-policy-content {
    background-color: #25292b;
    padding: 20px;
    border-radius: 10px;
    text-align: left;
}

.cookie-policy-dialog .button-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding-top: 10px;
}

.button-container button {
    margin: 30px;
    padding-left: 30px;
    padding-right: 30px;
}

.accept-button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.preserve-newlines {
    white-space: pre-line;
}
</style>
  