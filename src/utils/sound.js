/**
 * Bộ tạo âm thanh nhạc nền đám cưới lãng mạn (Web Audio API Synthesizer)
 * Tự động tạo giai điệu arpeggio piano/celesta thanh thoát, không cần tải file mp3 bên ngoài
 */

class WeddingAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;
    
    // Hợp âm Canon in D / Romantic Wedding Progression: D - A - Bm - F#m - G - D - G - A
    this.scale = [
      // D major / A / Bm notes
      293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37, 587.33, 659.25, 739.99
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
  }

  playNote(freq, time, duration = 1.2, gainValue = 0.08) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(gainValue, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  start() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.scheduleNotes();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  scheduleNotes() {
    if (!this.isPlaying) return;

    const chords = [
      [293.66, 369.99, 440.00, 587.33], // D
      [220.00, 277.18, 329.63, 440.00], // A
      [246.94, 293.66, 369.99, 493.88], // Bm
      [185.00, 220.00, 277.18, 369.99], // F#m
      [196.00, 246.94, 293.66, 392.00], // G
      [220.00, 293.66, 369.99, 440.00], // D/A
      [196.00, 246.94, 293.66, 493.88], // G
      [220.00, 277.18, 329.63, 554.37]  // A
    ];

    const chord = chords[Math.floor(this.step / 4) % chords.length];
    const note = chord[this.step % chord.length];
    const now = this.ctx.currentTime;

    this.playNote(note, now, 1.4, 0.04);
    if (this.step % 4 === 0) {
      // Bass note
      this.playNote(chord[0] / 2, now, 2.0, 0.05);
    }

    this.step++;
    this.timer = setTimeout(() => this.scheduleNotes(), 420);
  }
}

export const weddingAudio = new WeddingAudioSynthesizer();

