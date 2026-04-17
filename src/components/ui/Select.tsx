'use client';

import { type SelectHTMLAttributes, forwardRef } from 'react';


interface Props extends Omit<SelectHTMLAttributes<HTMLInputElement>, 'prefix'> {
    symbol?: string;
    prefix?: React.ReactNode;
    error?: string;
    data: any
    func: (v: string) => void;
}

export const Select = forwardRef<HTMLInputElement, Props>(
    ({ symbol, prefix, error, data, className, func, ...props }, ref) => {
        return (

            <select
                value={symbol}
                onChange={e => func(e.target.value)}
                className={`${className}`}>
                {data.map((s: any) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                ))}
            </select>

            // <div className="flex flex-col gap-1.5 w-full">
            //     {label && (
            //         <label className="text-sm font-medium dark:text-gray-300 text-gray-700">
            //             {label}
            //         </label>
            //     )}
            //     <div className={` ${className}
            //     ${error ? 'border-red-500' : ''}
            //    `}
            //     >
            //         {prefix && <span className="shrink-0">{prefix}</span>}
            //         <input
            //             ref={ref}
            //             className="flex-1 bg-transparent outline-none text-sm min-w-0"
            //             {...props}
            //         />
            //     </div>
            //     {error && <span className="text-xs text-red-500">{error}</span>}
            // </div >
        );
    }
);