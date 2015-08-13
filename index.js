/* jshint node: true */
'use strict';

var replace = require('broccoli-string-replace');
var renameFiles = require('broccoli-rename-files');
var removeFile = require('broccoli-file-remover');
var funnel = require('broccoli-funnel');

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

module.exports = {
  name: 'ember-cli-build-env',

  treeForPublic: function() {
    var appEnv = this.app.env;
    var config = require(this.app.project.root + '/config/environment.js');
    var appEnvJSON = config(appEnv);
    var envTree = funnel(unwatchedTree('public'), {
      srcDir: '/',
      files: ['env_template.js'],
      destDir: '/'
    });

    var replaceTree = replace(envTree, {
      files: ['env_template.js'],
      patterns: [{
        match: /APP_ENV_JSON/g,
        replacement: JSON.stringify(appEnvJSON)
      }]
    });

    var tree = renameFiles(replaceTree, {
      transformFilename: function() {
        return 'env.js';
      }
    });

    return tree;
  },

  included: function(app) {
    this.app = app;
  }

};
