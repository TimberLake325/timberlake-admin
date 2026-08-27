"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef, useState } from "react";
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
    $createParagraphNode,
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
import { $setBlocksType, $patchStyleText } from "@lexical/selection";
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
    Heading4,
    Heading5,
    Heading6,
    Pilcrow,
    ChevronDown,
    Highlighter,
    Superscript,
    Subscript,
    Code,
    Minus,
} from "lucide-react";

const LowPriority = 1;

const FONT_COLORS = [
    { label: "Default", value: "" },
    { label: "Black", value: "#000000" },
    { label: "Dark Gray", value: "#374151" },
    { label: "Gray", value: "#6B7280" },
    { label: "Red", value: "#DC2626" },
    { label: "Orange", value: "#EA580C" },
    { label: "Amber", value: "#D97706" },
    { label: "Green", value: "#16A34A" },
    { label: "Teal", value: "#0D9488" },
    { label: "Blue", value: "#2563EB" },
    { label: "Indigo", value: "#4F46E5" },
    { label: "Purple", value: "#9333EA" },
    { label: "Pink", value: "#DB2777" },
    { label: "Rose", value: "#E11D48" },
];

const BG_COLORS = [
    { label: "None", value: "" },
    { label: "Yellow", value: "#FEF9C3" },
    { label: "Green", value: "#DCFCE7" },
    { label: "Blue", value: "#DBEAFE" },
    { label: "Purple", value: "#F3E8FF" },
    { label: "Pink", value: "#FCE7F3" },
    { label: "Red", value: "#FEE2E2" },
    { label: "Orange", value: "#FFEDD5" },
    { label: "Teal", value: "#CCFBF1" },
    { label: "Gray", value: "#F3F4F6" },
];

const FONT_SIZES = [
    { label: "12px", value: "12px" },
    { label: "14px", value: "14px" },
    { label: "16px", value: "16px" },
    { label: "18px", value: "18px" },
    { label: "20px", value: "20px" },
    { label: "24px", value: "24px" },
    { label: "28px", value: "28px" },
    { label: "32px", value: "32px" },
    { label: "36px", value: "36px" },
    { label: "48px", value: "48px" },
];

const HEADING_OPTIONS: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: "Paragraph", value: "paragraph", icon: <Pilcrow size={14} /> },
    { label: "Heading 1", value: "h1", icon: <Heading1 size={14} /> },
    { label: "Heading 2", value: "h2", icon: <Heading2 size={14} /> },
    { label: "Heading 3", value: "h3", icon: <Heading3 size={14} /> },
    { label: "Heading 4", value: "h4", icon: <Heading4 size={14} /> },
    { label: "Heading 5", value: "h5", icon: <Heading5 size={14} /> },
    { label: "Heading 6", value: "h6", icon: <Heading6 size={14} /> },
];

// Prevents toolbar buttons from stealing editor focus/selection
const preventFocusLoss = (e: React.MouseEvent) => {
    e.preventDefault();
};

// --- Dropdown wrapper component ---
function ToolbarDropdown({
    trigger,
    children,
    title,
}: {
    trigger: React.ReactNode;
    children: React.ReactNode;
    title: string;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 px-2 py-1.5 hover:bg-black/[0.05] rounded-lg transition-colors text-xs font-medium"
                title={title}
            >
                {trigger}
                <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-black/[0.08] rounded-xl shadow-lg shadow-black/[0.08] z-[9999] min-w-[140px] p-1">
                    {children}
                </div>
            )}
        </div>
    );
}

// --- Color Picker Grid ---
function ColorPickerGrid({
    colors,
    activeColor,
    onSelect,
    onClose,
}: {
    colors: { label: string; value: string }[];
    activeColor: string;
    onSelect: (value: string) => void;
    onClose: () => void;
}) {
    return (
        <div className="grid grid-cols-5 gap-1 p-2 min-w-[160px]">
            {colors.map((c) => (
                <button
                    key={c.label}
                    type="button"
                    title={c.label}
                    onMouseDown={preventFocusLoss}
                    onClick={() => {
                        onSelect(c.value);
                        onClose();
                    }}
                    className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${
                        activeColor === c.value
                            ? "border-[#2563eb] ring-2 ring-[#2563eb]/20"
                            : "border-black/[0.06]"
                    }`}
                    style={{
                        backgroundColor: c.value || "#ffffff",
                        ...(c.value === ""
                            ? {
                                  backgroundImage:
                                      "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)",
                                  backgroundSize: "8px 8px",
                                  backgroundPosition: "0 0, 4px 4px",
                              }
                            : {}),
                    }}
                />
            ))}
        </div>
    );
}

// --- Color picker dropdown ---
function ColorDropdown({
    icon,
    title,
    colors,
    activeColor,
    onSelect,
    indicatorColor,
}: {
    icon: React.ReactNode;
    title: string;
    colors: { label: string; value: string }[];
    activeColor: string;
    onSelect: (value: string) => void;
    indicatorColor: string;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() => setOpen(!open)}
                className="flex flex-col items-center p-1.5 hover:bg-black/[0.05] rounded-lg transition-colors"
                title={title}
            >
                {icon}
                <div
                    className="w-4 h-1 rounded-full mt-0.5 transition-colors"
                    style={{
                        backgroundColor: indicatorColor || "#9CA3AF",
                    }}
                />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-black/[0.08] rounded-xl shadow-lg shadow-black/[0.08] z-[9999]">
                    <ColorPickerGrid
                        colors={colors}
                        activeColor={activeColor}
                        onSelect={onSelect}
                        onClose={() => setOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}

export default function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const [isSuperscript, setIsSuperscript] = useState(false);
    const [isSubscript, setIsSubscript] = useState(false);
    const [isCode, setIsCode] = useState(false);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [blockType, setBlockType] = useState("paragraph");
    const [fontColor, setFontColor] = useState("");
    const [bgColor, setBgColor] = useState("");
    const [fontSize, setFontSize] = useState("");

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));
            setIsSuperscript(selection.hasFormat("superscript"));
            setIsSubscript(selection.hasFormat("subscript"));
            setIsCode(selection.hasFormat("code"));

            // Detect block type (heading/paragraph)
            const anchorNode = selection.anchor.getNode();
            const element =
                anchorNode.getKey() === "root"
                    ? anchorNode
                    : anchorNode.getTopLevelElementOrThrow();

            if ($isHeadingNode(element)) {
                setBlockType(element.getTag());
            } else if ($isListNode(element)) {
                const parentList = $getNearestNodeOfType(anchorNode, ListNode);
                const type = parentList
                    ? parentList.getListType()
                    : element.getListType();
                setBlockType(type === "number" ? "ol" : "ul");
            } else {
                setBlockType("paragraph");
            }

            // Detect font color from inline style
            const style = selection.style;
            const colorMatch = style.match(/(?:^|;\s*)color:\s*([^;]+)/);
            setFontColor(colorMatch ? colorMatch[1].trim() : "");

            const bgMatch = style.match(
                /(?:^|;\s*)background-color:\s*([^;]+)/
            );
            setBgColor(bgMatch ? bgMatch[1].trim() : "");

            const fsMatch = style.match(/(?:^|;\s*)font-size:\s*([^;]+)/);
            setFontSize(fsMatch ? fsMatch[1].trim() : "");

            // Link detection
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

    const formatHeading = (headingTag: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                if (headingTag === "paragraph") {
                    $setBlocksType(selection, () => $createParagraphNode());
                } else {
                    $setBlocksType(selection, () =>
                        $createHeadingNode(headingTag as HeadingTagType)
                    );
                }
            }
        });
    };

    const applyFontColor = (color: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { color: color || null });
            }
        });
        setFontColor(color);
    };

    const applyBgColor = (color: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, {
                    "background-color": color || null,
                });
            }
        });
        setBgColor(color);
    };

    const applyFontSize = (size: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { "font-size": size || null });
            }
        });
        setFontSize(size);
    };

    const currentBlock =
        HEADING_OPTIONS.find((h) => h.value === blockType) ||
        HEADING_OPTIONS[0];

    return (
        <div
            className="flex items-center gap-0.5 p-1.5 bg-black/[0.02] border border-black/[0.06] rounded-xl overflow-x-auto scrollbar-none flex-wrap"
            onMouseDown={preventFocusLoss}
        >
            {/* Undo / Redo */}
            <button
                type="button"
                disabled={!canUndo}
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(UNDO_COMMAND, undefined)
                }
                className="p-2 hover:bg-black/[0.05] disabled:opacity-20 rounded-lg transition-colors"
                title="Undo"
            >
                <Undo size={16} />
            </button>
            <button
                type="button"
                disabled={!canRedo}
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(REDO_COMMAND, undefined)
                }
                className="p-2 hover:bg-black/[0.05] disabled:opacity-20 rounded-lg transition-colors"
                title="Redo"
            >
                <Redo size={16} />
            </button>

            <div className="w-px h-6 bg-black/[0.06] mx-0.5" />

            {/* Block type (Heading dropdown) */}
            <ToolbarDropdown
                title="Block Type"
                trigger={
                    <span className="flex items-center gap-1.5">
                        {currentBlock.icon}
                        <span className="hidden sm:inline">
                            {currentBlock.label}
                        </span>
                    </span>
                }
            >
                {HEADING_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onMouseDown={preventFocusLoss}
                        onClick={() => formatHeading(opt.value)}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-xs rounded-lg hover:bg-black/[0.04] transition-colors text-left ${
                            blockType === opt.value
                                ? "bg-[#2563eb]/[0.08] text-[#2563eb] font-semibold"
                                : ""
                        }`}
                    >
                        {opt.icon}
                        {opt.label}
                    </button>
                ))}
            </ToolbarDropdown>

            <div className="w-px h-6 bg-black/[0.06] mx-0.5" />

            {/* Font Size */}
            <ToolbarDropdown
                title="Font Size"
                trigger={
                    <span className="flex items-center gap-1">
                        <Type size={14} />
                        <span className="text-[10px] tabular-nums">
                            {fontSize || "—"}
                        </span>
                    </span>
                }
            >
                <button
                    type="button"
                    onMouseDown={preventFocusLoss}
                    onClick={() => applyFontSize("")}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-xs rounded-lg hover:bg-black/[0.04] transition-colors text-left ${
                        !fontSize
                            ? "bg-[#2563eb]/[0.08] text-[#2563eb] font-semibold"
                            : ""
                    }`}
                >
                    <Minus size={12} />
                    Default
                </button>
                {FONT_SIZES.map((fs) => (
                    <button
                        key={fs.value}
                        type="button"
                        onMouseDown={preventFocusLoss}
                        onClick={() => applyFontSize(fs.value)}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-xs rounded-lg hover:bg-black/[0.04] transition-colors text-left ${
                            fontSize === fs.value
                                ? "bg-[#2563eb]/[0.08] text-[#2563eb] font-semibold"
                                : ""
                        }`}
                    >
                        <span style={{ fontSize: fs.value, lineHeight: "1" }}>
                            {fs.label}
                        </span>
                    </button>
                ))}
            </ToolbarDropdown>

            <div className="w-px h-6 bg-black/[0.06] mx-0.5" />

            {/* Text format buttons */}
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
                }
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${
                    isBold ? "bg-black/[0.1] text-[#2563eb]" : ""
                }`}
                title="Bold"
            >
                <Bold size={16} />
            </button>
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
                }
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${
                    isItalic ? "bg-black/[0.1] text-[#2563eb]" : ""
                }`}
                title="Italic"
            >
                <Italic size={16} />
            </button>
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
                }
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${
                    isUnderline ? "bg-black/[0.1] text-[#2563eb]" : ""
                }`}
                title="Underline"
            >
                <Underline size={16} />
            </button>
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(
                        FORMAT_TEXT_COMMAND,
                        "strikethrough"
                    )
                }
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${
                    isStrikethrough ? "bg-black/[0.1] text-[#2563eb]" : ""
                }`}
                title="Strikethrough"
            >
                <Strikethrough size={16} />
            </button>
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")
                }
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${
                    isCode ? "bg-black/[0.1] text-[#2563eb]" : ""
                }`}
                title="Inline Code"
            >
                <Code size={16} />
            </button>

            <div className="w-px h-6 bg-black/[0.06] mx-0.5" />

            {/* Superscript / Subscript */}
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")
                }
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${
                    isSuperscript ? "bg-black/[0.1] text-[#2563eb]" : ""
                }`}
                title="Superscript"
            >
                <Superscript size={16} />
            </button>
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")
                }
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${
                    isSubscript ? "bg-black/[0.1] text-[#2563eb]" : ""
                }`}
                title="Subscript"
            >
                <Subscript size={16} />
            </button>

            <div className="w-px h-6 bg-black/[0.06] mx-0.5" />

            {/* Font Color */}
            <ColorDropdown
                icon={<Type size={14} />}
                title="Font Color"
                colors={FONT_COLORS}
                activeColor={fontColor}
                onSelect={applyFontColor}
                indicatorColor={fontColor}
            />

            {/* Background Color */}
            <ColorDropdown
                icon={<Highlighter size={14} />}
                title="Highlight Color"
                colors={BG_COLORS}
                activeColor={bgColor}
                onSelect={applyBgColor}
                indicatorColor={bgColor}
            />

            <div className="w-px h-6 bg-black/[0.06] mx-0.5" />

            {/* Lists */}
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(
                        INSERT_UNORDERED_LIST_COMMAND,
                        undefined
                    )
                }
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${
                    blockType === "ul" ? "bg-black/[0.1] text-[#2563eb]" : ""
                }`}
                title="Bullet List"
            >
                <List size={16} />
            </button>
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(
                        INSERT_ORDERED_LIST_COMMAND,
                        undefined
                    )
                }
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${
                    blockType === "ol" ? "bg-black/[0.1] text-[#2563eb]" : ""
                }`}
                title="Numbered List"
            >
                <ListOrdered size={16} />
            </button>

            <div className="w-px h-6 bg-black/[0.06] mx-0.5" />

            {/* Link */}
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={insertLink}
                className={`p-2 hover:bg-black/[0.05] rounded-lg transition-colors ${
                    isLink ? "bg-black/[0.1] text-[#2563eb]" : ""
                }`}
                title="Insert Link"
            >
                <Link size={16} />
            </button>

            <div className="w-px h-6 bg-black/[0.06] mx-0.5" />

            {/* Alignment */}
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
                }
                className="p-2 hover:bg-black/[0.05] rounded-lg transition-colors"
                title="Align Left"
            >
                <AlignLeft size={16} />
            </button>
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
                }
                className="p-2 hover:bg-black/[0.05] rounded-lg transition-colors"
                title="Align Center"
            >
                <AlignCenter size={16} />
            </button>
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
                }
                className="p-2 hover:bg-black/[0.05] rounded-lg transition-colors"
                title="Align Right"
            >
                <AlignRight size={16} />
            </button>
            <button
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() =>
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
                }
                className="p-2 hover:bg-black/[0.05] rounded-lg transition-colors"
                title="Justify"
            >
                <AlignJustify size={16} />
            </button>
        </div>
    );
}
