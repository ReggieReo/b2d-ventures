"use client";

import {
  MDXEditor,
  type MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  BlockTypeSelect,
  CreateLink,
  InsertThematicBreak,
} from "@mdxeditor/editor";
import { type FC } from "react";
import "@mdxeditor/editor/style.css";

interface EditorProps {
  markdown: string;
  onChangeFn: (markdown: string) => void;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */

const Editor: FC<EditorProps> = ({ markdown, onChangeFn, editorRef }) => {
  return (
    <div className={"overflow-hidden rounded-lg border"}>
      <MDXEditor
        contentEditableClassName="prose"
        onChange={(e) => {
          console.log(e);
          onChangeFn(e);
        }}
        ref={editorRef}
        markdown={markdown}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            // toolbarClassName: "flex flex-row gap-2",
            toolbarContents: () => (
              <div className="flex w-full items-center gap-2 border-b bg-gray-50 p-1">
                <div className="flex-rol flex items-center gap-0.5 border-r pr-2">
                  <UndoRedo />
                </div>
                <div className="flex-rol flex items-center gap-0.5 border-r pr-2">
                  <BlockTypeSelect />
                </div>
                <div className="flex-rol flex items-center gap-0.5 border-r pr-2">
                  <BoldItalicUnderlineToggles />
                </div>
                <div className="flex-rol flex items-center gap-0.5 border-r pr-2">
                  <CreateLink />
                </div>
                <div className="flex-rol flex items-center gap-0.5">
                  <InsertThematicBreak />
                </div>
              </div>
            ),
          }),
        ]}
      />
    </div>
  );
};

export default Editor;
