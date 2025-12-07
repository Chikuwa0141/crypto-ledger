# Crypto Portfolio Tracker

仮想通貨（暗号資産）のポートフォリオを管理・可視化するためのWebアプリケーションです。
日々の取引を記録し、資産推移や構成比率を直感的なグラフで確認できます。

## 特徴

- **ポートフォリオ可視化**: 資産総額や通貨ごとの評価額の推移をインタラクティブなグラフで表示。ズームや範囲選択も可能です。
- **資産構成比率**: 現在のポートフォリオの構成比率（BTC vs ETHなど）を円グラフで確認できます。
- **詳細な損益表示**: 投資額に対する現在の評価額、損益（%）をリアルタイムで計算して表示します。
- **取引管理**: 購入データの追加、編集、削除が簡単に行えます。
- **0円取引対応**: ステーキング報酬やエアドロップなど、取得単価0円の取引も記録可能です。
- **CSVエクスポート**: 取引履歴をCSVファイルとしてダウンロードし、Excelなどで管理できます。

## 技術スタック

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Language**: Go
- **Framework**: [Echo](https://echo.labstack.com/)
- **ORM**: GORM
- **Database**: MySQL 8.0

### Infrastructure
- Docker & Docker Compose

## セットアップ手順

### 前提条件
- Docker および Docker Compose がインストールされていること

### 起動方法

1. リポジトリをクローンします。
   ```bash
   git clone <repository-url>
   cd crypto-ledger
   ```

2. Docker Composeを使ってアプリケーションを起動します。
   ```bash
   docker-compose up --build
   ```
   初回起動時はデータベースの初期化が行われるため、少し時間がかかる場合があります。

3. ブラウザで以下のURLにアクセスします。
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8080](http://localhost:8080)

## 使い方

1. **取引の追加**: ダッシュボードのフォームから、通貨、日付、数量、購入単価を入力して「取引を追加」ボタンを押します。ステーキング報酬の場合は「無料で受け取る」にチェックを入れます。
2. **履歴の確認**: 追加した取引は下部のリストに表示されます。
3. **編集・削除**: リストのアイコンから取引の修正や削除が可能です。
4. **分析**: 画面上部のサマリーやグラフで、現在の資産状況を確認します。

## 開発

このプロジェクトは **Antigravity (gemini3pro high)** を使用して開発されました。
