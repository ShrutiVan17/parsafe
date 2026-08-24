import { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { askParSafe } from '../api'
import { getStaticDemo } from '../demo'

export default function AskParSafe({ apiEnabled }) {
  const [query, setQuery] = useState(
    'Find me a low-risk parking option with a short walk'
  )
  const [answer, setAnswer] = useState('')
  const [mode, setMode] = useState(apiEnabled ? 'Python API' : 'Static demo')
  const [loading, setLoading] = useState(false)
  const [presets, setPresets] = useState([])

  useEffect(() => {
    if (!apiEnabled) {
      getStaticDemo()
        .then((data) => setPresets(Object.keys(data.presetQueries || {})))
        .catch(() => setPresets([]))
    }
  }, [apiEnabled])

  async function ask(nextQuery = query) {
    const value = nextQuery.trim()
    if (!value) return

    setQuery(value)
    setLoading(true)

    try {
      if (apiEnabled) {
        const result = await askParSafe(value)
        setAnswer(result.answer || 'No answer returned.')
        setMode(result.mode || 'Python API')
      } else {
        const demo = await getStaticDemo()
        const result = demo.presetQueries?.[value]

        if (!result) {
          setAnswer(
            'Static mode supports the example questions below. Connect the Python API for free-form retrieval.'
          )
        } else {
          setAnswer(result.answer)
        }

        setMode('Python-generated static demo')
      }
    } catch {
      setAnswer('The recommendation service is currently unavailable.')
      setMode('Unavailable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rag">
      <div className="eyebrow">RETRIEVAL-GROUNDED RECOMMENDATION</div>
      <h2>Ask ParSafe</h2>

      {!apiEnabled && presets.length > 0 && (
        <div className="preset-row">
          {presets.map((preset) => (
            <button
              className="preset"
              key={preset}
              onClick={() => ask(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      )}

      <div className="prompt">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && ask()}
        />
        <button onClick={() => ask()} disabled={loading}>
          <Send size={16} />
          {loading ? 'Searching...' : 'Ask'}
        </button>
      </div>

      <div className="answer">
        <small>MODE · {mode}</small>
        <p>
          {answer ||
            'Enter a parking question or choose an example query.'}
        </p>
      </div>
    </section>
  )
}
