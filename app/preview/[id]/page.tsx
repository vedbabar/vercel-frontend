'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  WandSparkles,
  Loader2,
  Copy,
  Download,
  CheckCircle2,
  Eye,
  Code,
  Moon,
  Sun,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export default function PreviewPage() {
  const params = useParams();
  const id = params.id as string;

  const [readme, setReadme] = useState('');
  const [status, setStatus] = useState('LOADING');
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [marked, setMarked] = useState<any>(null);

  // Load marked.js from CDN
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.marked) {
        // @ts-ignore
        setMarked(() => window.marked);
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (id) fetchReadme();
  }, [id]);

  const fetchReadme = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/status/${id}`);
      const data = await res.json();

      if (data.status === 'COMPLETED') {
        setReadme(data.content);
        setStatus('COMPLETED');
      } else if (data.status === 'FAILED') {
        setError(data.content);
        setStatus('FAILED');
      } else {
        setStatus('PENDING');
        setTimeout(fetchReadme, 30000);
      }
    } catch (err) {
      setStatus('FAILED');
      setError('Could not connect to server or ID is invalid.');
    }
  };

  const parseMarkdown = (markdown: string) => {
    if (!marked || !markdown) return '';

    try {
      marked.setOptions({
        gfm: true,
        breaks: false,
        headerIds: true,
        mangle: false,
      });

      return marked.parse(markdown);
    } catch (err) {
      console.error('Markdown parsing error:', err);
      return '<p>Error parsing markdown</p>';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(readme);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([readme], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`relative flex min-h-screen w-full flex-col items-center font-sans transition-colors duration-500 ${isDark
        ? 'bg-[#0a0a0f]'
        : 'bg-gradient-to-br from-slate-50 via-white to-violet-50'
      } p-6 sm:p-12 overflow-hidden`}>

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            <div className="orb orb-violet absolute -top-32 -right-32 h-[500px] w-[500px] opacity-40 animate-float"></div>
            <div className="orb orb-cyan absolute -bottom-40 -left-40 h-[400px] w-[400px] opacity-30 animate-float-delayed"></div>
            <div className="orb orb-emerald absolute top-1/2 left-1/3 h-[200px] w-[200px] opacity-20 animate-float-slow"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
          </>
        ) : (
          <>
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-violet-200 to-purple-100 opacity-50 blur-3xl animate-float"></div>
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 opacity-40 blur-3xl animate-float-delayed"></div>
            <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 opacity-30 blur-3xl animate-float-slow"></div>
          </>
        )}
      </div>

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-6 right-6 p-3 rounded-xl transition-all duration-300 cursor-pointer hover:scale-110 z-50 ${isDark
            ? 'bg-slate-800/80 hover:bg-slate-700/80 text-yellow-400 backdrop-blur-sm border border-slate-700/50'
            : 'bg-white/80 hover:bg-white text-slate-800 backdrop-blur-sm border border-slate-200 shadow-lg'
          }`}
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Header */}
      <header className="mb-12 flex flex-col items-center text-center relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <div className={`relative rounded-2xl p-3 animate-float ${isDark
              ? 'bg-gradient-to-br from-violet-600 to-purple-700 shadow-lg glow-violet'
              : 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl'
            }`}>
            <WandSparkles className="h-8 w-8 text-white" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
          </div>
          <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            GitReadme
          </h1>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isDark
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white'
              : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white'
            }`}>
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Preview
            </span>
          </span>
        </div>
        <h2 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Shared README <span className="gradient-text">Preview</span>
        </h2>
      </header>

      {/* Content Area */}
      <div className="w-full max-w-5xl relative z-10">

        {/* Loading State */}
        {(status === 'LOADING' || status === 'PENDING') && (
          <div className={`mt-6 rounded-2xl p-8 text-center animate-fade-slide-up ${isDark ? 'glass-card-dark' : 'glass-card'
            }`}>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <Loader2 className={`h-10 w-10 animate-spin ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
                <div className="absolute inset-0 animate-ping opacity-20">
                  <Loader2 className={`h-10 w-10 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
                </div>
              </div>
              <div>
                <p className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Fetching shared content...
                </p>
                <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Please wait while we retrieve the README.
                </p>
              </div>
              <div className="w-48 h-2 rounded-full shimmer-bar"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'FAILED' && (
          <div className="mt-6 rounded-2xl border border-red-400/50 bg-gradient-to-br from-red-50 to-red-100 p-8 shadow-lg text-center animate-fade-slide-up">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-red-800">Unable to load README</p>
            <p className="mt-2 text-sm text-red-700">{error || "The link might be invalid or expired."}</p>
          </div>
        )}

        {/* Success State */}
        {status === 'COMPLETED' && readme && (
          <div className="w-full success-container">
            <div className="mb-5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 success-icon">
                <div className={`rounded-xl p-2 ${isDark
                    ? 'bg-gradient-to-br from-emerald-500 to-green-600 glow-emerald'
                    : 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg'
                  }`}>
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Here is the README
                </h2>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer ${isDark
                      ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/30 hover:border-cyan-500/50'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100'
                    }`}
                >
                  {showPreview ? <><Code className="h-4 w-4" /> Show Code</> : <><Eye className="h-4 w-4" /> Show Preview</>}
                </button>
                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer ${isDark
                      ? 'bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700 hover:border-slate-500'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                >
                  {copied ? <><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy</>}
                </button>
                <button
                  onClick={handleDownload}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer ${isDark
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 hover:shadow-lg hover:shadow-violet-500/20'
                      : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md hover:from-violet-400 hover:to-purple-400 hover:shadow-lg'
                    }`}
                >
                  <Download className="h-4 w-4" /> Download .md
                </button>
              </div>
            </div>

            {showPreview ? (
              <div className={`rounded-2xl overflow-hidden shadow-2xl ${isDark ? 'border border-slate-700/50' : 'border border-gray-200'
                }`}>
                <div className={`px-4 py-3 flex items-center justify-between border-b ${isDark
                    ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700'
                    : 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'
                  }`}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-gray-400 ml-2 font-mono">README.md - Preview</span>
                  </div>
                </div>
                <div className={`p-8 sm:p-12 overflow-auto min-h-[500px] ${isDark ? 'bg-[#0d1117]' : 'bg-white'}`}>
                  <style jsx global>{`
                    .markdown-body {
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
                      font-size: 16px;
                      line-height: 1.6;
                      word-wrap: break-word;
                      color: ${isDark ? '#c9d1d9' : '#24292f'};
                    }
                    .markdown-body h1, .markdown-body h2 {
                      font-weight: 600;
                      padding-bottom: 0.3em;
                      border-bottom: 1px solid ${isDark ? '#21262d' : '#d0d7de'};
                      margin-top: 24px;
                      margin-bottom: 16px;
                      color: ${isDark ? '#c9d1d9' : '#24292f'};
                    }
                    .markdown-body h1 { font-size: 2em; }
                    .markdown-body h2 { font-size: 1.5em; }
                    .markdown-body h3 { 
                      font-size: 1.25em; 
                      font-weight: 600; 
                      margin-top: 24px; 
                      margin-bottom: 16px;
                      color: ${isDark ? '#c9d1d9' : '#24292f'};
                    }
                    .markdown-body h4, .markdown-body h5, .markdown-body h6 { 
                      font-size: 1em; 
                      font-weight: 600; 
                      margin-top: 24px; 
                      margin-bottom: 16px;
                      color: ${isDark ? '#c9d1d9' : '#24292f'};
                    }
                    .markdown-body p { 
                      margin-top: 0; 
                      margin-bottom: 16px;
                      color: ${isDark ? '#c9d1d9' : '#24292f'};
                    }
                    .markdown-body a { 
                      color: ${isDark ? '#58a6ff' : '#0969da'}; 
                      text-decoration: none; 
                    }
                    .markdown-body a:hover { text-decoration: underline; }
                    .markdown-body code {
                      padding: 0.2em 0.4em;
                      margin: 0;
                      font-size: 85%;
                      background-color: ${isDark ? 'rgba(110,118,129,0.4)' : 'rgba(175,184,193,0.2)'};
                      border-radius: 6px;
                      font-family: ui-monospace, SFMono-Regular, monospace;
                      color: ${isDark ? '#c9d1d9' : '#24292f'};
                    }
                    .markdown-body pre {
                      padding: 16px;
                      overflow: auto;
                      font-size: 85%;
                      line-height: 1.45;
                      background-color: ${isDark ? '#161b22' : '#f6f8fa'};
                      border-radius: 6px;
                      margin-bottom: 16px;
                    }
                    .markdown-body pre code {
                      background-color: transparent;
                      padding: 0;
                      color: ${isDark ? '#c9d1d9' : '#24292f'};
                    }
                    .markdown-body ul, .markdown-body ol {
                      padding-left: 2em;
                      margin-top: 0;
                      margin-bottom: 16px;
                      color: ${isDark ? '#c9d1d9' : '#24292f'};
                    }
                    .markdown-body li {
                      margin-top: 0.25em;
                      color: ${isDark ? '#c9d1d9' : '#24292f'};
                    }
                    .markdown-body ul {
                      list-style-type: disc;
                    }
                    .markdown-body ol {
                      list-style-type: decimal;
                    }
                    .markdown-body li::marker {
                      color: ${isDark ? '#8b949e' : '#57606a'};
                    }
                    .markdown-body table {
                      border-spacing: 0;
                      border-collapse: collapse;
                      width: 100%;
                      margin-top: 0;
                      margin-bottom: 16px;
                      color: ${isDark ? '#c9d1d9' : '#24292f'};
                    }
                    .markdown-body table th, .markdown-body table td {
                      padding: 6px 13px;
                      border: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
                      color: ${isDark ? '#c9d1d9' : '#24292f'};
                    }
                    .markdown-body table th {
                      font-weight: 600;
                      background-color: ${isDark ? '#161b22' : '#f6f8fa'};
                    }
                    .markdown-body table tr {
                      background-color: ${isDark ? '#0d1117' : '#ffffff'};
                      border-top: 1px solid ${isDark ? '#21262d' : '#d0d7de'};
                    }
                    .markdown-body table tr:nth-child(2n) {
                      background-color: ${isDark ? '#161b22' : '#f6f8fa'};
                    }
                    .markdown-body blockquote {
                      padding: 0 1em;
                      color: ${isDark ? '#8b949e' : '#57606a'};
                      border-left: 0.25em solid ${isDark ? '#30363d' : '#d0d7de'};
                      margin: 0 0 16px 0;
                    }
                    .markdown-body hr {
                      height: 0.25em;
                      padding: 0;
                      margin: 24px 0;
                      background-color: ${isDark ? '#21262d' : '#d0d7de'};
                      border: 0;
                    }
                    .markdown-body img {
                      max-width: 100%;
                      box-sizing: content-box;
                    }
                    .markdown-body strong { 
                      font-weight: 600;
                      color: ${isDark ? '#c9d1d9' : '#24292f'};
                    }
                    .markdown-body em { 
                      font-style: italic;
                      color: ${isDark ? '#c9d1d9' : '#24292f'};
                    }
                    .markdown-body del { 
                      text-decoration: line-through;
                      color: ${isDark ? '#c9d1d9' : '#24292f'};
                    }
                  `}</style>
                  <div className="markdown-body" dangerouslySetInnerHTML={{ __html: parseMarkdown(readme) }} />
                </div>
              </div>
            ) : (
              <div className={`rounded-2xl overflow-hidden shadow-2xl ${isDark ? 'border border-slate-700/50' : 'border border-gray-200'
                }`}>
                <div className={`px-4 py-3 flex items-center justify-between border-b ${isDark
                    ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700'
                    : 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'
                  }`}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-gray-400 ml-2 font-mono">README.md</span>
                  </div>
                </div>
                <div className={`p-6 overflow-auto max-h-[600px] ${isDark ? 'bg-[#0d1117]' : 'bg-slate-900'}`}>
                  <pre className="text-sm leading-relaxed"><code className="text-slate-100 whitespace-pre-wrap font-mono">{readme}</code></pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`mt-16 text-center text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
        <p>Made with ❤️ for developers everywhere</p>
      </footer>
    </div>
  );
}