'use client';

import { type InputHTMLAttributes, forwardRef } from 'react';



interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
    label?: string;
    prefix?: React.ReactNode;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
    ({ label, prefix, error, className, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label className="text-sm font-medium dark:text-gray-300 text-gray-700">
                        {label}
                    </label>
                )}
                <div className={` ${className}
                ${error ? 'border-red-500' : ''}
               `}
                >
                    {prefix && <span className="shrink-0">{prefix}</span>}
                    <input
                        ref={ref}
                        className="flex-1 bg-transparent outline-none text-sm min-w-0"
                        {...props}
                    />
                </div>
                {error && <span className="text-xs text-red-500">{error}</span>}
            </div >
        );
    }
);

Input.displayName = 'Input';


// ${isDark ? 'dark:bg-[#1e1e1e] dark:border-white/[0.08] dark:text-white dark:placeholder:text-gray-600'
// : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
// }
// flex items-center gap-2 px-4 py-3 rounded-xl border
// transition-all outline-none
// focus-within:ring-2 focus-within:ring-[#7c3aed]/50
// focus-within:border-[#7c3aed]/50