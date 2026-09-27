/**
 * Serviço de Áudio e Alarme do Cronômetro (Web Audio API)
 * Gera bipes pedagógicos limpos diretamente no navegador sem depender de arquivos externos.
 */

class SoundService {
  private audioCtx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private readonly STORAGE_KEY = 'foco_timer_alarm_sound_enabled';

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored !== null) {
          this.isEnabled = stored === 'true';
        } else {
          this.isEnabled = true;
        }
      } catch {
        this.isEnabled = true;
      }
    }
  }

  /**
   * Retorna se o som do alarme está ativo.
   */
  public isAlarmEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Ativa ou desativa o som do alarme e persiste no localStorage.
   */
  public setAlarmEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, String(enabled));
      } catch (err) {
        console.warn('Erro ao salvar preferência de som do alarme:', err);
      }
    }
    if (enabled) {
      this.unlockAudio();
    }
  }

  /**
   * Desbloqueia o contexto de áudio em resposta a uma interação do usuário (clique, toque).
   */
  public unlockAudio(): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtxClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!this.audioCtx && AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    } catch {
      // Navegadores com políticas restritivas
    }
  }

  /**
   * Toca o alarme quando o cronômetro atinge 00:00 (se habilitado).
   * Padrão sonoro: 3 notas táticas claras e ascendentes (880Hz -> 1174Hz -> 1760Hz).
   */
  public playAlarmSound(): void {
    if (!this.isEnabled) return;
    this.unlockAudio();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 3 beeps harmônicos claros e distintos
      const chimes = [
        { freq: 880, start: 0, duration: 0.18 },       // A5
        { freq: 1174.66, start: 0.14, duration: 0.18 }, // D6
        { freq: 1760, start: 0.28, duration: 0.42 },   // A6
      ];

      chimes.forEach(({ freq, start, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + start);

        // Suave envelope anti-estalo
        gain.gain.setValueAtTime(0.0001, now + start);
        gain.gain.exponentialRampToValueAtTime(0.35, now + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + duration);
      });
    } catch (err) {
      console.warn('Não foi possível reproduzir o som do alarme:', err);
    }
  }
}

export const soundService = new SoundService();
