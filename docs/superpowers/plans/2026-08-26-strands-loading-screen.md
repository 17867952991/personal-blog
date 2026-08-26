# Strands 首屏加载动画 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在个人作品集首次加载时展示一个 2.5 秒的 Strands 流光全屏加载页，并平滑显示现有主页。

**Architecture:** 新建 `Strands` 作为独立、可复用的 OGL/WebGL 光丝画布组件；新建 `LoadingScreen` 处理最短展示时长、页面加载完成状态、无障碍降级与退出过渡。`App` 只负责挂载该加载页，既有页面组件与数据不变。

**Tech Stack:** React 19、TypeScript、Vite 6、Tailwind CSS 4、OGL、Vitest、React Testing Library。

## Global Constraints

- 新增运行时依赖固定为 `ogl`，不引入额外的动画库。
- 加载页面的最短展示时长为 **2500ms**，退出过渡为 **500ms**。
- Strands 配色使用 `#D3A84C`、`#9B7BFF`、`#4AA7B8`。
- GitHub Pages 项目基路径保持为 `/personal-blog/`，所有静态资源继续经 `import.meta.env.BASE_URL` 生成。
- 设置 `prefers-reduced-motion: reduce` 时不创建 WebGL 画布，仅显示静态背景和文字过渡。
- 所有定时器、事件监听、`requestAnimationFrame` 与 WebGL 上下文都必须在组件卸载时释放。

---

## 文件结构

- **创建** `src/components/Strands.tsx`：封装 OGL renderer、着色器、响应式 resize 和资源释放。
- **创建** `src/components/Strands.css`：让 Strands 容器与 canvas 填满父容器。
- **创建** `src/components/LoadingScreen.tsx`：控制页面加载状态、2.5 秒时序、文案和淡出。
- **创建** `src/components/LoadingScreen.test.tsx`：验证加载页时序和减少动态效果时的降级行为。
- **修改** `src/App.tsx`：将 `LoadingScreen` 放在现有作品集布局前。
- **修改** `package.json`、`package-lock.json`：添加 `ogl` 依赖。

### Task 1: 安装并封装 Strands WebGL 组件

**Files:**
- Create: `src/components/Strands.tsx`
- Create: `src/components/Strands.css`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `Strands(props: StrandsProps): JSX.Element`。
- `StrandsProps`：`colors: string[]`、`count?: number`、`speed?: number`、`amplitude?: number`、`waviness?: number`、`thickness?: number`、`glow?: number`、`className?: string`。

- [ ] **Step 1: 安装渲染依赖**

```powershell
npm install ogl
```

Expected: `package.json` 的 `dependencies` 出现 `"ogl"`，并更新 `package-lock.json`。

- [ ] **Step 2: 创建光丝组件及最小顶点/片段着色器**

创建 `src/components/Strands.tsx`。组件使用 `useEffect` 初始化透明 OGL renderer；片段着色器接收 `uTime`、`uResolution`、`uColors`、`uStrandCount` 等 uniform，逐条绘制横向流动的光丝。实现必须采用以下清理逻辑：

```tsx
return () => {
  cancelAnimationFrame(animationFrame);
  window.removeEventListener("resize", resize);
  if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
  gl.getExtension("WEBGL_lose_context")?.loseContext();
};
```

- [ ] **Step 3: 创建组件样式**

创建 `src/components/Strands.css`：

```css
.strands-container { height: 100%; position: relative; width: 100%; }
.strands-container canvas { display: block; height: 100%; width: 100%; }
```

- [ ] **Step 4: 验证生产构建**

```powershell
npm run build
```

Expected: 命令以 `✓ built` 结束，且没有 TypeScript 错误。

- [ ] **Step 5: 提交 Strands 组件**

```powershell
git add package.json package-lock.json src/components/Strands.tsx src/components/Strands.css
git commit -m "feat: add Strands WebGL component"
```

### Task 2: 测试并实现加载状态机

**Files:**
- Create: `src/components/LoadingScreen.test.tsx`
- Create: `src/components/LoadingScreen.tsx`

**Interfaces:**
- Consumes: `Strands`，`window.load` 事件、`window.matchMedia`。
- Produces: `LoadingScreen(): JSX.Element | null`。
- 退出逻辑：页面处于 `loading`，当 `window.load` 与 2500ms 均完成后切换为 `exiting`；500ms 后从 DOM 移除。

- [ ] **Step 1: 写出加载时序的失败测试**

创建 `src/components/LoadingScreen.test.tsx`，使用 fake timers 测试：

```tsx
render(<LoadingScreen />);
expect(screen.getByText("LOADING······")).toBeInTheDocument();
fireEvent(window, new Event("load"));
act(() => vi.advanceTimersByTime(2499));
expect(screen.getByText("LOADING······")).toBeInTheDocument();
act(() => vi.advanceTimersByTime(1));
expect(screen.getByTestId("loading-screen")).toHaveAttribute("data-state", "exiting");
act(() => vi.advanceTimersByTime(500));
expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
```

另写一个测试：`matchMedia("(prefers-reduced-motion: reduce)")` 返回 `matches: true` 时，不渲染 `Strands` 容器。

- [ ] **Step 2: 运行测试，确认先失败**

```powershell
npx vitest run src/components/LoadingScreen.test.tsx
```

Expected: FAIL，原因是 `LoadingScreen` 尚未定义。

- [ ] **Step 3: 写出最小实现**

创建 `src/components/LoadingScreen.tsx`，使用：

```tsx
const MINIMUM_DURATION = 2500;
const EXIT_DURATION = 500;
const STRAND_COLORS = ["#D3A84C", "#9B7BFF", "#4AA7B8"];
```

根节点必须是：

```tsx
<section data-testid="loading-screen" data-state={phase} aria-live="polite">
  {!reduceMotion && <Strands colors={STRAND_COLORS} count={3} speed={0.48} amplitude={1.05} waviness={1.1} thickness={0.72} glow={2.4} />}
  <p>LOADING······</p>
</section>
```

容器使用 `fixed inset-0 z-[100]`、深靛黑背景、文字追踪和 `transition-opacity duration-500`。退出状态应用 `opacity-0 scale-[1.03] pointer-events-none`。

- [ ] **Step 4: 运行组件测试**

```powershell
npx vitest run src/components/LoadingScreen.test.tsx
```

Expected: PASS，至少包含时序测试与减少动态效果测试。

- [ ] **Step 5: 提交加载状态机**

```powershell
git add src/components/LoadingScreen.tsx src/components/LoadingScreen.test.tsx
git commit -m "feat: add timed loading screen"
```

### Task 3: 接入应用并完成回归验证

**Files:**
- Modify: `src/App.tsx`
- Test: `src/components/LoadingScreen.test.tsx`

**Interfaces:**
- Consumes: `LoadingScreen`。
- Produces: 现有 `App` 在任何页面内容之前渲染 `<LoadingScreen />`，不改变 `useHashScroll`、`Hero`、`WorksSection` 和 `ContactSection` 的调用方式。

- [ ] **Step 1: 在 App 中接入加载页**

```tsx
import { LoadingScreen } from "./components/LoadingScreen";

return (
  <>
    <LoadingScreen />
    <div className="min-h-screen bg-[#f7f7fb] text-[#1B133C]">{/* 保留现有页面内容 */}</div>
  </>
);
```

- [ ] **Step 2: 运行完整自动化测试**

```powershell
npm test
```

Expected: 所有现有测试与 `LoadingScreen.test.tsx` 均 PASS。

- [ ] **Step 3: 运行生产构建**

```powershell
npm run build
```

Expected: 命令以 `✓ built` 结束，`dist/index.html` 存在。

- [ ] **Step 4: 浏览器验收**

```powershell
npm run dev
```

Expected: 刷新本地页面后，先出现深色 Strands 动画与 `LOADING······`，约 2.5 秒后淡出；封面图片、哈希导航与作品弹窗均可继续使用。

- [ ] **Step 5: 提交集成改动**

```powershell
git add src/App.tsx
git commit -m "feat: show Strands animation while loading"
```

## 自检结果

- **规格覆盖：** Task 1 实现 OGL 流光和生命周期；Task 2 实现 2.5 秒、500ms、无障碍降级和时序测试；Task 3 接入首页并完成构建、测试及浏览器验收。
- **占位扫描：** 计划不含 TBD、TODO、模糊测试描述或未定义接口。
- **类型一致性：** `StrandsProps`、`LoadingScreen`、`MINIMUM_DURATION`、`EXIT_DURATION` 与后续调用保持一致。
