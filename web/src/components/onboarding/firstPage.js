import React, { useState } from 'react'

const FirstPage = ({ nextPage }) => {
  const [title] = useState('Smart Reactions');
  const [subtitle] = useState('Provide more actionable feedback with Sema’s auto-suggested smart reactions. As you type, Sema will calculate the right reaction for you. Click to override at any time.');

  return (
    <>
      <div className="columns">
        <div className="column">
          <p className="mt-200 mb-20 title">{title}</p>
          <p className="mt-20 mb-200 subtitle">
            {subtitle}
          </p>
          <button
            type="button"
            className="button is-primary my-20 is-pulled-right"
            onClick={nextPage}
          >
            Next
          </button>
        </div>
        <div class="column" style={{backgroundColor: "#E4E4E4"}}>
        </div>
      </div>
    </>
  )
}

export default FirstPage
