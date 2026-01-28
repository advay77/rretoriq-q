// Global type declarations for browser APIs used in the application

interface Window {
  webkitAudioContext?: typeof AudioContext
}

// Declare global variables that might be used in the app
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

export {}