import { validate, round } from '../../utils';
export class AgcFieldCapacity {
    constructor() {
        this.socket = "";
        this.tract = "";
        this.units = { width: 'ft', land: 'A', speed: 'mph' };
        this.mode = 'step';
        this.currentStep = 0;
        this.cache = {};
        this.submitted = false;
        this.results = {};
    }
    render() {
        return (h("div", null,
            h("form", { onSubmit: (e) => e.preventDefault(), ref: c => this.form = c, "data-wizard": "agc-field-capacity", "data-wizard-mode": this.mode, class: "agc-wizard" },
                h("slot", null),
                h("section", { "data-wizard-section": "1" },
                    h("div", { class: "agc-wizard__field" },
                        h("label", { "data-i18n": "fields.implement-width" }, "Implement Width"),
                        h("input", { name: "implementWidth", type: "text", required: true, min: "1", step: "0.1" }),
                        h("p", { class: "agc-wizard__validation-message", "data-i18n": "validation.implement-width.required", "data-validates": "implementWidth" }, "Please enter a value."),
                        h("p", { "data-i18n": `hints.implement-width.${this.units['width']}` }, "\u2BA4 Enter the width of the implement in feet.")),
                    h("div", { class: "agc-wizard__actions" }, this.mode === 'step' && h("button", { class: "agc-wizard__actions-next", "data-i18n": "actions.next", onClick: this.nextPrev.bind(this, 1) }, "Next \uD83E\uDC16"))),
                h("section", { "data-wizard-section": "2" },
                    h("div", { class: "agc-wizard__field" },
                        h("label", { "data-i18n": "fields.working-speed" }, "Working Speed"),
                        h("input", { name: "workingSpeed", type: "text", required: true, min: "1", step: "0.1" }),
                        h("p", { class: "agc-wizard__validation-message", "data-i18n": "validation.working-speed.required", "data-validates": "workingSpeed" }, "Please enter a value."),
                        h("p", { "data-i18n": `hints.working-speed.${this.units['speed']}` }, "\u2BA4 Enter the average working field speed in miles per hour.")),
                    h("div", { class: "agc-wizard__actions" }, this.mode === 'step' && [h("button", { class: "agc-wizard__actions-prev", "data-i18n": "actions.prev", onClick: this.nextPrev.bind(this, -1) }, "\uD83E\uDC14 Back"),
                        h("button", { class: "agc-wizard__actions-next", "data-i18n": "actions.next", onClick: this.nextPrev.bind(this, 1) }, "Next \uD83E\uDC16")])),
                h("section", { "data-wizard-section": "3" },
                    h("div", { class: "agc-wizard__field" },
                        h("label", { "data-i18n": "fields.field-efficiency" }, "Field Efficiency"),
                        h("input", { name: "fieldEfficiency", type: "text", required: true, min: "1", step: "0.1" }),
                        h("p", { class: "agc-wizard__validation-message", "data-i18n": "validation.field-efficiency.required", "data-validates": "fieldEfficiency" }, "Please enter a value."),
                        h("p", { "data-i18n": "hints.field-efficiency" }, "\u2BA4 Enter the estimated field efficiency percentage.")),
                    h("div", { class: "agc-wizard__actions" },
                        this.mode === 'step' && h("button", { class: "agc-wizard__actions-prev", "data-i18n": "actions.prev", onClick: this.nextPrev.bind(this, -1) }, "\uD83E\uDC14 Back"),
                        h("button", { class: "agc-wizard__actions-next", "data-i18n": "actions.finish", onClick: this.nextPrev.bind(this, this.mode === 'step' ? 1 : 3) }, "Calculate \uD83E\uDC16"))),
                h("section", { "data-wizard-results": true },
                    h("slot", { name: "results" })))));
    }
    showTab(n) {
        if (this.mode === 'step') {
            this.cache['sections'][n].style.display = "block";
        }
        if (this.socket) {
            this.agcStepChanged.emit({ socket: this.socket, tract: this.tract, step: this.currentStep });
        }
    }
    reset() {
        this.currentStep = 0;
        this.submitted = false;
        this.showTab(0);
    }
    validateForm() {
        let valid = true;
        if (this.currentStep === 0 || this.mode === 'full') {
            if (!validate(this.form, 'implementWidth')) {
                valid = false;
            }
        }
        if (this.currentStep === 1 || this.mode === 'full') {
            if (!validate(this.form, 'workingSpeed')) {
                valid = false;
            }
        }
        if (this.currentStep === 2 || this.mode === 'full') {
            if (!validate(this.form, 'fieldEfficiency')) {
                valid = false;
            }
        }
        return valid;
    }
    nextPrev(n, e) {
        e && e.preventDefault();
        if (this.mode === 'full') {
            if (!this.validateForm())
                return false;
        }
        else if (n == 1 && !this.validateForm())
            return false;
        if (this.mode === 'step') {
            this.cache['sections'][this.currentStep].style.display = "none";
        }
        this.currentStep = this.currentStep + n;
        if (this.currentStep >= this.cache['sections'].length) {
            this.submitted = true;
            this.showResults.call(this);
            return false;
        }
        this.showTab.call(this, this.currentStep);
    }
    showResults() {
        let implementWidth = parseFloat(this.form.querySelector('[name="implementWidth"').value);
        let workingSpeed = parseFloat(this.form.querySelector('[name="workingSpeed"').value);
        let fieldEfficiency = round(parseFloat(this.form.querySelector('[name="fieldEfficiency"').value) / 100, 2);
        let fieldEfficiencyPercent = round(fieldEfficiency * 100, 0);
        let factor = round(43560 / 5280, 2);
        let fieldCapacityPerHour = round((workingSpeed * implementWidth * fieldEfficiency) / factor, 2);
        let fieldCapacity = round(fieldCapacityPerHour * 10, 2);
        let results = {
            socket: this.socket,
            tract: this.tract,
            units: this.units,
            implementWidth,
            workingSpeed,
            fieldEfficiency,
            fieldEfficiencyPercent,
            fieldCapacity,
            fieldCapacityPerHour
        };
        if (this.socket) {
            this.agcCalculated.emit({ socket: this.socket, tract: this.tract, results: Object.assign({}, results) });
        }
        this.results = Object.assign({}, results);
        this.cache['results'].forEach(result => {
            result.style.display = 'block';
        });
    }
    handleAction(e) {
        if (e.detail['action'] === 'reset') {
            this.reset();
        }
    }
    componentDidLoad() {
        var sections = Array.from(this.form.querySelectorAll('[data-wizard-section]')).map(c => c).map(c => c);
        var results = Array.from(this.form.querySelectorAll('[data-wizard-results]')).map(c => c).map(c => c);
        this.cache = Object.assign({}, this.cache, { sections: sections, results: results });
        window.document.addEventListener('agcAction', this.handleAction.bind(this));
        this.form.querySelector('[name="fieldEfficiency"').value = "83";
        this.showTab(0);
    }
    componentDidUnload() {
        window.document.removeEventListener('agcAction', this.handleAction);
    }
    static get is() { return "agc-field-capacity"; }
    static get properties() { return {
        "cache": {
            "state": true
        },
        "currentStep": {
            "state": true
        },
        "mode": {
            "type": String,
            "attr": "mode"
        },
        "results": {
            "state": true
        },
        "socket": {
            "type": String,
            "attr": "socket"
        },
        "submitted": {
            "state": true
        },
        "tract": {
            "type": String,
            "attr": "tract"
        },
        "units": {
            "type": "Any",
            "attr": "units"
        }
    }; }
    static get events() { return [{
            "name": "agcCalculated",
            "method": "agcCalculated",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "agcStepChanged",
            "method": "agcStepChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
}
