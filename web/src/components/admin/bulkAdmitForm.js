import React, { useState } from 'react';

const BulkAdmitForm = ({ onSubmit }) => {
  const [bulkCount, setBulkCount] = useState(0);

  return (
    <div className='is-flex is-align-items-center'>
      <p>Invite the next </p>
      <input
        className='input is-inline-block has-background-white mx-10'
        type='number'
        placeholder='500'
        style={{ width: 100 }}
        onChange={(e) => setBulkCount(e.target.value)}
      />
      <p>Waitlisted users into Sema</p>
      <button className='button mx-10 has-background-black-900 has-text-white' onClick={() => onSubmit(bulkCount)}>Go</button>
    </div>
  )
};

export default BulkAdmitForm;
