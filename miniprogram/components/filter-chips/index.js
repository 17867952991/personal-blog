Component({
    properties: {
        filters: { type: Array, value: [] },
        active: { type: String, value: "全部" }
    },
    methods: {
        selectFilter(event) {
            this.triggerEvent("change", { filter: event.currentTarget.dataset.filter });
        }
    }
});
