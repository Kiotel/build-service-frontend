import { useNavigate } from 'react-router-dom';

/**
 * A safe wrapper around react-router's navigate that avoids crashing
 * in environments where the History API is restricted (SecurityError).
 * Falls back to window.location.assign on failure.
 */
export default function useSafeNavigate() {
  const navigate = useNavigate();

  return (to, options = {}) => {
    try {
      navigate(to, options);
    } catch (e) {
      // Some browsers (or sandboxed iframes) can throw SecurityError on history ops
      try {
        if (typeof window !== 'undefined' && window.location) {
          if (options && options.replace && typeof window.location.replace === 'function') {
            window.location.replace(typeof to === 'string' ? to : String(to?.pathname || '/'));
          } else {
            window.location.assign(typeof to === 'string' ? to : String(to?.pathname || '/'));
          }
        }
      } catch (_) {
        // Last resort: no-op
      }
    }
  };
}
