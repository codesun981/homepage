# 🎉 Homepage

我的个人数字小屋 — 新域名庆祝站。

## 部署

Cloudflare Pages → 连接本仓库 → 绑定域名。纯静态，零构建。

## 本地预览

```bash
cd /path/to/homepage
python3 -m http.server 8000
# 打开 http://localhost:8000
```

## 改域名

编辑 `js/config.js`，把 `yourdomain.com` 换成真实域名。

## 留言板

用 [utterances](https://utteranc.es)（GitHub Issues 驱动）。首次使用需要在 utterances 安装 GitHub App 并授权本仓库。
