Component({
  methods: {
    navigate(event: WechatMiniprogram.TouchEvent) {
      this.triggerEvent("navigate", { target: event.currentTarget.dataset.target });
    }
  }
});
