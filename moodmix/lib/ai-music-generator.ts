// AI Music Generation for Mood-Based Ambient Soundscapes
// Generate unlimited, copyright-free music matching user moods

interface GeneratedTrack {
  id: string
  title: string
  mood: string
  duration: number
  audioBlob: Blob
  audioUrl: string
}

class AIMusicGenerator {
  private audioContext: AudioContext
  private isInitialized: boolean = false

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  async initialize(): Promise<void> {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
    this.isInitialized = true
  }

  async generateMoodMusic(mood: string, duration: number = 120): Promise<GeneratedTrack> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    const moodParams = this.getMoodParameters(mood)
    const audioBuffer = await this.synthesizeAudio(moodParams, duration)
    const audioBlob = await this.audioBufferToBlob(audioBuffer)
    const audioUrl = URL.createObjectURL(audioBlob)

    return {
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${mood} Ambient Soundscape`,
      mood,
      duration,
      audioBlob,
      audioUrl
    }
  }

  private getMoodParameters(mood: string) {
    const moodSettings: Record<string, any> = {
      'Energetic': {
        tempo: 128,
        baseFreq: 440,
        harmonics: [1, 2, 3, 5],
        rhythm: 'driving',
        filterType: 'highpass'
      },
      'Serene': {
        tempo: 60,
        baseFreq: 220,
        harmonics: [1, 2, 4],
        rhythm: 'flowing',
        filterType: 'lowpass'
      },
      'Melancholic': {
        tempo: 70,
        baseFreq: 330,
        harmonics: [1, 1.5, 2.5],
        rhythm: 'sparse',
        filterType: 'bandpass'
      },
      'Mystical': {
        tempo: 80,
        baseFreq: 396, // Healing frequency
        harmonics: [1, 1.618, 2.618], // Golden ratio
        rhythm: 'ethereal',
        filterType: 'lowpass'
      }
    }

    return moodSettings[mood] || moodSettings['Serene']
  }

  private async synthesizeAudio(params: any, duration: number): Promise<AudioBuffer> {
    const sampleRate = this.audioContext.sampleRate
    const frameCount = sampleRate * duration
    const audioBuffer = this.audioContext.createBuffer(2, frameCount, sampleRate)

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel)
      
      for (let i = 0; i < frameCount; i++) {
        const time = i / sampleRate
        let sample = 0

        // Generate harmonic series based on mood
        for (const harmonic of params.harmonics) {
          const freq = params.baseFreq * harmonic
          const amplitude = 0.3 / harmonic // Decay amplitude for higher harmonics
          
          // Add some temporal variation
          const envelope = this.createEnvelope(time, duration)
          const lfo = Math.sin(2 * Math.PI * 0.1 * time) * 0.1 + 1 // Low frequency oscillator
          
          sample += Math.sin(2 * Math.PI * freq * time * lfo) * amplitude * envelope
        }

        // Add mood-specific modulation
        sample = this.applyMoodModulation(sample, params, time)
        
        // Apply gentle compression
        sample = Math.sign(sample) * Math.min(Math.abs(sample), 0.8)
        
        channelData[i] = sample
      }
    }

    return audioBuffer
  }

  private createEnvelope(time: number, duration: number): number {
    const fadeTime = Math.min(duration * 0.1, 5) // 10% fade or max 5 seconds
    
    if (time < fadeTime) {
      return time / fadeTime // Fade in
    } else if (time > duration - fadeTime) {
      return (duration - time) / fadeTime // Fade out
    }
    return 1 // Sustain
  }

  private applyMoodModulation(sample: number, params: any, time: number): number {
    switch (params.rhythm) {
      case 'driving':
        // Add rhythmic pulsing for energetic moods
        const pulse = Math.sin(2 * Math.PI * (params.tempo / 60) * time) * 0.2 + 0.8
        return sample * pulse
      
      case 'flowing':
        // Smooth, wave-like modulation for serene moods
        const wave = Math.sin(2 * Math.PI * 0.05 * time) * 0.3 + 0.7
        return sample * wave
      
      case 'sparse':
        // Intermittent notes for melancholic moods
        const sparse = Math.random() < 0.3 ? 1 : 0.1
        return sample * sparse
      
      case 'ethereal':
        // Otherworldly modulation for mystical moods
        const ethereal = Math.sin(2 * Math.PI * 0.03 * time) * 0.5 + 0.5
        return sample * ethereal
      
      default:
        return sample
    }
  }

  private async audioBufferToBlob(audioBuffer: AudioBuffer): Promise<Blob> {
    // Convert AudioBuffer to WAV format
    const length = audioBuffer.length
    const numberOfChannels = audioBuffer.numberOfChannels
    const sampleRate = audioBuffer.sampleRate
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2)
    const view = new DataView(arrayBuffer)

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(0, 'RIFF')
    view.setUint32(4, 36 + length * numberOfChannels * 2, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numberOfChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numberOfChannels * 2, true)
    view.setUint16(32, numberOfChannels * 2, true)
    view.setUint16(34, 16, true)
    writeString(36, 'data')
    view.setUint32(40, length * numberOfChannels * 2, true)

    // Convert float samples to 16-bit PCM
    let offset = 44
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]))
        view.setInt16(offset, sample * 0x7FFF, true)
        offset += 2
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' })
  }

  // Clean up generated audio URLs
  cleanup(audioUrl: string): void {
    URL.revokeObjectURL(audioUrl)
  }
}

export { AIMusicGenerator, type GeneratedTrack }