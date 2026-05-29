import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, loadEnv, type Plugin, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

const readJsonBody = async (request: IncomingMessage) => {
  const chunks: Buffer[] = []

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') as { text?: string; targetLanguageCode?: string }
}

const sendJson = (response: ServerResponse, statusCode: number, body: unknown) => {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(body))
}

type SarvamTtsResponse = {
  audios?: string[]
  error?: {
    message?: string
  }
}

const sarvamTtsProxy = (apiKey: string | undefined): Plugin => ({
  name: 'sarvam-tts-proxy',
  configureServer(server) {
    server.middlewares.use('/api/sarvam-tts', async (request, response) => {
      if (request.method !== 'POST') {
        sendJson(response, 405, { error: 'Method not allowed' })
        return
      }

      if (!apiKey) {
        sendJson(response, 500, { error: 'SARVAM_API_KEY is not configured.' })
        return
      }

      try {
        const { text, targetLanguageCode = 'en-IN' } = await readJsonBody(request)

        if (!text || text.length > 2500) {
          sendJson(response, 400, { error: 'Text is required and must stay under 2500 characters.' })
          return
        }

        const sarvamResponse = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'api-subscription-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            target_language_code: targetLanguageCode,
            model: 'bulbul:v3',
            speaker: 'shubh',
            pace: 1.08,
            speech_sample_rate: 44100,
            output_audio_codec: 'wav',
            temperature: 0.45,
          }),
        })

        const payload = await sarvamResponse.json() as SarvamTtsResponse

        if (!sarvamResponse.ok) {
          sendJson(response, sarvamResponse.status, {
            error: payload?.error?.message || 'Sarvam text-to-speech request failed.',
          })
          return
        }

        sendJson(response, 200, { audio: payload.audios?.[0] })
      } catch (error) {
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : 'Could not generate speech.',
        })
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const plugins: PluginOption[] = [
    tailwindcss(),
    svgr(),
    react(),
  ]

  if (command === 'serve') {
    plugins.unshift(sarvamTtsProxy(env.SARVAM_API_KEY))
  }

  return {
    plugins,
  }
})
