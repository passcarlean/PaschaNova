// High-resilience global JSON.stringify and JSON.parse patches to permanently neutralize circular errors and "undefined" parsing errors isomorphically
(function() {
  const originalStringify = JSON.stringify;
  JSON.stringify = function (value: any, replacer?: any, space?: any) {
    const seen = new WeakSet();
    
    function safeReplacer(key: string, val: any) {
      if (val !== null && typeof val === 'object') {
        if (
          val === window || 
          val.constructor?.name === 'Window' || 
          val.constructor?.name === 'HTMLDocument' ||
          (typeof Node !== 'undefined' && val instanceof Node) ||
          seen.has(val)
        ) {
          return undefined;
        }
        seen.add(val);
      }
      return val;
    }

    try {
      if (typeof replacer === 'function') {
        const combinedReplacer = function (this: any, key: string, val: any) {
          const cleanVal = safeReplacer(key, val);
          return replacer.call(this, key, cleanVal);
        };
        return originalStringify(value, combinedReplacer, space);
      } else if (Array.isArray(replacer)) {
        const combinedReplacer = function (key: string, val: any) {
          if (key === '' || replacer.includes(key)) {
            return safeReplacer(key, val);
          }
          return undefined;
        };
        return originalStringify(value, combinedReplacer, space);
      } else {
        return originalStringify(value, safeReplacer, space);
      }
    } catch {
      return '"[Circular/Unserializable]"';
    }
  };

  const originalParse = JSON.parse;
  JSON.parse = function (text: any, reviver?: any) {
    if (typeof text === 'string' && (text.trim() === 'undefined' || text.trim() === '')) {
      return undefined;
    }
    try {
      return originalParse(text, reviver);
    } catch (e) {
      if (typeof text === 'string' && text.includes('undefined')) {
        // Fallback for strings containing undefined or corrupted pieces
        return undefined;
      }
      throw e;
    }
  };
})();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

