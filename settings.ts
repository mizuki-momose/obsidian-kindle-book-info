import { App, PluginSettingTab, Setting, TFolder, TFile, AbstractInputSuggest } from 'obsidian';
import KindleBookInfoPlugin from './main';
import { getSampleTemplate } from './types';
import { t } from './i18n';

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

		containerEl.createEl('h2', { text: t('settings_title') });

		// ターゲットフォルダ設定（フォルダサジェスト）
		new Setting(containerEl)
			.setName(t('settings_target_folder_name'))
			.setDesc(t('settings_target_folder_desc'))
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
			.setName(t('settings_filename_template_name'))
			.setDesc(t('settings_filename_template_desc'))
			.addText(text => text
				.setPlaceholder('{{title}}')
				.setValue(this.plugin.settings.filenameTemplate)
				.onChange(async (value) => {
					this.plugin.settings.filenameTemplate = value;
					await this.plugin.saveSettings();
				}));

		// テンプレートファイルパス設定（ファイルサジェスト）
		new Setting(containerEl)
			.setName(t('settings_template_file_name'))
			.setDesc(t('settings_template_file_desc'))
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
			.setName(t('settings_download_images_name'))
			.setDesc(t('settings_download_images_desc'))
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.downloadImages)
				.onChange(async (value) => {
					this.plugin.settings.downloadImages = value;
					await this.plugin.saveSettings();
				}));

		// 画像フォルダ設定（フォルダサジェスト）
		new Setting(containerEl)
			.setName(t('settings_image_folder_name'))
			.setDesc(t('settings_image_folder_desc'))
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

		// リボンアイコン表示設定
		new Setting(containerEl)
			.setName(t('settings_show_ribbon_icon_name'))
			.setDesc(t('settings_show_ribbon_icon_desc'))
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showRibbonIcon)
				.onChange(async (value) => {
					this.plugin.settings.showRibbonIcon = value;
					await this.plugin.saveSettings();
				}));

		// サンプルテンプレートセクション
		containerEl.createEl('h3', { text: t('settings_sample_template_title') });
		
		const templateDesc = containerEl.createDiv({ cls: 'setting-item-description' });
		templateDesc.innerHTML = t('settings_sample_template_placeholders');

		new Setting(containerEl)
			.setName(t('settings_sample_template_title'))
			.addTextArea(text => {
				text
					.setValue(getSampleTemplate())
					.setDisabled(true);
				text.inputEl.rows = 15;
				text.inputEl.style.width = '100%';
				text.inputEl.style.fontFamily = 'monospace';
				return text;
			});

		// デフォルトに戻すボタン
		new Setting(containerEl)
			.setName(t('settings_reset_name'))
			.setDesc(t('settings_reset_desc'))
			.addButton(button => button
				.setButtonText(t('settings_reset_button'))
				.onClick(async () => {
					const { DEFAULT_SETTINGS } = await import('./types');
					this.plugin.settings.templateFilePath = DEFAULT_SETTINGS.templateFilePath;
					this.plugin.settings.targetFolder = DEFAULT_SETTINGS.targetFolder;
					this.plugin.settings.imageFolder = DEFAULT_SETTINGS.imageFolder;
					this.plugin.settings.filenameTemplate = DEFAULT_SETTINGS.filenameTemplate;
					this.plugin.settings.showRibbonIcon = DEFAULT_SETTINGS.showRibbonIcon;
					await this.plugin.saveSettings();
					this.display();
				}));
	}
}
