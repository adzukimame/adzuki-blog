# ブログサイトのコンテンツについて

## ディレクトリ構造

一般的な記事は `content/posts` に配置する。これらの記事は `/posts/<FILE_BASENAME>` のパスで利用可能になる。これらの記事はトップページやカテゴリページの記事リストに現れる。

その他の特別な記事は `content/pages` に配置する。これらの記事は `/pages/<FILE_BASENAME>` のパスで利用可能になる。これらの記事は記事リストに現れない。

## Markdownファイル

### 記事のメタデータ

[Front-matter](https://content.nuxt.com/usage/markdown#front-matter) も参照のこと。

|キー        |型          |説明       |
|------------|------------|-----------|
|`category`  |`string`    |記事のカテゴリ|
|`created`   |`string`    |記事の作成日（`YYYY-MM-DD` 形式）|

*すべてのメタデータはOptional*
