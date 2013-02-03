// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";

    CodeMirror.defineMode("tcl", function() {
        function parseWords(str) {
            var obj = {},
                words = str.split(" ");
            for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
            return obj;
        }
        var keywords = parseWords("Tcl safe after append array auto_execok auto_import auto_load " +
            "auto_mkindex auto_mkindex_old auto_qualify auto_reset bgerror " +
            "binary break catch cd close concat continue dde eof encoding error " +
            "eval exec exit expr fblocked fconfigure fcopy file fileevent filename " +
            "filename flush for foreach format gets glob global history http if " +
            "incr info interp join lappend lindex linsert list llength load lrange " +
            "lreplace lsearch lset lsort memory msgcat namespace open package parray " +
            "pid pkg::create pkg_mkIndex proc puts pwd re_syntax read regex regexp " +
            "registry regsub rename resource return scan seek set socket source split " +
            "string subst switch tcl_endOfWord tcl_findLibrary tcl_startOfNextWord " +
            "tcl_wordBreakAfter tcl_startOfPreviousWord tcl_wordBreakBefore tcltest " +
            "tclvars tell time trace unknown unset update uplevel upvar variable " +
            "vwait clock if elseif else and not or eq ne in ni for foreach while switch dict");
        var nextArgIsVar = parseWords("set incr lappend foreach snmpget snmpwalk");
        var waitVarInBraces = parseWords("proc foreach");
        var isOperatorChar = /[+\-*&%=<>!?^\/\|]/;

        function chain(stream, state, f) {
            state.tokenize = f;
            return f(stream, state);
        }

        function tokenBase(stream, state) {
            if (stream.column() == stream.indentation()) {
                state.lastSpecChar = "";
                state.varInBraces = 0;
                state.bracesCnt = 0;
                state.global = 0;
                state.markVar = 0;                
            }

            var ch = stream.next();            

            //if (ch == "}") state.varInBraces = 0;
            if (state.varInBraces==1){
            	if (ch=="{") state.bracesCnt += 1
            	if (ch=="}") {
            		state.bracesCnt -= 1
            		if (state.bracesCnt==0) state.varInBraces=0
            	}
            }

            if (/[\[\]{}();]/.test(ch)) {
                state.lastSpecChar = ch;
                state.markVar = 0;
                return null;
            }

            if (state.varInBraces==1 && state.bracesCnt>0 && (/\D/.test(ch))) {
            	stream.eatWhile(/\w/);
//            	var brCnt=1
//            	var next
//            	while ((next = stream.next()) != null) {
//                    if (next=="{") brCnt=brCnt+1
//                    if (next=="}") brCnt=brCnt-1
//                    if (brCnt==0) {
//                    	stream.backUp(1)
//                    	break;
//                    }
//                }
                //if (!stream.skipTo('}')) stream.skipToEnd();
            	//if (!stream.skipTo('}')) stream.eatWhile(/\w/);
                //state.varInBraces = 0;
                return "variable";
            }


            /*if (ch == '"') {
                return chain(stream, state, tokenString(ch));
            }*/


            if (state.global == 1) {
                state.global = 0;
                if (!stream.skipTo(";")) stream.skipToEnd();
                return "variable";
            }

            if (state.markVar == 1) {
                state.markVar = 0;
                stream.eatWhile(/\w/);
                return "variable";
            }


            if (/\d/.test(ch)) {
                stream.eatWhile(/[\w\.]/);
                return "number";
            }

            if (ch == "#" && (stream.column() == stream.indentation() || state.lastSpecChar == ";")) {
                stream.skipToEnd();
                return "comment";
            }


            if (ch == "$") {
                stream.eatWhile(/\w/);
                return "variable";
            }


            if (isOperatorChar.test(ch)) {
                stream.eatWhile(isOperatorChar);
                return "operator";
            }

            stream.eatWhile(/\w/);
            var word = stream.current().toLowerCase();

            //if (word == "global") state.global = 1;

            //if (nextArgIsVar && nextArgIsVar.propertyIsEnumerable(word))
            //    state.markVar = 1;

            //if (waitVarInBraces && waitVarInBraces.propertyIsEnumerable(word))
            //    state.varInBraces = 1;

            if (keywords && keywords.propertyIsEnumerable(word))
                return "keyword";

            return null;
        }

        function tokenString(quote) {
            return function(stream, state) {
                var escaped = false,
                    next, end = false;
                while ((next = stream.next()) != null) {
                    if (next == quote && !escaped) {
                        end = true;
                        break;
                    }
                    escaped = !escaped && next == "\\";
                }
                if (end) state.tokenize = tokenBase;
                return "string";
            };
        }


        return {
            startState: function() {
                return {
                    tokenize: tokenBase
                };
            },
            token: function(stream, state) {
                if (stream.eatSpace()) return null;
                return state.tokenize(stream, state);
            },
            lineComment: '#'
        };
    });

    CodeMirror.defineMIME("text/x-tcl", "tcl");

});