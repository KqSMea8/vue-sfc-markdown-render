import { renderTableTitle, renderTabelHeader, renderTabelRow } from '../utils';
import { RenderPluginOption } from '../../typings/render';
import { ParserResult } from '@vuese/parser';

export default class PropsRenderPlugin {
    options: RenderPluginOption = {
        heads: ['Name', 'Description', 'Type', 'Required', 'Default'],
    };
    constructor(options: RenderPluginOption){
        this.options = {...this.options, ...options};
    }
    render(parserResult: ParserResult, topTitleLevel: number) {
        let content = '';
        if (parserResult.props && this.options.heads) {
            content += renderTableTitle(topTitleLevel + 1, 'Props');
            content += renderTabelHeader(this.options.heads);
            parserResult.props.forEach((prop) => {
                const row = [];
                // @ts-ignore
                for (const head of this.options.heads) {
                    if (head === 'Name') {
                        row.push(prop.name);
                    } else if (head === 'Description') {
                        let desc = ['-'];
                        if (prop.describe && prop.describe.length) {
                            desc = prop.describe;
                            if (prop.validatorDesc) {
                                desc = prop.describe.concat(prop.validatorDesc);
                            }
                        }
                        row.push(desc.join(''));
                    } else if (head === 'Type') {
                        if (prop.typeDesc) {
                            row.push(prop.typeDesc.join(''));
                        } else if (!prop.type) {
                            row.push('—');
                        } else if (typeof prop.type === 'string') {
                            row.push(`\`${prop.type}\``);
                        } else if (Array.isArray(prop.type)) {
                            row.push(
                                prop.type
                                    .map((t) => `\`${t}\` / `)
                                    .join('')
                                    .slice(0, -3),
                            );
                        } else {
                            row.push('-');
                        }
                    } else if (head === 'Required') {
                        if (typeof prop.required === 'undefined') {
                            row.push('`false`');
                        } else if (typeof prop.required === 'boolean') {
                            row.push(`\`${String(prop.required)}\``);
                        } else {
                            row.push('-');
                        }
                    } else if (head === 'Default') {
                        if (prop.defaultDesc) {
                            row.push(prop.defaultDesc.join(''));
                        } else if (prop.default) {
                            row.push(prop.default.replace(/\n/g, ''));
                        } else {
                            row.push('-');
                        }
                    } else {
                        row.push('-');
                    }
                }
                content += renderTabelRow(row);
            });
        }
        return content;
    }
}