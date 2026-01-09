import { App, Modal, Notice, Plugin, TFile, requestUrl, normalizePath } from 'obsidian';
import { KindleBookInfoSettings, DEFAULT_SETTINGS, BookInfo, getSampleTemplate } from './types';
import { fetchBookInfo } from './bookInfoFetcher';
import { renderTemplate, renderFilename } from './templateEngine';
import { KindleBookInfoSettingTab } from './settings';
import { t } from './i18n';

/**
 * URL入力モーダル
 */
class UrlInputModal extends Modal {
	onSubmit: (url: string) => void;

	constructor(app: App, onSubmit: (url: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	/**
	 * テキストからURLを抽出
	 */
	private extractUrl(text: string): string | null {
		// URLパターンにマッチする部分を探す
		const urlPattern = /https?:\/\/[^\s]+/g;
		const matches = text.match(urlPattern);
		
		if (matches && matches.length > 0) {
			// 最初に見つかったURLを返す
			return matches[0].trim();
		}
		
		return null;
	}

	async onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		
		contentEl.createEl('h2', { text: t('modal_title') });
		
		void contentEl.createDiv({ 
			text: t('modal_description'),
			cls: 'kindle-book-info-modal-desc'
		});
		
		// テキスト入力欄
		const inputContainer = contentEl.createDiv({
			cls: 'kindle-book-info-input-container'
		});

		const inputEl = inputContainer.createEl('input', {
			type: 'text',
			cls: 'kindle-book-info-input'
		});
		
		// プラットフォーム判定
		interface AppWithMobile extends App {
			isMobile: boolean;
		}
		const isMobile = (this.app as AppWithMobile).isMobile;
		
		// Mac/Windowsの場合：クリップボードから自動入力
		if (!isMobile) {
			try {
				const clipboardText = await navigator.clipboard.readText();
				if (clipboardText && clipboardText.trim()) {
					const url = this.extractUrl(clipboardText);
					if (url) {
						inputEl.value = url;
					}
				}
			} catch (error: unknown) {
				// Failed to read clipboard - ignore silently
				const errorMsg = error instanceof Error ? error.message : String(error);
				console.warn('Clipboard read error:', errorMsg);
			}
		}
		
		const buttonContainer = contentEl.createDiv({
			cls: 'kindle-book-info-button-container'
		});
		
		// iOS/Androidの場合：「クリップボードから検索」ボタンを追加
		if (isMobile) {
			const clipboardButton = buttonContainer.createEl('button', {
				text: t('modal_clipboard_button'),
				cls: 'kindle-book-info-button'
			});
			
			clipboardButton.addEventListener('click', () => {
				void (async () => {
					try {
						const clipboardText = await navigator.clipboard.readText();
						if (clipboardText && clipboardText.trim()) {
							const url = this.extractUrl(clipboardText);
							if (url) {
								this.close();
								this.onSubmit(url);
							} else {
								new Notice(t('notice_no_url'));
							}
						} else {
							new Notice(t('notice_clipboard_empty'));
						}
					} catch {
						new Notice(t('notice_clipboard_failed'));
					}
				})();
			});
		}
		
		const submitButton = buttonContainer.createEl('button', {
			text: t('modal_search_button'),
			cls: 'mod-cta kindle-book-info-button'
		});
		
		submitButton.addEventListener('click', () => {
			const text = inputEl.value.trim();
			if (text.length > 0) {
				this.close();
				this.onSubmit(text);
			} else {
				new Notice(t('notice_enter_url'));
			}
		});

		// フォーカス
		setTimeout(() => {
			inputEl.focus();
		}, 100);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

/**
 * メインプラグインクラス
 */
export default class KindleBookInfoPlugin extends Plugin {
	settings: KindleBookInfoSettings = DEFAULT_SETTINGS;

	async onload() {
		await this.loadSettings();

		// Obsidian URIハンドラーを登録（Advanced URIからの呼び出し用）
		this.registerObsidianProtocolHandler('kindle-book-info', async (params) => {
			const url = params.url;
			if (url) {
				// URLが渡された場合は直接検索を実行
				await this.fetchAndCreateNote(url);
			} else {
				// URLがない場合は通常のモーダルを開く
				void this.createBookNote();
			}
		});

		// コマンドを登録
		this.addCommand({
			id: 'create-kindle-book-note',
			name: t('command_create_note'),
			callback: () => {
				void this.createBookNote();
			}
		});

		// リボンにアイコンを追加（設定で有効な場合のみ）
		if (this.settings.showRibbonIcon) {
			this.addRibbonIcon('book-open', t('ribbon_create_note'), () => {
				void this.createBookNote();
			});
		}

		// 設定タブを追加
		this.addSettingTab(new KindleBookInfoSettingTab(this.app, this));
	}

	async loadSettings() {
		const data = await this.loadData() as Partial<KindleBookInfoSettings> | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data ?? {});
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/**
	 * テンプレートファイルを読み込む
	 */
	async loadTemplate(): Promise<string> {
		try {
			if (!this.settings.templateFilePath || this.settings.templateFilePath.trim() === '') {
				return getSampleTemplate();
			}

			const templatePath = normalizePath(this.settings.templateFilePath);
			const templateFile = this.app.vault.getAbstractFileByPath(templatePath);
			
			if (!templateFile || !(templateFile instanceof TFile)) {
				return getSampleTemplate();
			}
			
			return await this.app.vault.read(templateFile);
		} catch {
			return getSampleTemplate();
		}
	}

	/**
	 * URLから書籍情報を取得してノートを作成（モーダルなし）
	 */
	async fetchAndCreateNote(url: string) {
		const notice = new Notice(t('notice_fetching'), 0);
		
		try {
			// 書籍情報を取得（タイムアウト設定：15秒）
			const bookInfo = await Promise.race([
				fetchBookInfo(url),
				new Promise<never>((_, reject) => 
					setTimeout(() => reject(new Error(t('notice_timeout'))), 15000)
				)
			]);
			notice.setMessage(t('notice_creating'));
			
			// 画像のダウンロード（オプション）
			let thumbnailPath = bookInfo.thumbnail;
			if (this.settings.downloadImages && bookInfo.thumbnail) {
				thumbnailPath = await this.downloadImage(bookInfo);
			}
			
			// テンプレートを読み込む
			const template = await this.loadTemplate();
			
			// テンプレートをレンダリング
			const bookInfoWithLocalThumbnail = {
				...bookInfo,
				thumbnail: thumbnailPath
			};
			const content = renderTemplate(template, bookInfoWithLocalThumbnail);
			
			// ファイル名を生成
			const filename = renderFilename(this.settings.filenameTemplate, bookInfo);
			
			// ファイルパスを作成
			const folderPath = this.settings.targetFolder;
			await this.ensureFolderExists(folderPath);
			
			const filePath = normalizePath(`${folderPath}/${filename}.md`);
			
			// ファイルが既に存在する場合は番号を付ける
			const finalPath = this.getUniqueFilePath(filePath);
			
			// ファイルを作成
			const file = await this.app.vault.create(finalPath, content);
			
			// 作成したファイルを開く
			const leaf = this.app.workspace.getLeaf();
			await leaf.openFile(file);
			
			notice.hide();
			new Notice(t('notice_created', { filename }));
		} catch (err: unknown) {
			notice.hide();
			const errorMsg = err instanceof Error ? err.message : t('error_unknown');
			new Notice(t('notice_error', { message: errorMsg }));
		}
	}

	createBookNote(): void {
		new UrlInputModal(this.app, (url: string) => {
			void (async () => {
				const notice = new Notice(t('notice_fetching'), 0);
				
				try {
					// 書籍情報を取得（タイムアウト設定：15秒）
					const bookInfo = await Promise.race([
						fetchBookInfo(url),
						new Promise<never>((_, reject) => 
							setTimeout(() => reject(new Error(t('notice_timeout'))), 15000)
						)
					]);
					notice.setMessage(t('notice_creating'));
					
					// 画像のダウンロード（オプション）
					let thumbnailPath = bookInfo.thumbnail;
					if (this.settings.downloadImages && bookInfo.thumbnail) {
						thumbnailPath = await this.downloadImage(bookInfo);
					}
					
					// テンプレートを読み込む
					const template = await this.loadTemplate();
					
					// テンプレートをレンダリング
					const bookInfoWithLocalThumbnail = {
						...bookInfo,
						thumbnail: thumbnailPath
					};
					const content = renderTemplate(template, bookInfoWithLocalThumbnail);
					
					// ファイル名を生成
					const filename = renderFilename(this.settings.filenameTemplate, bookInfo);
					
					// ファイルパスを作成
					const folderPath = this.settings.targetFolder;
					await this.ensureFolderExists(folderPath);
					
					const filePath = normalizePath(`${folderPath}/${filename}.md`);
					
					// ファイルが既に存在する場合は番号を付ける
					const finalPath = this.getUniqueFilePath(filePath);
					
					// ファイルを作成
					const file = await this.app.vault.create(finalPath, content);
					
					// 作成したファイルを開く
					const leaf = this.app.workspace.getLeaf();
					await leaf.openFile(file);
					
					notice.hide();
					new Notice(t('notice_created', { filename }));
				} catch (err: unknown) {
					notice.hide();
					const errorMsg = err instanceof Error ? err.message : t('error_unknown');
					new Notice(t('notice_error', { message: errorMsg }));
				}
			})();
		}).open();
	}

	/**
	 * フォルダが存在することを確認（なければ作成）
	 */
	async ensureFolderExists(folderPath: string) {
		const normalizedPath = normalizePath(folderPath);
		const folder = this.app.vault.getAbstractFileByPath(normalizedPath);
		
		if (!folder) {
			await this.app.vault.createFolder(normalizedPath);
		}
	}

	/**
	 * 重複しないファイルパスを取得
	 */
	getUniqueFilePath(filePath: string): string {
		let path = filePath;
		let counter = 1;
		
		while (this.app.vault.getAbstractFileByPath(path)) {
			const pathWithoutExt = filePath.replace(/\.md$/, '');
			path = `${pathWithoutExt} ${counter}.md`;
			counter++;
		}
		
		return path;
	}

	/**
	 * 画像をダウンロードしてVaultに保存
	 */
	async downloadImage(bookInfo: BookInfo): Promise<string> {
		try {
			// 画像フォルダを確認
			await this.ensureFolderExists(this.settings.imageFolder);
			
			// 画像をダウンロード（タイムアウト：10秒、最大サイズ：5MB）
			const response = await Promise.race([
				requestUrl({
					url: bookInfo.thumbnail,
					method: 'GET'
				}),
				new Promise<never>((_, reject) => 
					setTimeout(() => reject(new Error('画像のダウンロードがタイムアウトしました')), 10000)
				)
			]);
			
			// レスポンスサイズをチェック（最大5MB）
			if (response.arrayBuffer.byteLength > 5 * 1024 * 1024) {
				console.warn('画像ファイルが大きすぎるため、ローカル保存をスキップします');
				return bookInfo.thumbnail;
			}
			
			// ファイル名を生成（ASINを使用）
			const ext = bookInfo.thumbnail.split('.').pop()?.split('?')[0] || 'jpg';
			const filename = `${bookInfo.asin}.${ext}`;
			const imagePath = normalizePath(`${this.settings.imageFolder}/${filename}`);
			
			// 既に存在する場合はスキップ
			if (this.app.vault.getAbstractFileByPath(imagePath)) {
				return filename;
			}
			
			// バイナリデータとして保存
			await this.app.vault.createBinary(imagePath, response.arrayBuffer);
			
			return filename;
		} catch (err: unknown) {
			const errorMsg = err instanceof Error ? err.message : String(err);
			console.warn('Image download warning:', errorMsg);
			return bookInfo.thumbnail;
		}
	}
}
