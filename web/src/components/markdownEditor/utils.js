import { EditorState, convertFromRaw, ContentState } from 'draft-js';

export const isJson = str => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const createEditorState = value => !value ? EditorState.createEmpty() :
  !isJson(value) ? EditorState.createWithContent(ContentState.createFromText(value)) :
  EditorState.createWithContent(convertFromRaw(JSON.parse(value)));
