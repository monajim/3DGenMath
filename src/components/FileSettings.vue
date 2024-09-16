<template>
  <!-- Bereich für Dateieinstellungen -->
  <div class="file-settings">
    <h3>{{ $t('file.title') }}</h3>

    <!-- Sektion für Dateinameneingabe -->
    <div class="filename-section">
      <CustomTooltip isRightAligned>
        <template v-slot:tooltip>
          {{ $t('tooltips.filename') }}
        </template>
        <label for="filename">{{ $t('file.filename') }}</label>
      </CustomTooltip>
      <input v-model="filename" @input="emitUpdate" id="filename" type="text">
    </div>

    <!-- Sektion zum Generieren der STL-Datei -->
    <div class="generate-stl-section">
      <CustomTooltip isRightAligned>
        <template v-slot:tooltip>
          {{ $t('tooltips.generateStl') }}
        </template>
        <button @click="generateSTL">{{ $t('file.generateStl') }}</button>
      </CustomTooltip>
    </div>

        <!-- Sektion zum Anzeigen der Drucklänge -->
        <div class="print-length-section inline-display">
      <h4>{{ $t('file.printLength') }}:</h4>
      <p>{{ printLength }}</p>
    </div>

  </div>
</template>

<script>
var gen = require('../dist/stlGenerator');
var global = require('./three/globalsSettings');
export default {
  data() {
    return {
      filename: 'model', // Name der zu generierenden Datei
      thickness: 3.0, // Dicke des Modells
      width: 12.0, // Breite des Modells
      supportEnabled: false, // Zustand des Supports
      printLength: '', // Initialisieren printLength als Leerstring
    };
  },
  watch: {
    thickness() {
      this.updatePrintLength();
    },
    width() {
      this.updatePrintLength();
    },
    supportEnabled() {
      this.updatePrintLength();
    },
    triangleSize() {
      this.updatePrintLength();
    },
    factor() {
      this.updatePrintLength();
    },
    supportHeight() {
      this.updatePrintLength();
    },
    supportDistance() {
      this.updatePrintLength();
    },
  },
  mounted() {
    this.updatePrintLength();
  },
  methods: {
    emitUpdate() {
      // Sendet ein Update-Event mit den aktuellen Daten
      this.$emit('updateSettings', this.getData());
    },
    getData() {
      // Gibt die aktuellen Daten zurück
      return {
        filename: this.filename
      };
    },
    updateData(data) {
      // Aktualisiert die Daten basierend auf externen Änderungen
      if (data.filename !== undefined) this.filename = data.filename;
      if (data.thickness !== undefined) this.thickness = data.thickness;
      if (data.width !== undefined) this.width = data.width;
      if (data.height !== undefined) this.height = data.height;
      if (data.toggleState !== undefined) this.supportEnabled = data.toggleState;
        if (data.triangleSize !== undefined) this.triangleSize = data.triangleSize;
        if (data.factor !== undefined) this.factor = data.factor;
        if (data.supportHeight !== undefined) this.supportHeight = data.supportHeight;
        if (data.supportDistance !== undefined) this.supportDistance = data.supportDistance;
        gen.setThickness(this.thickness);
        gen.setLen(this.width);
        gen.setSupport(this.supportEnabled);
        gen.setSupportDistance(this.supportDistance);
        gen.setSupportHeight(this.supportHeight);
        gen.setFactor(this.factor);
        gen.setTriangleSize(this.triangleSize);
        gen.make(this.thickness, this.width, this.filename, false, false, this.supportEnabled, this.triangleSize, this.factor, this.supportHeight, this.supportDistance);
        this.updatePrintLength();
        global.setisUpdate(true);
    },
    generateSTL() {
      gen.make(this.thickness, this.width, this.filename, true, false, this.supportEnabled, this.triangleSize, this.factor, this.supportHeight, this.supportDistance);
      this.updatePrintLength();
    },
    updatePrintLength() {
      this.printLength = gen.getPrintLen() + ' h';
    },
  }
}
</script>

<style scoped>
.file-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.filename-section,
.generate-stl-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.generate-stl-section button {
  width: 100%;
}

.print-length-section h4 {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.print-length-section p {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #333;
}

.inline-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.print-length-section h4, .print-length-section p {
  margin: 0;
  font-size: 14px;
}

</style>

