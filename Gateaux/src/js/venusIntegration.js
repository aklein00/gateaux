// Venus SDK Integration for Gateaux
import VenusAPI from '@series-inc/venus-sdk/api';

// Haptic feedback styles (from Venus SDK)
const HapticFeedbackStyle = {
  Light: 'light',
  Medium: 'medium',
  Heavy: 'heavy'
};

export class VenusIntegration {
  constructor() {
    this.isVenusApp = !VenusAPI.isMock();
    this.audioUnlocked = false;
    this.isPaused = false;

    this.setupLifecycleHooks();

    console.log('🍰 Venus Integration initialized', {
      isVenusApp: this.isVenusApp,
      platform: this.isVenusApp ? 'Venus' : 'Browser'
    });
  }

  setupLifecycleHooks() {
    // Game loaded in Venus app
    VenusAPI.lifecycles.onAwake(() => {
      console.log('🍰 Gateaux loaded in Venus');
      this.onGameAwake();
    });

    // App backgrounded - CRITICAL for mobile
    VenusAPI.lifecycles.onPause(() => {
      console.log('⏸️ Game paused');
      this.onGamePause();
    });

    // App foregrounded
    VenusAPI.lifecycles.onResume(() => {
      console.log('▶️ Game resumed');
      this.onGameResume();
    });
  }

  onGameAwake() {
    // Load saved state from Venus storage
    this.loadVenusStorage();
  }

  onGamePause() {
    this.isPaused = true;

    // Pause all audio
    this.pauseAllAudio();

    // Save critical state to Venus storage
    this.saveToVenusStorage();

    // Signal to main game to pause timers
    window.dispatchEvent(new CustomEvent('venus:pause-timers'));
  }

  onGameResume() {
    this.isPaused = false;

    // Resume audio if it was playing
    this.resumeAudio();

    // Signal to main game to resume timers
    window.dispatchEvent(new CustomEvent('venus:resume-timers'));

    // Check for background decay
    this.checkBackgroundDecay();
  }

  pauseAllAudio() {
    // Pause background music
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic && !bgMusic.paused) {
      bgMusic.pause();
    }

    // Stop any playing customer audio
    const customerAudio = document.getElementById('customer-audio');
    if (customerAudio && !customerAudio.paused) {
      customerAudio.pause();
    }
  }

  resumeAudio() {
    // Only resume if audio was previously unlocked and enabled
    if (!this.audioUnlocked) return;

    // Check if game state has audio enabled (will be imported later)
    const gameState = window.gameState;
    if (!gameState || !gameState.settings || !gameState.settings.audioEnabled) {
      return;
    }

    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
      bgMusic.play().catch(() => {
        console.log('Background music resume failed');
      });
    }
  }

  checkBackgroundDecay() {
    // When app resumes, check if cakes decayed while away
    if (window.displayCase) {
      window.displayCase.checkDecay();
    }
  }

  // Venus Storage Integration
  async saveToVenusStorage() {
    if (!this.isVenusApp) return;

    try {
      const gameState = window.gameState;
      if (!gameState) {
        console.warn('No gameState available for Venus save');
        return;
      }

      const state = gameState.exportProgress();

      // Venus storage only accepts strings
      await VenusAPI.appStorage.setItem('gateaux_save', JSON.stringify(state));

      console.log('💾 Saved to Venus storage');
    } catch (error) {
      console.error('Failed to save to Venus storage:', error);
    }
  }

  async loadVenusStorage() {
    if (!this.isVenusApp) return;

    try {
      const savedData = await VenusAPI.appStorage.getItem('gateaux_save');

      if (savedData) {
        const state = JSON.parse(savedData);

        const gameState = window.gameState;
        if (gameState) {
          gameState.importProgress(state);
          console.log('📂 Loaded from Venus storage');
        }
      }
    } catch (error) {
      console.error('Failed to load from Venus storage:', error);
    }
  }

  // Haptic Feedback
  async triggerHaptic(style) {
    if (!this.isVenusApp) return;

    try {
      await VenusAPI.triggerHapticAsync(style);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  // Convenience methods for common haptics
  async hapticSuccess() {
    await this.triggerHaptic(HapticFeedbackStyle.Light);
  }

  async hapticError() {
    await this.triggerHaptic(HapticFeedbackStyle.Heavy);
  }

  async hapticClick() {
    await this.triggerHaptic(HapticFeedbackStyle.Medium);
  }

  // Mobile Audio Unlock
  unlockAudio() {
    if (this.audioUnlocked) return;

    // Play and immediately stop a silent audio to unlock
    const audio = document.getElementById('customer-audio');
    if (audio) {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        this.audioUnlocked = true;
        console.log('🔊 Audio unlocked');
      }).catch(() => {
        console.log('Audio unlock failed');
      });
    }
  }
}

// Export singleton instance
export const venusIntegration = new VenusIntegration();
