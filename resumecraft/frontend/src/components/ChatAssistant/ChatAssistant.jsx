import { useState } from 'react';
import { MessageCircle, X, Send, Loader2, AlertCircle, Bot, User, RefreshCw } from 'lucide-react';
import api from '../../utils/api';

export default function ChatAssistant({ resumeData, onResumeUpdate, resumeId }) {
  const [open, setOpen]         = useState(false);
  const [message, setMessage]   = useState('');
  const [reply, setReply]       = useState(null);   // single reply only — no history list
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [remaining, setRemaining] = useState(null); // null = unknown yet

  const QUICK = [
    'Improve my summary',
    'Add stronger action verbs',
    'Make it ATS-friendly',
    'Fix my bullet points',
    'Highlight achievements better'
  ];

  const send = async (text) => {
    const msg = text || message.trim();
    if (!msg || loading) return;
    setLoading(true);
    setError('');
    setReply(null);

    try {
      // No conversationHistory sent — stateless to save tokens
      const res = await api.post('/api/ai/chat', {
        message: msg,
        resumeData,
        resumeId
        // no conversationHistory field
      });

      setReply({ question: msg, answer: res.data.message });
      setRemaining(res.data.remaining ?? null);

      if (res.data.action === 'update' && res.data.resumeData) {
        onResumeUpdate?.(res.data.resumeData);
      }

      setMessage('');
    } catch (err) {
      if (err.response?.status === 429) {
        setError(err.response.data.error || 'Daily chat limit reached. Resets at midnight.');
        setRemaining(0);
      } else {
        setError('Chat failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setReply(null);
    setError('');
    setMessage('');
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-xl hover:bg-blue-700 transition-all hover:scale-105 z-40 flex items-center gap-2"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-semibold hidden sm:block">AI Coach</span>
        {remaining !== null && remaining > 0 && (
          <span className="bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {remaining}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden max-h-[75vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-white" />
              <span className="text-white font-semibold text-sm">AI Resume Coach</span>
            </div>
            <div className="flex items-center gap-2">
              {remaining !== null && (
                <span className="text-xs text-blue-100">
                  {remaining === 0
                    ? 'Limit reached'
                    : `${remaining} chat${remaining !== 1 ? 's' : ''} left today`}
                </span>
              )}
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Intro if no reply yet */}
            {!reply && !error && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-xs text-blue-700 font-medium mb-1">💡 How the AI coach works</p>
                  <p className="text-xs text-blue-600 leading-relaxed">
                    Ask anything about your resume. Each session is fresh — no history stored.
                    <br /><span className="font-semibold">3 free chats per day</span>, resets at midnight.
                  </p>
                </div>

                <p className="text-xs text-gray-500 font-medium">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK.map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      disabled={loading || remaining === 0}
                      className="bg-gray-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-40"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-700 text-xs font-medium">{error}</p>
                  {remaining === 0 && (
                    <p className="text-red-500 text-xs mt-1">Resets at midnight. Come back tomorrow!</p>
                  )}
                </div>
              </div>
            )}

            {/* Single reply block */}
            {reply && (
              <div className="space-y-3">
                {/* User question */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-3 py-2 max-w-xs">
                    <p className="text-xs leading-relaxed">{reply.question}</p>
                  </div>
                </div>
                {/* AI answer */}
                <div className="flex gap-2">
                  <div className="bg-blue-600 rounded-full p-1.5 h-fit flex-shrink-0">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 max-w-xs">
                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{reply.answer}</p>
                  </div>
                </div>

                {/* Ask another */}
                <button
                  onClick={reset}
                  disabled={remaining === 0}
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="h-3 w-3" />
                  {remaining === 0 ? 'No chats left today' : 'Ask another question'}
                  {remaining !== null && remaining > 0 && (
                    <span className="text-gray-400">({remaining} left)</span>
                  )}
                </button>
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs">AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Input */}
          {(!reply || !reply.answer) && remaining !== 0 && (
            <div className="border-t border-gray-100 p-3">
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder="Ask about your resume..."
                  disabled={loading || remaining === 0}
                  className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 placeholder-gray-400"
                />
                <button
                  onClick={() => send()}
                  disabled={!message.trim() || loading || remaining === 0}
                  className="bg-blue-600 text-white rounded-xl p-2.5 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Show new question button when reply exists */}
          {reply && remaining !== 0 && (
            <div className="border-t border-gray-100 p-3">
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder="Ask another question..."
                  disabled={loading || remaining === 0}
                  className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 placeholder-gray-400"
                />
                <button
                  onClick={() => send()}
                  disabled={!message.trim() || loading || remaining === 0}
                  className="bg-blue-600 text-white rounded-xl p-2.5 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
