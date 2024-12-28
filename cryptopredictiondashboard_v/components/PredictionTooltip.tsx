'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon } from 'lucide-react'

export function PredictionTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon className="h-4 w-4 text-gray-400 cursor-help ml-2" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">
            Predictions are based on the crossover of 12-period (short) and 26-period (long) Exponential Moving Averages (EMA). We are working to combine more techniques e.g. Relative Strength Index (RSI).
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

