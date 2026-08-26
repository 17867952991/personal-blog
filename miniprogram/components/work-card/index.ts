Component({
  properties: {
    work: { type: Object, value: null }
  },

  methods: {
    selectWork() {
      const work = this.properties.work as { id: string } | null;

      if (work) {
        this.triggerEvent("select", { id: work.id });
      }
    }
  }
});
