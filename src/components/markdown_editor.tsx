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
  diffSourcePlugin,
  InsertThematicBreak,
  DiffSourceToggleWrapper,
  codeMirrorPlugin,
  sandpackPlugin,
  SandpackConfig,
  tablePlugin,
  linkPlugin,
} from "@mdxeditor/editor";
import { type FC } from "react";
import "@mdxeditor/editor/style.css";
import { UseFormTrigger } from "react-hook-form";
import { formSchema } from "~/app/create_fundraising/schema";

interface EditorProps {
  markdown: string;
  onChangeFn: (markdown: string) => void;
  trigger: () => Promise<boolean>;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const simpleSandpackConfig: SandpackConfig = {
  defaultPreset: "react",
  presets: [
    {
      label: "React",
      name: "react",
      meta: "live react",
      sandpackTemplate: "react",
      sandpackTheme: "light",
      snippetFileName: "/App.js",
      snippetLanguage: "jsx",
    },
  ],
};

const Editor: FC<EditorProps> = ({
  markdown,
  onChangeFn,
  trigger,
  editorRef,
}) => {
  return (
    <div className={"overflow-hidden rounded-lg border"}>
      <MDXEditor
        contentEditableClassName="prose"
        onChange={async (markdown) => {
          onChangeFn(markdown);
          await trigger();
        }}
        ref={editorRef}
        markdown={markdown}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          diffSourcePlugin({
            viewMode: "rich-text",
          }),
          sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: "JavaScript",
              css: "CSS",
              html: "HTML",
              jsx: "JSX",
            },
          }),
          tablePlugin(),
          linkPlugin(),

          toolbarPlugin({
            // toolbarClassName: "flex flex-row gap-2",
            toolbarContents: () => (
              <div className="flex w-full items-center gap-2 border-b bg-gray-50 p-1">
                <DiffSourceToggleWrapper>
                  <UndoRedo />
                  <BlockTypeSelect />
                  <BoldItalicUnderlineToggles />
                  <CreateLink />
                  <InsertThematicBreak />
                </DiffSourceToggleWrapper>
              </div>
            ),
          }),
        ]}
      />
    </div>
  );
};

export default Editor;
