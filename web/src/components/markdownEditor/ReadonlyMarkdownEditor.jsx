import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from 'next/dynamic';
import { createEditorState } from './utils';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
);

const ReadonlyMarkdownEditor = ({ value }) => {
  return (
    <Editor
      readOnly
      toolbarHidden
      editorState={createEditorState(value)}
    />);
}

export default ReadonlyMarkdownEditor;
