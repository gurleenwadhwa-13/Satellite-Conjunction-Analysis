"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Clock, TrendingUp, Filter, X } from "lucide-react"
import { format } from "date-fns"
import type { ConjunctionEvent } from "@/lib/types"
import { CANADIAN_SATELLITES } from "@/lib/canadianSatellites"

interface ConjunctionTableProps {
  conjunctions: ConjunctionEvent[]
  onSatelliteSelect: (noradId: number) => void
}

export default function ConjunctionTable({ conjunctions, onSatelliteSelect }: ConjunctionTableProps) {
  const [filterNoradId, setFilterNoradId] = useState<number | null>(null)

  // Get unique satellites from conjunctions
  const satellitesInConjunctions = useMemo(() => {
    const satellites = new Set<number>()
    conjunctions.forEach(conj => {
      satellites.add(conj.noradId1)
      satellites.add(conj.noradId2)
    })
    return Array.from(satellites).map(noradId => {
      const sat = CANADIAN_SATELLITES.find(s => s.noradId === noradId)
      return { noradId, name: sat?.name || `NORAD ${noradId}` }
    })
  }, [conjunctions])

  // Filter conjunctions by selected satellite
  const filteredConjunctions = useMemo(() => {
    if (!filterNoradId) return conjunctions
    return conjunctions.filter(conj => 
      conj.noradId1 === filterNoradId || conj.noradId2 === filterNoradId
    )
  }, [conjunctions, filterNoradId])
  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-yellow-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getRiskBg = (level: string) => {
    switch (level) {
      case "high":
        return "bg-destructive/10 border-destructive"
      case "medium":
        return "bg-yellow-500/10 border-yellow-500"
      default:
        return "bg-muted border-border"
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-foreground font-mono">{filteredConjunctions.length} Active Conjunctions</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Monitoring potential collision events</p>
          </div>
          {filterNoradId && (
            <button
              onClick={() => setFilterNoradId(null)}
              className="rounded-full bg-muted p-1.5 hover:bg-muted/80 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Satellite Filter */}
      {satellitesInConjunctions.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Filter by Satellite</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {satellitesInConjunctions.map(sat => (
              <button
                key={sat.noradId}
                onClick={() => setFilterNoradId(filterNoradId === sat.noradId ? null : sat.noradId)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                  filterNoradId === sat.noradId
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {sat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredConjunctions.map((conj, index) => (
        <motion.div
          key={conj.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`rounded-lg border p-4 ${getRiskBg(conj.riskLevel)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${getRiskColor(conj.riskLevel)}`} />
                <span className={`text-xs font-bold uppercase ${getRiskColor(conj.riskLevel)}`}>
                  {conj.riskLevel} Risk
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <button
                  onClick={() => onSatelliteSelect(conj.noradId1)}
                  className="block text-sm font-semibold text-foreground hover:text-primary transition-colors font-mono"
                >
                  {conj.satellite1}
                </button>
                <div className="text-xs text-muted-foreground">↕</div>
                <button
                  onClick={() => onSatelliteSelect(conj.noradId2)}
                  className="block text-sm font-semibold text-foreground hover:text-primary transition-colors font-mono"
                >
                  {conj.satellite2}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border/50 pt-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>TCA</span>
              </div>
              <p className="mt-1 text-xs font-medium text-foreground font-mono">{format(conj.tca, "MMM dd, HH:mm")}</p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>Min Range</span>
              </div>
              <p className="mt-1 text-xs font-medium text-foreground font-mono">{conj.minRange.toFixed(2)} km</p>
            </div>
          </div>

          <div className="mt-2 rounded bg-background/50 p-2">
            <div className="text-xs text-muted-foreground">Collision Probability</div>
            <div className="mt-1 text-sm font-bold text-foreground font-mono">{(conj.probability * 100).toExponential(2)}%</div>
          </div>
        </motion.div>
      ))}

      {filteredConjunctions.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <p className="mt-2 text-sm text-muted-foreground font-mono">
            {filterNoradId ? "No conjunctions found for selected satellite" : "No conjunction events detected"}
          </p>
        </div>
      )}
    </div>
  )
}
