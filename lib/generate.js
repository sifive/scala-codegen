'use strict';

const indent = str =>
  str.split('\n').map(e => '  ' + e).join('\n');

const reduct = vals =>
  vals.map(val => rec(val)).join(', ');

const reductCurly = vals =>
  (vals.length > 1)
    ? '{' + reduct(vals) + '}'
    : reduct(vals);


const rec = $ => {
  switch($.type) {
  case 'Pat.Wildcard':    return '_';
  case 'Pat.Var':         return rec($.name);

  case 'Defn.Val':        return 'val ' + reduct($.pats) + ' = '+ rec($.rhs);
  case 'Defn.Var':        return 'var ' + reduct($.pats) + ' = '+ rec($.rhs);
  case 'Defn.Def':        return 'def ' + rec($.name) + ' = '+ rec($.body);
  case 'Defn.Class':
    return '\nclass ' + rec($.name) + ' () extends ' + rec($.templ);

  case 'Term.Name':       return $.value;
  case 'Term.Apply':      return rec($.fun) + '(' + reduct($.args) + ')';
  case 'Term.ApplyInfix': return '(' + rec($.lhs) + ' ' + rec($.op) + ' ' + reduct($.args) + ')';
  case 'Term.Select':     return rec($.qual) + '.' + rec($.name);
  case 'Term.Assign':     return rec($.lhs) + ' = ' + rec($.rhs);

  case 'Lit.Int':
  case 'Lit.Boolean':
  case 'Lit.Double':          return $.value;
  case 'Lit.Null':            return 'null';
  case 'Lit.Long':            return $.value + 'L';
  case 'Lit.Float':           return $.value + 'F';
  case 'Lit.String':          return '"' + $.value + '"';
  case 'Lit.Char':            return '\'' + $.value + '\'';

  case 'Source':              return reduct($.stats);
  case 'Pkg':                 return 'package ' + rec($.ref) + '\n\n' + $.stats.map(rec).join('\n') + '\n';
  case 'Import':              return 'import ' + reduct($.importers);
  case 'Importer':            return rec($.ref) + '.' + reductCurly($.importees);
  case 'Importee.Name':       return rec($.name);
  case 'Name.Indeterminate':  return $.value;
  case 'Importee.Wildcard':   return '_';

  case 'Template':            return reduct($.inits) + ' {\n' + indent($.stats.map(rec).join('\n')) + '\n}';
  case 'Init':                return rec($.tpe);

  case 'Type.Name':           return $.value;

  default:                    return $.type;
  }
};

module.exports = rec;
/* eslint complexity: 0 */
