/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import * as Anchor from '../core/Anchor';

const insertAnchor = (editor: Editor, newId: string) => {
  if (!Anchor.isValidId(newId)) {
    editor.windowManager.alert(
      '「ank-」で始まる 小文字英数字「0〜9、a〜z、-」で入力してください。(例: ank-page1-2 など)'
    );
    return false;
  } else {
    if ( editor.getDoc().getElementById(newId) )
    {
      editor.windowManager.alert(
        '「' + newId + '」は、すでに利用されています。別の id を利用してください。'
      );
      return false;
    }
    Anchor.insert(editor, newId);
    return true;
  }
};

const open = (editor: Editor) => {
  const currentId = Anchor.getId(editor);

  editor.windowManager.open({
    title: 'Anchor',
    size: 'normal',
    body: {
      type: 'panel',
      items: [
        {
          name: 'id',
          type: 'input',
          label: 'ID',
          placeholder: 'ank- で始まる「0〜9、a〜z、-」で入力してください。'
        },
        {
          type: 'label',
          label: 'アンカーを設置すると、記事内リンク先として選択できます。',
          items: []
        }
      ]
    },
    buttons: [
      {
        type: 'cancel',
        name: 'cancel',
        text: 'Cancel'
      },
      {
        type: 'submit',
        name: 'save',
        text: 'Save',
        primary: true
      }
    ],
    initialData: {
      id: currentId
    },
    onSubmit(api) {
      if (insertAnchor(editor, api.getData().id)) { // TODO we need a better way to do validation
        api.close();
      }
    }
  });
};

export {
  open
};
