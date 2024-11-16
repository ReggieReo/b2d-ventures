"use client";

import {
  MDXEditor,
  type MDXEditorMethods,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  BlockTypeSelect,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  SandpackConfig,
  InsertImage,
  imagePlugin,
} from "@mdxeditor/editor";
import { type FC } from "react";
import { uploadFiles } from "~/utils/uploadthings";
import "@mdxeditor/editor/style.css";

interface EditorProps {
  markdown: string;
  onChangeFn: (markdown: string) => void;
  trigger: () => Promise<boolean>;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}


async function imageUploadHandler(image: File) {
  // send the file to your server and return
  // the URL of the uploaded image in the response
  const res = await uploadFiles("imageUploader", {
    files: [image],
  });
  if (!res[0]?.url) throw new Error("Failed to upload image");
  return res[0].url;
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
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          diffSourcePlugin({
            viewMode: "rich-text",
          }),
          imagePlugin({
            disableImageResize: true,
            imageUploadHandler: imageUploadHandler,
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex w-full items-center gap-2 border-b bg-gray-50 p-1">
                <DiffSourceToggleWrapper>
                  <UndoRedo />
                  <BlockTypeSelect />
                  <BoldItalicUnderlineToggles />
                  <InsertImage />
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
