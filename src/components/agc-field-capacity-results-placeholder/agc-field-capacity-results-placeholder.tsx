
import { Component } from '@stencil/core';


@Component({
    tag: 'agc-field-capacity-results-placeholder'
})
export class AgcFieldCapacityResultsPlaceholder {

    

    render() {
        const placeholder = () => <span><i class="mark"></i> <i class="mark"></i> <i class="mark"></i> <i class="mark"></i></span>

        return (
            <section>
                <ul class="agc-results-placeholder">
                    <li>
                        <h2 data-i18n="results.field-capacity">Field Capacity</h2>
                        {placeholder()}
                    </li>
                    <li>
                        <h2 data-i18n="results.per-hour">Field Capacity per Hour</h2>
                        {placeholder()}
                    </li>                                      
                </ul>
            </section>
        );
    }
}