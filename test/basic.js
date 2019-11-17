'use strict';

const scalametaParsers = require('scalameta-parsers');
const chai = require('chai');
const codegen = require('../lib/');

const generate = codegen.generate;
const _ = codegen.nodes;

// const $ = require('../lib/scala-nodes.js');

const expect = chai.expect;
const parseStat = scalametaParsers.parseStat;

describe('parser -> codegen', () => {
  [
    '(1 + 2)',
    '(1 + (200 * 31))',
    'Input(Bool())',
    'val foo, _ = Bool()'
  ].map(a => {
    it(a, done => {
      const b = parseStat.call({}, a);
      const c = generate(b);
      if (c !== a) {
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
    )
  };
  Object.keys(nodes).map(key => {
    it(key, done => {
      expect(generate(nodes[key])).to.eq(key);
      done();
    })
  })
});

/* eslint-env mocha */
