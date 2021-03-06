const path = require('path');

const matchOptions = require('../../src/lib/match-options');

describe('match options', () => {
    it('should match options from array', () => {
        const options = [
            { url: 'copy', filter: '**/*.png' },
            { url: 'inline', filter: '**/*.gif' },
            { url: 'rebase', filter: '**/*.svg' }
        ];
        const asset = {
            url: 'asset.gif',
            absolutePath: path.resolve(process.cwd(), 'some/path/to/asset.gif')
        };

        assert.equal(matchOptions(asset, options).url, 'inline');
    });

    it('should find first matched option by path', () => {
        const options = [
            { url: 'copy', filter: '/some/another/path/**/*.png' },
            { url: 'inline', filter: 'some/path/**/*.gif' },
            { url: 'inline2', filter: 'some/path/**/*.gif' },
            { url: 'rebase', filter: '/asset/path/**/*.svg' }
        ];
        const asset = {
            url: 'asset.gif',
            absolutePath: path.resolve(process.cwd(), 'some/path/to/asset.gif')
        };
        const option = matchOptions(asset, options);

        assert.equal(option && option.url, 'inline');
    });

    it('should match options with custom filter', () => {
        const options = [
            { url: 'copy', filter: (asset) => asset.absolutePath.indexOf('asset') !== -1 },
            { url: 'inline', filter: '**/*.gif' },
            { url: 'rebase', filter: '**/*.svg' }
        ];
        const asset = {
            url: 'asset.gif',
            absolutePath: path.resolve(process.cwd(), 'some/path/to/asset.gif')
        };

        assert.equal(matchOptions(asset, options).url, 'copy');
    });

    it('should match multiple options', () => {
        const options = [
            { url: 'copy', filter: (asset) => asset.absolutePath.indexOf('asset') !== -1 },
            { url: 'inline', filter: '**/*.gif' },
            { url: 'rebase', filter: '**/*.svg' },
            { url: () => 'custom', filter: '**/*.gif', multi: true }
        ];
        const asset = {
            url: 'asset.gif',
            absolutePath: path.resolve(process.cwd(), 'some/path/to/asset.gif')
        };

        const matched = matchOptions(asset, options);

        assert.equal(matched[1].url(), 'custom');
        assert.equal(matched.length, 2);
    });

    it('should match single option', () => {
        const options = [
            { url: 'copy', filter: (asset) => asset.absolutePath.indexOf('asset') !== -1 },
            { url: 'inline', filter: '**/*.gif' },
            { url: 'rebase', filter: '**/*.svg' },
            { url: () => 'custom', filter: '**/*.svg', multi: true }
        ];
        const asset = {
            url: 'asset.gif',
            absolutePath: path.resolve(process.cwd(), 'some/path/to/asset.gif')
        };

        assert.notOk(Array.isArray(matchOptions(asset, options)));
    });
});
