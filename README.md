# dekoboko

「何者にでもなれるのだから、何者にかにならなければならない」という空気が充満しています。少しでも何者かになれる器量のある人はインターネットの力を使い、Githubに登録したり、ハッカソンに通ったり、オンライン講座に参加したりすることで所謂スキルを身に着け、何者かになることができる。とてもいい社会だと思います。しかし世の中には完全な意味で何者でもない、まだ何の器量も持ってない上でこの空気にさらされ、苦しめられている人がいます。あるいは、何者かになれる器量はあるのだけど、そのカテゴリーが決してITエンジニアになるためのものではない人がいます。そういう人たちが気軽に参加できて、日々自分の成長のアーカイブを残し、Githubやハッカソン、オンライン講座がカバーしているよりももっと広いベン図にある社会的価値を付与できる、そんなアプリを創りたいと考えています。

## 開発手順

### 1. リポジトリをクローンする

```bash
git clone https://github.com/takeruhukushima/dekoboko.git
```

### 2. ブランチを作成する

```bash
git checkout -b feature/{branch_name}
```

### 3. 開発を行う

必要な環境変数を設定

```
DB_NAME=
DB_USER=
DB_PASS=

DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@db:5432/postgres?schema=public
COOKIE_SECRET=
```

Docker コンテナを起動

```bash
npm install
docker-compose up
```


## ライセンス

`dekoboko`は [Apache License 2.0](LICENSE)
のもとで提供されています。
## お問い合わせ
ご質問やフィードバックは以下で受け付けています：

- GitHub Issues: https://github.com/takeruhukushima/dekoboko/issues