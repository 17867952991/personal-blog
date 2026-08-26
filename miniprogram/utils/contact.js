"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyContact = copyContact;
function copyContact(value, api, notify) {
    api.setClipboardData({
        data: value,
        success: () => notify("已复制到剪贴板")
    });
}
