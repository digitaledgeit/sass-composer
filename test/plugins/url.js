var assert    = require('assert');
var path      = require('path');
var fixture   = require('./../lib/get-fixture');
var composer  = require('../..');
var url       = require('../../lib/plugins/url');

describe('sass-composer', function() {
  describe('plugin', function() {
    describe('url', function () {

      it.skip('path should be relative to the destination', function(done) {

        composer()
          .entry(fixture('plugin-url'))
          .use(url({dir: '.'}))
          .compose(function(err, css) {
            if (err) return done(err);
            done();
          })
        ;

      });

      describe('.transforms.relative()', function() {

        it('should not contain back slashes when I use a Windows path', function(done) {

          var entry = path.join(__dirname, 'fixtures', 'plugin-url.scss');
          var transform = url.transforms.relative({dir: path.join(__dirname, 'fixtures')});

          transform.call({entry: entry}, entry, '.\\img\\logo.png', function(err, rel) {
            assert.equal(err, null);
            assert.equal(-1, rel.indexOf('\\'));
            done();
          });

        });

        it('should ignore absolute URLs that start with "http:"', function(done) {

          var uri = 'http://avatars1.githubusercontent.com/u/2237996?v=3&s=96';

          var entry = path.join(__dirname, 'fixtures', 'plugin-url.scss');
          var transform = url.transforms.relative({dir: path.join(__dirname, 'fixtures')});

          transform.call({entry: entry}, entry, uri, function(err, rel) {
            assert.equal(err, null);
            assert.equal(0, rel.indexOf('http://avatars1.'));
            done();
          });

        });

        it('should ignore absolute URLs that start with "https:"', function(done) {

          var uri = 'https://avatars1.githubusercontent.com/u/2237996?v=3&s=96';

          var entry = path.join(__dirname, 'fixtures', 'plugin-url.scss');
          var transform = url.transforms.relative({dir: path.join(__dirname, 'fixtures')});

          transform.call({entry: entry}, entry, uri, function(err, rel) {
            assert.equal(err, null);
            assert.equal(0, rel.indexOf('https://avatars1.'));
            done();
          });

        });

        it('should ignore absolute URLs that start with "data:"', function(done) {

          var uri = 'data:image\\svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+' +
            'Cjxzdmcgd2lkdGg9IjQ1cHgiIGhlaWdodD0iMjVweCIgdmlld0JveD0iMCAwIDQ1IDI1IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8' +
            'vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaH' +
            'R0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDx0aXRsZT5TbGljZSAxPC90aXRsZT4KICAgIDxkZXNjcmlwd' +
            'Glvbj5DcmVhdGVkIHdpdGggU2tldGNoIChodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gpPC9kZXNjcmlwdGlvbj4KICAg' +
            'IDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlIDEiIGZpbGw9IiNEOEQ4RDgiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHB' +
            'hdGggZD0iTTIsMjAuOTkyIEwyLDYuNDYgTDcuMzQ4LDYuNDYgTDcuMzQ4LDguMzA4IEw3LjQwNCw4LjMwOCBDOC40NCw2Ljg1MiA5LjkyNC' +
            'w2LjA5NiAxMi4xMzYsNi4wOTYgQzE0Ljc0LDYuMDk2IDE3LjEyLDcuNjkyIDE3LjEyLDExLjAyNCBMMTcuMTIsMjAuOTkyIEwxMS41NzYsM' +
            'jAuOTkyIEwxMS41NzYsMTMuMzc2IEMxMS41NzYsMTEuNjk2IDExLjM4LDEwLjUyIDkuNzU2LDEwLjUyIEM4LjgwNCwxMC41MiA3LjU0NCwx' +
            'MC45OTYgNy41NDQsMTMuMzIgTDcuNTQ0LDIwLjk5MiBaIE0xOS4yNTYsMjAuOTkyIEwxOS4yNTYsNi40NiBMMjQuOCw2LjQ2IEwyNC44LDI' +
            'wLjk5MiBaIE0yNC44LDEgTDI0LjgsNC44OTIgTDE5LjI1Niw0Ljg5MiBMMTkuMjU2LDEgWiBNMzcuMTg0LDEzLjcxMiBDMzcuMTg0LDEyLj' +
            'AwNCAzNi43MzYsMTAuMTI4IDM0Ljc0OCwxMC4xMjggQzMyLjc2LDEwLjEyOCAzMi4zMTIsMTIuMDA0IDMyLjMxMiwxMy43MTIgQzMyLjMxM' +
            'iwxNS40NDggMzIuNzYsMTcuMzI0IDM0Ljc0OCwxNy4zMjQgQzM2LjczNiwxNy4zMjQgMzcuMTg0LDE1LjQ0OCAzNy4xODQsMTMuNzEyIFog' +
            'TTI2Ljk2NCwyMC45OTIgTDI2Ljk2NCwxIEwzMi41MDgsMSBMMzIuNTA4LDguMDU2IEwzMi41NjQsOC4wNTYgQzMzLjQwNCw2LjgyNCAzNC4' +
            '4ODgsNi4wOTYgMzYuNTQsNi4wOTYgQzQxLjQxMiw2LjA5NiA0Mi43MjgsMTAuMjQgNDIuNzI4LDEzLjY1NiBDNDIuNzI4LDE3LjI5NiA0MC' +
            '43NCwyMS4zNTYgMzYuNjI0LDIxLjM1NiBDMzMuOTA4LDIxLjM1NiAzMy4wNjgsMjAuMzIgMzIuMzY4LDE5LjM5NiBMMzIuMzEyLDE5LjM5N' +
            'iBMMzIuMzEyLDIwLjk5MiBaIE0yNi45NjQsMjAuOTkyIiBpZD0ibmliIiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgICA8L2c+Cjwvc3Zn' +
            'Pg=='
          ;

          var entry = path.join(__dirname, 'fixtures', 'plugin-url.scss');
          var transform = url.transforms.relative({dir: path.join(__dirname, 'fixtures')});

          transform.call({entry: entry}, entry, uri, function(err, rel) {
            assert.equal(err, null);
            assert.equal(0, rel.indexOf('data:image\\svg+xml;base64,PD94bW'));
            done();
          });

        });

        it('should remove the query string for file operations', function(done) {

          var uri = './img/logo.png?foo';

          var entry = path.join(__dirname, 'fixtures', 'plugin-url.scss');
          var transform = url.transforms.relative({dir: path.join(__dirname, 'fixtures')});

          transform.call({entry: entry}, entry, uri, function(err, rel) {
            assert.equal(err, null);
            assert.equal(rel, 'img/logo.png?foo');
            done();
          });

        });

        it('should remove the anchor string for file operations', function(done) {

          var uri = './img/logo.png#iefix';

          var entry = path.join(__dirname, 'fixtures', 'plugin-url.scss');
          var transform = url.transforms.relative({dir: path.join(__dirname, 'fixtures')});

          transform.call({entry: entry}, entry, uri, function(err, rel) {
            assert.equal(err, null);
            assert.equal(rel, 'img/logo.png#iefix');
            done();
          });

        });

      });

    });
  });
});
