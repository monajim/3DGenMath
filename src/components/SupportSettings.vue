<template>
  <div class="support-settings">
    <h3>{{ $t('support.title') }}</h3>

    <CustomTooltip isRightAligned>
      <template v-slot:tooltip>
        {{ $t('toggleSupportTooltip') }}
      </template>
      <div class="toggle-switch" :class="{ 'switch-on': toggleState }" @click="toggleState = !toggleState">
        <div class="switch"></div>
      </div>
    </CustomTooltip>

    <div class="dimension">
      <label for="supportHeight">{{ $t('support.supportHeight') }}</label>
      <input v-model.number="supportHeight" id="supportHeight" type="number" min="0" @input="emitUpdate"
        :disabled="!toggleState" ref="supportHeightInput" />
    </div>

    <div class="dimension">
      <label for="supportDistance">{{ $t('support.supportDistance') }}</label>
      <input v-model.number="supportDistance" id="supportDistance" type="number" min="0" @input="emitUpdate"
        :disabled="!toggleState" ref="supportDistanceInput" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toggleState: false,
      supportHeight: 6,
      supportDistance: 2,
    };
  },
  watch: {
    toggleState(newValue) {
      this.$nextTick(() => {
        if (this.$refs.supportHeightInput) {
          this.$refs.supportHeightInput.disabled = !newValue;
        }
        if (this.$refs.supportDistanceInput) {
          this.$refs.supportDistanceInput.disabled = !newValue;
        }
      });
      this.saveToggleStateToCookie(newValue);
      this.emitUpdate();
    },
  },
  mounted() {
    this.loadToggleStateFromCookie();
    this.loadSupportSettingsFromCookie();
    this.addScrollListeners();
  },
  methods: {
    emitUpdate() {
      this.$emit('updateSettings', {
        toggleState: this.toggleState,
        supportHeight: this.supportHeight,
        supportDistance: this.supportDistance,
      });
      this.saveSupportSettingsToCookie();
    },
    getData() {
      return {
        toggleState: this.toggleState,
        supportHeight: this.supportHeight,
        supportDistance: this.supportDistance,
      };
    },
    toggleSupport() {
      this.toggleState = !this.toggleState;
    },
    addScrollListeners() {
      this.$nextTick(() => {
        const refs = ['supportHeightInput', 'supportDistanceInput']; // Add refs for new inputs
        refs.forEach(refName => {
          if (this.$refs[refName]) {
            this.$refs[refName].addEventListener('wheel', this.handleScrollInput);
          }
        });
      });
    },
    handleScrollInput(event) {
      // Check if the toggle state allows interaction
      if (!this.toggleState) return; // Ignore if toggle is off

      const input = event.target;
      const step = parseFloat(input.step) || 1;
      let newValue = parseFloat(input.value) + (event.deltaY < 0 ? step : -step);

      // Ensure value doesn't go below 0, considering the input's minimum value
      newValue = Math.max(newValue, input.min || 0);
      input.value = newValue;

      // Trigger the input event to update data binding
      input.dispatchEvent(new Event('input'));

      // Prevent the default scroll behavior
      event.preventDefault();
    },
    beforeDestroy() {
      ['supportHeightInput', 'supportDistanceInput'].forEach(refName => {
        if (this.$refs[refName]) {
          this.$refs[refName].removeEventListener('wheel', this.handleScrollInput);
        }
      });
    },
    updateData(data) {
      if (data.supportHeight !== undefined) this.supportHeight = data.supportHeight;
      if (data.supportDistance !== undefined) this.supportDistance = parseFloat(data.supportDistance);
      if (data.toggleState !== undefined) {
        this.toggleState = data.toggleState;
      }
    },
    saveToggleStateToCookie(state) {
      document.cookie = `toggleState=${state};path=/;max-age=31536000`; // 1 Jahr Gültigkeit
    },

    loadToggleStateFromCookie() {
      const toggleCookie = document.cookie.split('; ').find(row => row.startsWith('toggleState='));
      if (toggleCookie) {
        const toggleValue = toggleCookie.split('=')[1] === 'true';
        this.toggleState = toggleValue;
      }
    },
    saveSupportSettingsToCookie() {
      const settings = {
        supportHeight: this.supportHeight,
        supportDistance: this.supportDistance,
        toggleState: this.toggleState
      };
      document.cookie = `supportSettings=${encodeURIComponent(JSON.stringify(settings))};path=/;max-age=31536000`; // 1 year
    },

    loadSupportSettingsFromCookie() {
      const settingsCookie = document.cookie.split('; ').find(row => row.startsWith('supportSettings='));
      if (settingsCookie) {
        const settings = JSON.parse(decodeURIComponent(settingsCookie.split('=')[1]));
        this.supportHeight = settings.supportHeight;
        this.supportDistance = settings.supportDistance;
        this.toggleState = settings.toggleState;
      }
    },
  }
}
</script>

<style scoped>
.support-settings {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.spacing-label {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
}

.spacing-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.dimension,
.placement {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.kind label,
.kind div,
.placement label,
.placement div {
  display: flex;
  align-items: center;
  gap: 5px;
}

.toggle-switch {
  width: 50px;
  height: 25px;
  background-color: #ccc;
  border-radius: 25px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.switch {
  width: 23px;
  height: 23px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: all 0.3s ease;
}

.toggle-switch.switch-on .switch {
  left: 26px;
}

.toggle-switch.switch-on {
  background-color: #4CAF50;
}

input[type="number"]:disabled {
  background-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}
</style>
