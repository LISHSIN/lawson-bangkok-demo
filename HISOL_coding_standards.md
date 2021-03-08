# GM/MPC コーディング規約 (2017/06/28版)

# 目標
- コーディングスタイルを統一する事により可読性を向上させ、生産性および保守性の向上を図る。
- 品質上の問題が発生しやすいコーディングを排除し、品質の向上を図る。

# 適用範囲
開発プロジェクトで作成する全てのTypeScriptソースコードを対象とする。

# 本規約の前提
- TypeScript 2.6 を対象とする。
- 対象のブラウザ種類およびそのバージョンは特に限定しない。
- 本規約でのクラスとはTypeScriptのclassステートメントにて作成した定義を指し、JavaScriptのfunctionステートメントにて作成したクラスは指さない。

# ツール
静的解析ツールとしてtslintを利用する

## 導入方法
- tslintをグローバルにインストールする
  - npm install -g tslint
- tslintをVisual Studio Codeから利用するための拡張機能をインストールする。事前にhttp.proxyを設定すること
  - code --install-extension eg2.tslint


# 命名規則
識別子は下記の規則で命名する。
項番	識別子	規則	例
- 名前空間	- すべて小文字の規定値	wm, wm.internal, samples
- クラス（※注１）	- 名詞 - アッパーキャメルケース（※注２）	Company, Employee
- インターフェース	- 名詞 - アッパーキャメルケース	Collection, List
- パブリックメソッド	- 動詞   - キャメルケース（※注３）	open(), getById(id), getByEnvelope(envelope)
- プロテクテッドメソッド	- 動詞 - キャメルケース	open(),onLoad()
- プライベートメソッド	- 動詞 - キャメルケースとし、さらに先頭にアンダースコアを記述	_open(), _onLoad()
- イベントリスナ - on + イベント名のアッパーキャメルケース	onLoad(), onClick()
- 変数	- 名詞または形容詞(boolean) - キャメルケース	color, visible, propertyCount
- 仮引数	- 名詞または形容詞(boolean) - キャメルケース	color, visible, propertyCount
- 定数名	- 名詞　- すべて大文字とし単語をアンダースコアで連結	MAX_PATH_LENGTH, AC_ADDRESS
- 文字定数値	- 名詞　- すべて小文字とし単語をハイフンで連結	top-left, double-click
- グローバル変数	使用禁止
- プロパティ- アクセサ	- 名詞または形容詞（boolean）- キャメルケース	width, height, visible, propertyCount
- パブリックメンバ変数	- キャメルケースを基本として任意(引数のオプション用のインターフェースでのみ使用可)	color, visible, showScaleBar
- プロテクテッドメンバ変数 	使用禁止。アクセサを利用する
- プライベートメンバ変数	- 名詞または形容詞(boolean)- キャメルケースとし、さらに先頭にアンダースコアを記述	_number, _propertyCount
- ローカル変数	- キャメルケースを基本として任意	number
- リテラル型	- 名詞 - アッパーキャメルケース	ResolutionType, PresetButtonType
- 列挙体（enum）	使用禁止。文字定数の型を利用する
（※注１）クラス、インターフェース、列挙体について、TypeScriptではスコープの指定は不可。常にパブリック。
（※注２）英単語を連結して複合語やフレーズを表記する際、各単語の先頭の文字を大文字で表記する手法。
（※注３）英単語を連結して複合語やフレーズを表記する際、各単語の先頭の文字を小文字で表記する手法。

## 共通規則
- 英単語を使用し、名称から意味を把握できるものとする。　　
  下記の例外を除き、単語は略さない。
  - 略語（単語）	例
  - App（Application）	AppContext
  - Alt（Altitude）	LonLatExpression{ lon:0, lat:0, alt:0 }
  - Config（Configuration）	MapConfig
  - Def（Definition）	PropertyDef
  - Lat（Latitude）	LonLatLabel
  - Lon	（Longitude）	LonLatLabel
  - Utils（Utilities）	CanvasTextUtils
  - Impl（Implementation）	FeatureCollectionImpl<br/>
    (インターフェースの単一実装に限る)
  - src (Source) srcPoint
  - dst (Destination) dstPoint
    (src,dst は両者がセットである場合に限る)
  - Px (Pixel)	meterPerPx<br/>

- 論理値を扱う識別子に否定語を使用しない。<br/>
 // 良い例<br/>
 ok;<br/>
 // 悪い例:否定語を使用<br/>
 notOK;<br/>

- 識別子に略語や頭字語を含める場合は、先頭のみを大文字のキャメルケースとする 。<br/>
// TODO いったん現状通りとし、開発してみて再検討
 // 良い例<br/>
 getHtml(), HtmlDocument<br/>
 // 悪い例:表記が混在<br/>
 getHtml(), HTMLDocument<br/>

## 名前空間
- 名前空間はすべて小文字の名詞を使用する。
- APIはwm, API用の引数オプションはwm.options, 内部処理用はwm.internalとする。
サンプルソースはsamplesとし、上記以外は使用しない

## 引数オプション
- 引数オプションは、コンストラクタの引数でのみ必要な場合に用意する。
- コンストラクタ以外のメソッドの引数は、インライン key - value 形式として、引数オプションは作成しない。（例）CanvasGraphics.drawCircle()

## 型エイリアス（Type alias）
- 以下のケースは、Type aliasの定義を検討する。
    - パラメータとして取り得る値を限定するとき。

      (記述例)

      export type PresetPointSymbol = "circle" | "square" | "diamond" | "triangle" | "cross" | "diagonal-cross" | "star";
    - StyleIdなど、文字列だが、特定の意味を持つ文字列であることを明示したい場合は、使用頻度により作成を検討する。
        - 型エイリアスとする例
            - CSSColor
            - ContainerId
            - EngineContainerId
            - EngineNodeId
            - FeatureId
            - SrsId
        - 型エイリアスとしない例
            - GM/Server側のスタイル/ラベリングのIDは、stringのままとする。（EngineLabelingStyleIDとか、いちいち作らない）
- 判断がつかない場合は、設計レビューにて決める。
- 他の類似型を確認して、一部のみ型エイリアスにならないよう注意する。

## インターフェース
- インターフェースは、アッパーキャメルケースを用いて名詞で命名する。先頭にIは付与しない。<br/>
 //コレクション階層インターフェース<br/>
 Collection<br/>

## クラス
- クラスは、アッパーキャメルケースを用いて名詞で命名する。
- そのクラスが継承クラスである場合は、親クラスがわかりやすいように命名する。<br/>
// 親クラス<br/>
ButtonEventHandler<br/>
//子クラス<br/>
OKButtonEventHandler<br/>

## プロパティ、アクセサ、メンバ変数
- プロパティやアクセサは、キャメルケースを用いて名詞または形容詞で命名する。
- グローバル変数は使用禁止とする。
- パブリックやプロテクテッドメンバ変数は使用禁止とし、代替としてアクセサを公開する。
- プライベートのメンバの場合は、先頭にアンダースコアを記述する。アクセサとの重複を避けるため。

以下に詳細な命名規則を示す。
  - 論理値を管理するプロパティには、接頭語に「is」「has」「can」「should」を記述しない。
動詞も基本的には使用しないが、引数のオプション用のインターフェースの属性名称は例外的に使用可能とする。
  - オブジェクトの数を管理するプロパティには接尾語に「count」を記述する。<br/>
// 良い例<br/>
visible, length, propertyCount;<br/>
MapViewOptions.showScaleBar;<br/>
// 悪い例:<br/>
isVisible, doRecursive;<br/>

## メソッド
- メソッドは、キャメルケースを用いて動詞で命名する。
- プロテクテッドやプライベートの場合は、先頭にアンダースコアを記述する。

以下にメソッドの命名規則を示す。
  - 配列を返すメソッドは、メソッド名を複数形にする。
  - 論理型を返すメソッドには、接頭語に「is」、「has」、「can」、「should」を記述する。
  // TODO 具体例を見て考える。
  - 取得操作は接頭語に「get」 を、追加操作は接頭語に「add」を、削除操作は接頭語に「remove」を、一括削除操作は接頭語に「removeAll」を、記述する。
  - 非同期のメソッドは「async」を先頭につける。
  - 引数で条件を指定する場合、「byXXX」で引数の種別を表す。
条件の型が複数ある場合は、同一名称でのオーバーロードは行わず、型ごとに異なる名称を付与する。
  - 単一と複数の場合は、同一の名称で共用型の引数とする。
  - 引数でインデックス(int型)を指定する場合、接尾語に「At」を記述する
  - イベントなど、あるタイミングで実行されるメソッドには、接頭語に「on」を記述し、イベント名を付与する

## 変数
- 変数は、キャメルケースを用いて命名する。
- スコープの広さに合わせて命名する。一般にスコープの広さと変数名の長さは比例する。

## 予約語
JavaScriptの予約語には以下の3種類があるが、エラーや誤動作を起こす可能性があるため使用しないこと。
- 現バージョンでの予約キーワード
- 現バージョン以降で追加予定のキーワード
- 使用できない単語　（オブジェクトや関数として使用されているキーワードで、StringやparseIntなど）

参考までに、「Standard ECMA-262 ECMAScript(R) Language Specification 5.1 Edition」による予約キーワードと
追予定のキーワードを記述しておく。
- 予約キーワード<br/>
break
case
catch
continue
debugger
default
delete
do
else
finally
for
function
if
in
instanceof
new
return
switch
this
throw
try
typeof
var
void
while
with
- 追加予定のキーワード
  - strict mode<br/>
implements
interface
let
package
private
protected
public
static
yield
  - strict mode以外<br/>
class
const
enum
export
extends
import
super

## その他
- 定数はすべて大文字とし、単語間をアンダースコアで連結する。<br/>
 const MODE_WORD: string = '0';<br/>
 const MODE_WHITESPACE: number = 1;<br/>
 const MODE_COMMENT_BEGIN: number = 2;<br/>
 const MODE_COMMENT_END: number = 3;<br/>

- 列挙体は使用せず、リテラル型を利用する<br/>
 type ResolutionType = 1 | 2 | "auto";<br/>
 type PresetButtonType = "zoom-in" | "zoom-out" | "rotate-right" | "rotate-left" | "compass";<br/>

- for文で使用するループ変数名は、混乱のおそれがない場合、i, jでよいが、必要に応じて意味のある変数名を付ける。<br/>
for (let rowIndex = 0; rowIndex < 10; rowIndex++) {<br/>
    for (let columnIndex= 0; columnIndex< 15; columnIndex++) {<br/>
        ...<br/>
    }<br/>
}<br/>

# プログラム記述の規則
## TypeScriptソースファイル
TypeScriptソースファイル（TSファイル）は機能毎（共通用、個別画面用等）に分割を行うこと。

## ファイル構成
ソースファイルは下記の順番で記述する。
- ファイルヘッダコメント
- 名前空間宣言
- インポート宣言
- クラス、インタフェースの定義（複数の場合もあり）

- ファイルヘッダコメント
ヘッダコメントの記述内容は、下記とする。

/*
 COPYRIGHT (C) 2017, HITACHI SOLUTIONS, LTD. ALL RIGHTS RESERVED.
 Hitachi Solutions, Ltd. Confidential
 */


- クラスとインターフェース
  - クラスとインターフェースは、１つのファイル内に複数定義する場合がある。各クラスとインターフェースごとに、下記の順番で記述する。
  - 密接に関連するクラスは同一ファイルに記載する。ただし、肥大化した場合は分割する。
  - また下記の構成を機能単位（※○○取得処理、○○更新処理 など）でスコープ毎に分け、
  - 機能内で範囲の広いものから順番に記載する。（public → protected → private）

  - クラス、インタフェースの宣言
  - 列挙体の宣言
  - 定数の宣言
  - メンバ変数の宣言
  - コンストラクタ
  - アクセサ
  - メソッド

## アクセサとメソッド
### アクセサとメソッドの使い分け
- Getter<br/>
以下の条件を満たす値の取得処理はアクセサを使用する
  - 引数がない（条件等の指定がない）<br/>
 // よい例<br/>
 geometry = Feature.geometry;<br/>
 id = Feature.id;<br/>
 features = FeatureCollection.features;<br/>
 value = Point.x;<br/>
 // 引数で条件を指定<br/>
 value = Feature.getProperty (name);<br/>
 // 悪い例<br/>
 geom = Feature.getGeometry();<br/>
 id = Feature.getID();<br/>
 features = FeatureCollection.getFeatures();<br/>
 value = Point.getX();<br/>

- Setter<br/>
以下の条件を満たす値の設定処理はアクセサを使用する
  - 引数が対象の値の一つのみ
  - 戻り値を返さない<br/>
 // よい例<br/>
 Feature.geometry = geometry;<br/>
 FeatureCollection.features = features;<br/>
 // 引数で条件を指定<br/>
 Feature.setProperty(name, value);<br/>
 // 悪い例<br/>
 Feature.setGeometry(geometry);<br/>
 FeatureCollection.setFeatures(features);<br/>


- メソッド<br/>
その他の処理はメソッドを使用する
  - データ変換
  - オブジェクトの内部状態変更
  - 条件指定を伴う操作<br/>
 // よい例<br/>
 // 変更操作<br/>
 FeatureCollection.removeAll();<br/>
 FeatureCollection.addFeature(feature);<br/>
 // 変換操作<br/>
 Feature.toJSON();<br/>
 // 条件指定<br/>
 FeatureCollection.getFeautreById(id);<br/>

- 補足
  - アクセサはsetterとgetterでアクセスレベルを変えたり、@hiddenで片方だけ隠すことができないため、setterを隠す必要がある場合は、アクセサでなくメソッドを利用する
  - アクセサは親クラスのアクセサを呼び出せないため、共通処理はメソッドにまとめる

 // よい例<br/>
 get layer(): Layer {<br/>
  return layers;<br/>
 }<br/>
 /** @hidden 使用禁止 */<br/>
 protected setLayers(layer) {<br/>
   this._layer = layer;<br/>
 }<br/>

 get showing(): boolean {<br/>
   // 独自の処理<br/>
   ...<br/>
   // return super.showing; // コンパイルエラーになる<br/>
   return super.isShowing();<br/>
 } <br/>



## コメント記述の規則
プログラム中のコメントの記述規則を示す。

### 全般
TypeScriptには以下の2種類のコメントがある。
- インプリメンテーションコメント（implementation comment）<br/>
「/*」 ～ 「*/」で囲まれた部分、および「//」から行末までのコメントであり、
ある特定のコードの実装について記述する。
- ドキュメンテーションコメント（documentation comment）<br/>
typedocツールで検索できる、「/**」 ～ 「*/」で囲まれたものあり、コードの仕様などについて記述する。

 また、コメントを書くときの注意点を以下に示す。
- 日本語で記述する
- TypeDoc出力を考慮し、動詞のコメントはです- ます調で記述する。
- 文字コードはUTF-8を使用する。
- 改行コードはCRLFとする。
- 機種依存文字は使用しない。
- コードから自明な仕様については記述しない。
- 対象コードの処理の説明についてのみ記述する。
- コメントのネストは行わない。
- 箇条書きはMarkDown形式を使用する。
- 修正履歴はつけない。

### 記述スタイル
- インプリメンテーションコメント
  - ブロックコメント

複数行に渡り記述するコメントである。データ構造、アルゴリズムなどの説明に使用するものであり、
以下のように記述する。

「/* ～ */」でコメントを囲み、「/*」または「*/」を含まない行の先頭には「*」を付ける。
対象コードと同じインデントを付ける。<br/>
 /*<br/>
  \* レコードがなくなるまで、<br/>
  \* データ読込みを行います<br/>
  */<br/>
 for (counter = 0; counter < maxLoops; counter++) {<br/>
    rtn = readData(kind, data);<br/>
    if (rtn == -1) {<br/>
        ...<br/>
    } else {<br/>
        ...<br/>
    }<br/>
    ...<br/>
 }<br/>


  - 1行コメント
対象コードの１行前に記述するコメントである。1行全てをコメントとし、そのコードについての説明に
使用するものであり、以下のように記述する。<br/>
 //対象コードと同じインデントを付ける。<br/>
 if (condition) {<br/>
    /* XXXからデータ取得します */<br/>
    ...<br/>
 } else {<br/>
    ...<br/>
 }<br/>
 if (condition) {<br/>
    // XXXからデータ取得します<br/>
    ...<br/>
 } else {<br/>
    ...<br/>
 }<br/>

  - 後置コメント<br/>
対象とする行の後ろに記述し、それ以降、行末までをコメントとするものである。
後置コメントはフォーマッタがインデントに対応していないため、利用しない。


- ドキュメンテーションコメント<br/>
クラス、インターフェース、列挙体、定数、メンバ変数、コンストラクタ、メソッド
  の前に記述するコメントである。クラスの仕様を説明するために使用するもので、API記述方針で別途規定する。

- オーバーライドメソッド<br/>
オーバーライドについては、@inheritdocではなく@overrideを記載する "21_APIドキュメント記載方針" 参照
  ``` ts
          /** メソッドの説明 */
          // @override DataHolder
          public setData(key: string, value: Object | null): this {
              this._dataMap = internal.DataHolderUtils.setData(this._dataMap, key, value);
              return this;
          }
  ```

## ソースのフォーマット
- Visual Studio Codeの自動整形を活用する
保存時のフォーマットは必須とする。

- セミコロン
末尾には必ず「;」(セミコロン)を記述する。

- 空白行
次の場合には、空白行を１行入れる。
  - ソースファイルを構成する下記要素の間
    - ファイルヘッダコメント
    - 名前空間宣言
    - import 宣言
    - クラス／インタフェースの定義
  - メソッド間
  - メソッドの局所変数宣言と最初の文との間
  - ブロックコメント、行コメントの前
  - メソッド内の論理的なブロックの間
  - ソースコードの見やすさ、その他、可読性向上のために必要な個所


- 宣言の記述
  - スコープの明示
   クラス内に定義するメソッドや変数のスコープは下記の通りに必ず記載する。
    - パブリック<br/>
 public getShopName(): string {
    ...
 }

    - プロテクテッド<br/>
protected _getShopName(): string {
    ...
}

    - プライベート   private _shopName: string = '';

 private _getShopName(): string {
    ...
 }


  - 変数宣言
    - １行に複数の変数を宣言しない。
    - 型推論を使いず、明示的に型を指定する 。ただし、プリミティブ型で初期化する場合は、省略してもよい。
    - let（※private） + " "（※半角スペース） + 変数名 + ": "（※コロン + 半角スペース） + 型名の形式とする。
    - var は使用しない。<br/>
 /* 良い例 */<br/>
 let level: number = 0;<br/>
 let size = 0;<br/>
 let name: string = '';<br/>
 let label = '';<br/>
 let total: number = 10;<br/>
 let layer: Layer = new ImageTileLayer();<br/>
 /* 悪い例 */<br/>
 let level: number, size;<br/>
 let layer = new ImageTileLayer();<br/>

    - オブジェクトリテラルの場合、型にはObjectではなくオブジェクト型リテラルを指定すること。
   ※Oject指定の場合、「shopData.shopId」のようなプロパティアクセスが出来ない（※shopData['shopId']は可）
     また、typeofでの型の複製も出来なくなる。<br/>
 /* 良い例 */<br/>
 let shopData: {shopId: string, shopName: string} = {shopId: '0001', shopName: '店舗０００１'};<br/>
 /* 悪い例 */<br/>
 var shopData = {shopId: '0001', shopName: '店舗０００１'};<br/>
 var shopData: Object = {shopId: '0001', shopName: '店舗０００１'};<br/>

  - 配列の宣言時は[]を使用するように統一する。<br/>
 /* 良い例 */<br/>
 var numAry: number[] = [10, 20, 30];<br/>
 /* 悪い例 */<br/>
 var numAry: Array<number> = [10, 20, 30];<br/>

  - 同一名称変数の宣言禁止<br/>
グローバル変数、クラス変数、メソッド引数、メソッド内ローカル変数などの
  変数スコープや宣言箇所の違いに関わらず、同じ変数名は使用しないこと。
 private count: number = 0;<br/>
 ...<br/>
 public myMethod() {<br/>
    ...<br/>
    if (bar > 10) {<br/>
         // 悪い例<br/>
        let count: number = 0;<br/>
        ...<br/>
    }<br/>
    ...<br/>
 }<br/>

  - メソッド宣言順序
    - メソッドは機能ごとに、「public」→「protected」→「private」の順に記述する。
   （ソースコードの理解のしやすさを重視するため、機能単位でまとめる。）

  - 区切り位置
  - 全般
    - １行に２文以上を記述しない。<br/>
 /* 良い例 */<br/>
 count = 0;<br/>
 flag = 0;<br/>
 /* 悪い例 */<br/>
 count = 0; flag = 0;<br/>

      - if文, for文,while文などの内容が１行だけでも”{”,　”}”を付ける。<br/>
/* 良い例 */<br/>
if (condition) {<br/>
    value = '';<br/>
}<br/>
/* 悪い例 */<br/>
if (condition) value = '';<br/>

    - for文,while文などで処理ブロック内に文がない場合でも”{” + 改行 + ”}”を記述し、コメントを記載する。<br/>
for (initialization; condition; update) {<br/>
    // 文がない理由<br/>
};<br/>

  - if文
    - 複合条件文(「&&」や「||」など)を使用する場合はカッコを付けて見やすくする。<br/>
// 通常のif文<br/>
if (...) {<br/>
...<br/>
}<br/>
// 分岐するif文<br/>
if (...) {<br/>
...<br/>
} else {<br/>
...<br/>
}<br/>
// else ifの例<br/>
if (...) {<br/>
    ...<br/>
} else if (...) {<br/>
    ...<br/>
}<br/>
// 複合条件のif文<br/>
if ((hour1 == hour2) && (minute1 == minute2)) {<br/>
...<br/>
}<br/>

  - for文<br/>
  for文は以下の形式に従う。<br/>
/* 通常（良い例） */<br/>
for (initialization; condition; update) {<br/>
    ...<br/>
}<br/>
/* 処理ブロックが空の場合（良い例） */<br/>
for (initialization; condition; update) {<br/>
    // 処理がない理由<br/>
}<br/>


  - while文<br/>
  while文は以下の形式に従う。<br/>
/* 通常 */<br/>
while (condition) {<br/>
    ...<br/>
}<br/>
/* 処理ブロックが空の場合 */<br/>
while (condition) { <br/>
    // 処理がない理由<br/>
};<br/>

  - switch-case文<br/>
    switch-case文は以下の形式に従う。<br/>
    - 複数の値に対し同じ処理をする場合は「case ○:」の後に改行を入れ、「case △:」を続けて記載する。
   ※「case ○, △:」の書き方はコンパイルは通るが、
     ○のパターンが正しく判定されない為、そのような書き方はしないこと。
    - ”break”の記述漏れに注意する。記述しない場合は、その場所にコメントで説明する。
    - ”default:”も必ず記述する。到達しない場合は、例外を発行する。<br/>
switch (condition) {<br/>
    case KIND_A:<br/>
        ...<br/>
        /* breakせずに、KIND_Bの場合の処理も行います */<br/>
    case KIND_B:<br/>
        ...<br/>
        break;<br/>
    case KIND_C:<br/>
    case KIND_D:<br/>
        ...<br/>
        break;<br/>
    default: {<br/>
        throw new LogicError("Invalid condition:" + condition);<br/>
    }<br/>
}<br/>

- try-catch文<br/>
try-catch文は以下の形式に従う。<br/>
/* 例１ */<br/>
try {<br/>
    ...<br/>
} catch (e) {<br/>
    ...<br/>
}<br/>
/* 例２ */<br/>
try {<br/>
    ...<br/>
} catch (e) {<br/>
    ... <br/>
} finally {<br/>
    ...<br/>
}<br/>

  - return文<br/>
return文に括弧を使わない。（演算式を書く場合は例外）<br/>
/* 良い例 */<br/>
return 0;<br/>
/* 悪い例 */<br/>
return (0); <br/>
/* 演算結果を返す場合 */<br/>
return (count + point);<br/>

# コーディングレベルでの注意事項
TypeScriptソースをコーディングする際の、各種注意事項を示す。本章の注意事項は推奨事項である。

## 品質向上の為の注意事項
- クラス変数のカプセル化
クラス変数はprivateで宣言し、クラス外からアクセスさせたい場合は、get、setを行うメソッドを用意する。

- カウンタ変数の用法
カウンタ変数は原則増分１のシンプルな使い方とし、飛び増、減数カウンタ等、ロジックを理解し難いものは
  使用しない。
カウンタ変数は使用するスコープ内で定義し、スコープ外での使用を不可とするコーディングとすること。

- 判定文
判定文には極力否定型を使用しないこと。２つ以上の否定型を使用してはならない。

- do-while文
do-while文は使用禁止とする。
※ループの記載方法のパターンを減らし、コードの統一性を図る為。

- 文字コード
文字コードはtsファイルとhtmlファイルで統一し、基本的にはUTF-8を使用する。

- evalの使用不可<br/>
eval関数は、引数に指定する文字列コードの静的型チェックが出来ない。
また、Microsoft Ajax Minifierで正しく圧縮できないため使用しない。<br/>
JSON文字列の評価にはJSON.parse()を使用する。

- 文字列の定義
文字列定義時には、'(シングルクォート)ではなく"(ダブルクォート)を使用する。<br/>
// 良い例<br/>
var myString: string = "Hitachi,Ltd.";<br/>
// 悪い例<br/>
var myString: string = 'Hitachi,Ltd.';<br/>

- インスタンス破棄
メモリを多く占有するインスタンスについては、変数を使用しなくなるタイミングでnullに設定する事を検討する。
ただし、メソッドの最後に、メソッド内ローカル変数に対して上記の考慮行う必要は無い。
※メソッドが終了し、変数のスコープが外れると自動的にガベージコレクタのインスタンス破棄対象となる為。

- 比較演算子
比較演算子には通常演算子ではなく、厳密演算子を使用する。
  - 比較内容	通常演算子	厳密演算子
  - 等価	等価演算子（==）	厳密等価演算子（===）
  - 不等価	不等価演算子（!=）	厳密不等価演算子（!==）<br/>
// 良い例<br/>
if ('' === shopName) {  <br/>
	...<br/>
} else {<br/>
...<br/>
}<br/>
if (0 !== shopCount) {<br/>
	...<br/>
} else {<br/>
...<br/>
} <br/>
// 悪い例<br/>
if ([1,2,3] == [1,2,3]) {<br/>
	...<br/>
} else {<br/>
...<br/>
}<br/>
if (1 != valid) {<br/>
	...<br/>
} else {<br/>
...<br/>
}<br/>
<br/>
同様の理由で||に演算子による代入も使用しない。

// 良い例<br/>
value = (param !== undefined) ? param : value;<br/>
// 悪い例<br/>
value = param || defaultValue;<br/>

通常の演算子は比較対象の型が異なる場合、下記のように自動的に型変換が実施された後に
比較される。そのため、本来の等価、不等価とは意図しない結果になる場合がある。
＜通常演算子の自動型変換＞
- 数値と文字列を比較するとき、文字列は数値に変換
- boolean型ならtrue⇒1、false⇒0に変換<br/>
// 数値とブール値<br/>
alert(1 == true);    // true<br/>
alert(0 == false);   // true<br/>
alert(1 === true);   // false<br/>
alert(0 === false);  // false<br/>
// 数値と文字列<br/>
var a = 10;<br/>
var b = "10";<br/>
alert(a == b);     // true<br/>
alert(a === b);    // false<br/>
// オブジェクト<br/>
var a = [1,2,3];<br/>
var b = a;<br/>
alert(a == b);       // true<br/>
alert(a == [1,2,3]); // false<br/>
// 文字列とStringオブジェクト<br/>
var a = "abc";<br/>
var b = new String("abc");<br/>
alert(a == b);             // true<br/>
alert(a === b);            // false<br/>
alert(a === b.toString()); // true<br/>
<br/>

- 意図しない自動型変換で、誤った判定処理を行わないよう、if文などの判定文では比較対象の値を明記する (省略形を使わない)

    ■例1
    ```
      let myBoolValue = true;

      // OK
      if (myBoolValue === true) {
      }

      // NG
      if (myBoolValue) {
      }
    ```
    ■例2
    ```
      let myNullValue = null;

      // OK
      if (myNullValue !== null) {
      }

      // NG
      if (myNullValue) {
      }
    ```
    ■例3
    ```
      let myUndefinedValue = undefined;

      // OK
      if (myUndefinedValue !== undefined) {
      }

      // NG
      if (myUndefinedValue) {
      }
    ```



  - 最終要素の後のカンマの記述<br/>
オブジェクトリテラル、配列リテラル、列挙体などの最終要素の後に「,」(カンマ)を記述する。<br/>
// 良い例<br/>
var Color = {<br/>
    RED:   0,<br/>
    GREEN: 1,<br/>
    BLUE:  2,<br/>
};<br/>

  - try-catch文は使用箇所を厳選する<br/>
Scriptエラー時の調査が難しくなるため、try-catch文はエラー発生時の後処理がどうしても必要な箇所で
使用する。
またエラーをキャッチし処理を継続する場合は、エラー情報の再スローやエラーログ出力など確認できる手段の
実装を検討すること。

  - 暗黙のany型の使用禁止<br/>
暗黙のany型は使用禁止とする。<br/>
※コンパイルオプション「--noImplicitAny」を指定してコンパイルできるソースを記述すること。

  - any型は極力使用しない<br/>
any型は極力使用を避け、ジェネリクスやインターフェースの拡張を使用する。

  - classベースでのコーディング<br/>
classベースでコーディングを行い、typescriptでのprototypeへの設定は行わないこと。
※コンパイラの静的型チェックを行える範囲を広げる為。

  - 可能な限り不変にする<br/>
明確な必要性がない場合、readonlyキーワードやObject.freeze()等を利用して、不変オブジェクトにする。

// TODO


  - マジックナンバーは避ける（tslintからは除外）<br/>
マジックナンバーは可能な限り避け、適切な名称の定数や変数を作成する。

  - tslintの警告は無視しない<br/>
tslintの警告は基本的にすべて対応する。真にやむを得ない場合に限り、Disabledを使用して抑止する。

  - 配列かどうかの判定は Array.isArray()を使用する

  - 配列の中に複数の型のデータを混在させない<br/>
  配列の並び替え(sort関数)処理がブラウザによって異なることがあるため、1つの配列の中に複数の型のデータを混在させたり、並び替え結果に依存するような処理を実装しない。

## 性能向上のための注意事項
- 無駄にnewしない
オブジェクトのnew は日常必要なことであるが、コストも高いため、極力回数を減らすように意識する。
但し、その為に変数のスコープを拡大して使いまわすなど、保守性の低下に繋がることは避ける。

## 戻り値に関する注意事項
- 内部に保持しているオブジェクトをそのまま返却しない
参照型のメンバを直接返却すると、呼び出し元が戻り値を変更することで、メンバのデータが変化してしまう場合がある。そのため、Featureから取得するプロパティは、基本的にコピーを生成して返却する。<br/>
パフォーマンス上の問題で直接返却せざるを得ない場合は、変更不可であることをAPIドキュメントに明記し、可能な場合はReadonlyArray等の不変インターフェースを利用する。ただし、その場合、JavaScriptやキャストを利用されると変更できてしまうことを考慮に入れる。


## 引数に関する注意事項
- 引数を変更しない<br/>
各メソッドにおいて参照型の引数に対して直接内容の変更を行うと、メソッドの呼び出し元が意識していないところで引数として与えた変数の値が変化してしまう場合があるため、基本的に変更しない。

- 引数をそのまま格納しない<br/>
参照型の引数をそのまま格納すると、呼び出し元が引数の内容を変更することで、メンバのデータが変化してしまう場合があるため、引数が不変オブジェクトでない場合、Featureから取得するプロパティはコピーを生成して格納する。
パフォーマンス上の問題で直接格納せざるを得ない場合は、呼び出し後の変更が不可であることをAPIドキュメントに明記する。

- 引数の前提条件チェックを行う<br/>
値の範囲や内容について、チェックを行う。
ただし、膨大な回数呼ばれ、パフォーマンスに悪影響を与える場合は例外的にチェック処理を回避可能とする。
// TODO デバッグオプション等は共通処理作成時に考える


# 単語集
TypeScriptソースをコーディングする際の、単語について記載する
  - 個数を扱う場合、単数形+Countを使用する。Lengthは長さ、Sizeは大きさ
  - 透明度はweb標準に合わせて、opacity（不透明度）を使用する。
ただし、Canvas描画APIはCanvas APIに合わせてalpha(透明度)を使用する。
  - 動作方式にはTypeを、表示形状に関してはStyleを使用する。




以上
