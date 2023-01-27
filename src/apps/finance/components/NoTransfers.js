import React from 'react'
import { EmptyStateCard, GU, LoadingRing } from '@aragon/ui'

const NoTransfers = React.memo(({ isSyncing }) => {
  return (
    <EmptyStateCard
      text={
        isSyncing ? (
          <div
            css={`
              display: grid;
              align-items: center;
              justify-content: center;
              grid-template-columns: auto auto;
              grid-gap: ${1 * GU}px;
            `}
          >
            <LoadingRing />
            <span>Loading…</span>
          </div>
        ) : (
          'No delayed scripts!'
        )
      }
    />
  )
})

export default NoTransfers