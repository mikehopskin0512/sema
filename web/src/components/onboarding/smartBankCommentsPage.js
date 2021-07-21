import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { commentCollection } from './content';

const SmartBankCommentsPage = ({ page, nextPage, previousPage }) => {

  return (
    <>
      <div className="m-20">
        <p className="title is-4">Please choose some comment collections</p>
        <p className="subtitle is-6">You can now activate groups of comments that suit your style and work environment. Choose the ones you want, or add your own to My Comments.</p>
        {
          commentCollection.map((collection) => {
            return (
              <>
                <div className="columns">
                  <div className="column is-11 pb-0">
                    <div className="title is-6">{collection.title}</div>
                    <div className="subtitle is-6">{collection.subtitle}</div>
                  </div>
                  <div className="column">
                    <input type="checkbox" size="large" />
                  </div>
                </div>
                <div className="is-divider my-20"/>
                {/* <hr /> */}
              </>
            )
          })
        }
        {/* <div className="columns">
          <div className="column is-11">
            <div className="title is-6">Common Comments</div>
            <div className="subtitle is-6">Frequently used statements and questions when conducting code reviews</div>
          </div>
          <div className="column">
            <input type="checkbox" size="large" />
          </div>
        </div>
        <hr /> */}
        {
          page !== 1 && (
            <button
              type="button"
              className="button is-primary my-20 is-outlined"
              onClick={previousPage}
            >
              <FontAwesomeIcon icon={faArrowLeft} color="primary" size="lg" />
            </button>
          )
        }
        <button
          type="button"
          className="button is-primary my-20 is-pulled-right"
          onClick={nextPage}
        >
          Next
        </button>
        <button
          type="button"
          className="button is-text has-text-primary my-20 is-pulled-right"
          onClick={nextPage}
        >
          Skip this step
        </button>
      </div>
    </>
  )
}

export default SmartBankCommentsPage
