class Provider {
    getSettings() {
        return {
            id: 'r34-booru-provider-v2',
            name: 'Rule34 Booru Engine',
            supportsMultiLanguage: false,
            supportsMultiScanlator: false
        };
    }

    async search(options) {
        const query = encodeURIComponent(options.query);
        const url = 'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=' + query;
        try {
            const response = await fetch(url);
            const posts = await response.json();
            if (!posts || posts.length === 0) return;
            
            return [{
                id: options.query,
                title: 'Booru Tag: ' + options.query,
                url: 'https://rule34.xxx/index.php?page=post&s=list&tags=' + query,
                image: posts[0]?.file_url || posts[0]?.sample_url || ''
            }];
        } catch (e) {
            return;
        }
    }

    async findChapters(mangaId) {
        return [{
            id: mangaId,
            title: 'All recent items for tag: ' + mangaId,
            chapter: '1',
            language: 'en'
        }];
    }

    async findChapterPages(chapterId) {
        const query = encodeURIComponent(chapterId);
        const url = 'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=' + query;
        try {
            const response = await fetch(url);
            const posts = await response.json();
            if (!posts || !Array.isArray(posts)) return;

            return posts.map((post, index) => ({
                index: index,
                url: post.file_url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'Referer': 'https://rule34.xxx'
                }
            }));
        } catch (e) {
            return;
        }
    }
}

module.exports = { Provider };
