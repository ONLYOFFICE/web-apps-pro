/*
 *
 * (c) Copyright Ascensio System SIA 2010-2020
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
 *  SlicerSettings.js
 *
 *  Created by Julia Radzhabova on 5/26/20
 *  Copyright (c) 2020 Ascensio System SIA. All rights reserved.
 *
 */
define([
    'text!spreadsheeteditor/main/app/template/SlicerSettings.template',
    'jquery',
    'underscore',
    'backbone',
    'common/main/lib/component/Button',
    'common/main/lib/component/MetricSpinner',
    'spreadsheeteditor/main/app/view/SlicerSettingsAdvanced'
], function (menuTemplate, $, _, Backbone) {
    'use strict';

    SSE.Views.SlicerSettings = Backbone.View.extend(_.extend({
        el: '#id-slicer-settings',

        // Compile our stats template
        template: _.template(menuTemplate),

        // Delegated events for creating new items, and clearing completed ones.
        events: {
        },

        options: {
            alias: 'SlicerSettings'
        },

        initialize: function () {
            this._initSettings = true;

            this._nRatio = 1;
            this._state = {
                Width: 0,
                Height: 0,
                DisabledControls: false,
                keepRatio: false,
                ColCount: 0,
                ColWidth: 0,
                ColHeight: 0,
                PosVert: 0,
                PosHor: 0,
                PosLocked: false
            };
            this.spinners = [];
            this.lockedControls = [];
            this._locked = false;

            this._noApply = false;
            this._originalProps = null;
            this.styles = null;

            this.render();
        },

        render: function () {
            var el = $(this.el);
            el.html(this.template({
                scope: this
            }));

            this.linkAdvanced = $('#slicer-advanced-link');
        },

        setApi: function(api) {
            if ( api == undefined ) return;
            this.api = api;
            this.api.asc_registerCallback('asc_onSendThemeColors',    _.bind(this.onSendThemeColors, this));
            return this;
        },

        setMode: function(mode) {
            this.mode = mode;
        },

        updateMetricUnit: function() {
            if (this.spinners) {
                for (var i=0; i<this.spinners.length; i++) {
                    var spinner = this.spinners[i];
                    spinner.setDefaultUnit(Common.Utils.Metric.getCurrentMetricName());
                    spinner.setStep(Common.Utils.Metric.getCurrentMetric()==Common.Utils.Metric.c_MetricUnits.pt ? 1 : 0.1);
                }
            }
        },

        createDelayedControls: function() {
            var me = this;
            this.spnWidth = new Common.UI.MetricSpinner({
                el: $('#slicer-spin-width'),
                step: .1,
                width: 78,
                defaultUnit : "cm",
                value: '0 cm',
                maxValue: 5963.9,
                minValue: 0
            });
            this.spinners.push(this.spnWidth);
            this.lockedControls.push(this.spnWidth);

            this.spnHeight = new Common.UI.MetricSpinner({
                el: $('#slicer-spin-height'),
                step: .1,
                width: 78,
                defaultUnit : "cm",
                value: '0 cm',
                maxValue: 5963.9,
                minValue: 0
            });
            this.spinners.push(this.spnHeight);
            this.lockedControls.push(this.spnHeight);

            this.btnRatio = new Common.UI.Button({
                parentEl: $('#slicer-button-ratio'),
                cls: 'btn-toolbar',
                iconCls: 'toolbar__icon advanced-btn-ratio',
                style: 'margin-bottom: 1px;',
                enableToggle: true,
                hint: this.textKeepRatio
            });
            this.lockedControls.push(this.btnRatio);

            this.btnRatio.on('click', _.bind(function(btn, e) {
                if (btn.pressed && this.spnHeight.getNumberValue()>0) {
                    this._nRatio = this.spnWidth.getNumberValue()/this.spnHeight.getNumberValue();
                }
                if (this.api)  {
                    if (this._originalProps) {
                        this._originalProps.asc_putLockAspect(btn.pressed);
                        this.api.asc_setGraphicObjectProps(this._originalProps);
                    }
                }
            }, this));

            this.spnWidth.on('change', _.bind(this.onWidthChange, this));
            this.spnHeight.on('change', _.bind(this.onHeightChange, this));
            this.spnWidth.on('inputleave', function(){ Common.NotificationCenter.trigger('edit:complete', me);});
            this.spnHeight.on('inputleave', function(){ Common.NotificationCenter.trigger('edit:complete', me);});

            this.spnHor = new Common.UI.MetricSpinner({
                el: $('#slicer-spin-hor'),
                step: .1,
                width: 85,
                defaultUnit : "cm",
                value: '0 cm',
                maxValue: 5963.9,
                minValue: 0
            });
            this.spinners.push(this.spnHor);
            this.lockedControls.push(this.spnHor);

            this.spnVert = new Common.UI.MetricSpinner({
                el: $('#slicer-spin-vert'),
                step: .1,
                width: 85,
                defaultUnit : "cm",
                value: '0 cm',
                maxValue: 5963.9,
                minValue: 0
            });
            this.spinners.push(this.spnVert);
            this.lockedControls.push(this.spnVert);

            // this.spnHor.on('change', _.bind(this.onHorChange, this));
            // this.spnVert.on('change', _.bind(this.onVertChange, this));
            this.spnHor.on('inputleave', function(){ Common.NotificationCenter.trigger('edit:complete', me);});
            this.spnVert.on('inputleave', function(){ Common.NotificationCenter.trigger('edit:complete', me);});

            this.chLock = new Common.UI.CheckBox({
                el: $('#slicer-checkbox-disable-resize'),
                labelText: this.textLock,
                disabled: this._locked
            });
            this.lockedControls.push(this.chLock);
            this.chLock.on('change', this.onLockSlicerChange.bind(this));

            this.spnColWidth = new Common.UI.MetricSpinner({
                el: $('#slicer-spin-col-width'),
                step: .1,
                width: 85,
                defaultUnit : "cm",
                value: '0 cm',
                maxValue: 5963.9,
                minValue: 0
            });
            this.spinners.push(this.spnColWidth);
            this.lockedControls.push(this.spnColWidth);

            this.spnColHeight = new Common.UI.MetricSpinner({
                el: $('#slicer-spin-col-height'),
                step: .1,
                width: 85,
                defaultUnit : "cm",
                value: '0 cm',
                maxValue: 5963.9,
                minValue: 0
            });
            this.spinners.push(this.spnColHeight);
            this.lockedControls.push(this.spnColHeight);

            this.numCols = new Common.UI.MetricSpinner({
                el: $('#slicer-spin-cols'),
                step: 1,
                width: 50,
                defaultUnit : "",
                defaultValue : 1,
                value: '1',
                allowDecimal: false,
                maxValue: 20000,
                minValue: 1
            });
            this.lockedControls.push(this.numCols);

            this.spnColWidth.on('change', _.bind(this.onColWidthChange, this));
            this.spnColHeight.on('change', _.bind(this.onColHeightChange, this));
            this.numCols.on('change', _.bind(this.onColChange, this));
            this.spnColWidth.on('inputleave', function(){ Common.NotificationCenter.trigger('edit:complete', me);});
            this.spnColHeight.on('inputleave', function(){ Common.NotificationCenter.trigger('edit:complete', me);});
            this.numCols.on('inputleave', function(){ Common.NotificationCenter.trigger('edit:complete', me);});

            $(this.el).on('click', '#slicer-advanced-link', _.bind(this.openAdvancedSettings, this));
        },

        createDelayedElements: function() {
            this.createDelayedControls();
            this.updateMetricUnit();
            this._initSettings = false;
        },

        onSendThemeColors: function() {
            // get new table templates
            if (this.mnuSlicerPicker && this._originalProps) {
                this.onInitStyles(this._originalProps.asc_getSlicerProperties().asc_getStylesPictures());
                this.mnuSlicerPicker.scroller.update({alwaysVisibleY: true});
            }
        },

        openAdvancedSettings: function(e) {
            if (this.linkAdvanced.hasClass('disabled')) return;

            var me = this;
            var win;
            if (me.api && !this._locked){
                var selectedElements = me.api.asc_getGraphicObjectProps();
                if (selectedElements && selectedElements.length>0){
                    var elType, elValue;
                    for (var i = selectedElements.length - 1; i >= 0; i--) {
                        elType = selectedElements[i].asc_getObjectType();
                        elValue = selectedElements[i].asc_getObjectValue();
                        if (Asc.c_oAscTypeSelectElement.Image == elType) {
                            (new SSE.Views.SlicerSettingsAdvanced(
                                {
                                    imageProps: elValue,
                                    api: me.api,
                                    styles: me.styles || me._originalProps.asc_getSlicerProperties().asc_getStylesPictures(),
                                    handler: function(result, value) {
                                        if (result == 'ok') {
                                            if (me.api) {
                                                me.api.asc_setGraphicObjectProps(value.imageProps);
                                            }
                                        }

                                        Common.NotificationCenter.trigger('edit:complete', me);
                                    }
                                })).show();
                            break;
                        }
                    }
                }
            }
        },

        ChangeSettings: function(props) {
            if (this._initSettings)
                this.createDelayedElements();

            this.disableControls(this._locked);

            if (props ){
                this._originalProps = new Asc.asc_CImgProperty(props);

                var value = props.asc_getWidth();
                if ( Math.abs(this._state.Width-value)>0.001 ||
                    (this._state.Width===null || value===null)&&(this._state.Width!==value)) {
                    this.spnWidth.setValue((value!==null) ? Common.Utils.Metric.fnRecalcFromMM(value) : '', true);
                    this._state.Width = value;
                }

                value = props.asc_getHeight();
                if ( Math.abs(this._state.Height-value)>0.001 ||
                    (this._state.Height===null || value===null)&&(this._state.Height!==value)) {
                    this.spnHeight.setValue((value!==null) ? Common.Utils.Metric.fnRecalcFromMM(value) : '', true);
                    this._state.Height = value;
                }

                if (props.asc_getHeight()>0)
                    this._nRatio = props.asc_getWidth()/props.asc_getHeight();

                value = props.asc_getLockAspect();
                if (this._state.keepRatio!==value) {
                    this.btnRatio.toggle(value);
                    this._state.keepRatio=value;
                }

                var slicerprops = props.asc_getSlicerProperties();
                if (slicerprops) {
                    value = slicerprops.asc_getColumnCount();
                    if ( Math.abs(this._state.ColCount-value)>0.1 ||
                        (this._state.ColCount===null || value===null)&&(this._state.ColCount!==value)) {
                        this.numCols.setValue((value!==null) ? value : '', true);
                        this._state.ColCount = value;
                    }

                    value = slicerprops.asc_getButtonWidth()/36000;
                    if ( Math.abs(this._state.ColWidth-value)>0.001 ||
                        (this._state.ColWidth===null || value===null)&&(this._state.ColWidth!==value)) {
                        this.spnColWidth.setValue((value!==null) ? Common.Utils.Metric.fnRecalcFromMM(value) : '', true);
                        this._state.ColWidth = value;
                    }

                    value = slicerprops.asc_getRowHeight()/36000;
                    if ( Math.abs(this._state.ColHeight-value)>0.001 ||
                        (this._state.ColHeight===null || value===null)&&(this._state.ColHeight!==value)) {
                        this.spnColHeight.setValue((value!==null) ? Common.Utils.Metric.fnRecalcFromMM(value) : '', true);
                        this._state.ColHeight = value;
                    }

                    if (!this.btnSlicerStyle)
                        this.onInitStyles(slicerprops.asc_getStylesPictures());
                    value = slicerprops.asc_getStyle();
                    if (this._state.StyleType!==value || this._isTemplatesChanged) {
                        var rec = this.mnuSlicerPicker.store.findWhere({type: value});
                        if (!rec) {
                            rec = this.mnuSlicerPicker.store.at(0);
                        }
                        this.btnSlicerStyle.suspendEvents();
                        this.mnuSlicerPicker.selectRecord(rec, true);
                        this.btnSlicerStyle.resumeEvents();
                        this.$el.find('.icon-template-slicer').css({'background-image': 'url(' + rec.get("imageUrl") + ')', 'height': '49px', 'width': '36px', 'background-position': 'center', 'background-size': 'cover'});
                        this._state.StyleType=value;
                    }
                    this._isTemplatesChanged = false;

                    value = slicerprops.asc_getLockedPosition();
                    if ( this._state.PosLocked!==value ) {
                        this.chLock.setValue((value !== null && value !== undefined) ? !!value : 'indeterminate', true);
                        this._state.PosLocked=value;
                    }
                }
            }
        },

        onWidthChange: function(field, newValue, oldValue, eOpts){
            var w = field.getNumberValue();
            var h = this.spnHeight.getNumberValue();
            if (this.btnRatio.pressed) {
                h = w/this._nRatio;
                if (h>this.spnHeight.options.maxValue) {
                    h = this.spnHeight.options.maxValue;
                    w = h * this._nRatio;
                    this.spnWidth.setValue(w, true);
                }
                this.spnHeight.setValue(h, true);
            }
            if (this.api)  {
                if (this._originalProps) {
                    this._originalProps.asc_putWidth(Common.Utils.Metric.fnRecalcToMM(w));
                    this._originalProps.asc_putHeight(Common.Utils.Metric.fnRecalcToMM(h));
                    this.api.asc_setGraphicObjectProps(this._originalProps);
                }
            }
        },

        onHeightChange: function(field, newValue, oldValue, eOpts){
            var h = field.getNumberValue(), w = this.spnWidth.getNumberValue();
            if (this.btnRatio.pressed) {
                w = h * this._nRatio;
                if (w>this.spnWidth.options.maxValue) {
                    w = this.spnWidth.options.maxValue;
                    h = w/this._nRatio;
                    this.spnHeight.setValue(h, true);
                }
                this.spnWidth.setValue(w, true);
            }
            if (this.api)  {
                if (this._originalProps) {
                    this._originalProps.asc_putWidth(Common.Utils.Metric.fnRecalcToMM(w));
                    this._originalProps.asc_putHeight(Common.Utils.Metric.fnRecalcToMM(h));
                    this.api.asc_setGraphicObjectProps(this._originalProps);
                }
            }
        },

        onColWidthChange: function(field, newValue, oldValue, eOpts){
            if (this.api)  {
                if (this._originalProps) {
                    this._originalProps.asc_getSlicerProperties().asc_setButtonWidth(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue())*36000);
                    this.api.asc_setGraphicObjectProps(this._originalProps);
                }
            }
        },

        onColHeightChange: function(field, newValue, oldValue, eOpts){
            if (this.api)  {
                if (this._originalProps) {
                    this._originalProps.asc_getSlicerProperties().asc_setRowHeight(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue())*36000);
                    this.api.asc_setGraphicObjectProps(this._originalProps);
                }
            }
        },

        onColChange: function(field, newValue, oldValue, eOpts){
            if (this.api)  {
                if (this._originalProps) {
                    this._originalProps.asc_getSlicerProperties().asc_setColumnCount(field.getNumberValue());
                    this.api.asc_setGraphicObjectProps(this._originalProps);
                }
            }
        },

        onInitStyles: function(Templates){
            var self = this;
            this._isTemplatesChanged = true;
            this.styles = Templates;

            if (!this.btnSlicerStyle) {
                this.btnSlicerStyle = new Common.UI.Button({
                    cls         : 'btn-large-dataview sheet-template-slicer',
                    iconCls     : 'icon-template-slicer',
                    menu        : new Common.UI.Menu({
                        style: 'width: 333px;',
                        items: [
                            { template: _.template('<div id="id-slicer-menu-style" class="menu-slicer-template"  style="margin: 5px 5px 5px 10px;"></div>') }
                        ]
                    })
                });
                this.btnSlicerStyle.on('render:after', function(btn) {
                    self.mnuSlicerPicker = new Common.UI.DataView({
                        el: $('#id-slicer-menu-style'),
                        parentMenu: btn.menu,
                        restoreHeight: 325,
                        groups: new Common.UI.DataViewGroupStore(),
                        store: new Common.UI.DataViewStore(),
                        itemTemplate: _.template('<div id="<%= id %>" class="item"><img src="<%= imageUrl %>" height="49" width="36"></div>'),
                        style: 'max-height: 325px;'
                    });
                });
                this.btnSlicerStyle.render($('#slicer-btn-style'));
                this.lockedControls.push(this.btnSlicerStyle);
                this.mnuSlicerPicker.on('item:click', _.bind(this.onSelectSlicerStyle, this, this.btnSlicerStyle));
                if (this._locked) this.btnSlicerStyle.setDisabled(this._locked);
            }

            if (Templates) {
                var count = self.mnuSlicerPicker.store.length;
                if (count>0 && count==Templates.length) {
                    var data = self.mnuSlicerPicker.store.models;
                    _.each(Templates, function(template, index){
                        data[index].set('imageUrl', template.asc_getImage());
                    });
                } else {
                    var arr = [];
                    _.each(Templates, function(template){
                        arr.push({
                            id          : Common.UI.getId(),
                            type        : template.asc_getName(),
                            imageUrl    : template.asc_getImage(),
                            allowSelected : true,
                            selected    : false
                        });
                    });
                    self.mnuSlicerPicker.store.reset(arr);
                }
            }
            this.btnSlicerStyle.setDisabled(this.mnuSlicerPicker.store.length<1 || this._locked);
        },

        onSelectSlicerStyle: function(btn, picker, itemView, record) {
            if (this._noApply) return;

            if (this._originalProps) {
                this._originalProps.asc_getSlicerProperties().asc_setStyle(record.get('type'));
                this.api.asc_setGraphicObjectProps(this._originalProps);
            }
        },

        onLockSlicerChange: function(field, newValue, oldValue, eOpts){
            if (this.api)  {
                if (this._originalProps) {
                    this._originalProps.asc_getSlicerProperties().asc_setLockedPosition(field.getValue()=='checked');
                    this.api.asc_setGraphicObjectProps(this._originalProps);
                }
            }
        },

        setLocked: function (locked) {
            this._locked = locked;
        },

        disableControls: function(disable) {
            if (this._initSettings) return;

            if (this._state.DisabledControls!==disable) {
                this._state.DisabledControls = disable;
                _.each(this.lockedControls, function(item) {
                    item.setDisabled(disable);
                });
                this.linkAdvanced.toggleClass('disabled', disable);
            }
        },

        textKeepRatio: 'Constant Proportions',
        textSize:       'Size',
        textWidth:      'Width',
        textHeight:     'Height',
        textAdvanced:   'Show advanced settings',
        textPosition: 'Position',
        textHor: 'Horizontal',
        textVert: 'Vertical',
        textButtons: 'Buttons',
        textColumns: 'Columns',
        textStyle: 'Style',
        textLock: 'Disable resizing or moving'

    }, SSE.Views.SlicerSettings || {}));
});
