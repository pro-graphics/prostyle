/*!
 * VERSION: 0.20.0
 * DATE: 17-Aug-2015
 * UPDATES AND DOCS AT: https://prostyle.io/plus/
 * 
 * This file is part of ProStyle Plus, a set of premium extensions for ProStyle. It may be
 * used for free for personal projects or licensed per website domain name for commercial use.
 * 
 * @copyright - Copyright (c) 2013-2015, Pro Graphics, Inc. All rights reserved. 
 * @license - This work is subject to the terms at https://prostyle.io/plus/license/
 * @author: Gary Chamberlain, gary@pro.graphics.
 * 
 **/

/// <reference path="../../../ts/prostyle.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var Items;
        (function (Items) {
            var BarChart;
            (function (BarChart) {
                var Variables = ProStyle.Models.Properties.Variables;
                var BarDataVariableType = (function (_super) {
                    __extends(BarDataVariableType, _super);
                    function BarDataVariableType(label, jsonNames, cssName, defaultValue, text, alwaysInitializeCss) {
                        _super.call(this, label, jsonNames, cssName, text, defaultValue, alwaysInitializeCss);
                    }
                    BarDataVariableType.prototype.scrubValue = function (value) {
                        var d = [];
                        if (typeof value === 'number') {
                            return [[undefined, value]];
                        }
                        else if (typeof value === 'string') {
                            var parts = value.split(",");
                            parts.forEach(function (part) {
                                d.push([0, ProStyle.Util.convertToNumber(part.trim())]);
                            });
                        }
                        else if (value instanceof Array) {
                            value.forEach(function (datum) {
                                if (datum instanceof Array) {
                                    d.push([
                                        datum.length > 0 ? ProStyle.Util.convertToNumber(datum[0]) : 0,
                                        datum.length > 1 ? ProStyle.Util.convertToNumber(datum[1]) : 0
                                    ]);
                                }
                                else {
                                    d.push([0, ProStyle.Util.convertToNumber(datum)]);
                                }
                            });
                        }
                        return d;
                    };
                    BarDataVariableType.prototype.writeCssBucket = function (story, model, containerSize, bucket, value) {
                        var proCache = bucket.element["proCache"] || {};
                        bucket.element["proCache"] = proCache;
                        var index = bucket.elementIndex;
                        var proData = proCache.data = [0, 0];
                        if (value.length > index) {
                            var datum = value[index];
                            if (datum.length > 0)
                                proData[0] = datum[0];
                            if (datum.length > 1)
                                proData[1] = datum[1];
                        }
                    };
                    return BarDataVariableType;
                })(Variables.VariableType);
                BarChart.BarDataVariableType = BarDataVariableType;
            })(BarChart = Items.BarChart || (Items.BarChart = {}));
        })(Items = Extensions.Items || (Extensions.Items = {}));
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
/// <reference path="../../../ts/prostyle.d.ts" />
/// <reference path="BarDataVariableType.ts" />
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var Items;
        (function (Items) {
            var BarChart;
            (function (BarChart) {
                var Properties = ProStyle.Models.Properties;
                var BarDataPropertyType = (function (_super) {
                    __extends(BarDataPropertyType, _super);
                    function BarDataPropertyType() {
                        var v = [];
                        v.push(new BarChart.BarDataVariableType("values", ["values"], "dummy", [], "", true));
                        _super.call(this, "data", ["data"], v);
                    }
                    BarDataPropertyType.prototype.createPropertyFromBoolean = function (json) {
                        return _super.prototype.createPropertyFromBoolean.call(this, false);
                    };
                    BarDataPropertyType.prototype.createProperty = function (json) {
                        var property = new Properties.Property(this);
                        property["values"].setValue(json);
                        return property;
                    };
                    BarDataPropertyType.prototype.createPropertyFromNumber = function (json) {
                        return this.createProperty(json);
                    };
                    BarDataPropertyType.prototype.createPropertyFromString = function (json) {
                        return this.createProperty(json);
                    };
                    BarDataPropertyType.prototype.createPropertyFromArray = function (json) {
                        return this.createProperty(json);
                    };
                    BarDataPropertyType.prototype.renderLabel = function (property) {
                        return this.renderVariables(property, false, true);
                    };
                    return BarDataPropertyType;
                })(Properties.PropertyType);
                BarChart.BarDataPropertyType = BarDataPropertyType;
            })(BarChart = Items.BarChart || (Items.BarChart = {}));
        })(Items = Extensions.Items || (Extensions.Items = {}));
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
/// <reference path="../../../ts/prostyle.d.ts" />
/// <reference path="BarChartItemModel.ts" />
/// <reference path="BarDataPropertyType.ts" />
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var Items;
        (function (Items) {
            var BarChart;
            (function (BarChart) {
                var Properties = ProStyle.Models.Properties;
                var BarChartPropertyTypes = (function () {
                    function BarChartPropertyTypes() {
                    }
                    BarChartPropertyTypes.cacheProperties = function () {
                        BarChartPropertyTypes._propertyTypes = [];
                        BarChartPropertyTypes._barPropertyTypes = [];
                        var p = BarChartPropertyTypes._propertyTypes;
                        p.push(Properties.Cache.ANIMATION);
                        p.push(Properties.Cache.CROP_SVG);
                        p.push(Properties.Cache.OPACITY);
                        p.push(Properties.Cache.POSITION);
                        p.push(Properties.Cache.ROTATION);
                        p.push(Properties.Cache.SCALE);
                        p.push(Properties.Cache.SKEW);
                        var p = BarChartPropertyTypes._barPropertyTypes;
                        p.push(Properties.Cache.ANIMATION);
                        p.push(new Properties.SvgFillPropertyType("rgba(0,0,0,0.5)"));
                        p.push(Properties.Cache.OPACITY);
                        p.push(Properties.Cache.SKEW);
                        p.push(new BarChart.BarDataPropertyType());
                    };
                    BarChartPropertyTypes.get = function () {
                        if (BarChartPropertyTypes._propertyTypes === undefined)
                            BarChartPropertyTypes.cacheProperties();
                        return BarChartPropertyTypes._propertyTypes;
                    };
                    BarChartPropertyTypes.getForBars = function () {
                        if (BarChartPropertyTypes._barPropertyTypes === undefined)
                            BarChartPropertyTypes.cacheProperties();
                        return BarChartPropertyTypes._barPropertyTypes;
                    };
                    BarChartPropertyTypes._propertyTypes = undefined;
                    BarChartPropertyTypes._barPropertyTypes = undefined;
                    return BarChartPropertyTypes;
                })();
                BarChart.BarChartPropertyTypes = BarChartPropertyTypes;
            })(BarChart = Items.BarChart || (Items.BarChart = {}));
        })(Items = Extensions.Items || (Extensions.Items = {}));
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
/// <reference path="../../../ts/prostyle.d.ts" />
/// <reference path="BarChartItemModel.ts" />
/// <reference path="BarChartPropertyTypes.ts" />
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var Items;
        (function (Items) {
            var BarChart;
            (function (BarChart) {
                var DEFAULT_WH = 50;
                var DEFAULT_M = 1;
                function serialize(model) {
                    return {};
                }
                BarChart.serialize = serialize;
            })(BarChart = Items.BarChart || (Items.BarChart = {}));
        })(Items = Extensions.Items || (Extensions.Items = {}));
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
/// <reference path="../../../ts/prostyle.d.ts" />
/// <reference path="BarChartItemModel.ts" />
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var Items;
        (function (Items) {
            var BarChart;
            (function (BarChart) {
                var Views = ProStyle.Views;
                var Util = ProStyle.Util;
                var BarChartItemView = (function (_super) {
                    __extends(BarChartItemView, _super);
                    function BarChartItemView(model, itemViewSet) {
                        _super.call(this, model, itemViewSet, Util.createChildSvgElement(itemViewSet.div, "svg", { "class": "prostyle" }));
                        this.model = model;
                        this.barDivs = [];
                        this.width = 0;
                        this.height = 0;
                        this.margin = 0;
                        this.barWidth = 0;
                        this.maxDomain = 0;
                        this.minDomain = 0;
                        this.domain = 0;
                        this.domainBase = 0;
                        this.rangeBase = 0;
                        this.g = Util.createChildSvgElement(this.element, "g");
                        for (var c = 0; c < model.bars; c++) {
                            this.barDivs.push(Util.createChildSvgElement(this.g, "rect"));
                        }
                        this.maxDomain = model.maxDomainValue;
                        this.minDomain = model.minDomainValue;
                        this.domain = Math.abs(this.maxDomain - this.minDomain);
                        this.domainBase = this.maxDomain < 0 ? this.maxDomain : (this.minDomain > 0 ? this.minDomain : 0);
                    }
                    BarChartItemView.prototype.initializeItem = function (timeline, cameraSize) {
                        var story = this.model.itemModelSet.flow.story;
                        var pageAspectRatio = this.model.itemModelSet.flow.pageAspectRatio;
                        var pageSize = cameraSize.getContainedSize(pageAspectRatio);
                        this.width = (this.model.width / 100) * pageSize.width;
                        this.height = (this.model.height / 100) * pageSize.height;
                        this.margin = this.model.margin / 100 * this.width;
                        if (this.margin * (this.model.bars + 1) > this.width) {
                            this.margin = this.width / (this.model.bars + 1);
                        }
                        else {
                            this.barWidth = (this.width - this.margin * this.model.bars) / this.model.bars;
                        }
                        this.rangeBase = Math.abs(this.model.maxDomainValue - this.domainBase) / this.domain * this.height;
                        var forceProps = { width: this.width, height: this.height };
                        this.initializeProperties(story, [this.element], pageSize, timeline, this.model.init, true, forceProps);
                        forceProps = {};
                        this.initializeProperties(story, this.barDivs, pageSize, timeline, this.model.barsInit, false, forceProps, this.afterBarCssProperties.bind(this));
                    };
                    BarChartItemView.prototype.generateStepActions = function (itemViewSet, pageSize, timeline, stepIndex, label) {
                        this.generateActionsForStep(itemViewSet, [this.element], pageSize, timeline, stepIndex, label, this.model.scriptSet);
                        this.generateActionsForStep(itemViewSet, this.barDivs, pageSize, timeline, stepIndex, label, this.model.barsScriptSet, this.afterBarCssProperties.bind(this));
                    };
                    BarChartItemView.prototype.afterBarCssProperties = function (properties, buckets, containerSize) {
                        var _this = this;
                        if (this.domain <= 0)
                            return;
                        buckets.forEach(function (bucket, index) {
                            var datumFrom = Util.convertToNumber(bucket.element.proCache.data[0], _this.domainBase);
                            var datumTo = Util.convertToNumber(bucket.element.proCache.data[1], _this.domainBase);
                            var y = (_this.maxDomain - Math.max(datumFrom, datumTo)) / _this.domain * _this.height;
                            var h = ((_this.maxDomain - Math.min(datumFrom, datumTo)) / _this.domain * _this.height) - y;
                            var radius = _this.barWidth / 8;
                            bucket.attr = {
                                x: _this.margin / 2 + index * (_this.margin + _this.barWidth),
                                width: _this.barWidth,
                                y: y,
                                height: h,
                                rx: radius,
                                ry: radius
                            };
                        });
                    };
                    return BarChartItemView;
                })(Views.Items.ItemView);
                BarChart.BarChartItemView = BarChartItemView;
            })(BarChart = Items.BarChart || (Items.BarChart = {}));
        })(Items = Extensions.Items || (Extensions.Items = {}));
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
/// <reference path="../../../ts/prostyle.d.ts" />
/// <reference path="serialize.ts" />
/// <reference path="BarChartItemView.ts" />
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var Items;
        (function (Items) {
            var BarChart;
            (function (BarChart) {
                var Models = ProStyle.Models;
                var BarChartItemModel = (function (_super) {
                    __extends(BarChartItemModel, _super);
                    function BarChartItemModel(itemSet, bars, width, height, margin, minDomainValue, maxDomainValue, init, scriptSet, barsInit, barsScriptSet) {
                        _super.call(this, itemSet, "barChart", "BarChart", [init, barsInit], [scriptSet, barsScriptSet]);
                        this.bars = bars;
                        this.width = width;
                        this.height = height;
                        this.margin = margin;
                        this.minDomainValue = minDomainValue;
                        this.maxDomainValue = maxDomainValue;
                        this.barsInit = barsInit;
                        this.barsScriptSet = barsScriptSet;
                    }
                    BarChartItemModel.prototype.serialize = function () {
                        return BarChart.serialize(this);
                    };
                    BarChartItemModel.prototype.createView = function (itemViewSet) {
                        return new BarChart.BarChartItemView(this, itemViewSet);
                    };
                    return BarChartItemModel;
                })(Models.Items.ItemModel);
                BarChart.BarChartItemModel = BarChartItemModel;
            })(BarChart = Items.BarChart || (Items.BarChart = {}));
        })(Items = Extensions.Items || (Extensions.Items = {}));
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
/// <reference path="../../../ts/prostyle.d.ts" />
/// <reference path="BarChartItemModel.ts" />
/// <reference path="BarChartPropertyTypes.ts" />
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var Items;
        (function (Items) {
            var BarChart;
            (function (BarChart) {
                var DEFAULT_WH = 50;
                var DEFAULT_M = 1;
                var Serialization = ProStyle.Serialization;
                var Util = ProStyle.Util;
                function deserialize(itemSet, json) {
                    var bars = Math.max(1, Math.min(Util.convertToNumber(Util.getSetup(json, "bars")), 100));
                    var width = Math.max(0, Util.convertToNumber(Util.getSetup(json, "width"), DEFAULT_WH));
                    var height = Math.max(0, Util.convertToNumber(Util.getSetup(json, "height"), DEFAULT_WH));
                    var margin = Math.max(0, Util.convertToNumber(Util.getSetup(json, "margin"), DEFAULT_M));
                    var minDomainValue = 0;
                    var maxDomainValue = 0;
                    var domain = Util.getSetup(json, "domain");
                    if (typeof domain === 'number') {
                        maxDomainValue = domain;
                    }
                    else if (domain instanceof Array) {
                        minDomainValue = domain.length > 0 ? Util.convertToNumber(domain[0]) : 0;
                        maxDomainValue = domain.length > 1 ? Util.convertToNumber(domain[1]) : 0;
                    }
                    if (maxDomainValue < minDomainValue) {
                        var swap = maxDomainValue;
                        maxDomainValue = minDomainValue;
                        minDomainValue = swap;
                    }
                    var propertyTypes = BarChart.BarChartPropertyTypes.get();
                    var barPropertyTypes = BarChart.BarChartPropertyTypes.getForBars();
                    var init = Serialization.PropertyListReader.read(itemSet.story, json.init, propertyTypes);
                    var barsInit = Serialization.PropertyListReader.read(itemSet.story, json.barInit || json.barsInit, barPropertyTypes);
                    var scriptSet = Serialization.ScriptSetReader.readJson(itemSet, "Chart", json, [""], propertyTypes);
                    var barsScriptSet = Serialization.ScriptSetReader.readJson(itemSet, "Bars", json, ["bar", "bars"], barPropertyTypes);
                    return new BarChart.BarChartItemModel(itemSet, bars, width, height, margin, minDomainValue, maxDomainValue, init, scriptSet, barsInit, barsScriptSet);
                }
                BarChart.deserialize = deserialize;
            })(BarChart = Items.BarChart || (Items.BarChart = {}));
        })(Items = Extensions.Items || (Extensions.Items = {}));
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
//# sourceMappingURL=prostyle.item.barchart.js.map