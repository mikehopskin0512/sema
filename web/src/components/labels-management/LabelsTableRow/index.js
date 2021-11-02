import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import Tag from '../../tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { tagsOperations } from '../../../state/features/tags';

const { deleteTagAndFetchTags } = tagsOperations;

const LabelsTableRow = ({ data, token }) => {
  const dispatch = useDispatch();
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

  const onClickDelete = () => {
    dispatch(deleteTagAndFetchTags(_id, token))
  }

  return(
    <tr className="has-background-white my-10">
      <td className="py-15 has-background-white px-10" style={{ width: '50%' }}>
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <p className="is-size-7">
            <Tag tag={label} _id={_id} type={type} />
          </p>
          <div className="is-hidden-desktop m-5 is-hidden-tablet">
            <p className="is-uppercase has-text-weight-semibold is-size-8 has-text-stat m-0">
              Type: {type}
            </p>
            <p className="is-uppercase has-text-weight-semibold is-size-8 has-text-stat m-0">
              Suggested Snippets: {suggestedCommentsCount}
            </p>
          </div>
        </div>
      </td>
      <td className="py-15 has-background-white px-10 is-hidden-mobile">
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <p className="is-size-7" style={{ textTransform: "capitalize" }}>
            {type}
          </p>
        </div>
      </td>
      <td className="py-15 has-background-white px-10 is-hidden-mobile">
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <p className="is-size-7">
            {suggestedCommentsCount}
          </p>
        </div>
      </td>
      <td className="py-15 has-background-white px-10">
        <div className="is-flex is-justify-content-flex-end">
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
                <a href="#" className="dropdown-item" onClick={onClickDelete}>
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

LabelsTableRow.propTypes = {
  token: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export default LabelsTableRow;