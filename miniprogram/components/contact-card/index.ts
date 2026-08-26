Component({
  properties: {
    label: { type: String, value: "" },
    value: { type: String, value: "" }
  },

  methods: {
    copy() {
      this.triggerEvent("copy", { value: this.properties.value });
    }
  }
});
