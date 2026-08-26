Component({
    methods: {
        navigate(event) {
            this.triggerEvent("navigate", { target: event.currentTarget.dataset.target });
        }
    }
});
