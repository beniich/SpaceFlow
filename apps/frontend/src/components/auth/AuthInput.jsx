import { useState, forwardRef } from 'react';

export const AuthInput = forwardRef(
  ({ label, error, hint, showPasswordToggle, icon, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="auth-input-group">
        {label && <label className="auth-input-label">{label}</label>}
        <div className="auth-input-wrapper">
          <input
            ref={ref}
            type={inputType}
            className={`auth-input ${error ? 'error' : ''}`}
            {...props}
          />
          {showPasswordToggle && isPassword && (
            <span
              className="auth-input-icon"
              onClick={() => setShowPassword(p => !p)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowPassword(p => !p);
                }
              }}
            >
              {showPassword ? '🙈' : '👁'}
            </span>
          )}
          {!showPasswordToggle && icon && (
            <span className="auth-input-icon" style={{ pointerEvents: 'none' }}>
              {icon}
            </span>
          )}
        </div>
        {error && (
          <div className="auth-input-error">
            <span>⚠</span> {error}
          </div>
        )}
        {!error && hint && (
          <div className="auth-input-hint">{hint}</div>
        )}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
