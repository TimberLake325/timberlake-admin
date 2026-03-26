"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState } from "react";
import {
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    REDO_COMMAND,
    UNDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $getSelection,
    $isRangeSelection,
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
    $getNearestNodeOfType,
    mergeRegister,
} from "@lexical/utils";
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
    ListNode,
} from "@lexical/list";
import {
    $createHeadingNode,
    $isHeadingNode,
    HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    ListOrdered,
    Type,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Undo,
    Redo,
    Link,
    Heading1,
    Heading2,
    Heading3,
} from "lucide-react";

const LowPriority = 1;

export default function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));

            const node = selection.getNodes()[0];
            const parent = node?.getParent();
            if ($isLinkNode(parent) || $isLinkNode(node)) {
                setIsLink(true);
            } else {
                setIsLink(false);
            }
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    updateToolbar();
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority
            )
        );
    }, [editor, updateToolbar]);

    const insertLink = useCallback(() => {
        if (!isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
        } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, isLink]);

    return (
        <div className="flex items-center gap-1 p-2 mb-2 bg-black/[0.02] border border-black/[0.06] rounded-xl overflow-x-auto scrollbar-none">
            <button
                type="button"
                disabled={!canUndo}
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                className="p-2 hover:bg-black/[0.05] disabled:opacity-20 rounded-lg transition-colors"
                title="Undo"
            >
                <Undo size={16} />
            </button>
            <button
                type="button"
                disabled={!canRedo}
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                className="p-2 hover:bg-black/[0.05] disabled:opacity-20 rounded-lg transition-colors"
                title="Redo"
            >
                <Redo size={16} />
            </button>

            <div className="w-px h-6 bg-black/[0.06] mx-1" />

            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${isBold ? "bg-black/[0.1] text-[#2563eb]" : ""}`}
                title="Bold"
            >
                <Bold size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${isItalic ? "bg-black/[0.1] text-[#2563eb]" : ""}`}
                title="Italic"
            >
                <Italic size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${isUnderline ? "bg-black/[0.1] text-[#2563eb]" : ""}`}
                title="Underline"
            >
                <Underline size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${isStrikethrough ? "bg-black/[0.1] text-[#2563eb]" : ""}`}
                title="Strikethrough"
            >
                <Strikethrough size={16} />
            </button>

            <div className="w-px h-6 bg-black/[0.06] mx-1" />

            <button
                type="button"
                onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
                className="p-2 hover:bg-black/[0.05] rounded-lg transition-colors"
                title="Bullet List"
            >
                <List size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
                className="p-2 hover:bg-black/[0.05] rounded-lg transition-colors"
                title="Numbered List"
            >
                <ListOrdered size={16} />
            </button>

            <div className="w-px h-6 bg-black/[0.06] mx-1" />

            <button
                type="button"
                onClick={insertLink}
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${isLink ? "bg-black/[0.1] text-[#2563eb]" : ""}`}
                title="Insert Link"
            >
                <Link size={16} />
            </button>

            <div className="w-px h-6 bg-black/[0.06] mx-1" />

            <button
                type="button"
                onClick={() => {
                    editor.update(() => {
                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            $setBlocksType(selection, () => $createHeadingNode("h1"));
                        }
                    });
                }}
                className="p-2 hover:bg-black/[0.05] rounded-lg transition-colors"
                title="Heading 1"
            >
                <Heading1 size={16} />
            </button>
            <button
                type="button"
                onClick={() => {
                    editor.update(() => {
                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            $setBlocksType(selection, () => $createHeadingNode("h2"));
                        }
                    });
                }}
                className="p-2 hover:bg-black/[0.05] rounded-lg transition-colors"
                title="Heading 2"
            >
                <Heading2 size={16} />
            </button>
            <button
                type="button"
                onClick={() => {
                    editor.update(() => {
                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            $setBlocksType(selection, () => $createHeadingNode("h3"));
                        }
                    });
                }}
                className="p-2 hover:bg-black/[0.05] rounded-lg transition-colors"
                title="Heading 3"
            >
                <Heading3 size={16} />
            </button>

            <div className="w-px h-6 bg-black/[0.06] mx-1" />

            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
                className="p-2 hover:bg-black/[0.05] rounded-lg transition-colors"
                title="Align Left"
            >
                <AlignLeft size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
                className="p-2 hover:bg-black/[0.05] rounded-lg transition-colors"
                title="Align Center"
            >
                <AlignCenter size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
                className="p-2 hover:bg-black/[0.05] rounded-lg transition-colors"
                title="Align Right"
            >
                <AlignRight size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")}
                className="p-2 hover:bg-black/[0.05] rounded-lg transition-colors"
                title="Align Justify"
            >
                <AlignJustify size={16} />
            </button>
        </div>
    );
}
