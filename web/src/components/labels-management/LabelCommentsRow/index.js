import React, { useState } from 'react';

const LabelCommentsRow = ({ title, _id, onChange }) => {
  const [isOn, setIsOn] = useState(true);

  const onChangeToggle = () => {
    onChange(!isOn);
    setIsOn(!isOn);
  }

  return(
    <tr className="has-background-white my-10">
      <td className="py-15 has-background-white px-10">
        <div className="is-flex">
          <div className="field my-0 mr-10" aria-hidden>
            <input
              id={`activeSwitch-${_id}`}
              type="checkbox"
              onChange={onChangeToggle}
              name={`activeSwitch-${_id}`}
              className="switch is-rounded"
              checked={isOn}
            />
            <label htmlFor={`activeSwitch-${_id}`} />
          </div>
          <p className="is-size-7">
            {title}
          </p>
        </div>
      </td>
    </tr>
  )
}

export default LabelCommentsRow;