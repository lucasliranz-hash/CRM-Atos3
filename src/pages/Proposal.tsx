import { CoverSummary } from '@/components/proposal/CoverSummary'
import { ProblemSolution } from '@/components/proposal/ProblemSolution'
import { PricingNextSteps } from '@/components/proposal/PricingNextSteps'

export default function Proposal() {
  return (
    <div className="max-w-5xl mx-auto space-y-32 pb-32">
      <CoverSummary />
      <ProblemSolution />
      <PricingNextSteps />
    </div>
  )
}
