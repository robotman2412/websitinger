
// vv GR8CPU Rev2.1 HIGHLIGHTING vv //
ace.define("ace/mode/gr8cpurev2", function(require, exports, module) {

var oop = require("ace/lib/oop");
var TextMode = require("ace/mode/text").Mode;
var Gr8cpurev2HighlightRules = require("ace/mode/gr8cpurev2_highlight_rules").Gr8cpurev2HighlightRules;

var GR8CPURev2 = function() {
	this.HighlightRules = Gr8cpurev2HighlightRules;
}
oop.inherits(GR8CPURev2, TextMode);
(function() {
    // Extra logic goes here.
}).call(GR8CPURev2.prototype);
exports.Mode = GR8CPURev2;
});
ace.define("ace/mode/gr8cpurev2_highlight_rules", function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var GR8CPURev2Highlight = function() {

    var keywordMapper = this.createKeywordMapper({
        //"variable.language": "this",
        "keyword": 
            "nop load copy add sub comp jump or and xor shift inc dec rot halt store",
        "support.type": 
            "a b c d carry l r",
        "keyword.operator":
            "to if"
    }, "text", true, " ");
     
    this.$rules = {
        "start" : [
            {token : "string", regex : "\"", next  : "string"},
            {token : "string", regex : "\'", next  : "qstring"},
            {token : "comment", regex : /;.+/},
            //{token : "comment",  regex : /".+$/},
            //{token : "invalid", regex: "\\.{2,}"},
            //{token : "keyword.operator", regex: /\W[\-+%=<>*]\W|\*\*|[~:,\.&$]|->*?|=>/},
            //{token : "paren.lparen", regex : "[\\[({]"},
            //{token : "paren.rparen", regex : "[\\])}]"},
            {token : "constant.numeric", regex: "(#([<>]?[0-9a-zA-Z_]+|\\$[0-9a-fA-F]+)\\b|((-?[0-9]+)|([0-7]+[oqOQ])|(\\$[0-9a-fA-F]+))\\b)"},
            //{token : "variable.parameter", regex : /sy|pa?\d\d\d\d\|t\d\d\d\.|innnn/},
            {token : "variable.parameter", regex : /(data|reserve|byte|bytes)(?= |;|$)/},
            {token : keywordMapper, regex : "\\b\\w+\\b"},
            {caseInsensitive: true}
        ],
        "qstring" : [
            {token : "constant.language.escape",   regex : "\\\\\'"}, //hecking regex: (?<=[^\\](\\\\)*)\\'
            {token : "string", regex : "\'",     next  : "start"},
            {defaultToken : "string"}
        ],
        "string" : [
            {token : "constant.language.escape",   regex : "\\\\\""}, //hecking regex: (?<=[^\\](\\\\)*)\\"
            {token : "string", regex : "\"",     next  : "start"},
            {defaultToken : "string"}
        ]
    };
};
oop.inherits(GR8CPURev2Highlight, TextHighlightRules);
//(function() {
//    
//}).call(GR8CPURev2Highlight.prototype);

exports.Gr8cpurev2HighlightRules = GR8CPURev2Highlight;
});
// ^^ GR8CPU Rev2.1 HIGHLIGHTING ^^ //
