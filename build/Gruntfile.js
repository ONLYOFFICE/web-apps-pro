module.exports = function(grunt) {
    var _ = require('lodash'),
        defaultConfig,
        packageFile;

    const copyrightHeader = 'Copyright (c) Ascensio System SIA <%= grunt.template.today("yyyy") %>. All rights reserved'
    var copyright = '/*\n' +
                    ' * ' + (process.env['APP_COPYRIGHT'] || copyrightHeader) + '\n' +
                    ' *\n' +
                    ' * <%= pkg.homepage %> \n' +
                    ' *\n' +
                    ' * Version: <%= pkg.version %> (build:<%= pkg.build %>)\n' +
                    ' */\n';

    let iconv_lite, encoding = process.env.SYSTEM_ENCODING;
    grunt.log.writeln('platform: ' + process.platform.green);
    if (process.platform == 'win32') {
        const cmdencoding = require('child_process').execSync('chcp');
        grunt.log.writeln(cmdencoding);
        if ( !encoding ) {
            if ( cmdencoding.includes('866') ) encoding = '1251'; else
            if ( cmdencoding.includes('437') ) encoding = '1252'; else
            if ( cmdencoding.includes('65001') ) encoding = 'utf8';
        }

        if ( !!encoding && !/utf-?8/i.test(encoding) ) {
            iconv_lite = require('iconv-lite');
        }
    }

    let _encode = (string) => {
        return !!string && !!iconv_lite ? iconv_lite.encode(string,encoding) : string;
    };

    var jsreplacements = [
                {
                    from: /\{\{SUPPORT_EMAIL\}\}/g,
                    to: _encode(process.env.SUPPORT_EMAIL) || 'support@onlyoffice.com'
                },{
                    from: /\{\{SUPPORT_URL\}\}/g,
                    to: _encode(process.env.SUPPORT_URL) || 'https://support.onlyoffice.com'
                },{
                    from: /\{\{SALES_EMAIL\}\}/g,
                    to: _encode(process.env.SALES_EMAIL) || 'sales@onlyoffice.com'
                },{
                    from: /\{\{PUBLISHER_URL\}\}/g,
                    to: _encode(process.env.PUBLISHER_URL) || 'https://www.onlyoffice.com'
                },{
                    from: /\{\{PUBLISHER_PHONE\}\}/,
                    to: process.env['PUBLISHER_PHONE'] || '+371 633-99867'
                },{
                    from: /\{\{PUBLISHER_NAME\}\}/g,
                    to: _encode(process.env.PUBLISHER_NAME) || 'Ascensio System SIA'
                },{
                    from: /\{\{PUBLISHER_ADDRESS\}\}/,
                    to: _encode(process.env.PUBLISHER_ADDRESS) || '20A-12 Ernesta Birznieka-Upisha street, Riga, Latvia, EU, LV-1050'
                },{
                    from: /\{\{API_URL_EDITING_CALLBACK\}\}/,
                    to: _encode(process.env.API_URL_EDITING_CALLBACK) || 'https://api.onlyoffice.com/editors/callback'
                },{
                    from: /\{\{COMPANY_NAME\}\}/g,
                    to: _encode(process.env.COMPANY_NAME) || 'ONLYOFFICE'
                }, {
                    from: /\{\{APP_TITLE_TEXT\}\}/g,
                    to: _encode(process.env.APP_TITLE_TEXT) || 'ONLYOFFICE'
                }, {
                    from: /\{\{HELP_URL\}\}/g,
                    to: _encode(process.env.HELP_URL) || 'https://helpcenter.onlyoffice.com'
                }];

    var helpreplacements = [
                {
                    from: /\{\{COEDITING_DESKTOP\}\}/g,
                    to: _encode(process.env.COEDITING_DESKTOP) || 'Подключиться к облаку'
                },{
                    from: /\{\{PLUGIN_LINK\}\}/g,
                    to: _encode(process.env.PLUGIN_LINK) || 'https://api.onlyoffice.com/plugin/basic'
                },{
                    from: /\{\{PLUGIN_LINK_MACROS\}\}/g,
                    to: _encode(process.env.PLUGIN_LINK_MACROS) || 'https://api.onlyoffice.com/plugin/macros'
                }];

    let path = require('path');
    let addons = grunt.option('addon') || [];
    if (!Array.isArray(addons))
        addons = [addons];

    addons.forEach((element,index,self) => self[index] = path.join('../..', element, '/build'));
    addons = addons.filter(element => grunt.file.isDir(element));

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-json-minify');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-exec');

    function doRegisterTask(name, callbackConfig) {
        return grunt.registerTask(name + '-init', function() {
            var additionalConfig = {},
                initConfig = {};

            if (_.isFunction(callbackConfig)) {
                additionalConfig = callbackConfig.call(this, defaultConfig, packageFile);
            }

            if (!_.isUndefined(packageFile[name]['clean'])) {
                initConfig['clean'] = {
                    options: {
                        force: true
                    },
                    files: packageFile[name]['clean']
                }
            }

            if (!_.isUndefined(packageFile[name]['copy'])) {
                initConfig['copy'] = packageFile[name]['copy'];
            }

            grunt.initConfig(_.assign(initConfig, additionalConfig || {}));
        });
    }

    function doRegisterInitializeAppTask(name, appName, configFile) {
        if (!!process.env['OO_BRANDING'] &&
                grunt.file.exists('../../' + process.env['OO_BRANDING'] + '/web-apps-pro/build/' + configFile))
        {
            var _extConfig = require('../../' + process.env['OO_BRANDING'] + '/web-apps-pro/build/' + configFile);
        }

        function _merge(target, ...sources) {
            if (!sources.length) return target;
            const source = sources.shift();

            if (_.isObject(target) && _.isObject(source)) {
                for (const key in source) {
                    if (_.isObject(source[key])) {
                        if (!target[key]) Object.assign(target, { [key]: {} });
                        else if (_.isArray(source[key])) target[key].push(...source[key]);
                        else _merge(target[key], source[key]);
                    } else {
                        Object.assign(target, { [key]: source[key] });
                    }
                }
            }

            return _merge(target, ...sources);
        }

        return grunt.registerTask('init-build-' + name, 'Initialize build ' + appName, function(){
            defaultConfig = configFile;
            packageFile = require('./' + defaultConfig);

            if (packageFile) {
                grunt.log.ok(appName + ' config loaded successfully'.green);

                addons.forEach(element => {
                    let _path = path.join(element,configFile);
                    if (grunt.file.exists(_path)) {
                        _merge(packageFile, require(_path));
                        grunt.log.ok('addon '.green + element + ' is merged successfully'.green);
                    }
                });

                if ( !!_extConfig && _extConfig.name == packageFile.name ) {
                    _merge(packageFile, _extConfig);
                }
            } else grunt.log.error().writeln('Could not load config file'.red);
        });
    }

    grunt.initConfig({
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                },
                force: true
            },
            common: ['../apps/common/main/lib/**/*.js']
        }
    });

    doRegisterTask('sdk');
    doRegisterTask('api', function(defaultConfig, packageFile){
        return {
            pkg: packageFile,
            replace: {
                  writeVersion: {
                      src: ['<%= pkg.api.copy.script.dest %>' +  '/**/*.js'],
                      overwrite: true,
                      replacements: [{
                          from: /\{\{PRODUCT_VERSION\}\}/,
                          to: packageFile.version
                      },{
                          from: /\{\{APP_CUSTOMER_NAME\}\}/g,
                          to: process.env['APP_CUSTOMER_NAME'] || 'ONLYOFFICE'
                      },{
                          from: /\/\*\*[\s\S]+\.com\s+\*\//,
                          to: copyright
                      }]
                  }
            }
        }
    });
    doRegisterTask('sockjs');
    doRegisterTask('xregexp');
    doRegisterTask('megapixel');
    doRegisterTask('jquery');
    doRegisterTask('underscore');
    doRegisterTask('zeroclipboard');
    doRegisterTask('bootstrap');
    doRegisterTask('iscroll');
    doRegisterTask('fetch');
    doRegisterTask('es6-promise');
    doRegisterTask('jszip');
    doRegisterTask('jsziputils');
    doRegisterTask('requirejs', function(defaultConfig, packageFile) {
        return {
            uglify: {
                pkg: packageFile,

                options: {
                    banner: '/** vim: et:ts=4:sw=4:sts=4\n' +
                        ' * @license RequireJS 2.1.2 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.\n' +
                        ' * Available via the MIT or new BSD license.\n' +
                        ' * see: http://github.com/jrburke/requirejs for details\n' +
                        ' */\n'
                },
                build: {
                    src:  packageFile['requirejs']['min']['src'],
                    dest: packageFile['requirejs']['min']['dest']
                }
            }
        }
    });

    grunt.registerTask('prebuild-icons-sprite', function() {
        require('./sprites/Gruntfile.js')(grunt, '../');
        grunt.task.run('all-icons-sprite');
    });

    grunt.registerTask('main-app-init', function() {
        grunt.initConfig({
            pkg: packageFile,

            clean: {
                options: {
                    force: true
                },
                prebuild: {
                    src: packageFile['main']['clean']
                },
                postbuild: {
                    src: packageFile.main.svgicons.clean
                }
            },

            less: {
                production: {
                    options: {
                        compress: true,
                        ieCompat: false,
                        modifyVars: packageFile['main']['less']['vars'],
                        plugins: [
                            new (require('less-plugin-clean-css'))()
                        ]
                    },
                    files: {
                        "<%= pkg.main.less.files.dest %>": packageFile['main']['less']['files']['src']
                    }
                }
            },

            requirejs: {
                compile: {
                    options: packageFile['main']['js']['requirejs']['options']
                }
            },

            replace: {
                writeVersion: {
                    src: ['<%= pkg.main.js.requirejs.options.out %>'],
                    overwrite: true,
                    replacements: [{
                        from: /\{\{PRODUCT_VERSION\}\}/g,
                        to: packageFile.version
                    }]
                },
                prepareHelp: {
                    src: ['<%= pkg.main.copy.help[0].dest %>/ru/**/*.htm*'],
                    overwrite: true,
                    replacements: []
                }
            },

            concat: {
                options: {
                    stripBanners: true,
                    banner: copyright
                },
                dist: {
                    src: [packageFile['main']['js']['requirejs']['options']['out']],
                    dest: packageFile['main']['js']['requirejs']['options']['out']
                }
            },

            imagemin: {
                options: {
                    optimizationLevel: 3
                },
                dynamic: {
                    files: []
                        .concat(packageFile['main']['imagemin']['images-app'])
                        .concat(packageFile['main']['imagemin']['images-common'])
                }
            },

            'json-minify': {
                build: {
                    files: packageFile['main']['jsonmin']['files']
                }
            },

            copy: {
                localization: {
                    files: packageFile['main']['copy']['localization']
                },
                help: {
                    files: packageFile['main']['copy']['help']
                },
                indexhtml: {
                    files: packageFile['main']['copy']['indexhtml']
                }
            },

            inline: {
                dist: {
                    src: '<%= pkg.main.copy.indexhtml[0].dest %>/*.html'
                }
            },

            svgmin: {
                options: {
                    plugins: [{
                        cleanupIDs: false
                    },
                    {
                        convertPathData: {
                            floatPrecision: 4
                        }
                    }]
                },
                dist: {
                    files: packageFile.main.svgicons.common
                }
            }
        });

        var replace = grunt.config.get('replace');
        replace.writeVersion.replacements.push(...jsreplacements);
        replace.prepareHelp.replacements.push(...helpreplacements);
        grunt.config.set('replace', replace);
    });

    grunt.registerTask('deploy-reporter', function(){
        grunt.initConfig({
            pkg: packageFile,
            uglify: {
                options: {
                    banner: copyright
                },
                build: {
                    files: {
                        "<%= pkg.main.reporter.uglify.dest %>": packageFile.main.reporter.uglify.src
                    }
                }
            },
            copy: packageFile.main.reporter.copy
        });


        grunt.task.run(['uglify', 'copy']);
    });

    grunt.registerTask('mobile-app-init', function() {
        grunt.initConfig({
            pkg: packageFile,

            clean: {
                options: {
                    force: true
                },
                'deploy': packageFile['mobile']['clean']['deploy'],
                'template-backup': packageFile.mobile.copy['template-backup'][0].dest
            },

            requirejs: {
                compile: {
                    options: packageFile['mobile']['js']['requirejs']['options']
                }
            },

            concat: {
                options: {
                    stripBanners: true,
                    banner: copyright
                },
                dist: {
                    src: packageFile.mobile.js.requirejs.options.out,
                    dest: packageFile.mobile.js.requirejs.options.out
                }
            },

            cssmin: {
                // options: {level: { 1: { roundingPrecision: 'all=3' }}}, // to round fw7 numbers in styles. need clean-css 4.0
                target: {
                    files: {
                        "<%= pkg.mobile.css.ios.dist %>" : packageFile['mobile']['css']['ios']['src'],
                        "<%= pkg.mobile.css.material.dist %>" : packageFile['mobile']['css']['material']['src']
                    }
                }
            },

            htmlmin: {
                dist: {
                    options: {
                        removeComments: true,
                        collapseWhitespace: true
                    },
                    files: packageFile['mobile']['htmlmin']['templates']
                }
            },

            'json-minify': {
                build: {
                    files: packageFile['mobile']['jsonmin']['files']
                }
            },

            copy: {
                'template-backup': {
                    files: packageFile['mobile']['copy']['template-backup']
                },
                'template-restore': {
                    files: packageFile['mobile']['copy']['template-restore']
                },
                'localization': {
                    files: packageFile['mobile']['copy']['localization']
                },
                'index-page': {
                    files: packageFile['mobile']['copy']['index-page']
                },
                'images-app': {
                    files:[]
                        .concat(packageFile['mobile']['copy']['images-app'])
                        .concat(packageFile['mobile']['copy']['images-common'])
                },
                'webpack-dist': {
                    files: packageFile.mobile.copy['assets']
                },
            },
            
            replace: {
                writeVersion: {
                    src: ['<%= pkg.mobile.js.requirejs.options.out %>'],
                    overwrite: true,
                    replacements: [{
                        from: /\{\{PRODUCT_VERSION\}\}/,
                        to: packageFile.version
                    }]
                },
                fixResourceUrl: {
                    src: ['<%= pkg.mobile.js.requirejs.options.out %>',
                            '<%= pkg.mobile.css.ios.dist %>',
                            '<%= pkg.mobile.css.material.dist %>'],
                    overwrite: true,
                    replacements: [{
                        from: /(?:\.{2}\/){4}common\/mobile\/resources\/img/g,
                        to: '../img'
                    },{
                        from: /(?:\.{2}\/){2}common\/mobile/g,
                        to: '../mobile'
                    }]
                }
            },

            exec: {
                webpack_app_build: {
                    options: {
                        cwd: '../vendor/framework7-react',
                    },
                    cmd: function() {
                        const editor = packageFile.name == 'presentationeditor' ? 'slide' :
                                        packageFile.name == 'spreadsheeteditor' ? 'cell' : 'word';
                        return `npm run deploy-${editor}`;
                    },
                },
                webpack_install: {
                    options: {
                        cwd: '../vendor/framework7-react',
                    },
                    cmd: 'npm i',
                },
            }
        });

        var replace = grunt.config.get('replace');
        replace.writeVersion.replacements.push(...jsreplacements);
        grunt.config.set('replace', replace);
    });

    grunt.registerTask('embed-app-init', function() {
        grunt.initConfig({
            pkg: packageFile,

            clean: {
                options: {
                    force: true
                },
                postbuild: packageFile['embed']['clean']['postbuild'],
                prebuild: packageFile['embed']['clean']['prebuild']
            },

            uglify: {
                options: {
                    banner: copyright
                },
                build: {
                    src: packageFile['embed']['js']['src'],
                    dest: packageFile['embed']['js']['dist']
                }
            },

            less: {
                production: {
                    options: {
                        compress: true,
                        ieCompat: false
                    },
                    files: {
                        "<%= pkg.embed.less.files.dist %>": packageFile['embed']['less']['files']['src']
                    }
                }
            },

            copy: {
                localization: {
                    files: packageFile['embed']['copy']['localization']
                },
                'index-page': {
                    files: packageFile['embed']['copy']['index-page']
                },
                'images-app': {
                    files: packageFile['embed']['copy']['images-app']
                }
            }
        });
    });


    grunt.registerTask('increment-build', function() {
        var pkg = grunt.file.readJSON(defaultConfig);
        pkg.build = parseInt(pkg.build) + 1;
        packageFile.homepage = (process.env['PUBLISHER_URL'] || pkg.homepage);
        packageFile.version = (process.env['PRODUCT_VERSION'] || pkg.version);
        packageFile.build = (process.env['BUILD_NUMBER'] || pkg.build);
        grunt.file.write(defaultConfig, JSON.stringify(pkg, null, 4));
    });

    //quick workaround for build desktop version
    var copyTask = grunt.option('desktop')? "copy": "copy:script";

    grunt.registerTask('deploy-api',                    ['api-init', 'clean', copyTask, 'replace:writeVersion']);
    grunt.registerTask('deploy-sdk',                    ['sdk-init', 'clean', copyTask]);

    grunt.registerTask('deploy-sockjs',                 ['sockjs-init', 'clean', 'copy']);
    grunt.registerTask('deploy-xregexp',                ['xregexp-init', 'clean', 'copy']);
    grunt.registerTask('deploy-megapixel',              ['megapixel-init', 'clean', 'copy']);
    grunt.registerTask('deploy-jquery',                 ['jquery-init', 'clean', 'copy']);
    grunt.registerTask('deploy-underscore',             ['underscore-init', 'clean', 'copy']);
    grunt.registerTask('deploy-iscroll',                ['iscroll-init', 'clean', 'copy']);
    grunt.registerTask('deploy-fetch',                  ['fetch-init', 'clean', 'copy']);
    grunt.registerTask('deploy-bootstrap',              ['bootstrap-init', 'clean', 'copy']);
    grunt.registerTask('deploy-jszip',                  ['jszip-init', 'clean', 'copy']);
    grunt.registerTask('deploy-jsziputils',             ['jsziputils-init', 'clean', 'copy']);
    grunt.registerTask('deploy-requirejs',              ['requirejs-init', 'clean', 'uglify']);
    grunt.registerTask('deploy-es6-promise',            ['es6-promise-init', 'clean', 'copy']);

    grunt.registerTask('deploy-app-main',               ['prebuild-icons-sprite', 'main-app-init', 'clean:prebuild', 'imagemin', 'less',
                                                            'requirejs', 'concat', 'copy', 'svgmin', 'inline', 'json-minify',
                                                            'replace:writeVersion', 'replace:prepareHelp', 'clean:postbuild']);

    grunt.registerTask('deploy-app-mobile',             ['mobile-app-init', 'clean:deploy', /*'cssmin',*/ /*'copy:template-backup',*/
                                                            'htmlmin', /*'requirejs',*/ 'exec:webpack_install', 'exec:webpack_app_build', /*'concat',*/ /*'copy:template-restore',*/
                                                            /*'clean:template-backup',*/ 'copy:localization', 'copy:index-page',
                                                            'copy:images-app', 'copy:webpack-dist', 'json-minify',
                                                            'replace:writeVersion', 'replace:fixResourceUrl']);

    grunt.registerTask('deploy-app-embed',              ['embed-app-init', 'clean:prebuild', 'uglify', 'less', 'copy', 
                                                            'clean:postbuild']);

    doRegisterInitializeAppTask('common',               'Common',               'common.json');
    doRegisterInitializeAppTask('documenteditor',       'DocumentEditor',       'documenteditor.json');
    doRegisterInitializeAppTask('spreadsheeteditor',    'SpreadsheetEditor',    'spreadsheeteditor.json');
    doRegisterInitializeAppTask('presentationeditor',   'PresentationEditor',   'presentationeditor.json');


    grunt.registerTask('deploy-app', 'Deploy application.', function(){
        if (packageFile) {
            if (packageFile['tasks']['deploy'])
                grunt.task.run(packageFile['tasks']['deploy']);
            else
                grunt.log.error().writeln('Not found "deploy" task in configure'.red);
        } else {
            grunt.log.error().writeln('Is not load configure file.'.red);
        }
    });

    grunt.registerTask('deploy-common-component',             ['init-build-common', 'deploy-app']);
    grunt.registerTask('deploy-documenteditor-component',     ['init-build-documenteditor', 'deploy-app']);
    grunt.registerTask('deploy-spreadsheeteditor-component',  ['init-build-spreadsheeteditor', 'deploy-app']);
    grunt.registerTask('deploy-presentationeditor-component', ['init-build-presentationeditor', 'deploy-app']);
    // This task is called from the Makefile, don't delete it.
    grunt.registerTask('deploy-documents-component',          ['deploy-common-component']);   

    grunt.registerTask('deploy-documenteditor',     ['deploy-common-component', 'deploy-documenteditor-component']);
    grunt.registerTask('deploy-spreadsheeteditor',  ['deploy-common-component', 'deploy-spreadsheeteditor-component']);
    grunt.registerTask('deploy-presentationeditor', ['deploy-common-component', 'deploy-presentationeditor-component']);

    grunt.registerTask('default', ['deploy-common-component',
                                   'deploy-documenteditor-component',
                                   'deploy-spreadsheeteditor-component',
                                   'deploy-presentationeditor-component']);
};
