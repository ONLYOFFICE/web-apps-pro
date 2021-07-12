/*
 *
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
*/
/**
 * User: Julia.Radzhabova
 * Date: 17.05.16
 * Time: 15:38
 */

define([
    'core',
    'common/main/lib/collection/Plugins',
    'common/main/lib/view/Plugins'
], function () {
    'use strict';

    Common.Controllers.Plugins = Backbone.Controller.extend(_.extend({
        models: [],
        appOptions: {},
        configPlugins: {autostart:[]},// {config: 'from editor config', plugins: 'loaded plugins', UIplugins: 'loaded customization plugins', autostart: 'autostart guids'}
        serverPlugins: {autostart:[]},// {config: 'from editor config', plugins: 'loaded plugins', autostart: 'autostart guids'}
        collections: [
            'Common.Collections.Plugins'
        ],
        views: [
            'Common.Views.Plugins'
        ],

        initialize: function() {
            var me = this;
            this.addListeners({
                'Toolbar': {
                    'render:before' : function (toolbar) {
                        var appOptions = me.getApplication().getController('Main').appOptions;

                        if ( !appOptions.isEditMailMerge && !appOptions.isEditDiagram ) {
                            var tab = {action: 'plugins', caption: me.panelPlugins.groupCaption};
                            me.$toolbarPanelPlugins = me.panelPlugins.getPanel();

                            toolbar.addTab(tab, me.$toolbarPanelPlugins, 10);     // TODO: clear plugins list in left panel
                        }
                    }
                },
                'Common.Views.Plugins': {
                    'plugin:select': function(guid, type) {
                        me.api.asc_pluginRun(guid, type, '');
                    }
                }
            });
        },

        events: function() {
            return {
                'click #id-plugin-close':_.bind(this.onToolClose,this)
            };
        },

        onLaunch: function() {
            var store = this.getApplication().getCollection('Common.Collections.Plugins');
            this.panelPlugins= this.createView('Common.Views.Plugins', {
                storePlugins: store
            });
            this.panelPlugins.on('render:after', _.bind(this.onAfterRender, this));

            store.on({
                add: this.onAddPlugin.bind(this),
                reset: this.onResetPlugins.bind(this)
            });


            this._moveOffset = {x:0, y:0};
            this.autostart = [];

            Common.Gateway.on('init', this.loadConfig.bind(this));
            Common.NotificationCenter.on('app:face', this.onAppShowed.bind(this));
            Common.NotificationCenter.on('uitheme:changed', this.updatePluginsButtons.bind(this));
            Common.NotificationCenter.on('window:resize', this.updatePluginsButtons.bind(this));
        },

        loadConfig: function(data) {
            var me = this;
            me.configPlugins.config = data.config.plugins;
            me.editor = !!window.DE ? 'word' : !!window.PE ? 'slide' : 'cell';
        },

        loadPlugins: function() {
            if (this.configPlugins.config) {
                this.getPlugins(this.configPlugins.config.pluginsData)
                    .then(function(loaded)
                    {
                        me.configPlugins.plugins = loaded;
                        me.mergePlugins();
                    })
                    .catch(function(err)
                    {
                        me.configPlugins.plugins = false;
                    });
            } else
                this.configPlugins.plugins = false;

            var server_plugins_url = '../../../../plugins.json',
                me = this;
            Common.Utils.loadConfig(server_plugins_url, function (obj) {
                if ( obj != 'error' ) {
                    me.serverPlugins.config = obj;
                    me.getPlugins(me.serverPlugins.config.pluginsData)
                        .then(function(loaded)
                        {
                            me.serverPlugins.plugins = loaded;
                            me.mergePlugins();
                        })
                        .catch(function(err)
                        {
                            me.serverPlugins.plugins = false;
                        });
                } else
                    me.serverPlugins.plugins = false;
            });
        },

        onAppShowed: function (config) {
        },

        setApi: function(api) {
            this.api = api;

            if (!this.appOptions.customization || (this.appOptions.customization.plugins!==false)) {
                this.api.asc_registerCallback("asc_onPluginShow", _.bind(this.onPluginShow, this));
                this.api.asc_registerCallback("asc_onPluginClose", _.bind(this.onPluginClose, this));
                this.api.asc_registerCallback("asc_onPluginResize", _.bind(this.onPluginResize, this));
                this.api.asc_registerCallback("asc_onPluginMouseUp", _.bind(this.onPluginMouseUp, this));
                this.api.asc_registerCallback("asc_onPluginMouseMove", _.bind(this.onPluginMouseMove, this));
                this.api.asc_registerCallback('asc_onPluginsReset', _.bind(this.resetPluginsList, this));
                this.api.asc_registerCallback('asc_onPluginsInit', _.bind(this.onPluginsInit, this));

                this.loadPlugins();
            }
            return this;
        },

        setMode: function(mode, api) {
            this.appOptions = mode;
            this.api = api;
            this.customPluginsComplete = !this.appOptions.canBrandingExt;
            if (this.appOptions.canBrandingExt)
                this.getAppCustomPlugins(this.configPlugins);
            return this;
        },

        onAfterRender: function(panelPlugins) {
            panelPlugins.viewPluginsList && panelPlugins.viewPluginsList.on('item:click', _.bind(this.onSelectPlugin, this));
            this.bindViewEvents(this.panelPlugins, this.events);
            var me = this;
            Common.NotificationCenter.on({
                'layout:resizestart': function(e){
                    if (me.panelPlugins.isVisible()) {
                        var offset = me.panelPlugins.currentPluginFrame.offset();
                        me._moveOffset = {x: offset.left + parseInt(me.panelPlugins.currentPluginFrame.css('padding-left')),
                                            y: offset.top + parseInt(me.panelPlugins.currentPluginFrame.css('padding-top'))};
                        me.api.asc_pluginEnableMouseEvents(true);
                    }
                },
                'layout:resizestop': function(e){
                    if (me.panelPlugins.isVisible()) {
                        me.api.asc_pluginEnableMouseEvents(false);
                    }
                }
            });
        },

        refreshPluginsList: function() {
            var me = this;
            var storePlugins = this.getApplication().getCollection('Common.Collections.Plugins'),
                arr = [];
            storePlugins.each(function(item){
                var plugin = new Asc.CPlugin();
                plugin.set_Name(item.get('name'));
                plugin.set_Guid(item.get('guid'));
                plugin.set_BaseUrl(item.get('baseUrl'));
                plugin.set_MinVersion && plugin.set_MinVersion(item.get('minVersion'));

                var variations = item.get('variations'),
                    variationsArr = [];
                variations.forEach(function(itemVar){
                    var variation = new Asc.CPluginVariation();
                    variation.set_Description(itemVar.get('description'));
                    variation.set_Url(itemVar.get('url'));
                    variation.set_Icons(itemVar.get('icons'));
                    variation.set_Visual(itemVar.get('isVisual'));
                    variation.set_CustomWindow(itemVar.get('isCustomWindow'));
                    variation.set_System(itemVar.get('isSystem'));
                    variation.set_Viewer(itemVar.get('isViewer'));
                    variation.set_EditorsSupport(itemVar.get('EditorsSupport'));
                    variation.set_Modal(itemVar.get('isModal'));
                    variation.set_InsideMode(itemVar.get('isInsideMode'));
                    variation.set_InitDataType(itemVar.get('initDataType'));
                    variation.set_InitData(itemVar.get('initData'));
                    variation.set_isNeedNumbering(itemVar.get('isNeedNumbering'));
                    variation.set_UpdateOleOnResize(itemVar.get('isUpdateOleOnResize'));
                    variation.set_Buttons(itemVar.get('buttons'));
                    variation.set_Size(itemVar.get('size'));
                    variation.set_InitOnSelectionChanged(itemVar.get('initOnSelectionChanged'));
                    variation.set_Events(itemVar.get('events'));
                    variation.set_Help(itemVar.get('help'));

                    variationsArr.push(variation);
                });

                plugin.set_Variations(variationsArr);
                item.set('pluginObj', plugin);
                arr.push(plugin);
            });
            this.api.asc_pluginsRegister('', arr);
            if (storePlugins.hasVisible())
                Common.NotificationCenter.trigger('tab:visible', 'plugins', true);
            Common.Gateway.pluginsReady();
        },

        onAddPlugin: function (model) {
            var me = this;
            if ( me.$toolbarPanelPlugins ) {
                var btn = me.panelPlugins.createPluginButton(model);
                if (!btn) return;

                var _group = $('> .group', me.$toolbarPanelPlugins);
                var $slot = $('<span class="btn-slot text x-huge"></span>').appendTo(_group);
                btn.render($slot);
            }
        },

        onResetPlugins: function (collection) {
            var me = this;
            me.appOptions.canPlugins = !collection.isEmpty();
            if ( me.$toolbarPanelPlugins ) {
                me.$toolbarPanelPlugins.empty();

                var _group = $('<div class="group"></div>'),
                    rank = -1,
                    rank_plugins = 0;
                collection.each(function (model) {
                    var new_rank = model.get('groupRank');
                    if (new_rank!==rank && rank>-1 && rank_plugins>0) {
                        _group.appendTo(me.$toolbarPanelPlugins);
                        $('<div class="separator long"></div>').appendTo(me.$toolbarPanelPlugins);
                        _group = $('<div class="group"></div>');
                        rank_plugins = 0;
                    }

                    var btn = me.panelPlugins.createPluginButton(model);
                    if (btn) {
                        var $slot = $('<span class="btn-slot text x-huge"></span>').appendTo(_group);
                        btn.render($slot);
                        rank_plugins++;
                    }
                    rank = new_rank;
                });
                _group.appendTo(me.$toolbarPanelPlugins);
            } else {
                console.error('toolbar panel isnot created');
            }
        },

        updatePluginsButtons: function() {
            var storePlugins = this.getApplication().getCollection('Common.Collections.Plugins'),
                me = this;
            storePlugins.each(function(item){
                me.panelPlugins.updatePluginIcons(item);
            });
        },

        onSelectPlugin: function(picker, item, record, e){
            var btn = $(e.target);
            if (btn && btn.hasClass('plugin-caret')) {
                var menu = this.panelPlugins.pluginMenu;
                if (menu.isVisible()) {
                    menu.hide();
                    return;
                }

                var showPoint, me = this,
                    currentTarget = $(e.currentTarget),
                    parent = $(this.panelPlugins.el),
                    offset = currentTarget.offset(),
                    offsetParent = parent.offset();

                showPoint = [offset.left - offsetParent.left + currentTarget.width(), offset.top - offsetParent.top + currentTarget.height()/2];

                if (record != undefined) {
                    for (var i = 0; i < menu.items.length; i++) {
                        menu.removeItem(menu.items[i]); i--;
                    }
                    menu.removeAll();

                    var variations = record.get('variations');
                    for (var i=0; i<variations.length; i++) {
                        var variation = variations[i],
                            mnu = new Common.UI.MenuItem({
                                caption     : (i>0) ? variation.get('description') : me.panelPlugins.textStart,
                                value       : parseInt(variation.get('index'))
                            }).on('click', function(item, e) {
                                if (me.api) {
                                    me.api.asc_pluginRun(record.get('guid'), item.value, '');
                                }
                        });
                        menu.addItem(mnu);
                    }
                }

                var menuContainer = parent.find('#menu-plugin-container');
                if (!menu.rendered) {
                    if (menuContainer.length < 1) {
                        menuContainer = $('<div id="menu-plugin-container" style="position: absolute; z-index: 10000;"><div class="dropdown-toggle" data-toggle="dropdown"></div></div>', menu.id);
                        parent.append(menuContainer);
                    }
                    menu.render(menuContainer);
                    menu.cmpEl.attr({tabindex: "-1"});

                    menu.on({
                        'show:after': function(cmp) {
                            if (cmp && cmp.menuAlignEl)
                                cmp.menuAlignEl.toggleClass('over', true);
                        },
                        'hide:after': function(cmp) {
                            if (cmp && cmp.menuAlignEl)
                                cmp.menuAlignEl.toggleClass('over', false);
                        }
                    });
                }

                menuContainer.css({left: showPoint[0], top: showPoint[1]});

                menu.menuAlignEl = currentTarget;
                menu.setOffset(-20, -currentTarget.height()/2 - 3);
                menu.show();
                _.delay(function() {
                    menu.cmpEl.focus();
                }, 10);
                e.stopPropagation();
                e.preventDefault();
            } else
                this.api.asc_pluginRun(record.get('guid'), 0, '');
        },

        onPluginShow: function(plugin, variationIndex, frameId, urlAddition) {
            var variation = plugin.get_Variations()[variationIndex];
            if (variation.get_Visual()) {
                var url = variation.get_Url();
                url = ((plugin.get_BaseUrl().length == 0) ? url : plugin.get_BaseUrl()) + url;
                if (urlAddition)
                    url += urlAddition;
                if (variation.get_InsideMode()) {
                    if (!this.panelPlugins.openInsideMode(plugin.get_Name(), url, frameId))
                        this.api.asc_pluginButtonClick(-1);
                } else {
                    var me = this,
                        isCustomWindow = variation.get_CustomWindow(),
                        arrBtns = variation.get_Buttons(),
                        newBtns = [],
                        size = variation.get_Size(),
                        isModal = variation.get_Modal();
                        if (!size || size.length<2) size = [800, 600];

                    if (_.isArray(arrBtns)) {
                        _.each(arrBtns, function(b, index){
                            if (b.visible)
                                newBtns[index] = {caption: b.text, value: index, primary: b.primary};
                        });
                    }

                    var help = variation.get_Help();
                    me.pluginDlg = new Common.Views.PluginDlg({
                        cls: isCustomWindow ? 'plain' : '',
                        header: !isCustomWindow,
                        title: plugin.get_Name(),
                        width: size[0], // inner width
                        height: size[1], // inner height
                        url: url,
                        frameId : frameId,
                        buttons: isCustomWindow ? undefined : newBtns,
                        toolcallback: _.bind(this.onToolClose, this),
                        help: !!help,
                        modal: isModal!==undefined ? isModal : true
                    });
                    me.pluginDlg.on({
                        'render:after': function(obj){
                            obj.getChild('.footer .dlg-btn').on('click', _.bind(me.onDlgBtnClick, me));
                            me.pluginContainer = me.pluginDlg.$window.find('#id-plugin-container');
                        },
                        'close': function(obj){
                            me.pluginDlg = undefined;
                        },
                        'drag': function(args){
                            me.api.asc_pluginEnableMouseEvents(args[1]=='start');
                        },
                        'resize': function(args){
                            me.api.asc_pluginEnableMouseEvents(args[1]=='start');
                        },
                        'help': function(){
                            help && window.open(help, '_blank');
                        }
                    });

                    me.pluginDlg.show();
                }
            }
            this.panelPlugins.openedPluginMode(plugin.get_Guid());
        },

        onPluginClose: function(plugin) {
            if (this.pluginDlg)
                this.pluginDlg.close();
            else if (this.panelPlugins.iframePlugin)
                this.panelPlugins.closeInsideMode();
            this.panelPlugins.closedPluginMode(plugin.get_Guid());
            this.runAutoStartPlugins();
        },

        onPluginResize: function(size, minSize, maxSize, callback ) {
            if (this.pluginDlg) {
                var resizable = (minSize && minSize.length>1 && maxSize && maxSize.length>1 && (maxSize[0] > minSize[0] || maxSize[1] > minSize[1] || maxSize[0]==0 || maxSize[1] == 0));
                this.pluginDlg.setResizable(resizable, minSize, maxSize);
                this.pluginDlg.setInnerSize(size[0], size[1]);
                if (callback)
                    callback.call();
            }
        },
        
        onDlgBtnClick: function(event) {
            var state = event.currentTarget.attributes['result'].value;
            this.api.asc_pluginButtonClick(parseInt(state));
        },

        onToolClose: function() {
            this.api.asc_pluginButtonClick(-1);
        },

        onPluginMouseUp: function(x, y) {
            if (this.pluginDlg) {
                if (this.pluginDlg.binding.dragStop) this.pluginDlg.binding.dragStop();
                if (this.pluginDlg.binding.resizeStop) this.pluginDlg.binding.resizeStop();
            } else
                Common.NotificationCenter.trigger('frame:mouseup', { pageX: x*Common.Utils.zoom()+this._moveOffset.x, pageY: y*Common.Utils.zoom()+this._moveOffset.y });
        },
        
        onPluginMouseMove: function(x, y) {
            if (this.pluginDlg) {
                var offset = this.pluginContainer.offset();
                if (this.pluginDlg.binding.drag) this.pluginDlg.binding.drag({ pageX: x*Common.Utils.zoom()+offset.left, pageY: y*Common.Utils.zoom()+offset.top });
                if (this.pluginDlg.binding.resize) this.pluginDlg.binding.resize({ pageX: x*Common.Utils.zoom()+offset.left, pageY: y*Common.Utils.zoom()+offset.top });
            } else
                Common.NotificationCenter.trigger('frame:mousemove', { pageX: x*Common.Utils.zoom()+this._moveOffset.x, pageY: y*Common.Utils.zoom()+this._moveOffset.y });
        },

        onPluginsInit: function(pluginsdata) {
            !(pluginsdata instanceof Array) && (pluginsdata = pluginsdata["pluginsData"]);
            this.parsePlugins(pluginsdata)
        },

        runAutoStartPlugins: function() {
            if (this.autostart && this.autostart.length > 0) {
                this.api.asc_pluginRun(this.autostart.shift(), 0, '');
            }
        },

        resetPluginsList: function() {
            this.getApplication().getCollection('Common.Collections.Plugins').reset();
        },

        applyUICustomization: function () {
            var me = this;
            return new Promise(function(resolve, reject) {
                var timer_sl = setInterval(function() {
                    if ( me.customPluginsComplete ) {
                        clearInterval(timer_sl);
                        try {
                            me.configPlugins.UIplugins && me.configPlugins.UIplugins.forEach(function (c) {
                                if ( c.code ) eval(c.code);
                            });
                        } catch (e) {}
                        resolve();
                    }
                }, 10);
            });
        },

        parsePlugins: function(pluginsdata, uiCustomize) {
            var me = this;
            var pluginStore = this.getApplication().getCollection('Common.Collections.Plugins'),
                isEdit = me.appOptions.isEdit,
                editor = me.editor,
                apiVersion = me.api ? me.api.GetVersion() : undefined;
            if ( pluginsdata instanceof Array ) {
                var arr = [], arrUI = [],
                    lang = me.appOptions.lang.split(/[\-_]/)[0];
                pluginsdata.forEach(function(item){
                    if ( arr.some(function(i) {
                                return (i.get('baseUrl') == item.baseUrl || i.get('guid') == item.guid);
                            }
                        ) || pluginStore.findWhere({baseUrl: item.baseUrl}) || pluginStore.findWhere({guid: item.guid}))
                    {
                        return;
                    }

                    var variationsArr = [],
                        pluginVisible = false;
                    item.variations.forEach(function(itemVar){
                        var visible = (isEdit || itemVar.isViewer && (itemVar.isDisplayedInViewer!==false)) && _.contains(itemVar.EditorsSupport, editor) && !itemVar.isSystem;
                        if ( visible ) pluginVisible = true;

                        if (item.isUICustomizer ) {
                            visible && arrUI.push({
                                url: item.baseUrl + itemVar.url
                            });
                        } else {
                            var model = new Common.Models.PluginVariation(itemVar);
                            var description = itemVar.description;
                            if (typeof itemVar.descriptionLocale == 'object')
                                description = itemVar.descriptionLocale[lang] || itemVar.descriptionLocale['en'] || description || '';

                            _.each(itemVar.buttons, function(b, index){
                                if (typeof b.textLocale == 'object')
                                    b.text = b.textLocale[lang] || b.textLocale['en'] || b.text || '';
                                b.visible = (isEdit || b.isViewer !== false);
                            });

                            model.set({
                                description: description,
                                index: variationsArr.length,
                                url: itemVar.url,
                                icons: itemVar.icons2 || itemVar.icons,
                                buttons: itemVar.buttons,
                                visible: visible,
                                help: itemVar.help
                            });

                            variationsArr.push(model);
                        }
                    });

                    if (variationsArr.length > 0 && !item.isUICustomizer) {
                        var name = item.name;
                        if (typeof item.nameLocale == 'object')
                            name = item.nameLocale[lang] || item.nameLocale['en'] || name || '';

                        if (pluginVisible)
                            pluginVisible = me.checkPluginVersion(apiVersion, item.minVersion);

                        arr.push(new Common.Models.Plugin({
                            name : name,
                            guid: item.guid,
                            baseUrl : item.baseUrl,
                            variations: variationsArr,
                            currentVariation: 0,
                            visible: pluginVisible,
                            groupName: (item.group) ? item.group.name : '',
                            groupRank: (item.group) ? item.group.rank : 0,
                            minVersion: item.minVersion
                        }));
                    }
                });

                if ( uiCustomize!==false )  // from ui customizer in editor config or desktop event
                    me.configPlugins.UIplugins = arrUI;

                if ( !uiCustomize && pluginStore)
                {
                    arr = pluginStore.models.concat(arr);
                    arr.sort(function(a, b){
                        var rank_a = a.get('groupRank'),
                            rank_b = b.get('groupRank');
                        if (rank_a < rank_b)
                            return (rank_a==0) ? 1 : -1;
                        if (rank_a > rank_b)
                            return (rank_b==0) ? -1 : 1;
                        return 0;
                    });
                    pluginStore.reset(arr);
                    this.appOptions.canPlugins = !pluginStore.isEmpty();
                }
            }
            else if (!uiCustomize){
                this.appOptions.canPlugins = false;
            }

            if (!uiCustomize)
                this.getApplication().getController('LeftMenu').enablePlugins();

            if (this.appOptions.canPlugins) {
                this.refreshPluginsList();
                this.runAutoStartPlugins();
            }
        },

        checkPluginVersion: function(apiVersion, pluginVersion) {
            if (apiVersion && apiVersion!=='develop' && pluginVersion && typeof pluginVersion == 'string') {
                var res = pluginVersion.match(/^([0-9]+)(?:.([0-9]+))?(?:.([0-9]+))?$/),
                    apires = apiVersion.match(/^([0-9]+)(?:.([0-9]+))?(?:.([0-9]+))?$/);
                if (res && res.length>1 && apires && apires.length>1) {
                    for (var i=0; i<3; i++) {
                        var pluginVer = res[i+1] ? parseInt(res[i+1]) : 0,
                            apiVer = apires[i+1] ? parseInt(apires[i+1]) : 0;
                        if (pluginVer>apiVer)
                            return false;
                        if (pluginVer<apiVer)
                            return true;
                    }
                }

            }
            return true;
        },

        getPlugins: function(pluginsData, fetchFunction) {
            if (!pluginsData || pluginsData.length<1)
                return Promise.resolve([]);

            fetchFunction = fetchFunction || function (url) {
                    return fetch(url)
                        .then(function(response) {
                            if ( response.ok ) return response.json();
                            else return Promise.reject(url);
                        }).then(function(json) {
                            json.baseUrl = url.substring(0, url.lastIndexOf("config.json"));
                            return json;
                        });
                };

            var loaded = [];
            return pluginsData.map(fetchFunction).reduce(function (previousPromise, currentPromise) {
                return previousPromise
                    .then(function()
                    {
                        return currentPromise;
                    })
                    .then(function(item)
                    {
                        loaded.push(item);
                        return Promise.resolve(item);
                    })
                    .catch(function(item)
                    {
                        return Promise.resolve(item);
                    });

            }, Promise.resolve())
                .then(function ()
                {
                    return Promise.resolve(loaded);
                });
        },

        mergePlugins: function() {
            if (this.serverPlugins.plugins !== undefined && this.configPlugins.plugins !== undefined) { // undefined - plugins are loading
                var autostart = [],
                    arr = [],
                    plugins = this.configPlugins,
                    warn = false;
                if (plugins.plugins && plugins.plugins.length>0)
                    arr = plugins.plugins;
                if (plugins && plugins.config) {
                    var val = plugins.config.autostart || plugins.config.autoStartGuid;
                    if (typeof (val) == 'string')
                        val = [val];
                    warn = !!plugins.config.autoStartGuid;
                    autostart = val || [];
                }

                plugins = this.serverPlugins;
                if (plugins.plugins && plugins.plugins.length>0)
                    arr = arr.concat(plugins.plugins);
                if (plugins && plugins.config) {
                    val = plugins.config.autostart || plugins.config.autoStartGuid;
                    if (typeof (val) == 'string')
                        val = [val];
                    (warn || plugins.config.autoStartGuid) && console.warn("Obsolete: The autoStartGuid parameter is deprecated. Please check the documentation for new plugin connection configuration.");
                    autostart = autostart.concat(val || []);
                }

                this.autostart = autostart;
                this.parsePlugins(arr, false);
            }
        },

        getAppCustomPlugins: function (plugins) {
            var me = this,
                funcComplete = function() {me.customPluginsComplete = true;};
            if ( plugins.config ) {
                this.getPlugins(plugins.config.UIpluginsData)
                    .then(function(loaded)
                    {
                        me.parsePlugins(loaded, true);
                        me.getPlugins(plugins.UIplugins, function(item) {
                            return fetch(item.url)
                                .then(function(response) {
                                    if ( response.ok ) return response.text();
                                    else return Promise.reject();
                                })
                                .then(function(text) {
                                    item.code = text;
                                    return text;
                                });
                        }).then(funcComplete, funcComplete);
                    }, funcComplete);
            } else
                funcComplete();
        }
    }, Common.Controllers.Plugins || {}));
});
