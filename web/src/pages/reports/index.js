import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import withLayout from '../../components/layout';
import ReportsHeader from './reportsHeader';

import { reportsOperations } from '../../state/features/reports';

const { getModeUrl } = reportsOperations;

const Reports = (props) => {
  console.log('props: ', props);
  const dispatch = useDispatch();
  const {mappedValueFromStore} = props;

const storeValue = useSelector(state => state.storeValue);
console.log(storeValue);




  return (
    <div>
        <div>
      <p>From store directly: {storeValue}</p>
      <p>From mapped props: {mappedValueFromStore}</p>
  
    </div>
      <ReportsHeader />
      <section className="section">
        <div className="container">
          <h1 className="title">Report Title</h1>
          <h2 className="subtitle">
            <figure className="image is-16by9">
{/*              <iframe className="has-ratio" width="640" height="360" src="https://app.mode.com/semasoftware/reports/f061245f4752" frameBorder="0" allowFullScreen></iframe>
*/}            </figure>
          </h2>
        </div>
      </section>
    </div>
  );
};

Reports.getInitialProps = async (ctx) => {
  const mappedValueFromStore = ctx.store.state.mappedValueFromStore // we can retrieve data from redux store in getInitialProps
  ctx.store.dispatch({
    type: 'ACCESS_FROM_GET_INITIAL_PROPS'
  }) // We can dispatch actions too

  return {
    mappedValueFromStore,
  }
}

export default withLayout(Reports);
