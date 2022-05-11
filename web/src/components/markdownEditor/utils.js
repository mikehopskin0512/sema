import { EditorState, convertFromRaw, ContentState } from 'draft-js';

export const isMarkdownObject = str => {
  try {
    const data = JSON.parse(str);
    return typeof data === 'object';
  } catch (e) {
    return false;
  }
};

export const createEditorState = value => {
  if (!value) {
    return EditorState.createEmpty();
  }
  try {
    const data = !isMarkdownObject(value) ? ContentState.createFromText(value) : convertFromRaw(JSON.parse(value))
    return EditorState.createWithContent(data);
  } catch (e) {
    console.error(e)
  }
}
