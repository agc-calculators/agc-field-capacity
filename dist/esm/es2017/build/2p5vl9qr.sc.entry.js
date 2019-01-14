/*! Built with http://stenciljs.com */
import { h } from '../agc-field-capacity.core.js';

class AgcFieldCapacityResults {
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
                    h("h2", { "data-i18n": "results.field-capacity" }, "Field Capacity"),
                    h("span", { class: "agc-results__value" }, this.data['fieldCapacity']),
                    h("sub", null,
                        this.data['units']['land'],
                        "/10 hour day")),
                h("li", null,
                    h("h2", { "data-i18n": "results.per-hour" }, "Field Capacity per Hour"),
                    h("span", { class: "agc-results__value" }, this.data['fieldCapacityPerHour']),
                    h("sub", null,
                        this.data['units']['land'],
                        "/hour")))))));
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
    static get is() { return "agc-field-capacity-results"; }
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

export { AgcFieldCapacityResults };
