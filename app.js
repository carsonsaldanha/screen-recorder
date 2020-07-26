import {MDCRipple} from '@material/ripple';

const fabRipple = [].map.call(document.querySelectorAll('.mdc-fab'), function(el) {
    return new MDCRipple(el);
});