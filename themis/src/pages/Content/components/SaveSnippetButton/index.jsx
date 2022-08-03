import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './saveSnippetButton.module.scss';
import { onClickSaveSnippet } from '../..//modules/content-util';
import { toggleSnippetForSave } from '../../modules/redux/action';
import { SAVE_BUTTON_ICON, SAVE_BUTTON_ICON_DISABLED } from './constants';
import { getActiveTheme, getActiveThemeClass } from '../../../../../utils/theme';

const SaveSnippetButton = ({ semabarContainerId }) => {
  const { snippetSaved } = useSelector((state) => state);
  const dispatch = useDispatch();

  const activeTheme = getActiveTheme().toUpperCase();
  const isSnippetSavedForThisWindow = useMemo(() => snippetSaved.isSaved && (snippetSaved.semabarContainerId === semabarContainerId),
    [snippetSaved.semabarContainerId, semabarContainerId, snippetSaved.isSaved]);
  
  const saveImg = useMemo(() => isSnippetSavedForThisWindow ?
    SAVE_BUTTON_ICON_DISABLED[activeTheme] :
    SAVE_BUTTON_ICON[activeTheme], [activeTheme, isSnippetSavedForThisWindow]);

  const onClickButton = (e) => {
    dispatch(toggleSnippetForSave({ semabarContainerId }));
    onClickSaveSnippet(e);
  };

    return (
      <div className={styles.container}>
        <button type="button" disabled={isSnippetSavedForThisWindow} className={`${styles[getActiveThemeClass()]} ${styles.snippetButton}`} onClick={onClickButton}>
          <img src={saveImg} alt="save" className={styles.icon} />
          Save to a Snippet Collection
        </button>
        {isSnippetSavedForThisWindow && <span className={`${styles[getActiveThemeClass()]} ${styles.successText}`}>Snippet saved.</span>}
      </div>
    );
}

export default SaveSnippetButton;
