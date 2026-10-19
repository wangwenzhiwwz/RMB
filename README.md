# 人民币金额大写转换器

在线使用：<https://rmb.wwz.im/>

将数字金额快速转换为人民币大写，适合填写报销单、付款申请及财务单据。

## 功能

- 输入金额后自动转换，无需点击转换按钮。
- 支持从剪贴板粘贴小写金额，并一键复制转换结果。
- 固定显示“圆、角、分”，不追加“整”字。
- 按数字位逐位保留大写数字和对应单位，包括零位；例如 `3010.01` 转换为 `叁仟零佰壹拾零圆零角壹分`。
- 最多支持 16 位整数和 2 位小数。
- 支持清空输入，并对无效金额给出提示。
- 金额在浏览器本地处理，不会上传到服务器。

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- lucide-react

## 本地运行

需要安装 Node.js 和 npm。

```bash
npm install
npm run dev
```

开发服务器启动后，按终端提示打开本地地址。

## 构建与检查

```bash
npm run build
npm run lint
npm run preview
```

- `npm run build`：构建生产版本，输出到 `dist/`。
- `npm run lint`：运行 ESLint 检查。
- `npm run preview`：本地预览构建结果。

## 项目结构

```text
RMB/
├── src/
│   ├── components/       # 输入组件
│   ├── utils/            # 金额转换逻辑
│   ├── App.tsx            # 页面与交互
│   ├── index.css          # 全局样式
│   └── main.tsx           # 应用入口
├── index.html             # HTML 入口与 SEO 信息
├── package.json           # 依赖与命令
├── package-lock.json      # 依赖锁定文件
├── vite.config.ts         # Vite 配置
└── README.md              # 项目说明
```

## 转换规则说明

本项目采用逐位输出规则，零也保留对应位的单位，与常见省略零位的人民币财务大写格式不同。请根据实际单据或使用场景确认该格式是否符合要求。
