/**
 * Example usage of jQuery Terminal in Electron app
 * Copyright (c) 2018 Jakub Jankewicz <http://jcubic.pl/me>
 * Released under MIT license
 */
/* global require, module */

const {ipcRenderer} = require('electron');

require('devtron').install();

var $ = require('jquery');

require('jquery.terminal')($);

$('body').terminal(function(command) {
    if (command.match(/^\s*exit\*$/)) {
        ipcRenderer.send('terminal', {
            method: 'exit',
            args: []
        });
    } else if (command !== '') {
        try {
            var result = window.eval(command);
            if (result !== undefined) {
                this.echo(new String(result));
            }
        } catch(e) {
            this.error(new String(e));
        }
    }
}, {
    exit: false,
    greetings: function(set) {
        set(function() {
            var version = 'v. ' + process.versions.electron;
            var re = new RegExp('.{' + version.length + '}$');
            var ascii_art = [
                '   ______        __',
                '  / __/ /__ ____/ /________  ___',
                ' / _// / -_) __/ __/ __/ _ \\/ _ \\',
                '/___/_/\\__/\\__/\\__/_/  \\___/_//_/',
                '                                 '.replace(re, '') + version
            ].join('\n');
            var cols = this.cols();
            var signature = [];
            if (cols >= 33) {
                signature.push(ascii_art);
                signature.push('');
            } else {
                signature.push('Electron');
            }
            if (cols >= 57) {
                signature.push('Copyright (C) 2018 Jakub Jankiewicz <http://jcubic.pl/me>');
            } else if (cols >= 47) {
                signature.push('(C) 2018 Jakub Jankiewicz <http://jcubic.pl/me>');
            } else if (cols >= 25) {
                signature.push('(C) 2018 Jakub Jankiewicz');
            } else if (cols >= 15) {
                signature.push('(C) 2018 jcubic');
            }
            return signature.join('\n') + '\n';
        });
    },
    name: 'electron',
    prompt: '[[;#D72424;]js]> '
});


module.exports = $;
