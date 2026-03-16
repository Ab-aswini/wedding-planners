export const PLAN_LIMITS = {
  free: { invites: 1, premiumTemplates: false, customDomain: false, analytics: false },
  starter: { invites: 5, premiumTemplates: true, customDomain: false, analytics: true },
  pro: { invites: 999, premiumTemplates: true, customDomain: true, analytics: true },
} as const;

export const RELIGION_DEFAULTS: Record<string, {
  mantra: string;
  deityMotif: string;
  colors: { primary: string; accent: string; background: string; text: string };
}> = {
  hindu: {
    mantra: 'ॐ गणेशाय नमः',
    deityMotif: 'ganesha',
    colors: { primary: '#8B2635', accent: '#B8860B', background: '#1a0a0a', text: '#F5E6D0' },
  },
  muslim: {
    mantra: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
    deityMotif: 'bismillah',
    colors: { primary: '#0D5C3E', accent: '#C8A951', background: '#0A1A14', text: '#F0EDE5' },
  },
  sikh: {
    mantra: 'ੴ ਸਤਿ ਨਾਮੁ',
    deityMotif: 'khanda',
    colors: { primary: '#D4760A', accent: '#1A3D6D', background: '#1A1008', text: '#F5E6D0' },
  },
  christian: {
    mantra: 'What God has joined together, let no one separate.',
    deityMotif: 'cross',
    colors: { primary: '#2C3E50', accent: '#C0A36E', background: '#F8F6F0', text: '#2C3E50' },
  },
  universal: {
    mantra: '',
    deityMotif: 'none',
    colors: { primary: '#1a1a2e', accent: '#B8860B', background: '#0D0D1A', text: '#F5E6D0' },
  },
};

export const FONT_PAIRS = [
  { heading: 'Playfair Display', body: 'Cormorant Garamond', label: 'Classic Elegance' },
  { heading: 'Bodoni Moda', body: 'Libre Baskerville', label: 'Editorial' },
  { heading: 'Yeseva One', body: 'Josefin Sans', label: 'Modern Traditional' },
  { heading: 'Great Vibes', body: 'Lato', label: 'Script Romance' },
  { heading: 'Cinzel', body: 'Fauna One', label: 'Regal' },
] as const;
