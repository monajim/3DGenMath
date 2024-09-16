<template>
  <!-- Hauptanwendungskomponente -->
  <div id="app">
    <!-- Kopfzeile der Anwendung -->
    <AppHeader :logo="logo" :importedFileName="importedFileName" :currentLocale="currentLocale"
      @importSettings="importSettings" @handleExport="handleExport" @toggleLocale="toggleLocale" />

    <!-- Haupt-Grid-Container für die Layout-Struktur -->
    <div class="grid-container">
      <!-- Einstellungen für das Modell -->
      <ModelSettings ref="modelSettings" class="model-settings" @updateSettings="handleSettingsUpdate"
        @updateMeshView="handleMeshViewUpdate" />

      <!-- Canvas für die Darstellung des Modells -->
      <CanvasSettings class="model-viewer" />

      <!-- Rechte Spalte für zusätzliche Einstellungen -->
      <div class="right-column">
        <!-- Einstellungen für die Unterstützungsstrukturen -->
        <SupportSettings ref="supportSettings" class="support-settings" @updateSettings="handleSettingsUpdate" />

        <!-- Dateieinstellungen -->
        <FileSettings ref="fileSettings" class="file-settings" @updateSettings="handleSettingsUpdate" />
      </div>

      <!-- Fußzeile mit Versionsnummer -->
      <footer>
        <p>3DPG v{{ appVersion }}</p>
      </footer>
    </div>

    <!-- Cookie-Zustimmungs-Banner -->
    <CookieConsentBanner />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import ModelSettings from './components/ModelSettings.vue';
import SupportSettings from './components/SupportSettings.vue';
import FileSettings from './components/FileSettings.vue';
import CanvasSettings from './components/CanvasSettings.vue';
import CookieConsentBanner from './components/form/CookieConsentBanner.vue';
import { setMeshView } from '@/components/three/globalsSettings';
import { setExpr } from '@/dist/parser';
import { version } from '../package.json';
import logo from '@/assets/logo.png';

export default {
  name: 'App',
  data() {
    return {
      appVersion: version,  // Versionsnummer der Anwendung
      logo,                 // Logo der Anwendung
      importedFileName: '', // Name der importierten Datei
      settingsData: {},     // Gespeicherte Einstellungen
    };
  },
  components: {
    // Hier werden die einzelnen Komponenten registriert
    AppHeader,
    ModelSettings,
    SupportSettings,
    FileSettings,
    CanvasSettings,
    CookieConsentBanner,
  },
  watch: {
    // Beobachter für Änderungen in den Einstellungen
    settingsData: {
      handler(newValue) {
        this.saveSettingsToCookies(newValue);
      },
      deep: true
    }
  },
  mounted() {
    this.loadSettingsFromCookies();
  },
  created() {
    // Methoden, die beim Erstellen der Komponente ausgeführt werden
    this.loadSettingsFromCookies();
    this.loadLocaleFromCookies();
  },
  computed: {
    // Berechnetes Attribut für die aktuelle Sprache
    currentLocale() {
      return this.$i18n.locale;
    }
  },
  methods: {
    // Aktualisiert die gespeicherten Einstellungen, wenn Änderungen von den Kindkomponenten gemeldet werden
    handleSettingsUpdate(newSettings) {
      this.settingsData = { ...this.settingsData, ...newSettings };

      // Aktualisiert die Dateieinstellungen mit den neuen Einstellungen
      if (this.$refs.fileSettings) {
        this.$refs.fileSettings.updateData(newSettings);
      }
    },

    // Speichert die aktuellen Einstellungen in Cookies
    saveSettingsToCookies(settings) {
      const settingsString = JSON.stringify(settings);
      document.cookie = `settingsData=${encodeURIComponent(settingsString)};max-age=604800;path=/`; // 7 Tage Gültigkeit
    },

    // Lädt die gespeicherten Einstellungen aus den Cookies beim Start der Anwendung
    loadSettingsFromCookies() {
      const settingsCookie = document.cookie.split('; ').find(row => row.startsWith('settingsData='));
      if (settingsCookie) {
        const settingsString = settingsCookie.split('=')[1];
        try {
          const loadedSettings = JSON.parse(decodeURIComponent(settingsString));
          this.settingsData = loadedSettings;
          this.$nextTick(() => {
            this.updateSettingsFromData(loadedSettings);
          });
        } catch (e) {
          console.error('Fehler beim Parsen der Einstellungen aus Cookies:', e);
        }
      }
    },

    // Lädt die aktuelle Spracheinstellung aus den Cookies
    loadLocaleFromCookies() {
      const localeCookie = document.cookie.split('; ').find(row => row.startsWith('locale='));
      if (localeCookie) {
        const locale = localeCookie.split('=')[1];
        this.$i18n.locale = locale;
      }
    },

    // Sammelt Daten von den Kindkomponenten für den Export
    collectDataFromChildren() {
      return {
        ...this.$refs.modelSettings.getData(),
        ...this.$refs.supportSettings.getData(),
        ...this.$refs.fileSettings.getData()
      };
    },

    // Wechselt die Sprache der Anwendung
    toggleLocale() {
      this.$i18n.locale = this.currentLocale === 'en' ? 'de' : 'en';
      document.cookie = `locale=${this.$i18n.locale};max-age=31536000;path=/`;
    },

    // Erstellt einen XML-String aus den gesammelten Einstellungsdaten
    createXMLString(settingsData) {
      const xmlString = `
      <settings>
        <equation>${settingsData.equation}</equation>
        <width>${settingsData.width}</width>
        <height>${settingsData.height}</height>
        <surfaceType>${settingsData.surfaceType}</surfaceType>
        <modelSpacing>${settingsData.modelSpacing}</modelSpacing>
        <modelColor>${settingsData.modelColor}</modelColor>
        <supportSpacing>${settingsData.supportSpacing}</supportSpacing>
        <thickness>${settingsData.thickness}</thickness>
        <kind>${settingsData.kind}</kind>
        <triangleSize>${settingsData.triangleSize}</triangleSize>
        <factor>${settingsData.factor}</factor>
        <placement>${settingsData.placement}</placement>
        <toggleState>${settingsData.toggleState}</toggleState>
        <supportHeight>${settingsData.supportHeight}</supportHeight>
        <supportDistance>${settingsData.supportDistance}</supportDistance>
        <filename>${settingsData.filename}</filename>
      </settings>
  `;
      return xmlString;
    },

    // Exportiert die Einstellungen in eine XML-Datei
    exportToXML() {
      const settingsData = this.collectDataFromChildren();
      const xmlString = this.createXMLString(settingsData);
      const filename = this.processFilename(settingsData.filename || 'settings');
      this.downloadFile(xmlString, `${filename}.xml`, 'application/xml');
    },

    // Exportiert die Einstellungen in eine CSV-Datei
    exportToCSV() {
      const settingsData = this.collectDataFromChildren();
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "equation,width,height,surfaceType,modelSpacing,supportSpacing,thickness,kind,placement,filename\r\n";
      csvContent += `${settingsData.equation},${settingsData.width},${settingsData.height},${settingsData.surfaceType},${settingsData.modelSpacing},${settingsData.supportSpacing},${settingsData.thickness},${settingsData.kind},${settingsData.placement},${settingsData.filename}\r\n`;

      const filename = this.processFilename(settingsData.filename || 'settings');
      this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
    },

    // Verarbeitet den Dateinamen für den Export
    processFilename(filename) {
      if (filename.toLowerCase().endsWith('.stl')) {
        return filename.slice(0, -4);
      }
      return filename;
    },

    // Importiert Einstellungen aus einer XML-Datei
    importFromXML(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(e.target.result, 'application/xml');
        const data = {
          equation: xmlDoc.getElementsByTagName('equation')[0]?.textContent || '',
          width: xmlDoc.getElementsByTagName('width')[0]?.textContent || '',
          height: xmlDoc.getElementsByTagName('height')[0]?.textContent || '',
          surfaceType: xmlDoc.getElementsByTagName('surfaceType')[0]?.textContent || '',
          modelSpacing: xmlDoc.getElementsByTagName('modelSpacing')[0]?.textContent || '',
          modelColor: xmlDoc.getElementsByTagName('modelColor')[0]?.textContent || '',
          supportSpacing: xmlDoc.getElementsByTagName('supportSpacing')[0]?.textContent || '',
          thickness: xmlDoc.getElementsByTagName('thickness')[0]?.textContent || '',
          kind: xmlDoc.getElementsByTagName('kind')[0]?.textContent || '',
          triangleSize: xmlDoc.getElementsByTagName('triangleSize')[0]?.textContent || '',
          factor: xmlDoc.getElementsByTagName('factor')[0]?.textContent || '',
          placement: xmlDoc.getElementsByTagName('placement')[0]?.textContent || '',
          toggleState: xmlDoc.getElementsByTagName('toggleState')[0]?.textContent === 'true',          
          supportHeight: xmlDoc.getElementsByTagName('supportHeight')[0]?.textContent || '',
          supportDistance: xmlDoc.getElementsByTagName('supportDistance')[0]?.textContent || '',
          filename: xmlDoc.getElementsByTagName('filename')[0]?.textContent || '',
        };
        const toggleState = xmlDoc.getElementsByTagName('toggleState')[0]?.textContent === 'true';
        this.updateSettingsFromData({ ...data, toggleState });
      };
      reader.readAsText(file);
    },

    // Importiert Einstellungen aus einer CSV-Datei
    importFromCSV(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvContent = e.target.result;
        const lines = csvContent.split("\r\n");

        // Check if there are at least two lines (header and data)
        if (lines.length < 2) {
          alert(this.$t('csvFileFormatError'));
          return;
        }

        const headers = lines[0].split(",");
        const values = lines[1].split(",");

        // Check if the number of headers matches the number of values
        if (headers.length !== values.length) {
          alert(this.$t('csvFileFormatError'));
          return;
        }

        let data = {};
        headers.forEach((header, index) => {
          // Ensure that the value for each header exists
          const value = values[index];
          data[header.trim()] = value ? value.trim() : "";
        });

        this.updateSettingsFromData(data);
      };
      reader.readAsText(file);
    },

    // Lädt eine Datei herunter
    downloadFile(content, filename, contentType) {
      const blob = new Blob([content], { type: contentType });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // Aktualisiert die Einstellungen basierend auf den importierten oder geladenen Daten
    updateSettingsFromData(data) {
      this.handleSettingsUpdate(data);
      if (this.$refs.modelSettings) {
        this.$refs.modelSettings.updateData(data);
        if (data.equation) {
          setExpr(data.equation);  // Aktualisiert die Gleichung im Modell
        }
      }
      // Aktualisieren der SupportSettings inklusive des toggleState
      if (this.$refs.supportSettings) {
        this.$refs.supportSettings.updateData({ ...data, toggleState: data.toggleState,  });
      }
      // Aktualisieren der FileSettings
      if (this.$refs.fileSettings) {
        this.$refs.fileSettings.updateData(data);
      }
    },

    // Verarbeitet den Export auf Basis des gewählten Formats
    handleExport(event) {
      const format = event.target.value;
      if (format === 'xml') {
        this.exportToXML();
      } else if (format === 'csv') {
        this.exportToCSV();
      }
    },

    // Verarbeitet den Import einer Datei
    importSettings(event) {
      const file = event.target.files[0];
      if (file) {
        this.importedFileName = file.name;
        const fileType = file.name.split('.').pop();
        if (fileType === 'xml') {
          this.importFromXML(file);
        } else if (fileType === 'csv') {
          this.importFromCSV(file);
        } else {
          alert('Unsupported file format');
        }
      }
    },

    // Aktualisiert die Mesh-Ansicht basierend auf dem gewählten Gittermodus
    handleMeshViewUpdate(isGridView) {
      setMeshView(isGridView);
    },
  }
}
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: 280px 8fr 280px;
  grid-template-rows: auto 60px;
  gap: 10px;
  height: calc(100vh - 60px);
  background-color: rgb(23, 23, 23);
}

.right-column {
  display: grid;
  max-width: 300px;
  flex-direction: column;
  gap: 10px;
  grid-column: 3;
}

.model-settings,
.support-settings,
.file-settings {
  padding: 10px;
  background-color: rgb(23, 23, 23);
}

.model-settings h1,
.support-settings h1,
.file-settings h1 {
  font-size: 18px;
  font-weight: bold;
  color: rgb(23, 23, 23);
  padding-bottom: 10px;
}

.model-settings label,
.support-settings label,
.file-settings label {
  font-size: 15px;
  color: #ffffff;
  margin-top: 10px;
}

.model-viewer {
  container-type: inline-size;
  grid-column: 2;
  grid-row: 1 / 3;
  display: flex;
  align-items: center;
  justify-content: center,
}
</style>