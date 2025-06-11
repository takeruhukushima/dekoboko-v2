// Type definitions for @blockcerts/blockcerts-verifier

// Allow importing the module
declare module '@blockcerts/blockcerts-verifier' {
  export function defineCustomElements(): Promise<void>;
}

// Extend the global JSX namespace for the custom element
declare namespace JSX {
  interface IntrinsicElements {
    'blockcerts-verifier': {
      ref?: React.RefObject<HTMLElement>;
      src?: string;
      'allow-download'?: string;
      'allow-social-share'?: string;
      'disable-auto-verify'?: string;
      'disable-verify'?: string;
      'display-mode'?: 'card' | 'fullscreen';
      locale?: string;
      theme?: 'bright' | 'dark';
      'clickable-urls'?: string;
      class?: string;
      style?: React.CSSProperties;
    } & React.HTMLAttributes<HTMLElement>;
  }
}

// Extend the global Window interface
declare global {
  interface Window {
    BlockcertsVerifier: {
      defineCustomElements: () => Promise<void>;
    };
  }
}
