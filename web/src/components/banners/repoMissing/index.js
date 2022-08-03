import React from 'react'

function RepoMissingBanner() {
  return (
    <div className='has-background-gray-200 py-12 border-radius-8px is-flex is-justify-content-center'>
        <span className='is-size-8 has-text-gray-700'>
            Missing a repo? Only public repos can be synced with Sema for now. Private repo sync is coming soon!
        </span>
    </div>
  )
}

export default RepoMissingBanner