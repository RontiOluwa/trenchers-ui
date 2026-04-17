import Image from 'next/image';
import Link from 'next/link';
import { useThemeToggle } from '@/hooks/useTheme';

interface Props {
    size?: number;
    href?: string;
    showText?: boolean;
    textStyle?: string;
}

export function Logo({ size = 28, href = '/', showText = true, textStyle = '' }: Props) {
    const { isDark } = useThemeToggle();

    const content = (
        <div className="flex items-center gap-2 shrink-0">
            <Image src="/logo.png" alt="Trenchers" width={size} height={size} style={{ width: size, height: size }} />
            {showText && (
                <span className={`font-bold tracking-wide ${isDark ? 'dark:text-white' : 'text-gray-900'}  ${textStyle}`}>
                    TRENCHERS
                </span>
            )}
        </div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
}