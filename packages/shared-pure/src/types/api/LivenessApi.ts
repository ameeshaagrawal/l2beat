import z from 'zod'

import { branded } from '../branded'
import { LivenessType } from '../LivenessType'
import { UnixTime } from '../UnixTime'

export const LivenessDataPoint = z
  .object({
    averageInSeconds: z.number().positive().int(),
    minimumInSeconds: z.number().positive().int(),
    maximumInSeconds: z.number().positive().int(),
  })
  .or(z.undefined())
export type LivenessDataPoint = z.infer<typeof LivenessDataPoint>

export const LivenessAnomaly = z.object({
  timestamp: branded(z.number(), (n) => new UnixTime(n)),
  durationInSeconds: z.number().positive().int(),
  type: branded(z.string(), (t) => LivenessType(t)),
})
export type LivenessAnomaly = z.infer<typeof LivenessAnomaly>

const LivenessDetails = z
  .object({
    last30Days: LivenessDataPoint,
    last90Days: LivenessDataPoint,
    allTime: LivenessDataPoint,
  })
  .or(z.undefined())
export type LivenessDetails = z.infer<typeof LivenessDetails>

export const LivenessApiProject = z.object({
  batchSubmissions: LivenessDetails,
  stateUpdates: LivenessDetails,
  proofSubmissions: LivenessDetails,
  anomalies: z.array(LivenessAnomaly).or(z.undefined()),
  isSynced: z.boolean(),
})

export type LivenessApiProject = z.infer<typeof LivenessApiProject>

export const LivenessApiResponse = z.object({
  projects: z.record(z.string(), z.optional(LivenessApiProject)),
})
export type LivenessApiResponse = z.infer<typeof LivenessApiResponse>
