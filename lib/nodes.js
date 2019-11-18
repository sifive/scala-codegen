'use strict';
// @flow

const TypeName = (value /*: string */) => ({
  type: 'Type.Name',
  value
});

exports.Mod = {
  Lazy: () => ({type: 'Mod.Lazy'}),
  Case: () => ({type: 'Mod.Case'}),
  Implicit: () => ({type: 'Mod.Implicit'}),
  Final: null, // nope
  Sealed: null // nope
};

exports.Lit = {

  Null:     (value /*: null */)   => ({type: 'Lit.Null', value}),    // null
  Boolean:  (value /*: bool */)   => ({type: 'Lit.Boolean', value}), // true
  Unit:     (value /*: any */)    => ({type: 'Lit.Unit', value}),    // ()
  Int:      (value /*: number */) => ({type: 'Lit.Int', value}),     // 42
  Double:   (value /*: number */) => ({type: 'Lit.Double', value}),  // 1.0
  Float:    (value /*: number */) => ({type: 'Lit.Float', value}),   // 1.0F
  Long:     (value /*: number */) => ({type: 'Lit.Long', value}),    // 100L

  Byte:     null, //   (no available syntax)
  Short:    null, //   (no available syntax)

  Char:     (value /*: string */) => ({type: 'Lit.Char', value}),    // 'a'
  Symbol:   (value /*: string */) => ({type: 'Lit.Symbol', value}),  // 'a
  String:   (value /*: string */) => ({type: 'Lit.String', value})   // "A"

};

exports.Pat = {

  Wildcard: () => ({        // _
    type: 'Pat.Wildcard'
  }),

  SeqWildcard: null,        //   _* in case List(xs @ _*) =>

  Var: (name /*: string */) => ({   // a in case a =>
    type: 'Pat.Var',
    name: TermName(name)
  }),

  Bind: null, //   a @ A()

  Alternative: null, //   1 | 2

  Tuple: (args /*: Array<{}> */) => ({                  // (a, b)
    type: 'Lit.Tuple',
    args
  }),

  Extract: (fun /*: {} */, args /*: Array<{}> */) => ({ // A(a, b)
    type: 'Lit.Extract',
    fun,
    args
  }),

  ExtractInfix: null,       // a E b

  Interpolate: null,        // r"Hello (.+)$name"

  Xml: null,                // <h1>Hello, World!</h1>

  Typed: null               // a: Int

};


exports.Type = {

  // Ref
  Name: TypeName,   // B

  Select: null,     // a.B

  Project: null,    // a#B

  Singleton: null,  // a.type

  // Type
  Apply: null,      // F[T]

  ApplyInfix: null, // K Map V

  Function: null,     // A => B

  ImplicitFunction: null,     //  implicit A => B

  Tuple: null,    //  (A, B)

  With: null,     //  A with B

  And: null,    //  A & B

  Or: null,     //  A | B

  Refine: null,     //  A { def f: Int }

  Existential: null,    //  A forSome { type T }

  Annotate: null,     //  T @annot

  Lambda: null,     //  [T] => (T, T) (only for supported dialects)

  Method: null,     //  (x: T): T (only for supported dialects)

  Placeholder: null,    //  _ in T[_]

  Bounds: null,     //  T >: Lower <: Upper in def F[T >: Lower <: Upper] = 1

  ByName: null,     //  =>T in def f(x: => T) = x

  Repeated: null,     //  T* in def f(x: T*): Unit

  Var: null,    //  t in case _: List[t] =>

  Param: null    //  X in trait A[X]
};

const NameIndeterminate = (value /*: string */) => ({
  type: 'Name.Indeterminate',
  value
});

const NameAnonymous = () => ({
  type: 'Name.Anonymous',
  value: ''
});

exports.Name = {
  Indeterminate: NameIndeterminate,
  Anonymous: NameAnonymous
};

const TermName = (value /*: string */) => ({
  type: 'Term.Name',
  value
});

exports.Term = {
  This: null,

  Super: null,

  Name: TermName,

  Select: (qual /*: {} */, name /*: {} */) => ({ // a.b
    type: 'Term.Select',
    qual,
    name
  }),

  ApplyUnary: null,

  Apply: (fun /*: string */, args /*: Array<{}> */) => ({
    type: 'Term.Apply',
    fun: TermName(fun),
    args
  }),

  ApplyType: null,

  ApplyInfix: (lhs /*: {} */, name /*: string */, args /*: Array<{}> */) => ({
    type: 'Term.ApplyInfix',
    lhs,
    op: TermName(name),
    args
  }),

  Assign: null,

  Return: null,

  Throw: null,

  Ascribe: null,

  Annotate: null,

  Tuple: (args /*: Array<{}> */) => ({
    type: 'Term.Tuple',
    args
  }),

  Block: (stats /*: Array<{}> */) => ({
    type: 'Term.Block',
    stats
  }),

  If: null,

  Match: null,

  Try: null,

  TryWithHandler: null,

  Function: null,

  PartialFunction: null,

  While: null,

  Do: null,

  For: null,

  ForYield: null,

  New: null,

  NewAnonymous: null,

  Placeholder: null,

  Eta: null,

  Repeated: null,

  Param: null,

  Interpolate: null,

  Xml: null

};

const genDefn = (type /*: string */) =>
  (
    mods /*: Array<{}> */,
    name /*: string */,
    paramss /*: Array<Array<{}>>*/,
    decltpe /*: string */,
    body /*: {} */
  ) => ({
    type,
    mods,
    name: TermName(name),
    paramss,
    decltpe: TermName(decltpe),
    body
  });

exports.Defn = {
  Val: (pats /*: Array<{}> */, rhs /*: {} */, decltpe /*: string */) => ({
    type: 'Defn.Val',
    pats,
    rhs,
    decltpe: TypeName(decltpe)
  }),
  Var: (pats /*: Array<{}> */, rhs /*: {} */, decltpe /*: string */) => ({
    type: 'Defn.Var',
    pats,
    rhs,
    decltpe: TypeName(decltpe)
  }),
  Def: genDefn('Defn.Def'),
  Macro: null,
  Type: genDefn('Defn.Type'),
  Class: (
    mods /*: Array<{}> */,
    ctor /*: string */,
    type /*: string */
  ) => ({
    type: 'Defn.Class',
    mods,
    name: TypeName(type),
    tparams: [],
    ctor
  }),
  Trait: (
    mods /*: Array<{}> */,
    name /*: string */,
    ctor /*: string */,
    templ /*: {} */
  ) => ({
    type: 'Defn.Trait',
    mods,
    name: TermName(name),
    tparams: [],
    ctor,
    templ
  }),
  Object: (
    mods /*: string */,
    name /*: string */,
    stats /*: Array<{}> */
  ) => ({
    type: 'Defn.Object',
    mods,
    name: TermName(name),
    templ: {
      type: 'Template',
      self: {
        type: 'Self',
        name: NameAnonymous()
      },
      stats
    }
  })
};

exports.Decl = {
  Type: null, // nope
  Val: null, // nope
  Var: null,
  Def: null
};

exports.Ctor = {
  Primary: (
    mods /*: Array<{}> */,
    name /*: string */,
    paramss /*: string */
  ) => ({
    type: 'Ctor.Primary',
    mods: mods,
    name: {
      type: 'Name.Anonymous',
      value: name
    },
    paramss
  })
};

exports.Import = (importers /*: Array<{}> */) => ({
  type: 'Import',
  importers
});

exports.Importer = (ref /*: string */, importees /*: Array<{}> */) => ({
  type: 'Importer',
  ref: TermName(ref),
  importees
});

exports.Importee = {
  Name: (value /*: string */) => ({
    type: 'Importee.Name',
    name: NameIndeterminate(value)
  }),
  Wildcard: () => ({
    type: 'Importee.Wildcard'
  })
};
