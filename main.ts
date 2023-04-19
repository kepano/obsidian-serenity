import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { FocusActiveWordViewPlugin, WordSpanViewPlugin, scrollEventHandler } from 'editorExtension';

interface SerenityPluginSettings {
	fadeWords: boolean;
}

const DEFAULT_SETTINGS: SerenityPluginSettings = {
	fadeWords: true,
}

export default class SerenityPlugin extends Plugin {

	settings: SerenityPluginSettings;

	async onload() {
		await this.loadSettings();
		this.registerEditorExtension(WordSpanViewPlugin.extension);
		this.registerEditorExtension(FocusActiveWordViewPlugin.extension);
		this.registerEditorExtension(scrollEventHandler);
		this.addCommands();
	}

	onunload() {

	}

	addCommands() {
		this.addCommand({
			id: 'serenity-active',
			name: 'Toggle fading words',
			callback: () => { this.toggleFadeWords(); }
		});
	}

	toggleFadeWords() {
		this.settings.fadeWords = !this.settings.fadeWords;
		this.saveData(this.settings);
		this.loadSettings();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		document.body.classList.toggle('serenity-fade-words', this.settings.folding);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
