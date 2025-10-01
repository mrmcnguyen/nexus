"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical"
import { useCallback, useEffect, useState } from "react"
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list"
import { mergeRegister } from "@lexical/utils"

const LowPriority = 1

function SimpleToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"))
      setIsItalic(selection.hasFormat("italic"))
      setIsUnderline(selection.hasFormat("underline"))
      setIsStrikethrough(selection.hasFormat("strikethrough"))
    }
  }, [])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar()
        return false
      },
      LowPriority
    )
  }, [editor, updateToolbar])

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        LowPriority
      )
    )
  }, [editor])

  return (
    <div className="flex items-center gap-1 p-2 border-b border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
      {/* Undo/Redo */}
      <div className="flex gap-1">
        <button
          type="button"
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined)
          }}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          type="button"
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined)
          }}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

      {/* Text Formatting */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
          }}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            isBold ? "bg-gray-300 dark:bg-gray-600" : ""
          }`}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
          }}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            isItalic ? "bg-gray-300 dark:bg-gray-600" : ""
          }`}
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
          }}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            isUnderline ? "bg-gray-300 dark:bg-gray-600" : ""
          }`}
          title="Underline"
        >
          <span className="underline">U</span>
        </button>
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
          }}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            isStrikethrough ? "bg-gray-300 dark:bg-gray-600" : ""
          }`}
          title="Strikethrough"
        >
          <span className="line-through">S</span>
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

      {/* Lists */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
          }}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
          }}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default SimpleToolbarPlugin
