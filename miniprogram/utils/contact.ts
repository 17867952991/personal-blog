type ClipboardApi = {
  setClipboardData(options: { data: string; success?: () => void }): void;
};

export function copyContact(
  value: string,
  api: ClipboardApi,
  notify: (title: string) => void
): void {
  api.setClipboardData({
    data: value,
    success: () => notify("已复制到剪贴板")
  });
}
