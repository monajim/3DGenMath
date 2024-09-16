<template>
  <!-- Container für den Tooltip, der die Mausüberwachung und die Positionierung verwaltet -->
  <div class="tooltip-container" :class="{ 'right-tooltip': isRightAligned }" @mouseover="positionTooltip"
    @mouseleave="hideTooltip">
    <slot></slot>
    <!-- Slot für den Inhalt, der von der Elternkomponente bereitgestellt wird -->
    <div v-show="isVisible" ref="tooltipContent" class="tooltip-content" :style="tooltipStyle">
      <slot name="tooltip"></slot>
      <!-- Slot für den Tooltip-Inhalt -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isRightAligned: {
      type: Boolean,
      default: false
      // Bestimmt, ob der Tooltip rechtsbündig ausgerichtet ist
    },
    distanceFromSide: {
      type: Number,
      default: 280
      // Abstand von der Seite des Containers
    },
  },
  data() {
    return {
      isVisible: false, // Steuert die Sichtbarkeit des Tooltips
      tooltipStyle: {
        // Stil für den Tooltip
        top: '50%',
        left: '0',
        transform: 'translateY(-50%)',
        visibility: 'hidden',
        opacity: 0,
        transition: 'opacity 0.8s ease, visibility 1s ease'
      }
    };
  },
  methods: {
    positionTooltip() {
      // Positioniert den Tooltip basierend auf der Ausrichtung und dem Abstand
      if (this.$refs.tooltipContent) {
        let leftPosition;
        if (this.isRightAligned) {
          leftPosition = -this.distanceFromSide - 50;
        } else {
          leftPosition = this.distanceFromSide;
        }
        this.tooltipStyle = {
          ...this.tooltipStyle,
          left: `${leftPosition}px`,
          visibility: 'visible',
          opacity: 1
        };
        this.isVisible = true;
      }
    },

    hideTooltip() {
      // Versteckt den Tooltip
      this.isVisible = false;
      this.tooltipStyle = {
        ...this.tooltipStyle,
        visibility: 'hidden',
        opacity: 0
      };
    }
  },
  mounted() {
    // Fügt Ereignisbehandler für das Anzeigen und Verstecken des Tooltips hinzu
    this.$el.addEventListener('mouseover', this.positionTooltip);
    this.$el.addEventListener('mouseleave', this.hideTooltip);
  },
  beforeUnmount() {
    // Entfernt Ereignisbehandler vor dem Zerstören der Komponente
    this.$el.removeEventListener('mouseover', this.positionTooltip);
    this.$el.removeEventListener('mouseleave', this.hideTooltip);
  }
};
</script>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-content {
  position: absolute;
  z-index: 1000;
  min-width: 200px;
  max-width: 250px;
  font-size: 15px;
  padding: 15px;
  border-radius: 4px;
  background-color: rgb(0, 0, 0, 0.7);
  color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
