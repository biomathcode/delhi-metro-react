import { CheckIcon, ClipboardCopyIcon, GitHubLogoIcon, LinkedInLogoIcon, PlayIcon } from '@radix-ui/react-icons';
import { memo, useState } from 'react';

import { useI18n } from '../i18n';
import { copyText } from '../utils/clipboard';

const SUPPORT_EMAIL = 'sharma.pratik2016@gmail.com';
const LINKEDIN_URL = 'https://linkedin.com/in/biomathcode';
const GITHUB_URL = 'https://github.com/biomathcode';
const YOUTUBE_URL = 'https://www.youtube.com/@delhi-metro-map';

function CreatorLinks() {
    const { t } = useI18n();
    const [copied, setCopied] = useState(false);

    const copySupportEmail = async () => {
        await copyText(SUPPORT_EMAIL);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    return (
        <section className="grid gap-2 border-t border-neutral-200 pt-3 dark:border-zinc-700 sm:pt-4" aria-label={t('creatorLinks')}>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-zinc-400">{t('createdBy')}</p>
            <div className="flex flex-wrap items-center gap-2">
                <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                    <LinkedInLogoIcon />
                    {t('linkedin')}
                </a>
                <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                    <GitHubLogoIcon />
                    {t('github')}
                </a>
                <a
                    href={YOUTUBE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                    <PlayIcon />
                    {t('youtube')}
                </a>
                <button
                    type="button"
                    onClick={copySupportEmail}
                    title={SUPPORT_EMAIL}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                    {copied ? <CheckIcon /> : <ClipboardCopyIcon />}
                    {copied ? t('supportEmailCopied') : t('copySupportEmail')}
                </button>

            </div>


        </section>
    );
}

export default memo(CreatorLinks);
