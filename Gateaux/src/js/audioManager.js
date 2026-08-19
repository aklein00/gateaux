// Gateaux Audio Manager — Kenney Interface Sounds + Kevin MacLeod background music

// ── Kenney OGG file map (SFX) ──
const SOUND_FILES = {
    correct:        'assets/audio/glass_003.ogg',
    wrong:          'assets/audio/error_004.ogg',
    lessonComplete: 'assets/audio/confirmation_002.ogg',
    levelUp:        'assets/audio/maximize_005.ogg',
    timerTick:      'assets/audio/tick_001.ogg',
};

const audioEls = {};
let muted = false;

// ── Background music ──
// "Parisian" by Kevin MacLeod — CC BY 4.0 — incompetech.com
const MUSIC_VOLUME = 0.255; // 15% lower than the previous 0.30 level
let musicEl = null;
let musicStarted = false;

function createMusicPlayer() {
    if (musicEl) return;
    musicEl = new Audio('assets/audio/Parisian.mp3');
    musicEl.loop = true;
    musicEl.volume = MUSIC_VOLUME;
    musicEl.preload = 'auto';
}

// Preload all OGG files into HTMLAudioElements
function preload() {
    Object.entries(SOUND_FILES).forEach(([key, src]) => {
        try {
            const el = new Audio(src);
            el.preload = 'auto';
            audioEls[key] = el;
        } catch {
            // HTMLAudio not available — will fall back to synthesis
        }
    });
}

// Play a preloaded sound by key, falling back to a synthesis callback
function playFile(key, fallback) {
    if (muted) return;
    const el = audioEls[key];
    if (el) {
        el.currentTime = 0;
        el.play().catch(() => fallback && fallback());
    } else {
        fallback && fallback();
    }
}

// ── Web Audio API synthesis (fallback) ──

let audioCtx = null;

function getCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function playTone(config) {
    if (muted) return;
    try {
        const ctx = getCtx();
        const { notes, duration = 0.15, type = 'sine', volume = 0.25 } = config;

        notes.forEach(({ freq, time = 0, dur }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

            const noteDur = dur || duration;
            gain.gain.setValueAtTime(0, ctx.currentTime + time);
            gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + time + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + noteDur);

            osc.start(ctx.currentTime + time);
            osc.stop(ctx.currentTime + time + noteDur + 0.02);
        });
    } catch {
        // Web Audio not supported — fail silently
    }
}

// ── Public API ──

export const audioManager = {
    // Called on first user gesture — preloads SFX and starts music
    unlock() {
        preload();
        createMusicPlayer();
        try { getCtx(); } catch { /* noop */ }
        this.startMusic();
    },

    isMuted() {
        return muted;
    },

    setMuted(value) {
        muted = value;
        localStorage.setItem('gateaux_muted', value ? '1' : '0');
        document.getElementById('mute-btn')?.classList.toggle('muted', value);
        if (musicEl) musicEl.volume = value ? 0 : MUSIC_VOLUME;
    },

    toggleMute() {
        this.setMuted(!muted);
        return muted;
    },

    loadSettings() {
        muted = localStorage.getItem('gateaux_muted') === '1';
        document.getElementById('mute-btn')?.classList.toggle('muted', muted);
    },

    // Start looping background music (call once after first user gesture)
    startMusic() {
        if (musicStarted || !musicEl) return;
        musicEl.volume = muted ? 0 : MUSIC_VOLUME;
        musicEl.play().catch(() => {
            // Autoplay blocked — will retry on next interaction
            musicStarted = false;
        });
        musicStarted = true;
    },

    pauseMusic() {
        if (musicEl && !musicEl.paused) musicEl.pause();
    },

    resumeMusic() {
        if (!musicStarted || !musicEl || muted) return;
        musicEl.volume = MUSIC_VOLUME;
        musicEl.play().catch(() => {});
    },

    playCorrect() {
        playFile('correct', () => playTone({
            notes: [{ freq: 880, time: 0, dur: 0.12 }, { freq: 1175, time: 0.1, dur: 0.18 }],
            type: 'sine', volume: 0.3
        }));
        try { navigator.vibrate?.(20); } catch { /* desktop / denied */ }
    },

    playWrong() {
        playFile('wrong', () => playTone({
            notes: [{ freq: 280, time: 0, dur: 0.08 }, { freq: 220, time: 0.07, dur: 0.14 }],
            type: 'sawtooth', volume: 0.18
        }));
        try { navigator.vibrate?.(40); } catch { /* desktop / denied */ }
    },

    playLessonComplete() {
        playFile('lessonComplete', () => playTone({
            notes: [
                { freq: 523, time: 0,    dur: 0.12 },
                { freq: 659, time: 0.13, dur: 0.12 },
                { freq: 784, time: 0.26, dur: 0.22 },
            ],
            type: 'triangle', volume: 0.3
        }));
    },

    playLevelUp() {
        playFile('levelUp', () => playTone({
            notes: [
                { freq: 523, time: 0,    dur: 0.1 },
                { freq: 659, time: 0.1,  dur: 0.1 },
                { freq: 784, time: 0.2,  dur: 0.1 },
                { freq: 1047, time: 0.3, dur: 0.3 },
            ],
            type: 'triangle', volume: 0.3
        }));
    },

    playTimerTick() {
        playFile('timerTick', () => playTone({
            notes: [{ freq: 440, time: 0, dur: 0.04 }],
            type: 'square', volume: 0.1
        }));
    }
};
