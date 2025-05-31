// sakuraエディタ用マクロ
// xmlフォーマット

// エディタで文字列が選択されていない場合、すべて選択する
if(!IsTextSelected())SelectAll();
InsText(								// 4.変換処理結果をエディタに貼り付け
	main(								// 3.変換処理を呼び出す
		GetSelectedString()				// 1.エディタで選択されている文字列取得
			.replace(/\r\n/g, "\n")		// 2.改行コードを\nに統一する
			.replace(/\r/g, "\n")
	)
);

function getIndexSpace(indent) {
	var s = "";
	for(var j=0;j<indent;j++) {
		s += "  ";
	}
	return s;
}

function main(s) {

	var indent = 0;
	var r = "";
	var beforeTag = "";

	// "<"毎に文字列分解する
	var ary = s.replace(/\n/g, "")
				.replace(/</g, "\n<")
				.split("\n");

	// 一行毎に繰り返し処理
	for(var i=0;i<ary.length; i++) {
		var line = ary[i].replace(/[ ]+$/g, "");
		if(line.substring(line.length-2, line.length) == "/>") {
			r += "\n" + getIndexSpace(indent) + line;
			beforeTag = "";
		} else if(line.substring(0, 2) == "</") {
			indent = indent - 1;
			// 前回のタグ（開始タグ）が今回のタグ（終了タグ）と同じ場合
			if(beforeTag == line.replace(/^<\/([^>]+)>/g, "$1")) {
				// 前回と同じ行に出力する
				r += line;
			} else {
				r += "\n" + getIndexSpace(indent) + line;
			}
			beforeTag = line;
		} else if(line.substring(0, 1) == "<") {
			r += "\n" + getIndexSpace(indent) + line;
			indent = indent + 1;
			beforeTag = line.replace(/^<([^ ]+) .*/g, "$1");
		}
	}
	// 先頭の改行を除去し末尾に改行を付与
	return r.replace(/^[\n]*/, "") + "\n";
}
