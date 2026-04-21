import { createTheme } from '@mui/material/styles'

const cream = '#FDFBF7' // Warm, paper-like cream
const teal = '#006D77' // Organic, sophisticated teal
const softRed = '#E29578' // Earthy, humanist red (not "stop sign" red)
const deepBlack = '#1A1C1E'

export const getHumanistTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light Mode: Cream background, Teal primary
            primary: { main: teal },
            secondary: { main: softRed },
            background: { default: cream, paper: '#FFFFFF' },
            text: { primary: deepBlack, secondary: '#4A4A4A' },
            error: { main: '#D32F2F' }, // A clearer red for functionality
          }
        : {
            primary: { main: '#83C5BE' }, // Lighter teal for contrast
            secondary: { main: softRed },
            background: { default: '#0B1315', paper: '#161B1D' },
            text: { primary: cream, secondary: '#B0B0B0' },
            error: { main: '#FF8A80' },
          }),
    },
    shape: {
      borderRadius: 12, // Humanist "soft" corners
    },
    typography: {
      fontFamily: '"Inter", "system-ui", sans-serif',
      h1: { fontWeight: 600, letterSpacing: '-0.02em' },
      button: { textTransform: 'none', fontWeight: 500 },
    },
    cssVariables: true,
  })
