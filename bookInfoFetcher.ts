import { requestUrl } from 'obsidian';
import * as cheerio from 'cheerio';
import { BookInfo } from './types';

/**
 * 短縮URLからASINを抽出して正規のAmazon URLを構築
 */
export async function resolveAsinFromShortUrl(url: string): Promise<string | null> {
	try {
		const response = await requestUrl({
			url: url,
			method: 'GET',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
			}
		});

		const html = response.text;
		const $ = cheerio.load(html);

		// canonical リンクからASINを抽出
		const canonicalUrl = $('link[rel="canonical"]').attr('href');
		if (canonicalUrl) {
			const asin = extractAsin(canonicalUrl);
			if (asin) {
				return asin;
			}
		}

		// og:url からASINを抽出
		const ogUrl = $('meta[property="og:url"]').attr('content');
		if (ogUrl) {
			const asin = extractAsin(ogUrl);
			if (asin) {
				return asin;
			}
		}

		// HTMLからASINを抽出
		const asin = extractAsinFromHtml($);
		if (asin) {
			return asin;
		}

		console.warn('Could not extract ASIN from short URL');
		return null;
	} catch (error) {
		console.error('Short URL resolution error:', error);
		return null;
	}
}

/**
 * Amazon/KindleのURLから書籍情報を取得
 */
export async function fetchBookInfo(url: string): Promise<BookInfo> {
	try {
		// 短縮URLの場合はASINを抽出して正規URLを構築
		let asinFromUrl: string | null = null;
		let finalUrl = url;
		
		if (url.includes('a.co/') || url.includes('amzn.to/')) {
			asinFromUrl = await resolveAsinFromShortUrl(url);
			if (asinFromUrl) {
				finalUrl = `https://www.amazon.co.jp/dp/${asinFromUrl}`;
			} else {
				throw new Error('短縮URLからASINを抽出できませんでした');
			}
		}

		// HTMLを取得
		const response = await requestUrl({
			url: finalUrl,
			method: 'GET',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3'
			}
		});

		const html = response.text;
		const $ = cheerio.load(html);

		// 書籍かどうかを判定
		if (!isBook($)) {
			throw new Error('このURLは書籍ではありません。Kindle本または紙書籍の商品ページURLをご使用ください。');
		}

		// ASINを取得（短縮URLから取得済みの場合はそれを使用、なければURLから抽出）
		let asin = asinFromUrl || extractAsin(finalUrl);
		
		// URLからASINが取得できない場合はHTMLから抽出
		if (!asin) {
			asin = extractAsinFromHtml($);
		}

		if (!asin) {
			throw new Error('ASINの取得に失敗しました');
		}

		// 統一されたURL形式を使用（常にhttps://www.amazon.co.jp/dp/ASINの形式）
		const standardizedUrl = `https://www.amazon.co.jp/dp/${asin}`;

		// タイトルを取得
		const title = extractTitle($);
		
		// 著者を取得
		const authors = extractAuthors($);
		
		// 概要を取得
		const description = extractDescription($);
		
		// 公開日を取得
		const published = extractPublishDate($);
		
		// サムネイルを取得
		const thumbnail = extractThumbnail($);
		
		// ISBNを取得
		let isbnData = extractIsbn($);

		// Kindle版でISBNが取得できない場合、紙の本のASINを探して取得を試みる
		if (!isbnData.isbn10 && !isbnData.isbn13) {
			const paperbackAsin = extractPaperbackAsin($);
			if (paperbackAsin) {
				isbnData = await fetchIsbnFromPaperback(paperbackAsin);
			} else {
			}
		}

		// シリーズ情報を取得
		const { series, volume } = extractSeries($);

		return {
			title,
			authors,
			description,
			published,
			asin,
			isbn10: isbnData.isbn10,
			isbn13: isbnData.isbn13,
			thumbnail,
			url: standardizedUrl,
			series,
			volume
		};
	} catch (error) {
		console.error('Book info fetch error:', error);
		throw new Error(`書籍情報の取得に失敗しました: ${error.message}`);
	}
}

/**
 * 商品が書籍（Kindle本または紙書籍）かどうかを判定
 */
function isBook($: cheerio.CheerioAPI): boolean {
	// JSONLDスキーマから Book タイプかどうかを確認
	const jsonLdScripts = $('script[type="application/ld+json"]');
	let hasBookSchema = false;
	jsonLdScripts.each((_, elem) => {
		try {
			const jsonData = JSON.parse($(elem).html() || '{}');
			if (jsonData['@type'] === 'Book' || 
			    (Array.isArray(jsonData['@type']) && jsonData['@type'].includes('Book'))) {
				hasBookSchema = true;
			}
		} catch {
			// JSONパースエラーは無視
		}
	});

	if (hasBookSchema) {
		return true;
	}

	// パンくずリストから判定（Kindleストア > Kindle本 または トップレベルが「本」）
	const breadcrumbSegmentsOrdered: string[] = [];
	// Wayfindingパンくず（優先）
	$('#wayfinding-breadcrumbs_feature_div a, #wayfinding-breadcrumbs_feature_div li').each((_, elem) => {
		const seg = $(elem).text().replace(/\s+/g, ' ').trim();
		if (seg) breadcrumbSegmentsOrdered.push(seg);
	});
	// 旧/汎用パンくず（フォールバック）
	if (breadcrumbSegmentsOrdered.length === 0) {
		$('.a-breadcrumb a').each((_, elem) => {
			const seg = $(elem).text().replace(/\s+/g, ' ').trim();
			if (seg) breadcrumbSegmentsOrdered.push(seg);
		});
	}

	// 条件：トップレベルが「本」
	const hasTopBooks = breadcrumbSegmentsOrdered.length > 0 && breadcrumbSegmentsOrdered[0].includes('本');

	// 条件：Kindleストア > Kindle本（順序を考慮）
	const iKindleStore = breadcrumbSegmentsOrdered.findIndex(s => s.includes('Kindleストア'));
	const iKindleBook = breadcrumbSegmentsOrdered.findIndex(s => s.includes('Kindle本'));
	const hasKindleStoreKindleBook = iKindleStore !== -1 && iKindleBook !== -1 && iKindleStore < iKindleBook;

	return hasTopBooks || hasKindleStoreKindleBook;
}

/**
 * URLからASINを抽出
 */
function extractAsin(url: string): string | null {
	// クエリパラメータからASINを抽出（Kindleシェアリンクなど）
	try {
		const urlObj = new URL(url);
		const asinParam = urlObj.searchParams.get('asin');
		if (asinParam && /^[A-Z0-9]{10}$/i.test(asinParam)) {
			return asinParam;
		}
	} catch (e) {
		// URL解析失敗時は無視
	}

	// URLパスからASINを抽出
	const match = url.match(/\/dp\/([A-Z0-9]{10})/i) || 
	              url.match(/\/product\/([A-Z0-9]{10})/i) ||
	              url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
	return match ? match[1] : null;
}

/**
 * HTMLからASINを抽出（URLから取得できない場合の代替手段）
 */
function extractAsinFromHtml($: cheerio.CheerioAPI): string | null {
	// data-asinから抽出
	let asin = $('[data-asin]').attr('data-asin');
	if (asin) return asin;
	
	// htmlタグのdata-asinから抽出
	asin = $('html').attr('data-asin');
	if (asin) return asin;
	
	// productタグのasinから抽出
	asin = $('input[name="ASIN"]').val() as string | undefined;
	if (asin) return asin;
	
	// scriptタグのJSON-LDから抽出
	const scripts = $('script[type="application/ld+json"]');
	for (let i = 0; i < scripts.length; i++) {
		try {
			const jsonData = JSON.parse($(scripts[i]).text());
			if (jsonData.productID) {
				// productIDからASINを取得（ASIN:xxxxx形式）
				const asinMatch = jsonData.productID.match(/ASIN:([A-Z0-9]{10})/);
				if (asinMatch) return asinMatch[1];
			}
		} catch (e) {
			// JSONパースエラーは無視
		}
	}
	
	// JavaScriptの変数からASINを抽出
	const bodyText = $('body').html() || '';
	const asinMatch = bodyText.match(/"ASIN":\s*"([A-Z0-9]{10})"/i) ||
	                  bodyText.match(/["']ASIN["']:\s*["']([A-Z0-9]{10})/i) ||
	                  bodyText.match(/B[A-Z0-9]{8}/); // Kindle版のASIN形式
	if (asinMatch) {
		return asinMatch[1] || asinMatch[0];
	}
	
	return null;
}

/**
 * タイトルを抽出
 */
function extractTitle($: cheerio.CheerioAPI): string {
	// OGタグから取得
	let title = $('meta[property="og:title"]').attr('content');
	
	// productTitleから取得
	if (!title) {
		title = $('#productTitle').text().trim();
	}
	
	// ebooksProductTitleから取得
	if (!title) {
		title = $('#ebooksProductTitle').text().trim();
	}
	
	return title || 'Unknown Title';
}

/**
 * 著者を抽出
 */
function extractAuthors($: cheerio.CheerioAPI): string[] {
	const authors: string[] = [];
	
	// .author クラスから取得
	$('.author a.contributorNameID').each((_, elem) => {
		const author = $(elem).text().trim();
		if (author && !authors.includes(author)) {
			authors.push(author);
		}
	});
	
	// bylineInfoから取得
	if (authors.length === 0) {
		$('#bylineInfo .author a').each((_, elem) => {
			const author = $(elem).text().trim();
			if (author && !authors.includes(author)) {
				authors.push(author);
			}
		});
	}
	
	return authors.length > 0 ? authors : ['Unknown Author'];
}

/**
 * 概要を抽出
 */
function extractDescription($: cheerio.CheerioAPI): string {
	// OGタグから取得
	let description = $('meta[property="og:description"]').attr('content');
	
	// book descriptionから取得
	if (!description) {
		description = $('#bookDescription_feature_div noscript').text().trim();
	}
	
	// iframe内のdescriptionを取得
	if (!description) {
		description = $('#bookDescription_feature_div').text().trim();
	}
	
	// meta descriptionから取得
	if (!description) {
		description = $('meta[name="description"]').attr('content');
	}
	
	return description || '';
}

/**
 * 公開日を抽出
 */
function extractPublishDate($: cheerio.CheerioAPI): string {
	// 詳細情報から取得
	let date = '';
	
	$('#detailBullets_feature_div li').each((_, elem) => {
		const text = $(elem).text();
		if (text.includes('出版社') || text.includes('Publisher')) {
			const match = text.match(/(\d{4})[年\/](\d{1,2})[月\/](\d{1,2})/);
			if (match) {
				date = `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
			}
		}
	});
	
	// 製品の詳細から取得
	if (!date) {
		$('.detail-bullet-list span.a-list-item').each((_, elem) => {
			const text = $(elem).text();
			if (text.includes('出版社') || text.includes('Publisher')) {
				const match = text.match(/(\d{4})[年\/](\d{1,2})[月\/](\d{1,2})/);
				if (match) {
					date = `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
				}
			}
		});
	}
	
	return date;
}

/**
 * サムネイルを抽出
 */
function extractThumbnail($: cheerio.CheerioAPI): string {
	// OGイメージから取得
	let thumbnail = $('meta[property="og:image"]').attr('content');
	
	// landingImageから取得
	if (!thumbnail) {
		thumbnail = $('#landingImage').attr('src');
	}
	
	// ebooksImgBlkFrontから取得
	if (!thumbnail) {
		thumbnail = $('#ebooksImgBlkFront img').attr('src');
	}
	
	// imgBlkFrontから取得
	if (!thumbnail) {
		thumbnail = $('#imgBlkFront img').attr('src');
	}
	
	return thumbnail || '';
}

/**
 * ISBNを抽出
 */
function extractIsbn($: cheerio.CheerioAPI): { isbn10: string, isbn13: string } {
	let isbn10 = '';
	let isbn13 = '';

	// #detailBullets_feature_div から探す
	const detailBullets = $('#detailBullets_feature_div li');
	
	$('#detailBullets_feature_div li').each((_, elem) => {
		// 制御文字を含むすべての不可視文字を削除し、複数の空白を1つに
		const text = $(elem).text()
			.replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '') // 不可視制御文字を削除
			.replace(/\s+/g, ' ')
			.trim();
		
		if (text.includes('ISBN-13') && !isbn13) {
			const match = text.match(/ISBN-13\s*[:：]\s*([0-9\-]+)/);
			if (match) {
				isbn13 = match[1].replace(/-/g, '');
			}
		} else if (text.includes('ISBN-10') && !isbn10) {
			const match = text.match(/ISBN-10\s*[:：]\s*([0-9\-]+)/);
			if (match) {
				isbn10 = match[1].replace(/-/g, '');
			}
		}
	});
	
	// 製品の詳細から取得
	if (!isbn10 && !isbn13) {
		const detailBulletList = $('.detail-bullet-list span.a-list-item');
		
		$('.detail-bullet-list span.a-list-item').each((_, elem) => {
			// 制御文字を含むすべての不可視文字を削除し、複数の空白を1つに
			const text = $(elem).text()
				.replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '') // 不可視制御文字を削除
				.replace(/\s+/g, ' ')
				.trim();
			
			if (text.includes('ISBN-13') && !isbn13) {
				const match = text.match(/ISBN-13\s*[:：]\s*([0-9\-]+)/);
				if (match) {
					isbn13 = match[1].replace(/-/g, '');
				}
			} else if (text.includes('ISBN-10') && !isbn10) {
				const match = text.match(/ISBN-10\s*[:：]\s*([0-9\-]+)/);
				if (match) {
					isbn10 = match[1].replace(/-/g, '');
				}
			}
		});
	}
	
	return { isbn10, isbn13 };
}
/**
 * シリーズ情報を抽出
 */
function extractSeries($: cheerio.CheerioAPI): { series: string; volume: string } {
	let series = '';
	let volume = '';
	
	// seriesBulletWidget_feature_div から抽出
	const seriesBulletLink = $('#seriesBulletWidget_feature_div a');
	if (seriesBulletLink.length > 0) {
		const text = seriesBulletLink.text()
			.replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '') // 不可視制御文字を削除
			.replace(/\s+/g, ' ')
			.trim();
		
		// "全6巻中第1巻: テルマエ・ロマエ" パターンを抽出
		const match = text.match(/全\d+巻中第(\d+)巻[:\s]*(.+?)$/);
		if (match) {
			volume = match[1];
			series = match[2].trim();
		}
	}
	
	return { series, volume };
}

/**
 * Kindle版ページから紙の本（単行本、文庫など）のASINを抽出
 */
function extractPaperbackAsin($: cheerio.CheerioAPI): string | null {
	// 形式セレクター（twister）から紙の本のリンクを探す
	const formatLinks = $('#tmmSwatches .swatchElement');
	
	for (let i = 0; i < formatLinks.length; i++) {
		const element = formatLinks.eq(i);
		const formatText = element.find('.a-button-text').text().trim();
		
		// 単行本、文庫、コミック、ペーパーバック、新書、または「(紙)」を含むフォーマットを探す
		if (formatText.includes('単行本') || 
		    formatText.includes('文庫') || 
		    formatText.includes('コミック') ||
		    formatText.includes('新書') ||
		    formatText.includes('(紙)') ||
		    formatText.includes('ペーパーバック') ||
		    formatText.includes('Paperback') ||
		    formatText.includes('Hardcover')) {
			
			const link = element.find('a').attr('href');
			if (link) {
				const asin = extractAsin(link);
				if (asin) {
					return asin;
				}
			}
		}
	}
	
	// formats セクションから探す
	let foundAsin: string | null = null;
	const formatsButtons = $('#formats .a-button-group a, #format .a-button-group a');
	
	formatsButtons.each((_, elem) => {
		if (foundAsin) return false;
		
		const text = $(elem).text().trim();
		if (text.includes('単行本') || text.includes('文庫') || 
		    text.includes('コミック') || text.includes('新書') || text.includes('(紙)') ||
		    text.includes('ペーパーバック') || text.includes('Hardcover')) {
			const href = $(elem).attr('href');
			if (href) {
				const asin = extractAsin(href);
				if (asin) {
					foundAsin = asin;
					return false;
				}
			}
		}
	});
	
	if (foundAsin) return foundAsin;
	
	// 書籍形式のバリエーションテーブルから探す
	const mediaTabs = $('#mediaTab_heading_0, #mediaTab_heading_1, #mediaTab_heading_2');
	
	mediaTabs.each((_, elem) => {
		if (foundAsin) return false;
		
		const text = $(elem).text().trim();
		if (text.includes('単行本') || text.includes('文庫') || 
		    text.includes('コミック') || text.includes('新書') || text.includes('(紙)')) {
			const link = $(elem).find('a').attr('href');
			if (link) {
				const asin = extractAsin(link);
				if (asin) {
					foundAsin = asin;
					return false;
				}
			}
		}
	});
	
	return foundAsin;
}

/**
 * 紙の本のページからISBNを取得
 */
async function fetchIsbnFromPaperback(asin: string): Promise<{ isbn10: string, isbn13: string }> {
	try {
		const url = `https://www.amazon.co.jp/dp/${asin}`;
		
		const response = await requestUrl({
			url: url,
			method: 'GET',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3'
			}
		});

		const html = response.text;
		const $ = cheerio.load(html);
		
		const isbns = extractIsbn($);
		
		return isbns;
	} catch (error) {
		console.error('紙の本のページからISBN取得エラー:', error);
		return { isbn10: '', isbn13: '' };
	}
}
