import { Line, Range } from "@codemirror/state";
import { EditorView, ViewUpdate, Decoration, DecorationSet, ViewPlugin } from "@codemirror/view";

function getActiveWordBounds(line: Line, pos: number) {
  const lineStart = line.from;
  const lineText = line.text;

  let start = lineText.slice(0, pos - lineStart).search(/\S+$/);
  if (start < 0) start = pos - lineStart;

  let end = lineText.slice(pos - lineStart).search(/\s/);
  if (end < 0) end = lineText.length;
  else end += pos - lineStart;

  return { start: start + lineStart, end: end + lineStart };
}

function getParagraphDecos(view: EditorView) {
  const widgets: Range<Decoration>[] = [];
  const selection = view.state.selection.main;
  const pos = selection.from;
  const line = view.state.doc.lineAt(pos);

  const lineText = line.text;

  let match;
  const wordRegex = /(\S+)/g;

  while ((match = wordRegex.exec(lineText)) !== null) {
    const start = match.index + line.from;
    const end = start + match[1].length;

    widgets.push(
      Decoration.mark({
        inclusive: true,
        attributes: {},
        class: "word-span",
      }).range(start, end)
    );
  }

  return Decoration.set(widgets, true);
}

function getActiveWordDecos(view: EditorView) {
  const widgets: Range<Decoration>[] = [];
  const selection = view.state.selection.main;
  const pos = selection.from;
  const line = view.state.doc.lineAt(pos);

  const activeWordBounds = getActiveWordBounds(line, pos);

  const start = activeWordBounds.start;
  const end = activeWordBounds.end;

  function addWidget(from: number, to: number, className: string) {
    widgets.push(
      Decoration.mark({
        inclusive: true,
        attributes: {},
        class: className,
      }).range(from, to)
    );
  }

  if (start != end) {
    addWidget(start, end, "focus-word-active");
  }

  return Decoration.set(widgets, true);
}

export const WordSpanViewPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = getParagraphDecos(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.selectionSet) {
        this.decorations = getParagraphDecos(update.view);
      }
    }
  },
  { decorations: (v) => v.decorations }
);

export const FocusActiveWordViewPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = getActiveWordDecos(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.selectionSet) {
        this.decorations = getActiveWordDecos(update.view);

        if (this.editorElement) {
			this.editorElement.addClass("focus-word");
		}
      }
    }
  },
  { decorations: (v) => v.decorations }
);

export const scrollEventHandler = EditorView.domEventHandlers({
	scroll(event, view) {
		const editorElement = view.contentDOM.parentElement;

		if (editorElement) {
			editorElement.removeClass("focus-word");
		}
	}
});
