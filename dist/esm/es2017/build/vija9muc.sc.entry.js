/*! Built with http://stenciljs.com */
import { h } from '../agc-field-capacity.core.js';

class AgcFieldCapacityInputs {
    constructor() {
        this.socket = "";
        this.ready = false;
    }
    render() {
        return (h("section", { "data-wizard-results": true, ref: c => this.section = c },
            h("div", { style: { display: this.ready ? 'none' : 'block' } },
                h("slot", { name: "empty" })),
            h("div", { style: { display: this.ready ? 'block' : 'none' } }, this.data && (h("ul", { class: "agc-results" },
                h("li", null,
                    h("h2", { "data-i18n": "results.implement-width" }, "Implement Width"),
                    h("span", { class: "agc-results__value" }, this.data['implementWidth']),
                    h("sub", null, this.data['units']['width'])),
                h("li", null,
                    h("h2", { "data-i18n": "results.working-speed" }, "Working Speed"),
                    h("span", { class: "agc-results__value" }, this.data['workingSpeed']),
                    h("sub", null, this.data['units']['speed'])),
                h("li", null,
                    h("h2", { "data-i18n": "results.field-efficiency" }, "Field Efficiency"),
                    h("span", { class: "agc-results__value" }, this.data['fieldEfficiencyPercent']),
                    h("sub", null, "%")))))));
    }
    handleResults(e) {
        if (e.detail['socket'] !== this.socket) {
            return;
        }
        this.data = Object.assign({}, e.detail['results']);
        this.ready = true;
    }
    componentDidLoad() {
        if (!this.socket) {
            return;
        }
        window.document.addEventListener('agcCalculated', this.handleResults.bind(this));
    }
    componentDidUnload() {
        window.document.removeEventListener('agcCalculated', this.handleResults);
    }
    static get is() { return "agc-field-capacity-inputs"; }
    static get properties() { return {
        "data": {
            "state": true
        },
        "ready": {
            "state": true
        },
        "socket": {
            "type": String,
            "attr": "socket"
        }
    }; }
}

export { AgcFieldCapacityInputs };
