function showLineNums(container, name) {
	var tas = container.getElementsByTagName('textarea');
	var ta;
	for (var i = 0; i < tas.length; i++) {
		if (tas[i].name == name) {
			ta = tas[i];
			break;
		}
	}
	if (!ta)
		return;

	var el = document.createElement('TEXTAREA');
	var string = '';
	for (var no = 1; no <= 9999; no++) {
		if (string.length > 0)
			string += "\n";
		string += no;
	}
	el.disabled = true;
	el.className = ta.className;
	el.style.fontFamily = 'monospace';
	el.style.width = '40px';
	if (ta.style.height != null)
		el.style.height = ta.style.height;
	else
		el.style.height = '100%';
	el.style.resize = 'none';
	el.style.overflow = 'hidden';
	el.style.textAlign = 'right';
	el.style.display = 'inline';
	el.innerHTML = string;
	ta.style.margin = null;
	ta.style.width = (parseInt(ta.style.width) - 45) + 'px';
	ta.style.overflowX = 'hidden';
	ta.style.display = 'inline';
	ta.style.fontFamily = 'monospace';
	ta.parentNode.insertBefore(el, ta);
	setLine();

	ta.onkeydown = setLine;
	ta.onmousedown = setLine;
	ta.onscroll = setLine;
	ta.onblur = setLine;
	ta.onfocus = setLine;
	ta.onmouseover = setLine;
	ta.onmouseup = setLine;

	function setLine() {
		el.scrollTop = ta.scrollTop;
	}
}

function setMonospace(container, name) {
	var tas = container.getElementsByTagName('textarea');
	var ta;
	for (var i = 0; i < tas.length; i++) {
		if (tas[i].name == name) {
			ta = tas[i];
			break;
		}
	}
	if (!ta)
		return;

	ta.style.fontFamily = 'monospace';
}

function placeCaretAtEnd(el) {
	el.focus();
	if (typeof window.getSelection != "undefined"
			&& typeof document.createRange != "undefined") {
		var range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (typeof document.body.createTextRange != "undefined") {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText(el);
		textRange.collapse(false);
		textRange.select();
	}
}

function getCookie(name) {
	var matches = document.cookie
			.match(new RegExp("(?:^|; )"
					+ name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')
					+ "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
	options = options || {};

	var expires = options.expires;

	if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires * 1000);
		expires = options.expires = d;
	}
	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString();
	}

	value = encodeURIComponent(value);

	var updatedCookie = name + "=" + value;

	for ( var propName in options) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true) {
			updatedCookie += "=" + propValue;
		}
	}

	document.cookie = updatedCookie;
}

function deleteCookie(name) {
	setCookie(name, "", {
		expires : -1
	})
}

function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
  var params = {};
  var prmarr = prmstr.split("&");
  for ( var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
  }
  return params;
}