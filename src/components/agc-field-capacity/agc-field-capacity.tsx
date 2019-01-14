
import { Component, State, Event, EventEmitter, Prop } from '@stencil/core';
import { validate, round } from '../../utils'

@Component({
    tag: 'agc-field-capacity'
})
export class AgcFieldCapacity {

    @Prop() socket: string = ""
    @Prop() tract: string = ""
    @Prop() units: any = { width: 'ft', land: 'A', speed: 'mph'}
    @Prop() mode: 'full' | 'step' = 'step'
    @State() currentStep = 0
    @State() cache = {}
    @State() submitted = false
    @State() results = {}
    @Event({
        eventName: 'agcCalculated'
      }) agcCalculated: EventEmitter;
    @Event({
        eventName: 'agcStepChanged'
    }) agcStepChanged: EventEmitter;

    form: HTMLFormElement

    render() {
        return (
            <div>
                <form onSubmit={(e) => e.preventDefault()} ref={c => this.form = c as HTMLFormElement} data-wizard="agc-field-capacity" 
                    data-wizard-mode={this.mode}
                    class="agc-wizard">
                    <slot></slot>
                    <section data-wizard-section="1">
                        <div class="agc-wizard__field">
                            <label data-i18n="fields.implement-width">Implement Width</label>
                            <input name="implementWidth" type="text" required min="1" step="0.1" />
                            <p class="agc-wizard__validation-message" data-i18n="validation.implement-width.required" data-validates="implementWidth">Please enter a value.</p>
                            <p data-i18n={`hints.implement-width.${this.units['width']}`}>⮤ Enter the width of the implement in feet.</p>
                        </div>
                        <div class="agc-wizard__actions">
                            {this.mode === 'step' && <button class="agc-wizard__actions-next" data-i18n="actions.next" onClick={this.nextPrev.bind(this, 1)}>Next 🠖</button>}
                        </div>
                    </section>
                    <section data-wizard-section="2">
                        <div class="agc-wizard__field">
                            <label data-i18n="fields.working-speed">Working Speed</label>
                            <input name="workingSpeed" type="text" required min="1" step="0.1" />
                            <p class="agc-wizard__validation-message" data-i18n="validation.working-speed.required" data-validates="workingSpeed">Please enter a value.</p>
                            <p data-i18n={`hints.working-speed.${this.units['speed']}`}>⮤ Enter the average working field speed in miles per hour.</p>
                        </div>
                        <div class="agc-wizard__actions">
                            {this.mode === 'step' && [<button class="agc-wizard__actions-prev" data-i18n="actions.prev" onClick={this.nextPrev.bind(this, -1)}>🠔 Back</button>,
                            <button class="agc-wizard__actions-next" data-i18n="actions.next" onClick={this.nextPrev.bind(this, 1)}>Next 🠖</button>]}
                        </div>
                    </section>
                    <section data-wizard-section="3">
                        <div class="agc-wizard__field">
                            <label data-i18n="fields.field-efficiency">Field Efficiency</label>
                            <input name="fieldEfficiency" type="text" required min="1" step="0.1" />
                            <p class="agc-wizard__validation-message" data-i18n="validation.field-efficiency.required" data-validates="fieldEfficiency">Please enter a value.</p>
                            <p data-i18n="hints.field-efficiency">⮤ Enter the estimated field efficiency percentage.</p>
                        </div>
                        <div class="agc-wizard__actions">
                            {this.mode === 'step' && <button class="agc-wizard__actions-prev" data-i18n="actions.prev" onClick={this.nextPrev.bind(this, -1)}>🠔 Back</button>}
                            <button class="agc-wizard__actions-next" data-i18n="actions.finish" onClick={this.nextPrev.bind(this, this.mode === 'step' ? 1 : 3)}>Calculate 🠖</button>
                        </div>
                    </section>
                    <section data-wizard-results>                        
                        <slot name="results"></slot>                     
                    </section>
                </form>
            </div>
        );
    }

    showTab(n) {
        // This function will display the specified section of the form... 
        if (this.mode === 'step') {       
            this.cache['sections'][n].style.display = "block";
        }

        if (this.socket) {
            this.agcStepChanged.emit({socket: this.socket, tract: this.tract, step: this.currentStep})
        }
    }

    reset() {
        this.currentStep = 0
        this.submitted = false
        this.showTab(0)
    }

    validateForm () {
        let valid = true;

        if (this.currentStep === 0 || this.mode === 'full') {
            if (!validate(this.form, 'implementWidth')) {
                valid = false
            }
        }

        if (this.currentStep === 1 || this.mode === 'full') {
            if (!validate(this.form, 'workingSpeed')) {
                valid = false
            }
        }

        if (this.currentStep === 2 || this.mode === 'full') {
            if (!validate(this.form, 'fieldEfficiency')) {
                valid = false
            }
        }        

        return valid;
    }

    nextPrev(n, e) {
        e && e.preventDefault()
        if (this.mode === 'full') {
            if (!this.validateForm()) return false
        } else if (n == 1 && !this.validateForm()) return false

        // Hide the current tab:
        if (this.mode === 'step') {
            this.cache['sections'][this.currentStep].style.display = "none"
        }
        // Increase or decrease the current tab by 1:
        this.currentStep = this.currentStep + n
        // if you have reached the end of the form...
        if (this.currentStep >= this.cache['sections'].length) {
            // ... the form gets submitted:
            this.submitted = true
            this.showResults.call(this);
            return false;
        }
        // Otherwise, display the correct tab:
        this.showTab.call(this, this.currentStep);
    }

    showResults() {
        let implementWidth =  parseFloat((this.form.querySelector('[name="implementWidth"') as HTMLInputElement).value);        
        let workingSpeed =  parseFloat((this.form.querySelector('[name="workingSpeed"') as HTMLInputElement).value);        
        let fieldEfficiency =  round(parseFloat((this.form.querySelector('[name="fieldEfficiency"') as HTMLInputElement).value) / 100, 2);        
        let fieldEfficiencyPercent = round(fieldEfficiency * 100, 0)

        // The factor is calculated by taking 43560 sq. feed divided by 5280 feet per mile
        let factor = round(43560 / 5280, 2)

        let fieldCapacityPerHour = round((workingSpeed * implementWidth * fieldEfficiency) / factor, 2);

        let fieldCapacity= round(fieldCapacityPerHour * 10, 2);

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
        }

        if (this.socket) {
            this.agcCalculated.emit({socket: this.socket, tract: this.tract, results: {...results}})
        }

        this.results = {...results}
        
        this.cache['results'].forEach(result => {
            result.style.display = 'block'
        })
    }

    handleAction(e:CustomEvent) {
        if (e.detail['action'] === 'reset') {
            this.reset();
        }
    }

    componentDidLoad() {
        var sections = Array.from(this.form.querySelectorAll('[data-wizard-section]')).map(c => c as any).map(c => c as HTMLElement)
        var results = Array.from(this.form.querySelectorAll('[data-wizard-results]')).map(c => c as any).map(c => c as HTMLElement)
        this.cache = {...this.cache, sections: sections, results: results}

        window.document.addEventListener('agcAction', this.handleAction.bind(this));

        (this.form.querySelector('[name="fieldEfficiency"') as HTMLInputElement).value = "83"

        this.showTab(0)
    }

    componentDidUnload() {
        window.document.removeEventListener('agcAction', this.handleAction);
    }
}