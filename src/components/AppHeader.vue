<template>
    <!-- Kopfzeile der Anwendung mit Logo, Import-/Export-Kontrollen und Sprachauswahl -->
    <div class="app-header">
        <!-- Logo der Anwendung -->
        <img :src="logo" alt="Logo" class="logo">
        <span class="header-text">Print Gen4Math</span>

        <!-- Import- und Export-Steuerungselemente -->
        <div class="import-export-controls">
            <!-- Etikett für Dateieingabe und Auswahl des Importformats -->
            <label for="fileInput" class="control-label">
                {{ importedFileName || $t('importFile') }}
            </label>
            <!-- Verstecktes Eingabefeld für Dateiimport -->
            <input type="file" id="fileInput" @change="$emit('importSettings', $event)" accept=".xml"
                style="display: none;">
            <!-- Dropdown-Menü für Exportformat-Auswahl -->
            <label class="control-label">
                <select @change="$emit('handleExport', $event)">
                    <option disabled selected>{{ $t('exportAs') }}</option>
                    <option value="xml">{{ $t('exportAsXml') }}</option>
                    <option value="csv">{{ $t('exportAsCsv') }}</option>
                </select>
            </label>
        </div>

        <!-- Sprachauswahl -->
        <div class="language-selector">
            <!-- Sprachauswahl-Icon -->
            <img :src="currentLocale === 'de' ? '/flags/germany.png' : '/flags/usa.png'" @click="$emit('toggleLocale')"
                alt="Language" />
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'AppHeader',
    props: {
        logo: String, // Logo der Anwendung
        importedFileName: String, // Name der importierten Datei
        currentLocale: String // Aktuelle Spracheinstellung
    },
}
</script>
  
<style scoped>
.app-header {
    display: flex;
    height: 58px;
    align-items: center;
    justify-content: flex-start;
    padding: 0 30px;
    background-color: #25292b;
    border-bottom: 1pt solid rgba(255, 255, 255, 0.2);
}

.logo {
    height: 30px;
    width: auto;
    opacity: 0.7;
}

.header-text {
    display: flex;
    margin-left: 10px;
    font-size: 24px;
    font-weight: bold;
    color: #1e9fc2;
    opacity: 0.5;
    text-shadow: #ffffff;
    align-items: left;
}

.import-export-controls {
    margin-left: auto;
    margin-right: 20px;
    display: flex;
    align-items: center;
}

.control-label {
    display: inline-block;
    font-size: 16px;
    font-weight: 490;
    margin-right: 10px;
    margin-left: 1px;
    color: #ffffff;
    opacity: 0.7;
    cursor: pointer;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.control-label select,
.control-label input[type="file"] {
    margin-left: 5px;
    cursor: pointer;
    background-color: #25292b;
    font-size: 15px;
    border: none;
    color: #ffffff;
}

.language-selector img {
    cursor: pointer;
    width: 25px;
    height: auto;

}
</style>
  