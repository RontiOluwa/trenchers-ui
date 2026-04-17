import { type ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

type Variant = 'primary' | 'ghost' | 'success' | 'danger' | 'secondary';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    className?: string;
    children: React.ReactNode;
}

type ButtonProps = BaseProps &
    (
        | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>)
        | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>)
    );

const VARIANTS: Record<Variant, string> = {
    primary: 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-sm hover:shadow-[#7c3aed]/30',
    ghost: 'border dark:border-white/20 border-gray-300 dark:text-white text-gray-700 dark:hover:border-white/40 hover:border-gray-400',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    secondary: 'dark:bg-[#1a1a1a] dark:hover:bg-[#252525] dark:text-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700',
};

const SIZES: Record<Size, string> = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-7 py-3.5',
};

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const base = `inline-flex items-center justify-center gap-2 font-semibold
    rounded-lg transition-all duration-200 active:scale-[0.98]
    disabled:opacity-70 disabled:cursor-not-allowed
    ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

    if ('href' in props && props.href) {
        const { href, ...rest } = props as { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>;
        return <Link href={href} className={base} {...rest}>{children}</Link>;
    }

    const btnProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
        <button className={base} disabled={loading || btnProps.disabled} {...btnProps}>
            {loading ? (
                <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {children}
                </>
            ) : children}
        </button>
    );
}