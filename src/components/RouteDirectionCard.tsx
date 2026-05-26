interface RouteDirectionCardProps {
    fromName: string;
    toName?: string;
}

function RouteDirectionCard({ fromName, toName }: RouteDirectionCardProps) {
    return (
        <div className="flex aspect-[293.4/101.89] w-full max-w-[293.4px] items-center gap-3 rounded-[16px] bg-[#F5F5F5] px-3">
            <svg
                width="71"
                height="71"
                viewBox="0 0 71 71"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="h-[71px] w-[71px] shrink-0"
            >
                <path d="M13.875 56.2083V14.7917" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M42.5388 48.4472L51.8024 35.5406L42.5388 22.634" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M49.7439 35.5354L23.5459 35.5" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-950">{fromName}</p>
                <p className="mt-1 truncate text-xs font-medium text-neutral-500">
                    {toName ? `To ${toName}` : 'Select destination'}
                </p>
            </div>
        </div>
    );
}

export default RouteDirectionCard;
