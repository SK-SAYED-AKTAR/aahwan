/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const emeraldLight = '#0F5C48';
const emeraldDark = '#4FA184';

/**
 * Sophisticated neutral palette: warm off-white/charcoal-green surfaces with
 * emerald as a sparing accent and muted gold for secondary emphasis
 * (current-prayer highlight, azaan screen). Never use `primary` as a
 * background fill — see AGENTS.md section 13.
 */
export const Colors = {
  light: {
    text: '#1C1B19',
    textSecondary: '#726C63',
    background: '#FAF6F0',
    surface: '#FFFFFF',
    surfaceMuted: '#F1ECE2',
    border: '#E7E0D3',
    primary: emeraldLight,
    primarySoft: '#E3EEE8',
    accent: '#B4894F',
    tint: emeraldLight,
    icon: '#847E74',
    tabIconDefault: '#A39C90',
    tabIconSelected: emeraldLight,
  },
  dark: {
    text: '#F3EFE7',
    textSecondary: '#9C9690',
    background: '#0D1210',
    surface: '#141B17',
    surfaceMuted: '#1A221D',
    border: '#232B26',
    primary: emeraldDark,
    primarySoft: '#1A2A22',
    accent: '#D4B677',
    tint: emeraldDark,
    icon: '#8D9490',
    tabIconDefault: '#6C7570',
    tabIconSelected: emeraldDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
