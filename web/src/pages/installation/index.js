import React, { useEffect, useState } from 'react'
import { isExtensionInstalled } from '../../utils/extension';
import withLayout from '../../components/layout';
import styles from './installation.module.scss';


const Installation = () => {
  const [extensionInstalled, toggleExtensionInstalled] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await isExtensionInstalled();
      toggleExtensionInstalled(res);
    })();
  }, []);

  return (
    <>
      <div className="tile is-ancestor">
        <div className="tile is-parent">
          <article className="tile is-child notification is-danger box" style={{margin: "25px !important"}}>
            <p className="title">Note!!</p>
            <p className="subtitle">Read before you proceed</p>
            <div className="content">
              {extensionInstalled ? <h1>Extension is already installed.</h1> : <h1>Please install the extension before proceeding.</h1>}
            </div>
          </article>
        </div>
      </div>
    </>
  )
}

export default withLayout(Installation);
