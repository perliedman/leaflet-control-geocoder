var LeafDoc = require('Leafdoc');
var doc = new LeafDoc();

doc.addFile('src/control.js');

var out = doc.outputStr();
var sander = require('sander');


sander.writeFileSync('docs.html', out);
