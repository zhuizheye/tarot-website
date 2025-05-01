# RWS 塔罗牌解说网站

一个全面的Rider-Waite-Smith（RWS）塔罗牌解读网站，提供78张塔罗牌的详细解读和多种牌阵分析。

## 功能特色

- 完整的78张RWS塔罗牌库，包含大阿卡那和小阿卡那
- 每张牌的详细解读，包括故事背景、象征意义、感情/事业/学业解读
- 正位和逆位的完整解释
- 单张随机抽牌功能
- 多种牌阵解读（单张、三张牌阵等）
- 响应式设计，适配各种设备
- 分类浏览所有塔罗牌
- "关于RWS塔罗牌"的详细介绍页面

## 技术栈

- 前端：原生HTML, CSS, JavaScript
- 动画：GSAP (GreenSock Animation Platform)
- 后端：Node.js, Express
- 数据：JSON文件存储

## 安装指南

1. 克隆仓库到本地

```bash
git clone https://github.com/yourusername/rws-tarot.git
cd rws-tarot
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 在浏览器中访问 `http://localhost:3000`

## 目录结构

```
├── package.json          # 项目配置文件
├── public/               # 静态资源目录
│   ├── css/              # CSS样式文件
│   ├── js/               # 客户端JavaScript文件
│   ├── images/           # 图片资源
│   │   └── tarot/        # 塔罗牌图片
│   ├── index.html        # 首页
│   ├── about.html        # 关于页面
│   ├── cards-list.html   # 塔罗牌列表页面
│   ├── readings.html     # 牌阵解读页面
│   ├── 404.html          # 404错误页面
│   └── cards/            # 单张塔罗牌详情页面
├── src/                  # 服务器端代码
│   ├── server.js         # 主服务器文件
│   ├── routes/           # 路由处理
│   ├── api/              # API处理逻辑
│   └── data/             # 数据文件
│       ├── cards.json    # 塔罗牌数据
│       └── interpretations.json # 塔罗牌解读数据
└── README.md             # 项目说明文档
```

## 部署

1. 构建生产版本

```bash
npm run build
```

2. 启动生产服务器

```bash
npm start
```

## 贡献指南

1. Fork这个仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个Pull Request

## 许可证

MIT

## 致谢

- Rider-Waite-Smith塔罗牌的创作者：Arthur Edward Waite和Pamela Colman Smith
- 所有为本项目提供塔罗牌解读和资源的贡献者 