
import './App.css'
import MetroMapStage from './components/Stage'
import { I18nProvider } from './i18n'
import { ThemeProvider } from './theme'

function App() {

  return (
    <ThemeProvider>
      <I18nProvider>
        <div>
          <MetroMapStage />
        </div>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
