import { Platform } from 'react-native';

type SoundType = {
  new (
    path: string | number,
    basePath: string | undefined,
    callback: (error?: Error) => void
  ): SoundInstance;
  setCategory: (category: string, mixWithOthers?: boolean) => void;
  MAIN_BUNDLE: string;
};

type SoundInstance = {
  play: (callback?: (success: boolean) => void) => void;
  reset: () => void;
  release: () => void;
  setVolume: (volume: number) => void;
};

let Sound: SoundType | null = null;

try {
  const soundModule = require('react-native-sound');
  Sound = soundModule.default || soundModule;
  if (Sound) {
    Sound.setCategory('Playback', true);
  }
} catch {
  // Sound library not available
}

let markSound: SoundInstance | null = null;
let checkSound: SoundInstance | null = null;
let soundsInitialized = false;
let isInitializing = false;

const getSoundPath = (filename: string): string | number => {
  if (Platform.OS === 'android') {
    return filename.replace('.wav', '');
  }
  if (filename === 'mark.wav') {
    return require('../assets/sounds/mark.wav');
  }
  if (filename === 'check.wav') {
    return require('../assets/sounds/check.wav');
  }
  throw new Error(`Unknown sound file: ${filename}`);
};

const initializeSounds = (callback?: () => void) => {
  if (!Sound) {
    callback?.();
    return;
  }

  if (soundsInitialized || isInitializing) {
    callback?.();
    return;
  }

  isInitializing = true;

  try {
    const markSoundPath = getSoundPath('mark.wav');
    const checkSoundPath = getSoundPath('check.wav');

    let markReady = false;
    let checkReady = false;

    const checkComplete = () => {
      if (markReady && checkReady) {
        soundsInitialized = true;
        isInitializing = false;
        callback?.();
      }
    };

    markSound = new Sound(
      markSoundPath,
      Platform.OS === 'ios' ? Sound.MAIN_BUNDLE : undefined,
      error => {
        if (error) {
          markSound = null;
        }
        markReady = true;
        checkComplete();
      }
    );

    checkSound = new Sound(
      checkSoundPath,
      Platform.OS === 'ios' ? Sound.MAIN_BUNDLE : undefined,
      error => {
        if (error) {
          checkSound = null;
        }
        checkReady = true;
        checkComplete();
      }
    );

    markSound?.setVolume(1.0);
    checkSound?.setVolume(1.0);
  } catch {
    isInitializing = false;
    callback?.();
  }
};

const playSound = (soundInstance: SoundInstance | null) => {
  if (!Sound) {
    return;
  }

  if (!soundsInitialized) {
    initializeSounds(() => {
      if (soundInstance) {
        soundInstance.play(success => {
          if (!success) {
            soundInstance?.reset();
          }
        });
      }
    });
    return;
  }

  if (soundInstance) {
    soundInstance.play(success => {
      if (!success) {
        soundInstance?.reset();
      }
    });
  }
};

export const playMarkSound = () => {
  try {
    playSound(markSound);
  } catch {
    // Error playing sound
  }
};

export const playCheckSound = () => {
  try {
    playSound(checkSound);
  } catch {
    // Error playing sound
  }
};

export const preloadSounds = () => {
  if (!Sound) {
    return;
  }
  initializeSounds();
};

export const releaseSounds = () => {
  if (!Sound) {
    return;
  }

  try {
    markSound?.release();
    checkSound?.release();
    markSound = null;
    checkSound = null;
    soundsInitialized = false;
    isInitializing = false;
  } catch {
    // Error releasing sounds
  }
};
