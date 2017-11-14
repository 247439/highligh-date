import DOMIterator from './DOMIterator';
import {WEEK_NAMES_SHORT, WEEK_DAY_COLORS} from './constants';

class Highlight {
    constructor(ctx) {
        /**
         * The context of the instance.
         * @type {HTMLElement}
         * @access protected
         */
        this.ctx = ctx;
    }

    set opt(val) {
        this._opt = Object.assign({}, {
            "element": "span",
            "className": "",
            "exclude": ['[data-marked]'],
        }, val);
    }

    get opt() {
        return this._opt;
    }

  /**
   * An instance of DOMIterator
   * @type {DOMIterator}
   */
    get iterator() {
        // always return new instance in case there were option changes
        return new DOMIterator(
            this.ctx
        );
    }

    getTextNodes(cb) {
        let val = "",
            nodes = [];
        this.iterator.forEachNode(
            NodeFilter.SHOW_TEXT, node => {
                nodes.push({
                    start: val.length,
                    end: (val += node.textContent).length,
                    node
                });
            },
            node => {
                if(this.matchesExclude(node.parentNode)) {
                    return NodeFilter.FILTER_REJECT;
                } else {
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            () => {
                cb({
                    value: val,
                    nodes: nodes
                });
            }
        );
    }

    matchesExclude(el) {
        return DOMIterator.matches(el, this.opt.exclude.concat([
            // ignores the elements itself, not their childrens (selector *)
            "script", "style", "title", "head", "html"
        ]));
    }

  /**
   * Wraps the instance element and class around matches within single HTML
   * elements in all contexts
   * @param {RegExp} regex - The regular expression to be searched
   */
    wrapMatches(regex) {
        const matchIdx = 0;

        this.getTextNodes(dict => {
            dict.nodes.forEach(node => {
                node = node.node;
                let match;
                while(
                    (match = regex.exec(node.textContent)) !== null &&
                    match[matchIdx] !== ""
                ) {
                    let pos = match.index;
                    const dateString = this.opt.getDay ? this.opt.getDay(match) : match[0];
                    const dayOfWeek = new Date(dateString).getDay();

                    if(matchIdx !== 0) {
                        for(let i = 1; i < matchIdx; i++) {
                            pos += match[i].length;
                        }
                    }
                    node = this.wrapRangeInTextNode(
                        node,
                        pos,
                        pos + match[matchIdx].length,
                        dayOfWeek
                    );
                    // eachCb(node.previousSibling);
                    // reset index of last match as the node changed and the
                    // index isn't valid anymore http://tinyurl.com/htsudjd
                    regex.lastIndex = 0;
                }
            });
        });
    }

    markRegExp(regexp, opt) {
        this.opt = opt;
        this.wrapMatches(regexp);
    }

    wrapRangeInTextNode(node, start, end, dayOfWeek) {
        const hEl = !this.opt.element ? "mark" : this.opt.element,
            startNode = node.splitText(start),
            ret = startNode.splitText(end - start);
        let repl = document.createElement(hEl);
        repl.setAttribute("data-marked", "true");

        if (!isNaN(dayOfWeek)) {
            repl.style.background = WEEK_DAY_COLORS[dayOfWeek];
            repl.style.color = (dayOfWeek == 5) ? '#000' : '#fff';
        }
        if(this.opt.className) {
            repl.setAttribute("class", this.opt.className);
        }
        if (this.opt.addDay) {
            repl.textContent = `${WEEK_NAMES_SHORT[dayOfWeek]}, ${startNode.textContent}`;
        } else {
            repl.textContent = startNode.textContent;
        }
        startNode.parentNode.replaceChild(repl, startNode);

        return ret;
    }

    /**
     * Removes all marked elements inside the context with their HTML and
     * normalizes the parent at the end
     */
    unmark() {
        let sel = this.opt.element ? this.opt.element : "*";
        sel += "[data-marked]";
        if(this.opt.className) {
            sel += `.${this.opt.className}`;
        }
        this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT, node => {
            this.unwrapMatches(node);
        }, node => {
            const matchesSel = DOMIterator.matches(node, sel),
                matchesExclude = this.matchesExclude(node);
            if(!matchesSel || matchesExclude) {
                return NodeFilter.FILTER_REJECT;
            } else {
                return NodeFilter.FILTER_ACCEPT;
            }
        }, this.opt.done);
    }
}

export default Highlight;