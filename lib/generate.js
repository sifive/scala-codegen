'use strict';

const reduct = vals => vals.map(val => rec(val)).join(', ');

const rec = $ => {
  switch($.type) {
  case 'Pat.Wildcard':    return '_';
  case 'Pat.Var':         return rec($.name);

  case 'Defn.Val':        return 'val ' + reduct($.pats) + ' = '+ rec($.rhs);
  case 'Defn.Var':        return 'var ' + reduct($.pats) + ' = '+ rec($.rhs);
  case 'Defn.Def':        return 'def ' + rec($.name) + ' = '+ rec($.body);

  case 'Term.Name':       return $.value;
  case 'Term.Apply':      return rec($.fun) + '(' + reduct($.args) + ')';
  case 'Term.ApplyInfix': return '(' + rec($.lhs) + ' ' + rec($.op) + ' ' + reduct($.args) + ')';

  case 'Lit.Int':
  case 'Lit.Boolean':
  case 'Lit.Double':      return $.value;
  case 'Lit.Null':        return 'null';
  case 'Lit.Long':        return $.value + 'L';
  case 'Lit.Float':       return $.value + 'F';
  case 'Lit.String':      return '"' + $.value + '"';
  case 'Lit.Char':        return '\'' + $.value + '\'';

  default:                return $.type;
  }
};

module.exports = rec;
