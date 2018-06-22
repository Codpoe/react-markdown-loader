const mdIt = require('markdown-it');
const mdContainer = require('markdown-it-container');
const loaderUtils = require('loader-utils');
const hljs = require('highlight.js');

// 自定义容器的类型
const TYPES = {
    IMPORT: 'import',
    EXPORT: 'export',
    DEMO: 'demo'
};

const options = {
    className: 'md',    // 组件类名
    plugins: []         // markdown-it 插件
};

hljs.configure({
    tabReplace: '    ', // 把 tab 字符转换成 4 个空格
    useBR: true         // 把换行符转换成 <br>
});

const md = mdIt({
    html: true,
    linkify: true,
    typographer: false,
    highlight(str, lang) {
        let content;

        if (lang && hljs.getLanguage(lang)) {
            try {
                content = hljs.highlight(lang, str).value;
            } catch (err) {} // eslint-disable-line no-empty
        }

        if (!content) {
            try {
                content = hljs.highlightAuto(str).value;
            } catch (err) {} // eslint-disable-line no-empty
        }
        
        // 将 '{' 和 '}' 转换成字符串，防止其里面的内容被解析成表达式
        return hljs.fixMarkup(content.replace(/[{}]/g, match => `{'${match}'}`));
    }
});

/**
 * 将 MD 转换为 React 组件
 * @param {string} jsx 由 markdown-it 渲染得到的字符串转换而来的合法 JSX
 * @param {string} importStatements import 语句
 * @param {string} exportStatements export 语句
 * @param {Array} demos 示例组件
 */
const toMdComponent = (jsx, importStatements, exportStatements, demos) => {
    return `
        import React from 'react';
        ${importStatements}

        ${joinDemos(demos)}

        class MdComponent extends React.Component {
            render() {
                return (
                    <div className="${options.className}">
                        ${jsx}
                    </div>
                );
            }
        }

        export default MdComponent;
        ${exportStatements}
    `;
};

/**
 * 给各个组件套壳（加类名），然后拼接起来
 * @param {Array} demos 示例组件
 */
const joinDemos = (demos) => {
    return demos.map(([id, demo]) => (`
        class Rmdl${id} extends React.Component {
            ${demo}
        }
    `)).join('\n');
};

/**
 * 将 markdown-it 渲染得到的字符串转换成合法的 JSX
 * @param {string} html markdown-it 渲染得到的字符串
 */
const toLegalJsx = (html) => {
    return html.replace(/(<.*? )class=/g, (match, $1) => `${$1}className=`)
        .replace(/<br>/g, '<br />')
        .replace(/<hr>/g, '<hr />');
};

module.exports = function (source) {
    // 合并选项
    Object.assign(options, loaderUtils.getOptions(this));

    const { className, plugins } = options;
    let importStatements = '';
    let exportStatements = '';
    const demos = [];
    let isDemo = false;

    // 自定义 markdown 容器
    md.use(mdContainer, 'react', { // 以 'react' 作为标记
        validate(params) {
            return params.trim().match(/^react\s*(.*)$/);
        },
        render(tokens, idx) {
            const m = tokens[idx].info.trim().match(/^react\s*(.*)$/);
            
            if (tokens[idx].nesting === 1) { // 开标签
                const type = (m && m.length > 1) ? m[1] : '';
                const content = tokens[idx + 1].content;

                switch (type) {
                    case TYPES.IMPORT:
                        importStatements += content;
                        break;
                    case TYPES.EXPORT:
                        exportStatements += content;
                        break;
                    case TYPES.DEMO:
                        demos.push([idx, content]);
                        isDemo = true;
                        break;
                }

                if (!isDemo) { // 非 demo，则不显示代码
                    return '{/* ';
                }

                const nodeName = `Rmdl${idx}`;

                return `
                    <div className="${className}__demo">
                        <div className="${className}__demo-component">
                            <${nodeName} />
                        </div>
                        <div className="${className}__demo-code">
                `;
            }
            if (!isDemo) {
                return ' */}';
            }
            isDemo = false;
            return '</div></div>';
        }
    });

    // 
    plugins.forEach(plugin => {
        md.use(...plugin);
    });

    // 转换为合法的 JSX 语法
    const jsx = toLegalJsx(md.render(source));
    
    return toMdComponent(jsx, importStatements, exportStatements, demos);
};
