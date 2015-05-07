
var quoted_rules = [
  'content'
];

module.exports = function(selector, rule, css) {
  var regexp, rule_regexp, value_regexp;
  css = css.toString();

  if (quoted_rules.indexOf(rule) === -1) {
    value_regexp = '([^;]*)';
  } else {
    value_regexp = '"([^"]*)"';
  }
  rule_regexp = '\\s*'+rule+'\\s*:\\s*'+value_regexp+'\\s*;?\\s*';
  regexp      = selector+'\\s*{'+rule_regexp+'}';

  var matches = css.match(new RegExp(regexp, 'm'));
  return matches === null ? null : matches[1].trim();
};