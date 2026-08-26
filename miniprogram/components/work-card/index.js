Component({
    properties: {
        work: { type: Object, value: null }
    },
    methods: {
        selectWork() {
            const work = this.properties.work;
            if (work) {
                this.triggerEvent("select", { id: work.id });
            }
        }
    }
});
