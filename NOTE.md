# メモ

Cloudflare Pages にデプロイする想定。

## メタデータの記述

サイト名、著者名などは `content/meta.json` にキー・値のペアとして記述する。

記述したキー・値は `runtimeConfig.public` のキー・値として利用できる。

`meta.json` と `runtimeConfig.public` でキーが競合する場合は、`meta.json` 側の値が優先される。

`runtimeConfig.public` にデフォルト値を記述しておくとよい。

## コンテンツの記述

[NOTE-content](./NOTE-content.md) を参照。

## Cloudflare Pages の設定

ダッシュボードの Environment variables で以下のように環境変数を構成する：

```ts
type Env = {
  // Cloudflare Web Analytics のトークン
  NUXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN?: string;
  // リンクプレビューの生成に使用するURL
  NUXT_SUMMALY_PROXY_URL?: string;
  // 画像やメディアファイルの読み込み元のオリジン
  NUXT_IMG_AND_MEDIA_SRC?: string[];
};
```

JSON文字列に変換して登録する。（文字列の両端の二重引用符は不要）

デプロイ時に上書きされないように Encrypt する。
