import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Tag from '../../tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

// TODO: GET SUGGESTED COMMENTS WITH SUGGESTED COMMENTS COUNT

const LabelsTableRow = ({ data }) => {
  const { label, _id, type, suggestedCommentsCount } = data;

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const popupRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuIsOpen(!menuIsOpen);
  };

  const handleClick = (e) => {
    if (popupRef.current.contains(e.target)) {
      return;
    }
    setMenuIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return(
    <tr className="has-background-white my-10">
      <td className="py-15 has-background-white px-10">
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <p className="is-size-7">
            <Tag tag={label} _id={_id} type={type} />
          </p>
        </div>
      </td>
      <td className="py-15 has-background-white px-10">
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <p className="is-size-7" style={{ textTransform: "capitalize" }}>
            {type}
          </p>
        </div>
      </td>
      <td className="py-15 has-background-white px-10">
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <p className="is-size-7">
            {suggestedCommentsCount}
          </p>
        </div>
      </td>
      <td className="py-15 has-background-white px-10" style={{ width: 80 }}>
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <div className={clsx("dropdown is-right", menuIsOpen && "is-active")}>
            <div className="dropdown-trigger">
              <button className="button is-text" aria-haspopup="true" aria-controls="dropdown-menu" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faEllipsisV} color="#0081A7" />
              </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu" ref={popupRef}>
              <div className="dropdown-content">
                <a href={`/labels-management/edit?id=${_id}`} className="dropdown-item">
                  Edit Label
                </a>
                <a href="/labels-management/edit" className="dropdown-item">
                  Delete Label
                </a>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  )
}

export default LabelsTableRow;