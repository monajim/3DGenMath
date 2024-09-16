import { createApp } from 'vue';
import App from './App.vue';
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import de from './locales/de.json';
import './assets/styles/global.css';
import CustomTooltip from './components/form/CustomTooltip.vue';

const messages = {
    en,
    de 
};

// Create i18n instance with options
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

// Create Vue app
const app = createApp(App);

// Use i18n instance
app.use(i18n);
app.component('CustomTooltip', CustomTooltip);
app.mount('#app');
