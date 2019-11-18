'use strict';

const scalametaParsers = require('scalameta-parsers');
const chai = require('chai');
const codegen = require('../lib/');

const generate = codegen.generate;
const _ = codegen.nodes;

// const $ = require('../lib/scala-nodes.js');

const expect = chai.expect;
const parseStat = scalametaParsers.parseStat;
const parseSource = scalametaParsers.parseSource;

describe('parseSource -> codegen', () => {
  [
`package a.b.c

import a._
import foo.bar.{baz, taz}

class AA () extends A {
  val a = A(B(c = C(0), d = 42))
  var foo = "BAR"
}
`
  ].map(a => {
    it(a, done => {
      const b = parseSource.call({}, a);
      const c = generate(b);
      if (c !== a) {
        console.log(JSON.stringify(b, null, 2));
        expect(c).to.eq(a);
      }
      done();
    });
  });
});

describe('parseStat -> codegen', () => {
  [
    '(1 + 2)',
    '(1 + (200 * 31))',
    'Input(Bool())',
    'val foo, _ = Bool()',
    'var a = null',
    'var a = true',
    'var a = 100L',
    'def a = 1.2',
    'var a = 1F'
  ].map(a => {
    it(a, done => {
      const b = parseStat.call({}, a);
      const c = generate(b);
      if (c !== a) {
        console.log(b);
        expect(c).to.eq(a);
      }
      done();
    });
  });
});

describe('nodes -> codegen', () => {
  const nodes = {
    '(5 + 7)': _.Term.ApplyInfix(
      _.Lit.Int(5), '+', [_.Lit.Int(7)]
    ),
    'var a = null': _.Defn.Var(
      [_.Pat.Var('a')], _.Lit.Null()
    ),
    'val b = 42': _.Defn.Val(
      [_.Pat.Var('b')], _.Lit.Int(42)
    ),
    'val c = true': _.Defn.Val(
      [_.Pat.Var('c')], _.Lit.Boolean(true)
    ),
    'val c = 100L': _.Defn.Val(
      [_.Pat.Var('c')], _.Lit.Long(100)
    ),
    'val d = "ABC"': _.Defn.Val(
      [_.Pat.Var('d')], _.Lit.String('ABC')
    ),
    'var e = \'w\'': _.Defn.Var(
      [_.Pat.Var('e')], _.Lit.Char('w')
    ),
    'var f, _ = Bool()': _.Defn.Var(
      [_.Pat.Var('f'), _.Pat.Wildcard()], _.Term.Apply('Bool', [])
    )
  };
  Object.keys(nodes).map(key => {
    it(key, done => {
      // expect(nodes[key]).to.deep.eq(parseStat.call({}, key));
      expect(generate(nodes[key])).to.eq(key);
      done();
    });
  });
});

/* eslint-env mocha */
