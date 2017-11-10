import Highlight from './Highlight';
import regexpList from './regexpList';

const highlightInstance = new Highlight(document.body);

regexpList.forEach(item => highlightInstance.markRegExp(item.reg, item.opt));
