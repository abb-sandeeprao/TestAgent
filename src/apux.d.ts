/// <reference types="react" />

declare namespace JSX {
  interface IntrinsicElements {
    'apux-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      variant?: 'primary' | 'ghost' | 'discreet';
      size?: 'small' | 'medium' | 'extra-small';
      disabled?: boolean;
      icon?: string;
      block?: boolean;
      type?: 'button' | 'submit' | 'reset';
    }, HTMLElement>;
    
    'apux-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      type?: 'text' | 'password' | 'email' | 'search' | 'tel' | 'url' | 'number';
      name?: string;
      value?: string;
      placeholder?: string;
      disabled?: boolean;
      icon?: string;
      size?: 'small' | 'medium' | 'extra-small';
    }, HTMLElement>;
    
    'apux-spinner-loader': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      size?: 'small' | 'medium' | 'large';
      variant?: 'default' | 'accent' | 'discreet';
      state?: 'loading' | 'success' | 'error';
    }, HTMLElement>;
  }
}
