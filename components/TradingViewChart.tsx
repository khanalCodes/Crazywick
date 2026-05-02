'use client'
import { useEffect, useRef } from 'react'

export default function TradingViewChart({ symbol = 'FOREXCOM:SPXUSD' }: { symbol?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: 'D',
      timezone: 'Asia/Kathmandu',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: '#111111',
      gridColor: 'rgba(255,255,255,0.04)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
    })

    ref.current.appendChild(script)
  }, [symbol])

  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '10px',
      overflow: 'hidden',
      height: '450px',
    }}>
      <div
        className="tradingview-widget-container"
        ref={ref}
        style={{ height: '100%', width: '100%' }}
      >
        <div className="tradingview-widget-container__widget" style={{ height: '100%' }} />
      </div>
    </div>
  )
}
