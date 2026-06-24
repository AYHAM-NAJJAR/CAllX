import { AlertCircle } from 'lucide-react'
import React from 'react'

function LoadingError({Phrase}) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-1 text-center p-4 text-slate-100">
        <AlertCircle className="text-rose-500 animate-pulse" size={36} />
        <h3 className="text-base text-rose-400  font-bold">Failed to load {Phrase}</h3>
        <p className="text-xs text-slate-400 max-w-sm">
            "An error occurred while loading data"
        </p>
      </div>
  )
}

export default LoadingError