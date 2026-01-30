import { useState, forwardRef } from 'react';
import { Input } from './ui/input';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>((props, ref) => {
  const [passwordPreview, setPasswordPreview] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        type={passwordPreview ? 'text' : 'password'}
      />
      <button
        onClick={() => setPasswordPreview((prev) => !prev)}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-matcha hover:bg-primary-foreground"
        type="button"
        tabIndex={-1}
      >
        {passwordPreview ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
