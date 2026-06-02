
import './App.css'
import MetroMapStage from './components/Stage'
import { LazyBoundary } from './components/LazyComponent'
import { I18nProvider } from './i18n'
import { usePathname } from './store/locationStore'
import { ThemeProvider } from './theme'
import { createLazyComponent } from './utils/lazyComponent'

const StationPage = createLazyComponent(() => import('./components/StationPage'));

const stationSlugFromPathname = (pathname: string) => {
  const match = pathname.match(/^\/stations\/([^/]+)\/?$/);
  return match?.[1] || null;
};

function AppContent() {
  const pathname = usePathname();
  const stationSlug = stationSlugFromPathname(pathname);

  if (stationSlug) {
    return (
      <LazyBoundary fallback={<div className="min-h-svh bg-[#f4f0e8] dark:bg-zinc-950" />}>
        <StationPage slug={stationSlug} />
      </LazyBoundary>
    );
  }

  return <MetroMapStage />;
}

function App() {

  return (
    <ThemeProvider>
      <I18nProvider>
        <div>
          <AppContent />
        </div>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
