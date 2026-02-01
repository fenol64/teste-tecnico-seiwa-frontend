export const theme = {
  colors: {
    primary: 'rgb(0, 157, 129)', // User requested Green/Teal
    primaryDark: 'rgb(0, 125, 103)', // Darker shade
    secondary: 'rgb(0, 157, 129)', // Keeping it consistent or maybe 'rgb(16, 185, 129)'
    background: '#F8FAFC', // Slate 50
    surface: '#FFFFFF',
    text: '#0F172A', // Slate 900
    textSecondary: '#64748B', // Slate 500
    error: '#EF4444', // Red 500
    success: '#10B981', // Emerald 500
    warning: '#F59E0B', // Amber 500
    border: '#E2E8F0', // Slate 200
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    size: {
      xs: 12,
      s: 14,
      m: 16,
      l: 20,
      xl: 24,
      xxl: 30,
    },
    weight: {
      regular: '400',
      medium: '500',
      bold: '700',
    } as const,
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 12,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
  },

  borderRadius: {
    s: 4,
    m: 8,
    l: 12,
  },
};
