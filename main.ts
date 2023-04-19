import { App, Plugin } from 'obsidian';
import { FocusActiveWordViewPlugin, WordSpanViewPlugin, scrollEventHandler } from 'editorExtension';

export default class FocusActiveSentencePlugin extends Plugin {

	async onload() {
		this.registerEditorExtension(WordSpanViewPlugin.extension);
		this.registerEditorExtension(FocusActiveWordViewPlugin.extension);
		this.registerEditorExtension(scrollEventHandler);
	}

	onunload() {

	}
}
