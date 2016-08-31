var document = {
  'createElementNS': function() {
    return {};
  }
};
var window = this;

importScripts(
  'bower_components/pdfmake/build/pdfmake.min.js',
  'bower_components/pdfmake/build/vfs_fonts.js'
);

(function() {
  'use strict';

  var doc, current;

  function init() {
    doc = {
      content:[],
      styles: {}
    };
    current = {
      table:{
        body:[]
      }
    };
  }

  function set(data) {
    if(typeof data !== 'undefined'  && typeof data.content !== 'undefined') {
      doc = data;
    };
  }

  function add(data) {
    doc.content.push(data);
  }

  function createTable(template) {
    if(typeof template !== 'undefined' &&
      typeof template.table !== 'undefined' &&
      typeof template.table.body !== 'undefined') {
      current = template;
    } else {
      current = {
        table:{
          body:[]
        }
      };
    }
  }

  // no check of tableBody here for array, length etc
  function appendTable(tableBody) {
    if(typeof tableBody !== 'undefined') {
      current.table.body.push(tableBody);
    }
  }

  function closeTable() {
    doc.content.push(current);
    current = {};
  }

  function genPdf(name) {
    // postMessage({action:'debug', name: name});
    pdfMake.createPdf(doc).getBase64(function(base64) {
      postMessage({
        action: 'donePdf',
        base64: base64,
        name: name
      });
    });
  }

  function styles(styles) {
    doc.styles = styles;
  }

  onmessage = function(evt) {
    switch(evt.data.action) {
      case 'init':
        init();
        break;
      case 'set':
        set(evt.data.data);
        break;
      case 'add':
        add(evt.data.data);
        break;
      case 'createTable':
        createTable(evt.data.data);
        break;
      case 'appendTable':
        appendTable(evt.data.data);
        break;
      case 'closeTable':
        closeTable();
        break;
      case 'styles':
        styles(evt.data.data);
        break;
      case 'genPdf':
        genPdf(evt.data.data);
        break;
      default:
        postMessage({action:'debug', msg:"unknown message"});
    }
  };

})();

