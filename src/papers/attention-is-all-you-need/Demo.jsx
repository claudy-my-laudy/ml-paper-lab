import { useState, useEffect, useRef } from 'react';

// ── Sentiment Demo ──────────────────────────────────────────────
function SentimentDemo() {
  const [text, setText] = useState('The Transformer architecture is absolutely brilliant!');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading-model | ready | running
  const classifierRef = useRef(null);

  async function loadModel() {
    setStatus('loading-model');
    try {
      const { pipeline } = await import('@xenova/transformers');
      classifierRef.current = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
      );
      setStatus('ready');
    } catch (e) {
      setStatus('error');
      console.error(e);
    }
  }

  async function runSentiment() {
    if (!classifierRef.current) return;
    setLoading(true);
    setStatus('running');
    try {
      const out = await classifierRef.current(text);
      setResult(out[0]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setStatus('ready');
  }

  const labelColor = result?.label === 'POSITIVE' ? 'text-emerald-400' : 'text-red-400';
  const barColor = result?.label === 'POSITIVE' ? 'bg-emerald-500' : 'bg-red-500';
  const confidence = result ? Math.round(result.score * 100) : 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-1">Sentiment Analysis</h3>
      <p className="text-sm text-gray-500 mb-4">
        Powered by DistilBERT (client-side via Transformers.js)
      </p>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-indigo-500 mb-4"
        placeholder="Type something..."
      />

      <div className="flex gap-3 mb-5">
        {status === 'idle' && (
          <button
            onClick={loadModel}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium text-white transition-colors"
          >
            Load Model
          </button>
        )}
        {status === 'loading-model' && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="animate-spin">⟳</span>
            Downloading model from HuggingFace… (~70MB, first load only)
          </div>
        )}
        {(status === 'ready' || status === 'running') && (
          <button
            onClick={runSentiment}
            disabled={loading || !text.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg text-sm font-medium text-white transition-colors"
          >
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
        )}
        {status === 'error' && (
          <span className="text-sm text-red-400">Failed to load model.</span>
        )}
      </div>

      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-xl font-bold ${labelColor}`}>{result.label}</span>
            <span className="text-gray-400 text-sm">{confidence}% confidence</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className={`${barColor} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Attention Heatmap ────────────────────────────────────────────
// Simulated attention weights for demo purposes (no model needed for viz)
function generateFakeAttention(tokens, heads = 8) {
  const n = tokens.length;
  return Array.from({ length: heads }, (_, h) =>
    Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => {
        // Each head has a slightly different pattern
        const diag = Math.exp(-Math.abs(i - j) * (0.3 + h * 0.15));
        const noise = Math.random() * 0.3;
        const v = diag + noise;
        return v;
      })
    )
  );
}

function normalizeRows(matrix) {
  return matrix.map(row => {
    const sum = row.reduce((a, b) => a + b, 0);
    return row.map(v => v / sum);
  });
}

function AttentionHeatmap() {
  const [sentence, setSentence] = useState('The cat sat on the mat');
  const [head, setHead] = useState(0);
  const [attentionData, setAttentionData] = useState(null);
  const [tokens, setTokens] = useState([]);

  function compute() {
    const toks = sentence.trim().split(/\s+/);
    const raw = generateFakeAttention(toks, 8);
    const normalized = raw.map(h => normalizeRows(h));
    setTokens(toks);
    setAttentionData(normalized);
  }

  useEffect(() => { compute(); }, []);

  const matrix = attentionData ? attentionData[head] : null;

  function heatColor(val) {
    // 0 → dark blue, 1 → bright yellow
    const r = Math.round(val * 255);
    const g = Math.round(val * 200);
    const b = Math.round((1 - val) * 255);
    return `rgb(${r},${g},${b})`;
  }

  const cellSize = Math.min(48, Math.floor(480 / Math.max(tokens.length, 1)));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-1">Attention Heatmap</h3>
      <p className="text-sm text-gray-500 mb-4">
        Visualize self-attention weights between tokens. (Illustrative simulation — each head develops a different pattern.)
      </p>

      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          value={sentence}
          onChange={e => setSentence(e.target.value)}
          className="flex-1 min-w-0 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          placeholder="Type a sentence..."
        />
        <button
          onClick={compute}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium text-white transition-colors"
        >
          Compute
        </button>
      </div>

      {/* Head slider */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-gray-400 w-24">Attention Head</span>
        <input
          type="range"
          min={0}
          max={7}
          value={head}
          onChange={e => setHead(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-indigo-400 font-mono w-6">{head}</span>
      </div>

      {/* Heatmap grid */}
      {matrix && (
        <div className="overflow-x-auto">
          <div className="inline-block">
            {/* Column labels */}
            <div className="flex" style={{ marginLeft: `${cellSize + 8}px` }}>
              {tokens.map((t, j) => (
                <div
                  key={j}
                  style={{ width: cellSize, fontSize: 11 }}
                  className="text-center text-gray-400 truncate px-0.5"
                  title={t}
                >
                  {t.length > 5 ? t.slice(0, 4) + '…' : t}
                </div>
              ))}
            </div>
            {/* Rows */}
            {matrix.map((row, i) => (
              <div key={i} className="flex items-center">
                {/* Row label */}
                <div
                  style={{ width: cellSize, fontSize: 11 }}
                  className="text-right text-gray-400 pr-2 truncate"
                  title={tokens[i]}
                >
                  {tokens[i]?.length > 5 ? tokens[i].slice(0, 4) + '…' : tokens[i]}
                </div>
                {row.map((val, j) => (
                  <div
                    key={j}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: heatColor(val),
                      opacity: 0.85 + val * 0.15,
                    }}
                    className="border border-gray-950/30"
                    title={`${tokens[i]} → ${tokens[j]}: ${val.toFixed(3)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4">
        <span className="text-xs text-gray-500">Low</span>
        <div className="flex-1 h-3 rounded" style={{
          background: 'linear-gradient(to right, rgb(0,0,255), rgb(128,100,128), rgb(255,200,0))'
        }} />
        <span className="text-xs text-gray-500">High</span>
      </div>
    </div>
  );
}

// ── Key Findings ──────────────────────────────────────────────────
function KeyFindings() {
  return (
    <div className="space-y-6 mb-10">
      <h2 className="text-2xl font-bold text-white">Key Findings</h2>

      {/* Self-Attention Concept */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-indigo-300 mb-3">Self-Attention Mechanism</h3>
        <p className="text-gray-300 text-sm mb-5 leading-relaxed">
          Instead of processing tokens one-by-one like RNNs, every token attends to every other token simultaneously.
          Each token produces a <strong className="text-white">Query</strong>, <strong className="text-white">Key</strong>, and{' '}
          <strong className="text-white">Value</strong>. Attention scores = softmax(QKᵀ / √d_k) · V.
        </p>

        {/* QKV diagram */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4 flex-wrap justify-center">
            {['Query (Q)', 'Key (K)', 'Value (V)'].map((label, i) => (
              <div key={i} className={`px-4 py-3 rounded-lg text-sm font-medium text-white text-center w-32 ${
                i === 0 ? 'bg-indigo-800 border border-indigo-600' :
                i === 1 ? 'bg-purple-800 border border-purple-600' :
                          'bg-teal-800 border border-teal-600'
              }`}>
                {label}
              </div>
            ))}
          </div>
          <div className="text-gray-400 text-xs text-center">
            ↓ dot product Q·Kᵀ → scale → softmax → weight V
          </div>
          <div className="bg-gray-800 border border-yellow-700 px-6 py-3 rounded-lg text-sm font-medium text-yellow-300">
            Attention Output
          </div>
        </div>
      </div>

      {/* Multi-Head Attention */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-3">Multi-Head Attention</h3>
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          Run attention <em>h</em> times in parallel with different learned projections. Each head can attend to different
          aspects (syntax, coreference, position). Outputs are concatenated and projected.
        </p>
        <div className="flex gap-2 flex-wrap justify-center mb-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-mono text-white"
              style={{ background: `hsl(${i * 40},60%,35%)`, border: `1px solid hsl(${i * 40},60%,50%)` }}
            >
              h{i + 1}
            </div>
          ))}
        </div>
        <div className="text-center text-gray-400 text-xs">→ Concat → Linear → Output</div>
      </div>

      {/* Positional Encoding */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-teal-300 mb-3">Positional Encoding</h3>
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          Since attention has no inherent order, position is injected via sinusoidal encodings added to embeddings.
          PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
        </p>
        {/* Visual sin waves */}
        <svg viewBox="0 0 400 80" className="w-full h-16">
          {[0, 1, 2, 3].map(dim => (
            <polyline
              key={dim}
              points={Array.from({ length: 40 }, (_, x) => {
                const pos = x * 10;
                const y = 40 + 30 * Math.sin(pos / Math.pow(10000, (2 * dim) / 512));
                return `${x * 10},${y}`;
              }).join(' ')}
              fill="none"
              stroke={`hsl(${dim * 70 + 160},70%,55%)`}
              strokeWidth="1.5"
              opacity="0.8"
            />
          ))}
        </svg>
        <p className="text-xs text-gray-500 text-center mt-2">Different frequency sinusoids for each embedding dimension</p>
      </div>

      {/* Why it mattered */}
      <div className="bg-indigo-950 border border-indigo-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-indigo-200 mb-3">Why It Mattered</h3>
        <ul className="text-gray-300 text-sm space-y-2 list-none">
          {[
            '🚀 Parallelizable — no sequential dependencies like RNNs/LSTMs',
            '📏 Long-range dependencies handled in O(1) layers',
            '🔁 Foundation for BERT, GPT, T5, and basically all modern LLMs',
            '🎯 Scaled to unprecedented model sizes efficiently',
          ].map((item, i) => (
            <li key={i} className="flex gap-2">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Main Demo Component ───────────────────────────────────────────
export default function Demo() {
  return (
    <div className="space-y-10">
      <KeyFindings />

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Live Demos</h2>
        <div className="space-y-6">
          <SentimentDemo />
          <AttentionHeatmap />
        </div>
      </div>
    </div>
  );
}
