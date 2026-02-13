// Minimal mock implementation of Apux components for development
// This file provides basic web component definitions to allow the app to run
// Replace with actual @abb-hmi/apux package when available

// apux-button component
class ApuxButton extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    
    // Apply basic styling
    this.style.display = 'inline-flex';
    this.style.alignItems = 'center';
    this.style.justifyContent = 'center';
    this.style.padding = '8px 16px';
    this.style.border = 'none';
    this.style.borderRadius = '4px';
    this.style.cursor = 'pointer';
    this.style.fontSize = '14px';
    this.style.fontFamily = 'inherit';
    this.style.gap = '8px';
    
    // Apply variant styling
    const variant = this.getAttribute('variant') || 'default';
    const size = this.getAttribute('size') || 'medium';
    const disabled = this.hasAttribute('disabled');
    
    if (disabled) {
      this.style.opacity = '0.5';
      this.style.cursor = 'not-allowed';
      this.style.pointerEvents = 'none';
    }
    
    // Size variations
    if (size === 'small') {
      this.style.padding = '6px 12px';
      this.style.fontSize = '12px';
    } else if (size === 'extra-small') {
      this.style.padding = '4px 8px';
      this.style.fontSize = '11px';
    }
    
    // Variant styles
    if (variant === 'primary') {
      this.style.backgroundColor = '#3498db';
      this.style.color = '#ffffff';
    } else if (variant === 'ghost') {
      this.style.backgroundColor = 'transparent';
      this.style.border = '1px solid #bdc3c7';
      this.style.color = '#2c3e50';
    } else if (variant === 'discreet') {
      this.style.backgroundColor = 'transparent';
      this.style.color = '#7f8c8d';
    } else {
      this.style.backgroundColor = '#ecf0f1';
      this.style.color = '#2c3e50';
    }
    
    // Handle icon
    const icon = this.getAttribute('icon');
    if (icon && !this.textContent.trim()) {
      this.style.width = size === 'extra-small' ? '24px' : size === 'small' ? '32px' : '40px';
      this.style.height = size === 'extra-small' ? '24px' : size === 'small' ? '32px' : '40px';
      this.style.padding = '0';
    }
  }
}

// apux-input component
class ApuxInput extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    
    const input = document.createElement('input');
    input.type = this.getAttribute('type') || 'text';
    input.name = this.getAttribute('name') || '';
    input.value = this.getAttribute('value') || '';
    input.placeholder = this.getAttribute('placeholder') || '';
    input.disabled = this.hasAttribute('disabled');
    
    const size = this.getAttribute('size') || 'medium';
    
    // Style the input
    input.style.width = '100%';
    input.style.border = '1px solid #bdc3c7';
    input.style.borderRadius = '4px';
    input.style.fontSize = '14px';
    input.style.fontFamily = 'inherit';
    input.style.outline = 'none';
    input.style.boxSizing = 'border-box';
    
    if (size === 'small') {
      input.style.padding = '6px 12px';
      input.style.fontSize = '12px';
    } else if (size === 'extra-small') {
      input.style.padding = '4px 8px';
      input.style.fontSize = '11px';
    } else {
      input.style.padding = '8px 12px';
    }
    
    // Forward events
    input.addEventListener('input', (e) => {
      this.setAttribute('value', e.target.value);
      this.dispatchEvent(new CustomEvent('input', { detail: { value: e.target.value }, bubbles: true }));
    });
    
    input.addEventListener('change', (e) => {
      this.dispatchEvent(new CustomEvent('change', { detail: { value: e.target.value }, bubbles: true }));
    });
    
    shadow.appendChild(input);
    
    // Store reference to input for external access
    this._input = input;
  }
  
  get value() {
    return this._input ? this._input.value : this.getAttribute('value') || '';
  }
  
  set value(val) {
    if (this._input) {
      this._input.value = val;
    }
    this.setAttribute('value', val);
  }
}

// apux-spinner-loader component
class ApuxSpinnerLoader extends HTMLElement {
  connectedCallback() {
    const size = this.getAttribute('size') || 'medium';
    const variant = this.getAttribute('variant') || 'default';
    const state = this.getAttribute('state') || 'loading';
    
    // Create spinner element
    this.style.display = 'inline-block';
    this.style.borderRadius = '50%';
    this.style.border = '3px solid rgba(0,0,0,0.1)';
    
    // Size variations
    if (size === 'small') {
      this.style.width = '20px';
      this.style.height = '20px';
    } else if (size === 'large') {
      this.style.width = '48px';
      this.style.height = '48px';
    } else {
      this.style.width = '32px';
      this.style.height = '32px';
    }
    
    // Variant colors
    let color = '#3498db';
    if (variant === 'accent') {
      color = '#e74c3c';
    } else if (variant === 'discreet') {
      color = '#95a5a6';
    }
    
    if (state === 'loading') {
      this.style.borderTopColor = color;
      this.style.animation = 'apux-spin 1s linear infinite';
    } else if (state === 'success') {
      this.style.borderColor = '#2ecc71';
      this.textContent = '✓';
      this.style.display = 'flex';
      this.style.alignItems = 'center';
      this.style.justifyContent = 'center';
      this.style.color = '#2ecc71';
    } else if (state === 'error') {
      this.style.borderColor = '#e74c3c';
      this.textContent = '✗';
      this.style.display = 'flex';
      this.style.alignItems = 'center';
      this.style.justifyContent = 'center';
      this.style.color = '#e74c3c';
    }
  }
}

// Register components
if (!customElements.get('apux-button')) {
  customElements.define('apux-button', ApuxButton);
}
if (!customElements.get('apux-input')) {
  customElements.define('apux-input', ApuxInput);
}
if (!customElements.get('apux-spinner-loader')) {
  customElements.define('apux-spinner-loader', ApuxSpinnerLoader);
}

// Add spinner animation
if (!document.getElementById('apux-mock-styles')) {
  const style = document.createElement('style');
  style.id = 'apux-mock-styles';
  style.textContent = `
    @keyframes apux-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

console.log('Apux mock components loaded');
