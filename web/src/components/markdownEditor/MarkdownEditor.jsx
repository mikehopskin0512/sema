import React from 'react';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from 'next/dynamic';
import { gray400 } from '../../../styles/_colors.module.scss';
import styles from './markdownEditor.module.scss';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
);

const MarkdownEditor = ({ value, setValue }) => {
  return (<Editor
    editorState={value}
    onEditorStateChange={(v) => setValue(v)}
    editorClassName={styles.editor}
    toolbarClassName={styles.toolbar}
    toolbarStyle={{ margin: 0, border: `1px solid ${gray400}` }}
    toolbar={{
      options: ['inline', 'link', 'list'],
      inline: {
        inDropdown: false,
        options: ['bold', 'italic'],
      },
      list: {
        inDropdown: false,
        options: ['unordered'],
      },
      link: {
        inDropdown: false,
        showOpenOptionOnHover: true,
        defaultTargetOption: '_blank',
        options: ['link'],
      },
    }}
  />);
}

export default MarkdownEditor;
