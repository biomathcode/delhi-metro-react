import { DownloadIcon, ExternalLinkIcon, InstagramLogoIcon, Link2Icon, Share2Icon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { toPng } from 'html-to-image';
import { memo, useMemo, useRef, useState } from 'react';

import { useI18n } from '../i18n';
import { useTheme } from '../theme';
import type { RouteSummary } from '../types/route';
import { copyText } from '../utils/clipboard';

interface RouteSharePanelProps {
    route: RouteSummary;
    fromName: string;
    toName: string;
}

function RouteSharePanel({ route, fromName, toName }: RouteSharePanelProps) {
    const { t } = useI18n();
    const { theme } = useTheme();
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [copiedMessage, setCopiedMessage] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    const routeUrl = useMemo(() => {
        const url = new URL(window.location.href);
        url.searchParams.set('from', route.from);
        url.searchParams.set('to', route.to);
        return url.toString();
    }, [route.from, route.to]);
    const shareText = t('shareRouteText', {
        from: fromName,
        to: toName,
        stops: route.distance,
        time: t('minutesShort', { count: route.estimatedMinutes }),
        fare: route.fare,
    });
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(routeUrl);
    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
    };

    const showCopiedMessage = (message: string) => {
        setCopiedMessage(message);
        window.setTimeout(() => setCopiedMessage(''), 1600);
    };

    const copyRouteLink = async (message = t('routeLinkCopied')) => {
        await copyText(routeUrl);
        showCopiedMessage(message);
    };

    const shareRoute = async () => {
        if (navigator.share) {
            await navigator.share({
                title: t('routeTitle', { from: fromName, to: toName }),
                text: shareText,
                url: routeUrl,
            });
            return;
        }

        await copyRouteLink();
    };

    const downloadRoutePng = async () => {
        if (!cardRef.current || isDownloading) return;

        setIsDownloading(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                cacheBust: true,
                pixelRatio: 2,
            });
            const link = document.createElement('a');
            link.download = `${route.from}-to-${route.to}-delhi-metro-route.png`.toLowerCase();
            link.href = dataUrl;
            link.click();
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <section className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900" aria-label={t('shareRoute')}>
            <div ref={cardRef} className="grid gap-3 rounded-lg bg-white p-3 text-neutral-950 dark:bg-zinc-900 dark:text-zinc-100">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#009b50] dark:text-emerald-400">{t('shareRoute')}</p>
                    <h3 className="mt-1 text-lg font-semibold leading-tight">{t('routeTitle', { from: fromName, to: toName })}</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-neutral-100 p-2 dark:bg-zinc-800">
                        <p className="text-xs font-medium text-neutral-500 dark:text-zinc-400">{t('fare')}</p>
                        <p className="mt-1 text-base font-semibold">₹{route.fare}</p>
                    </div>
                    <div className="rounded-lg bg-neutral-100 p-2 dark:bg-zinc-800">
                        <p className="text-xs font-medium text-neutral-500 dark:text-zinc-400">{t('stops')}</p>
                        <p className="mt-1 text-base font-semibold">{route.distance}</p>
                    </div>
                    <div className="rounded-lg bg-neutral-100 p-2 dark:bg-zinc-800">
                        <p className="text-xs font-medium text-neutral-500 dark:text-zinc-400">{t('time')}</p>
                        <p className="mt-1 text-base font-semibold">{t('minutesShort', { count: route.estimatedMinutes })}</p>
                    </div>
                </div>
                <p className="text-xs font-medium text-neutral-500 dark:text-zinc-400">metro.coolhead.in</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => copyRouteLink()}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                    <Link2Icon />
                    {t('copyRouteLink')}
                </button>
                <button
                    type="button"
                    onClick={shareRoute}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                    <Share2Icon />
                    {t('shareVia')}
                </button>
                <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                    <TwitterLogoIcon />
                    {t('shareOnTwitter')}
                </a>
                <a
                    href={shareLinks.reddit}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                    <ExternalLinkIcon />
                    {t('shareOnReddit')}
                </a>
                <button
                    type="button"
                    onClick={() => copyRouteLink(t('instagramLinkCopied'))}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                    <InstagramLogoIcon />
                    {t('shareOnInstagram')}
                </button>
                <button
                    type="button"
                    onClick={downloadRoutePng}
                    disabled={isDownloading}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                    <DownloadIcon />
                    {isDownloading ? t('routePngDownloading') : t('downloadRoutePng')}
                </button>
            </div>
            {copiedMessage ? <p className="text-xs font-semibold text-[#009b50] dark:text-emerald-400">{copiedMessage}</p> : null}
        </section>
    );
}

export default memo(RouteSharePanel);
