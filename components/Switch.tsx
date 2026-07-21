'use client';

export default function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`md-btn relative shrink-0 w-11 h-6 rounded-full transition-colors duration-300 ${
        checked ? 'bg-primary dark:bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
