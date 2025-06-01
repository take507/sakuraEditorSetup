function main(t) {
	t = t.replace(/\r\n/mg, "\n");
	t = t.replace(/\n[ ]*/mg, "\t");
	t = t.replace(/[ ]*:[ ]*/mg, "\t:\t");
	t = t.replace(/"/mg, "\t\"\t");
	t = t.replace(/,/mg, "\t,\t");
	t = t.replace(/{/mg, "\t{\t");
	t = t.replace(/}/mg, "\t}\t");
	t = t.replace(/\[/mg, "\t[\t");
	t = t.replace(/]/mg,"\t]\t");

	var ary = t.split("\t");
	var r = "";
	var inStr = false;

	// 改行処理
	for(var i=0;i<ary.length; i++) {
		var w = ary [i];
		if(w == "{" || w == "[") {
			r += "\n" + w + "\n";
		} else if (w == "}" || w == "]") {
			r += "\n" + w;
		} else if(w == ",") {
			r += "\n" + w;
		} else if(w == ":") {
			r += w;
		} else if(w == "\"") {
			inStr = !inStr;
			r += w;
		} else {
			r += w;
		}
	}

	// 空行は除去する
	r = r.replace(/[\n]+/mg, "\n");
	// 空配列は改行しない
	r = r.replace(/\n\[\n]+/mg, "[]");

	// インデント処理
	ary = r.split("\n");
	r = "";
	var idt = 0;
	for(var i=0;i<ary.length; i++) {
		var w = ary[i];
		if(w == "{" || w == "[") {
			r += "\n" + indent(idt) + w + "\n";
			idt ++;
		} else if(w.charAt(0) == "}" || w.charAt(0) == "]" ) {
			idt--;
			r += "\n" + indent(idt) + w + "\n";
		} else if(w == ",") {
			r += indent(idt) + w + "\n";
		} else {
			r += indent(idt) + w + "\n";
		}
	}

	// 空行は除去する
	r = r.replace(/[\n]+/mg, "\n");

	var data = new Array();
	ary = r.split("\n");
	r = "";

	var idtSpOld = "";
	for(var i=0;i<ary.length;i++) {
		var w = ary[i];
		var idtSpNow = w.match(/^[ ]*/g)[0];

		// 前回とスペースインデントの数が違う場合
		if(idtSpNow != idtSpOld) {
			var keyLen = 0;
			for(var j=0;j<data.length;j++) {
				var keyStr = data[j].match(/^[:]+:/g);
				if(keyStr != null && keyStr[0].length > keyLen) keyLen = keyStr[0].length;
			}
			for(var j=0;j<data. length;j++) {
				if(data[j].match(/^[^:]+:/g) != null) {
					var keyStr = data[j].match(/^[^:]+:/g)[0];
					r += keyStr.substring(0, keyStr.length-1);
					for(var k=0;k<keyLen-keyStr.length;k++) {
						r += " ";
					}
					r += " : " + data[j].substring(keyStr.length) + "\n";
				
				} else {
					r += data[j] + "\n";
				}
			}
			data = [];
		}
		data.push(w);
		idtSpOld = idtSpNow;
	}
	for(var j=0;j<data.length;j++) {
		r += data[j] + "\n";
	}
	
	// 先頭空行は除去
	r = r.replace(/^\n/mg, "");
	// 空行は除去
	r = r.replace(/[\n]+/mg, "\n");

	return r;
}

function indent(lv) {
	var w = "";
	for(var i=0;i<lv;i++) {
		w += " ";
	}
	return w;
}

if(!GetSelectedString(0).length ) SelectAll();
InsText (main(GetSelectedString(0)));
