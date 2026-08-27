"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";
import Toolbar from "./Toolbar";
import { theme } from "./Theme";

interface LexicalEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

function HtmlPlugin({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    const [editor] = useLexicalComposerContext();
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        if (isFirstRender && value) {
            editor.update(() => {
                const parser = new DOMParser();
                const dom = parser.parseFromString(value, "text/html");
                const nodes = $generateNodesFromDOM(editor, dom);
                $getRoot().clear();
                $insertNodes(nodes);
            });
            setIsFirstRender(false);
        }
    }, [editor, value, isFirstRender]);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const htmlString = $generateHtmlFromNodes(editor);
                if (htmlString !== value) {
                    onChange(htmlString);
                }
            });
        });
    }, [editor, onChange, value]);

    return null;
}

export default function LexicalEditor({ value, onChange, placeholder }: LexicalEditorProps) {
    const initialConfig = {
        namespace: "TIMBERLAKEEditor",
        theme,
        onError: (error: Error) => {
            console.error(error);
        },
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            LinkNode,
            AutoLinkNode,
            
        ],
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="relative border border-black/[0.06] rounded-[2rem] bg-white focus-within:border-[#2563eb]/30 transition-all">
                <div className="p-2 border-b border-black/[0.03]">
                    <Toolbar />
                </div>
                <div className="relative min-h-[500px]">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="min-h-[500px] outline-none p-12 text-sm text-black/70 prose prose-slate max-w-none 
                                [&_h1]:text-4xl [&_h1]:font-black [&_h1]:mb-8 [&_h1]:font-heading
                                [&_h2]:text-2xl [&_h2]:font-black [&_h2]:mt-12 [&_h2]:mb-6
                                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4
                                [&_h4]:text-lg [&_h4]:font-bold [&_h4]:mt-8 [&_h4]:mb-3
                                [&_h5]:text-base [&_h5]:font-semibold [&_h5]:mt-6 [&_h5]:mb-2
                                [&_h6]:text-sm [&_h6]:font-semibold [&_h6]:mt-4 [&_h6]:mb-2 [&_h6]:uppercase [&_h6]:tracking-wide [&_h6]:text-black/50
                                [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-6
                                [&_section]:mb-16
                                [&_.privacy-header]:mb-16
                                [&_.grid]:grid-cols-2 [&_.grid]:gap-4
                                " />
                        }
                        placeholder={
                            <div className="absolute top-6 left-6 text-black/20 text-sm pointer-events-none">
                                {placeholder || "Start typing..."}
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    <HtmlPlugin value={value} onChange={onChange} />
                </div>
            </div>
        </LexicalComposer>
    );
}
