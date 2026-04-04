'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

type Role = 'user' | 'assistant'
interface Message {
  role: Role
  content: string
  isStreaming?: boolean
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi — I'm **OpenFounder**, your free guide for starting a business.\n\nI'll walk you through everything: choosing your entity, drafting your operating agreement, filing with the state, getting your EIN, setting up banking, and more. All in plain English.\n\nTo get started, tell me:\n1. **What state** are you in?\n2. **What kind of business** are you starting?\n3. **Solo or with partners?**",
}

function getDownloadInfo(content: string): { filename: string; label: string } | null {
  if (content.includes('# OPERATING AGREEMENT')) {
    return { filename: 'operating-agreement.md', label: 'Download Operating Agreement' }
  }
  if (content.includes('Launch Checklist') && content.includes('Legal Foundation')) {
    return { filename: 'launch-checklist.md', label: 'Download Launch Checklist' }
  }
  return null
}

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [toolStatus, setToolStatus] = useState<string | null>(null)
  const [copied, setCopied] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, toolStatus, isThinking])

  const toolLabel = (tool: string): string => {
    const labels: Record<string, string> = {
      get_state_info: 'Looking up state requirements...',
      recommend_entity_type: 'Analyzing your situation...',
      generate_operating_agreement: 'Drafting your operating agreement...',
      generate_launch_checklist: 'Building your launch checklist...',
      get_ein_guide: 'Pulling EIN guide...',
      get_banking_guide: 'Finding banking options...',
    }
    return labels[tool] || 'Working on it...'
  }

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMessage: Message = { role: 'user', content: text }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)
    setIsThinking(true)
    setToolStatus(null)

    const apiMessages = updatedMessages.map(m => ({ role: m.role, content: m.content }))
    setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)
      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.type === 'tool_status') {
              setIsThinking(false)
              setToolStatus(toolLabel(data.tool))
            } else if (data.type === 'text') {
              setIsThinking(false)
              accumulated += data.content
              setToolStatus(null)
              setMessages(prev => {
                const next = [...prev]
                next[next.length - 1] = { role: 'assistant', content: accumulated, isStreaming: true }
                return next
              })
            } else if (data.type === 'done') {
              setMessages(prev => {
                const next = [...prev]
                next[next.length - 1] = { role: 'assistant', content: accumulated, isStreaming: false }
                return next
              })
            } else if (data.type === 'error') {
              throw new Error(data.message)
            }
          } catch { /* skip malformed chunks */ }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
      setMessages(prev => {
        const next = prev.filter(m => !m.isStreaming)
        return [...next, { role: 'assistant', content: `Sorry, something went wrong: ${msg}\n\nPlease try again.` }]
      })
    } finally {
      setIsLoading(false)
      setIsThinking(false)
      setToolStatus(null)
      inputRef.current?.focus()
    }
  }, [input, isLoading, messages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2 text-gray-900 hover:opacity-80 transition-opacity">
          <span className="text-lg">🌱</span>
          <span className="font-semibold text-sm">OpenFounder</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 hidden sm:block">Free & open source</span>
          <a
            href="https://github.com/akoke1990/openfoundr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((msg, i) => {
            const downloadInfo = msg.role === 'assistant' && !msg.isStreaming
              ? getDownloadInfo(msg.content)
              : null

            return (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm mt-0.5 ${
                  msg.role === 'assistant' ? 'bg-forest-100 text-forest-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {msg.role === 'assistant' ? '🌱' : '↑'}
                </div>

                <div className={`group relative max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>

                  {msg.content && (
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-forest-700 text-white rounded-tr-sm'
                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <div className={`prose-chat ${msg.isStreaming ? 'after:content-["▋"] after:animate-pulse after:text-forest-600 after:ml-0.5' : ''}`}>
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  )}

                  {/* Action row — download + copy */}
                  {msg.role === 'assistant' && msg.content && !msg.isStreaming && (
                    <div className="flex items-center gap-2 ml-1">
                      {downloadInfo && (
                        <button
                          onClick={() => downloadText(msg.content, downloadInfo.filename)}
                          className="flex items-center gap-1.5 text-xs bg-forest-700 text-white px-3 py-1.5 rounded-lg hover:bg-forest-800 transition-colors font-medium"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          {downloadInfo.label}
                        </button>
                      )}
                      {msg.content.length > 200 && (
                        <button
                          onClick={() => handleCopy(msg.content, i)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 hover:text-gray-600"
                        >
                          {copied === i ? '✓ Copied' : 'Copy'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Thinking bubble — shows immediately on send */}
          {isThinking && !toolStatus && (
            <div className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-full bg-forest-100 flex items-center justify-center text-sm shrink-0">🌱</div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-forest-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-forest-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-forest-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}

          {/* Tool status bubble */}
          {toolStatus && (
            <div className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-full bg-forest-100 flex items-center justify-center text-sm shrink-0">🌱</div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-forest-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-forest-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-forest-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  {toolStatus}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-4 shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 items-end bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-forest-300 focus-within:ring-2 focus-within:ring-forest-100 transition-all px-4 py-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about starting your business..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-900 placeholder-gray-400 max-h-32"
              style={{ lineHeight: '1.5' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="shrink-0 w-8 h-8 rounded-xl bg-forest-700 text-white flex items-center justify-center hover:bg-forest-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-3.5 h-3.5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            Not legal advice · Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
