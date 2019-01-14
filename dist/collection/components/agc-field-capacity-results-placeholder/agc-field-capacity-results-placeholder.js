export class AgcFieldCapacityResultsPlaceholder {
    render() {
        const placeholder = () => h("span", null,
            h("i", { class: "mark" }),
            " ",
            h("i", { class: "mark" }),
            " ",
            h("i", { class: "mark" }),
            " ",
            h("i", { class: "mark" }));
        return (h("section", null,
            h("ul", { class: "agc-results-placeholder" },
                h("li", null,
                    h("h2", { "data-i18n": "results.field-capacity" }, "Field Capacity"),
                    placeholder()),
                h("li", null,
                    h("h2", { "data-i18n": "results.per-hour" }, "Field Capacity per Hour"),
                    placeholder()))));
    }
    static get is() { return "agc-field-capacity-results-placeholder"; }
}
