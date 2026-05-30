import { useI18n } from '../i18n';

interface RouteDirectionCardProps {
    fromName: string;
    toName?: string;
    lineColor?: string;
    label?: string;
    className?: string;
    compact?: boolean;
}

function RouteDirectionCard({ fromName, toName, lineColor = '#111827', label = 'To', className = '', compact = false }: RouteDirectionCardProps) {
    const { t } = useI18n();

    return (
        <div className={`flex w-full items-center rounded-lg bg-[#F5F5F5] dark:bg-zinc-800 ${compact ? 'max-w-[176px] gap-2 px-2.5 py-2' : 'aspect-[293.4/101.89] max-w-[293.4px] gap-3 px-3'} ${className}`}>
            <svg
                width="71"
                height="71"
                viewBox="0 0 71 71"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className={compact ? 'h-8 w-8 shrink-0' : 'h-[71px] w-[71px] shrink-0'}
            >
                <path d="M13.875 56.2083V14.7917" stroke={lineColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M42.5388 48.4472L51.8024 35.5406L42.5388 22.634" stroke={lineColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M49.7439 35.5354L23.5459 35.5" stroke={lineColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="min-w-0">
                <p className={`truncate font-semibold text-neutral-950 dark:text-zinc-100 ${compact ? 'text-xs' : 'text-sm'}`}>{fromName}</p>
                <p className="mt-0.5 truncate text-xs font-medium text-neutral-500 dark:text-zinc-400">
                    {toName ? `${label} ${toName}` : t('selectDestination')}
                </p>
            </div>
        </div>
    );
}

export default RouteDirectionCard;
