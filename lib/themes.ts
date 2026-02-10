/**
 * Theme definitions and management
 */

export interface ThemeColors {
  background: string;
  text: string;
  accent: string;
  border: string;
  muted: string;
}

export interface ThemeFonts {
  family: string;
  size: string;
  lineHeight: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  texture?: string;
}

/**
 * Available theme presets
 */
export const THEME_PRESETS: Theme[] = [
  {
    id: 'vintage-book',
    name: 'Vintage Book',
    description: 'Classic book aesthetic with warm tones',
    colors: {
      background: '#F5F5DC', // Beige
      text: '#3E2723', // Dark brown
      accent: '#8B7355', // Brown
      border: '#D4A574',
      muted: '#A0826D',
    },
    fonts: {
      family: "'Crimson Text', Georgia, serif",
      size: '18px',
      lineHeight: '1.8',
    },
    texture: 'paper',
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean and simple design',
    colors: {
      background: '#FFFFFF',
      text: '#000000',
      accent: '#3B82F6', // Blue
      border: '#E5E7EB',
      muted: '#6B7280',
    },
    fonts: {
      family: "'Inter', -apple-system, sans-serif",
      size: '16px',
      lineHeight: '1.6',
    },
    texture: 'none',
  },
  {
    id: 'dark-professional',
    name: 'Dark Professional',
    description: 'Sophisticated dark theme',
    colors: {
      background: '#1E2939',
      text: '#FFFFFF',
      accent: '#60A5FA', // Light blue
      border: '#374151',
      muted: '#9CA3AF',
    },
    fonts: {
      family: "'Roboto', -apple-system, sans-serif",
      size: '16px',
      lineHeight: '1.7',
    },
    texture: 'grid',
  },
  {
    id: 'cozy-evening',
    name: 'Cozy Evening',
    description: 'Warm and inviting for night writing',
    colors: {
      background: '#2D1F1A',
      text: '#D4A574', // Warm amber
      accent: '#E8B96E',
      border: '#4A3933',
      muted: '#8B7355',
    },
    fonts: {
      family: "'Merriweather', Georgia, serif",
      size: '17px',
      lineHeight: '1.8',
    },
    texture: 'fabric',
  },
  {
    id: 'ocean-calm',
    name: 'Ocean Calm',
    description: 'Peaceful blue gradient',
    colors: {
      background: '#E0F2F7',
      text: '#0D4759',
      accent: '#0891B2', // Cyan
      border: '#B3E5F0',
      muted: '#67B6C9',
    },
    fonts: {
      family: "'Lato', -apple-system, sans-serif",
      size: '16px',
      lineHeight: '1.7',
    },
    texture: 'watercolor',
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural and calming',
    colors: {
      background: '#D4E7D7',
      text: '#2D4A2B',
      accent: '#4CAF50', // Green
      border: '#A5D6A7',
      muted: '#66BB6A',
    },
    fonts: {
      family: "'Noto Serif', Georgia, serif",
      size: '17px',
      lineHeight: '1.75',
    },
    texture: 'paper',
  },
];

/**
 * Available textures
 */
export const TEXTURES = [
  { id: 'none', name: 'None', description: 'Solid color' },
  { id: 'paper', name: 'Paper', description: 'Aged paper texture' },
  { id: 'lined', name: 'Lined Paper', description: 'Notebook lines' },
  { id: 'dotted', name: 'Dotted', description: 'Dot grid pattern' },
  { id: 'grid', name: 'Grid', description: 'Graph paper grid' },
  { id: 'leather', name: 'Leather', description: 'Brown leather' },
  { id: 'fabric', name: 'Fabric', description: 'Linen texture' },
  { id: 'watercolor', name: 'Watercolor', description: 'Soft watercolor' },
];

/**
 * Font options
 */
export const FONT_OPTIONS = [
  { id: 'serif', name: 'Serif', family: "'Crimson Text', Georgia, serif" },
  { id: 'sans', name: 'Sans Serif', family: "'Inter', -apple-system, sans-serif" },
  { id: 'mono', name: 'Monospace', family: "'JetBrains Mono', 'Courier New', monospace" },
];

/**
 * Font size options
 */
export const FONT_SIZES = [
  { id: 'small', name: 'Small', size: '14px' },
  { id: 'medium', name: 'Medium', size: '16px' },
  { id: 'large', name: 'Large', size: '18px' },
  { id: 'xlarge', name: 'Extra Large', size: '20px' },
];

/**
 * Line height options
 */
export const LINE_HEIGHTS = [
  { id: 'compact', name: 'Compact', height: '1.5' },
  { id: 'normal', name: 'Normal', height: '1.7' },
  { id: 'relaxed', name: 'Relaxed', height: '1.9' },
];

/**
 * Get theme by ID
 */
export function getThemeById(themeId: string): Theme | undefined {
  return THEME_PRESETS.find(theme => theme.id === themeId);
}

/**
 * Save theme preference
 */
export function saveThemePreference(userId: string, themeId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`user_${userId}_theme`, themeId);
}

/**
 * Get theme preference
 */
export function getThemePreference(userId: string): string {
  if (typeof window === 'undefined') return 'modern-minimal';
  return localStorage.getItem(`user_${userId}_theme`) || 'modern-minimal';
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  
  // Apply CSS variables
  root.style.setProperty('--theme-background', theme.colors.background);
  root.style.setProperty('--theme-text', theme.colors.text);
  root.style.setProperty('--theme-accent', theme.colors.accent);
  root.style.setProperty('--theme-border', theme.colors.border);
  root.style.setProperty('--theme-muted', theme.colors.muted);
  
  root.style.setProperty('--theme-font-family', theme.fonts.family);
  root.style.setProperty('--theme-font-size', theme.fonts.size);
  root.style.setProperty('--theme-line-height', theme.fonts.lineHeight);
  
  if (theme.texture) {
    root.style.setProperty('--theme-texture', theme.texture);
  }
}
