import { App, PluginSettingTab, Setting, TFolder, TFile, AbstractInputSuggest } from 'obsidian';
import KindleBookInfoPlugin from './main';
import { SAMPLE_TEMPLATE } from './types';

/**
 * フォルダサジェスト機能
 */
class FolderSuggest extends AbstractInputSuggest<TFolder> {
	private folders: TFolder[] = [];
	private inputElement: HTMLInputElement;

	constructor(app: App, inputEl: HTMLInputElement) {
		super(app, inputEl);
		this.inputElement = inputEl;
		this.loadFolders();
	}

	private loadFolders() {
		this.folders = [];
		const traverse = (folder: TFolder) => {
			this.folders.push(folder);
			for (const child of folder.children) {
				if (child instanceof TFolder) {
					traverse(child);
				}
			}
		};
		
		const root = this.app.vault.getRoot();
		if (root instanceof TFolder) {
			traverse(root);
		}
	}

	getSuggestions(inputStr: string): TFolder[] {
		const lowerInput = inputStr.toLowerCase();
		return this.folders.filter(folder => 
			folder.path.toLowerCase().includes(lowerInput)
		);
	}

	renderSuggestion(folder: TFolder, el: HTMLElement): void {
		el.setText(folder.path);
	}

	selectSuggestion(folder: TFolder, evt: MouseEvent | KeyboardEvent): void {
		this.inputElement.value = folder.path;
		this.inputElement.dispatchEvent(new Event('input', { bubbles: true }));
		this.close();
	}
}

/**
 * ファイルサジェスト機能（Markdownファイルのみ）
 */
class FileSuggest extends AbstractInputSuggest<TFile> {
	private files: TFile[] = [];
	private inputElement: HTMLInputElement;

	constructor(app: App, inputEl: HTMLInputElement) {
		super(app, inputEl);
		this.inputElement = inputEl;
		this.loadFiles();
	}

	private loadFiles() {
		this.files = [];
		const traverse = (folder: TFolder) => {
			for (const child of folder.children) {
				if (child instanceof TFile && child.extension === 'md') {
					this.files.push(child);
				} else if (child instanceof TFolder) {
					traverse(child);
				}
			}
		};
		
		const root = this.app.vault.getRoot();
		if (root instanceof TFolder) {
			traverse(root);
		}
	}

	getSuggestions(inputStr: string): TFile[] {
		const lowerInput = inputStr.toLowerCase();
		return this.files.filter(file => 
			file.path.toLowerCase().includes(lowerInput)
		);
	}

	renderSuggestion(file: TFile, el: HTMLElement): void {
		el.setText(file.path);
	}

	selectSuggestion(file: TFile, evt: MouseEvent | KeyboardEvent): void {
		this.inputElement.value = file.path;
		this.inputElement.dispatchEvent(new Event('input', { bubbles: true }));
		this.close();
	}
}

/**
 * 設定タブ
 */
export class KindleBookInfoSettingTab extends PluginSettingTab {
	plugin: KindleBookInfoPlugin;

	constructor(app: App, plugin: KindleBookInfoPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Kindle Book Info Settings' });

		// ターゲットフォルダ設定（フォルダサジェスト）
		new Setting(containerEl)
			.setName('保存先フォルダ')
			.setDesc('作成したノートの保存先フォルダ（入力欄をクリックしてリストから選択）')
			.addText(text => {
				text
					.setPlaceholder('Books')
					.setValue(this.plugin.settings.targetFolder)
					.onChange(async (value) => {
						this.plugin.settings.targetFolder = value;
						await this.plugin.saveSettings();
					});
				
				// フォルダサジェスト機能を追加
				new FolderSuggest(this.app, text.inputEl);
				return text;
			});

		// ファイル名テンプレート設定
		new Setting(containerEl)
			.setName('ファイル名テンプレート')
			.setDesc('ファイル名のテンプレート（使用可能: {{title}}, {{authors}}, {{asin}}, {{series}}, {{volume}})')
			.addText(text => text
				.setPlaceholder('{{title}}')
				.setValue(this.plugin.settings.filenameTemplate)
				.onChange(async (value) => {
					this.plugin.settings.filenameTemplate = value;
					await this.plugin.saveSettings();
				}));

		// テンプレートファイルパス設定（ファイルサジェスト）
		new Setting(containerEl)
			.setName('テンプレートファイル')
			.setDesc('ノート作成時に使用するテンプレートファイル（空欄の場合はサンプルテンプレートが使用されます）')
			.addText(text => {
				text
					.setPlaceholder('Templates/kindle-book-template.md')
					.setValue(this.plugin.settings.templateFilePath)
					.onChange(async (value) => {
						this.plugin.settings.templateFilePath = value;
						await this.plugin.saveSettings();
					});
				
				// ファイルサジェスト機能を追加
				new FileSuggest(this.app, text.inputEl);
				return text;
			});

		// 画像ダウンロード設定
		new Setting(containerEl)
			.setName('画像をダウンロード')
			.setDesc('サムネイル画像をVaultにダウンロードする')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.downloadImages)
				.onChange(async (value) => {
					this.plugin.settings.downloadImages = value;
					await this.plugin.saveSettings();
				}));

		// 画像フォルダ設定（フォルダサジェスト）
		new Setting(containerEl)
			.setName('画像保存フォルダ')
			.setDesc('ダウンロードした画像の保存先フォルダ（入力欄をクリックしてリストから選択）')
			.addText(text => {
				text
					.setPlaceholder('Assets/BookCovers')
					.setValue(this.plugin.settings.imageFolder)
					.onChange(async (value) => {
						this.plugin.settings.imageFolder = value;
						await this.plugin.saveSettings();
					});
				
				// フォルダサジェスト機能を追加
				new FolderSuggest(this.app, text.inputEl);
				return text;
			});

		// サンプルテンプレートセクション
		containerEl.createEl('h3', { text: 'サンプルテンプレート' });
		
		const templateDesc = containerEl.createDiv({ cls: 'setting-item-description' });
		templateDesc.innerHTML = `
			<p>使用可能なプレースホルダー:</p>
			<ul>
				<li><code>{{title}}</code> - タイトル</li>
				<li><code>{{authors}}</code> - 著者（YAML配列形式）</li>
				<li><code>{{published}}</code> - 発売日</li>
				<li><code>{{series}}</code> - シリーズ</li>
				<li><code>{{volume}}</code> - 巻数</li>
				<li><code>{{asin}}</code> - ASIN</li>
				<li><code>{{isbn10}}</code> - ISBN-10</li>
				<li><code>{{isbn13}}</code> - ISBN-13</li>
				<li><code>{{thumbnail}}</code> - サムネイル</li>
				<li><code>{{thumbnail_display}}</code> - サムネイル（表示形式）</li>
				<li><code>{{url}}</code> - URL</li>
				<li><code>{{description}}</code> - 概要（全文）</li>
				<li><code>{{description_short}}</code> - 概要（短縮）</li>
				<li><code>{{created}}</code> - 作成日</li>
			</ul>
			<p>条件付きブロック: <code>{{#isbn10}}...{{/isbn10}}</code>, <code>{{#isbn13}}...{{/isbn13}}</code></p>
		`;

		new Setting(containerEl)
			.setName('サンプルテンプレート')
			.addTextArea(text => {
				text
					.setValue(SAMPLE_TEMPLATE)
					.setDisabled(true);
				text.inputEl.rows = 15;
				text.inputEl.style.width = '100%';
				text.inputEl.style.fontFamily = 'monospace';
				return text;
			});

		// デフォルトに戻すボタン
		new Setting(containerEl)
			.setName('デフォルトに戻す')
			.setDesc('設定をデフォルトに戻します')
			.addButton(button => button
				.setButtonText('リセット')
				.onClick(async () => {
					const { DEFAULT_SETTINGS } = await import('./types');
					this.plugin.settings.templateFilePath = DEFAULT_SETTINGS.templateFilePath;
					this.plugin.settings.targetFolder = DEFAULT_SETTINGS.targetFolder;
					this.plugin.settings.imageFolder = DEFAULT_SETTINGS.imageFolder;
					this.plugin.settings.filenameTemplate = DEFAULT_SETTINGS.filenameTemplate;
					await this.plugin.saveSettings();
					this.display();
				}));
	}
}
