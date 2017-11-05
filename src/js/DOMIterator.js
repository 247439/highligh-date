class DOMIterator {
    constructor(ctx) {
        this.ctx = ctx;
    }

    static matches(element, selector) {
        const selectors = typeof selector === "string" ? [selector] : selector,
            fn = (
                element.matches ||
                element.matchesSelector ||
                element.msMatchesSelector ||
                element.mozMatchesSelector ||
                element.oMatchesSelector ||
                element.webkitMatchesSelector
            );
        if(fn) {
            let match = false;
            selectors.every(sel => {
                if(fn.call(element, sel)) {
                    match = true;
                    return false;
                }
                return true;
            });
            return match;
        } else { // may be false e.g. when el is a textNode
            return false;
        }
    }

    /**
     * Returns all contexts filtered by duplicates (even nested)
     * @return {HTMLElement[]} - An array containing DOM contexts
     */
    getContexts() {
        let ctx,
            filteredCtx = [];
        if(typeof this.ctx === "undefined" || !this.ctx) { // e.g. null
            ctx = [];
        } else if(NodeList.prototype.isPrototypeOf(this.ctx)) {
            ctx = Array.prototype.slice.call(this.ctx);
        } else if(Array.isArray(this.ctx)) {
            ctx = this.ctx;
        } else if(typeof this.ctx === "string") {
            ctx = Array.prototype.slice.call(
                document.querySelectorAll(this.ctx)
            );
        } else { // e.g. HTMLElement
            ctx = [this.ctx];
        }
        // filter duplicate text nodes
        ctx.forEach(ctx => {
            const isDescendant = filteredCtx.filter(contexts => {
                return contexts.contains(ctx);
            }).length > 0;
            if(filteredCtx.indexOf(ctx) === -1 && !isDescendant) {
                filteredCtx.push(ctx);
            }
        });

        return filteredCtx;
    }


    /**
     * Creates a NodeIterator on the specified context
     * @see {@link https://developer.mozilla.org/en/docs/Web/API/NodeIterator}
     * @param {HTMLElement} ctx - The context DOM element
     * @param {whatToShow} whatToShow
     * @param {filterCb} filter
     * @return {NodeIterator}
     */

    createIterator(ctx, whatToShow, filter) {
        return document.createNodeIterator(ctx, whatToShow, filter, false);
    }


    /**
     * Returns the previous and current node of the specified iterator
     * @param {NodeIterator} itr - The iterator
     */
    getIteratorNode(itr) {
        const prevNode = itr.previousNode();
        let node;
        if(prevNode === null) {
            node = itr.nextNode();
        } else {
            node = itr.nextNode() && itr.nextNode();
        }
        return {
            prevNode,
            node
        };
    }

    /**
     * Iterates through all nodes in the specified context
     * @param {whatToShow} whatToShow
     * @param {HTMLElement} ctx - The context
     */
    iterateThroughNodes(whatToShow, ctx, eachCb, filterCb, doneCb) {
        var itr = this.createIterator(ctx, whatToShow, filterCb),
            elements = [],
            node, prevNode, retrieveNodes = () => {
                ({
                    prevNode,
                    node
                } = this.getIteratorNode(itr));
                return node;
            };

        while(retrieveNodes()) {
            // it's faster to call the each callback in an array loop
            // than in this while loop
            elements.push(node);
        }
        elements.forEach(node => {
            eachCb(node);
        });

        doneCb();
    }

    /**
     * Iterates over all contexts and initializes
     * @param {whatToShow} whatToShow
     */

    forEachNode(whatToShow, each, filter, done = () => {}) {
        const contexts = this.getContexts();
        let open = contexts.length;

        if(!open) {
            done();
        }

        contexts.forEach(ctx => {
            const ready = () => {
                this.iterateThroughNodes(whatToShow, ctx, each, filter, () => {
                    if(--open <= 0) { // call end all contexts were handled
                        done();
                    }
                });
            };
            ready();
        });
    }

};

export default DOMIterator;