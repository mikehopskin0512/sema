import { EditorState, convertFromRaw, ContentState } from 'draft-js';

export const isJsonString = string => string[0] === '{' && string[string.length - 1] === '}';

export const createEditorState = value => !value ? EditorState.createEmpty() :
  !isJsonString(value) ? EditorState.createWithContent(ContentState.createFromText(value)) :
  EditorState.createWithContent(convertFromRaw(JSON.parse(value)));
