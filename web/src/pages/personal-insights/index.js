import React, { useState } from 'react'
import clsx from 'clsx'
import Helmet, { PersonalInsightsHelmet } from '../../components/utils/Helmet';
import withLayout from '../../components/layout';
import PersonalStatsTile from '../../components/personalInsights/personalStatsTile';

const PersonalInsights = () => {
  
  const [commentView, setCommentView] = useState('received')
  return (
    <>
    <div className='has-background-gray-9 pb-180'>
      <Helmet {...PersonalInsightsHelmet} />
      <div className="py-30 px-80 is-hidden-mobile">
        <div className="mb-15">
          <div className="is-flex is-justify-content-space-between">
            <p className="has-text-deep-black has-text-weight-semibold is-size-4 mb-20 px-15">Personal Insights</p>
            <div className="is-flex">
              <button className={clsx("button border-radius-0 is-small", commentView === 'received' ? 'is-primary' : '')} onClick={() => setCommentView('received')}>
                Comments received
              </button>
              <button className={clsx("button border-radius-0 is-small", commentView === 'given' ? 'is-primary' : '')} onClick={() => setCommentView('given')}>
                Comments given
              </button>
            </div>
          </div>
        </div>
        <PersonalStatsTile />
      </div>
    </div>
    </>
  )
}

export default withLayout(PersonalInsights);