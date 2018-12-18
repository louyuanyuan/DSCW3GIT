'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 翻页
 */
var Pagination = function () {
    function Pagination(options) {
        _classCallCheck(this, Pagination);

        this.settings = $.extend({ linkNext: '.next', linkPrev: '.prev',
            linkFirst: '.first', linkLast: '.last', pageSize: 20, maxButtonCount: 10 }, options || {});
        this.pageSize = this.settings.pageSize;
        this._page = 0;
        this.maxButtonCount = this.settings.maxButtonCount;
    }

    _createClass(Pagination, [{
        key: 'totalCount',
        get: function get() {
            return this._totalCount;
        },
        set: function set(number) {
            this._totalCount = number;
        }
        /**
         * @return int number of pages
         */

    }, {
        key: 'pageCount',
        get: function get() {
            if (this.pageSize < 1) {
                return this.totalCount > 0 ? 1 : 0;
            } else {
                var totalCount = this.totalCount < 0 ? 0 : this.totalCount;
                return Math.floor((totalCount + this.pageSize - 1) / this.pageSize);
            }
        }

        /**
         * Returns the zero-based current page number.
         * @return int the zero-based current page number.
         */

    }, {
        key: 'page',
        get: function get() {
            return this._page;
        },
        set: function set(val) {
            // val = val-1;
            if (val < 0) {
                val = 0;
            }
            var pagecount = this.pageCount;
            if (val >= pagecount) {
                val = pagecount - 1;
            }
            this._page = val;
        }

        /**
         * @return int the offset of the data.
         */

    }, {
        key: 'offset',
        get: function get() {
            var pagesize = this.pageSize;
            return pagesize < 1 ? 0 : this.page * pagesize;
        }
    }, {
        key: 'limit',
        get: function get() {
            var pagesize = this.pageSize;
            // console.log('limit:',pagesize);
            return pagesize < 1 ? -1 : pagesize;
        }
    }, {
        key: 'pageRange',
        get: function get() {
            var currentPage = this.page;
            var pageCount = this.pageCount;
            var beginPage = Math.max(0, currentPage - Math.floor(this.maxButtonCount / 2));
            var endPage = null;
            if ((endPage = beginPage + this.maxButtonCount - 1) >= pageCount) {
                endPage = pageCount - 1;
                beginPage = Math.max(0, endPage - this.maxButtonCount + 1);
            }
            return [beginPage, endPage];
        }
    }]);

    return Pagination;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 该类实现了产品数据的获取和处理
 */
var Model = function () {
    /**
     * 构造器
     * @param Pagination pagination. Pagination类型，pagination对象
     */
    function Model(pagination) {
        _classCallCheck(this, Model);

        var self = this;
        self.data_file = 'data.json';
        self.pagination = pagination;
        self.data = window.json_items;
        self.cache = {};
        self.cache.last = null; //last found items, pagination pageSized items.
        self.cache.all = null;
        self.cache.food = null;
        self.cache.movie = null;
    }
    /**
     * 把给定的数据裁剪到pagination中设置的数量.
     * @param array data. array类型，产品数据
     * @param object condition. object类型，过滤条件
     * @return array data. 符合条件的数据.
     */


    _createClass(Model, [{
        key: '_paginationCut',
        value: function _paginationCut(data, condition) {
            var self = this;
            self.pagination.totalCount = data.length;
            self.pagination.page = condition.page;
            console.log('self.pagination.page:', self.pagination.page);
            console.log('self.pagination.offset:', self.pagination.offset);
            var pagination = self.pagination;
            console.log('pagination.offset:', pagination.offset);
            data = data.slice(pagination.offset, pagination.offset + pagination.limit);
            self.cache.last = data;
            return data;
        }

        /**
         * 返回给定条件的数据.
         * @param object condition, object类型,给定的条件
         * @return defer. 返回defer类型.
         */

    }, {
        key: 'find',
        value: function find(condition) {
            var self = this;
            var defer = $.Deferred();
            if (condition.type) {
                this.findType(condition.type).then(function (data) {
                    data = self._paginationCut(data, condition);
                    defer.resolve(data);
                });
            } else {
                this.findAll().then(function (data) {
                    data = self._paginationCut(data, condition);
                    defer.resolve(data);
                });
            }
            return defer;
        }

        /**
         * 返回所有数据
         * @returns {*}, 返回defer类型.
         */

    }, {
        key: 'findAll',
        value: function findAll() {
            var self = this;
            var defer = $.Deferred();
            if (self.cache.all) {
                self.pagination.totalCount = self.cache.all.length;
                defer.resolve(self.cache.all);
            } else {
                var items = self.data;
                self.cache.all = items;
                self.pagination.totalCount = self.cache.all.length;
                defer.resolve(self.cache.all);
            }
            return defer;
        }

        /**
         * 返回给定类型的数据.
         * @param string type, 产品类型.
         * @returns {*}, 返回defer类型.
         */

    }, {
        key: 'findType',
        value: function findType(type) {
            var self = this;
            var defer = $.Deferred();
            if (self.cache[type]) {
                self.pagination.totalCount = self.cache[type].length;
                defer.resolve(self.cache[type]);
            } else {
                var items = self.data.filter(function (elem, index, self) {
                    return elem.type == type;
                });
                self.cache[type] = items;
                self.pagination.totalCount = items.length;
                defer.resolve(self.cache[type]);
            }
            return defer;
        }

        /**
         * 返回给定id的数据
         * @param integer id, 产品的ID
         * @returns object 返回产品对象.
         */

    }, {
        key: 'findById',
        value: function findById(id) {
            var self = this;
            var result = self.cache.all.filter(function (element, index, array) {
                return element['id'] == id;
            });
            // console.log('findById:', result);
            if (result.length > 0) return result[0];else return false;
        }
    }]);

    return Model;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 该类是视图的抽象类. ListView , GridView继承该类.
 */
var AbstractView = function () {
    /**
     * 构造器.
     * @param Pagination pagination. Pagination类型，pagination对象
     * @param object options, 视图选项
     */
    function AbstractView(pagination, options) {
        _classCallCheck(this, AbstractView);

        this.settings = $.extend({
            listContainer: '#itemlist',
            mapContainer: '#mapContainer',
            modalContainer: '#modalContainer',
            pagerCountainer: '.pager',
            totalCount: '.total .count'
        }, options || {});
        this.pagination = pagination;
        this.name = 'abstract';
    }

    /**
     * 抽象方法
     */


    _createClass(AbstractView, [{
        key: 'init',
        value: function init() {}

        /**
         * 返回没有数据时显示的信息.
         * @returns {string}
         */

    }, {
        key: 'detail',


        /**
         * 以modal窗口显示详细信息.
         * @param model, 产品对象
         */
        value: function detail(model) {
            var _weatherIcons;

            var self = this;
            $(self.settings.modalContainer).empty().append('\n<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="mymodal" >\n  <div class="modal-dialog modal-lg" role="document">\n    <div class="modal-content" >\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">' + model.Item + '</h4>\n      </div>\n      <div class="modal-body">\n\n       <div class="row">  \n             <div class="col-md-4">\n                 <img src="' + model.img + '" style="width:200px;height:200px"class="center-block">\n                \n             </div>          \n             <div class="col-md-4 text-left">\n             <p></p>\n\n                <p><strong>Type:</strong><span>  ' + model.type + '</span></p>\n                <p><strong>Serving Size:</strong><span>  ' + model.ServingSize + '</span></p>\n                <p><strong>Calories:</strong><span>  ' + model.Calories + 'Kcal</span></p>\n                <p><strong>Total Fat:</strong><span>  ' + model.TotalFat + 'g</span></p>\n                <p><strong>Trans Fat:</strong><span>  ' + model.TransFat + 'g</span></p>\n                <p><strong>Saturated Fat:</strong><span>  ' + model.SaturatedFat + 'g</span></p>\n                <div style="width:100%;height:1px;background-color:#f0f0f0"></div>          \n             </div>  \n\n             <div class="col-md-4 text-left" >\n                <p></p>\n                <p><strong>Cholesterol:</strong><span>  ' + model.Cholesterol + 'g</span></p>\n                <p><strong>Sodium:</strong><span>  ' + model.Sodium + 'g</span></p>\n                <p><strong>Carbohydrates:</strong><span>  ' + model.Carbohydrates + 'g</span></p>\n                <p><strong>Dietary Fiber:</strong><span>  ' + model.DietaryFiber + 'g</span></p>\n                <p><strong>Sugars:</strong> ' + model.Sugars + 'g</span></p> \n                <p><strong>Protein:</strong> ' + model.Protein + 'mg</span></p>                              \n                <div style="width:100%;height:1px;background-color:#f0f0f0"></div> \n             </div>                \n         </div>\n         <div class="row"> \n             <div class="col-md-8">\n                <div class="center-block" id="figure"></div>\n             </div> \n             <div class="col-md-4">\n                 \n             </div> \n         </div>\n\n         <div class="row">  \n             <div class="col-md-4 text-center" style="padding-top:40px">\n             <h2>Score:<span style="color:#ffd43d"> ' + model.Score + '</span></h2> \n             </div>          \n             <div class="col-md-2 text-center" style="padding-top:35px"> \n             <h1>\u2248</h1> \n             </div>  \n             <div class="col-md-6 text-center" style="padding-top:40px">\n             <h3><span style="color:#ffd43d"> ' + model.Match + '</span></h3> \n             </div>     \n         </div>\n\n\n         <div class="row hide"> \n             <div class="col-md-12" style="margin-top:80px;padding-left:20px">\n                 <div class="center-block" id="echart" style="height:600px;width:800px"></div>\n             </div> \n         </div>\n\n         <div class="row" style="margin-top:80px"> \n         <div class="col-md-1"></div>\n             <div class="col-md-10">\n\n                 <div class="progress">\n                     <div class="progress-bar" role="progressbar" aria-valuenow="' + model.TotalFatDV + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + model.TotalFatDV + '%;">\n                      TotalFat DV ' + model.TotalFatDV + '%\n                     </div>\n                 </div>\n                 <div class="progress">\n                     <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + model.SaturatedFatDV + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + model.SaturatedFatDV + '%;">\n                      SaturatedFat DV ' + model.SaturatedFatDV + '%\n                     </div>\n                 </div>\n                 <div class="progress">\n                     <div class="progress-bar  progress-bar-info" role="progressbar" aria-valuenow="' + model.CholesterolDV + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + model.CholesterolDV + '%;">\n                      Cholesterol DV ' + model.CholesterolDV + '%\n                     </div>\n                 </div>\n                 <div class="progress">\n                     <div class="progress-bar " role="progressbar" aria-valuenow="' + model.DietaryFiberDV + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + model.DietaryFiberDV + '%;">\n                      DietaryFiber DV ' + model.DietaryFiberDV + '%\n                     </div>\n                 </div>\n                 <div class="progress">\n                     <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="' + model.VitaminADV + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + model.VitaminADV + '%;">\n                      VitaminA DV ' + model.VitaminADV + '%\n                     </div>\n                 </div>\n                 <div class="progress">\n                     <div class="progress-bar" role="progressbar" aria-valuenow="' + model.SodiumDV + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + model.SodiumDV + '%;">\n                      Sodium DV ' + model.SodiumDV + '%\n                     </div>\n                 </div>\n                 <div class="progress">\n                     <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="' + model.CalciumDV + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + model.CalciumDV + '%;">\n                      Calcium DV ' + model.CalciumDV + '%\n                     </div>\n                 </div>\n\n             </div> \n         <div class="col-md-1"></div>\n         </div>\n\n\n\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal"style="background-color: #ffd43d;border-color:#ffd43d">Close</button>\n      \n      </div>\n    </div><!-- /.modal-content -->\n  </div><!-- /.modal-dialog -->\n</div><!-- /.modal -->\n\n            ');
            $('#mymodal').modal('show');

            var myChart = echarts.init(document.getElementById('echart'));
            var weatherIcons = (_weatherIcons = {
                '': ''
            }, _defineProperty(_weatherIcons, '', ''), _defineProperty(_weatherIcons, '', ''), _weatherIcons);

            var seriesLabel = {
                normal: {
                    show: true,
                    textBorderColor: '#333',
                    textBorderWidth: 2
                }

                // 指定图表的配置项和数据
            };var option = {
                title: {
                    text: 'model compare'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['max', 'average', 'this']
                },
                grid: {
                    left: 100
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'value',
                    name: '',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    data: ['Accident Rate', 'Death Rate', 'Safety Score'],
                    axisLabel: {
                        formatter: function formatter(value) {
                            return '{' + value + '| }\n{value|' + value + '}';
                        },
                        margin: 20,
                        rich: {
                            value: {
                                lineHeight: 30,
                                align: 'center'
                            },
                            Sunny: {
                                height: 40,
                                align: 'center',
                                backgroundColor: {
                                    image: weatherIcons.Sunny
                                }
                            },
                            Cloudy: {
                                height: 40,
                                align: 'center',
                                backgroundColor: {
                                    image: weatherIcons.Cloudy
                                }
                            },
                            Showers: {
                                height: 40,
                                align: 'center',
                                backgroundColor: {
                                    image: weatherIcons.Showers
                                }
                            }
                        }
                    }
                },
                series: [{
                    name: 'max',
                    type: 'bar',
                    data: [165, 140, 143],
                    label: seriesLabel,
                    markPoint: {
                        symbolSize: 1,
                        symbolOffset: [0, '50%'],
                        label: {
                            normal: {
                                formatter: '{a|{a}\n}{b|{b} }{c|{c}}',
                                backgroundColor: 'rgb(242,242,242)',
                                borderColor: '#aaa',
                                borderWidth: 1,
                                borderRadius: 4,
                                padding: [4, 10],
                                lineHeight: 26,
                                // shadowBlur: 5,
                                // shadowColor: '#000',
                                // shadowOffsetX: 0,
                                // shadowOffsetY: 1,
                                position: 'right',
                                distance: 20,
                                rich: {
                                    a: {
                                        align: 'center',
                                        color: '#fff',
                                        fontSize: 18,
                                        textShadowBlur: 2,
                                        textShadowColor: '#000',
                                        textShadowOffsetX: 0,
                                        textShadowOffsetY: 1,
                                        textBorderColor: '#333',
                                        textBorderWidth: 2
                                    },
                                    b: {
                                        color: '#333'
                                    },
                                    c: {
                                        color: '#ff8811',
                                        textBorderColor: '#000',
                                        textBorderWidth: 1,
                                        fontSize: 22
                                    }
                                }
                            }
                        },
                        data: [{ type: 'max', name: 'max: ' }, { type: 'this', name: 'this: ' }]
                    }
                }, {
                    name: 'average',
                    type: 'bar',
                    label: seriesLabel,
                    data: [145, 135, 110]
                }, {
                    name: 'this',
                    type: 'bar',
                    label: seriesLabel,
                    data: [155, 136, 130]
                }]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }

        /**
         * 显示一共找到多少条满足条件
         */

    }, {
        key: 'displayTotalCount',
        value: function displayTotalCount() {
            console.log('this.pagination.totalCount:', this.pagination.totalCount);
            $(this.settings.totalCount).text(this.pagination.totalCount);
        }

        /**
         * 显示翻页按钮
         */

    }, {
        key: 'displayPager',
        value: function displayPager() {
            var $pages = this._pageButtons();
            $(this.settings.pagerCountainer).empty().append($pages);
        }
    }, {
        key: '_pageButtons',
        value: function _pageButtons() {
            var $container = $('<div>').addClass('ui pagination menu');
            var pagerange = this.pagination.pageRange;
            for (var i = pagerange[0]; i <= pagerange[1]; i++) {
                var $btn = $('<a>').addClass('item').text(i + 1);
                if (i == this.pagination.page) {
                    $btn.addClass('active').css("background-color", "#ffc21f");;
                }
                $container.append($btn);
            }
            return $container;
        }

        /**
         * 删除前一页内容, 显示当前页内容.
         * @param array items 当前页的数组对象.
         */

    }, {
        key: 'replaceProducts',
        value: function replaceProducts(items) {
            var self = this;
            $(self.settings.listContainer).empty().removeAttr('style');
            var htmlString = this._models2HtmlStr(items);
            if (htmlString) $(self.settings.listContainer).html(htmlString);else {
                $(self.settings.listContainer).html(this.constructor.noSearchData);
            }
            // window.scrollTo(0,0);
        }
        /**
         * 保持前一页内容, 在前页内容的后面继续添加当前页的内容
         * @param array items 当前页的数组对象.
         */

    }, {
        key: 'appendProducts',
        value: function appendProducts(items) {
            var self = this;
            var htmlString = this._models2HtmlStr(items);
            if (htmlString) $(self.settings.listContainer).append(htmlString);
        }

        /**
         * public方法, 该方法调用displayTotalCount(),appendProducts(),和displayPager().
         * @param items 当前页的数组对象.
         * @param append 默认保留前一页内容, 在前一页后面继续添加当前页内容
         */

    }, {
        key: 'display',
        value: function display(items) {
            var append = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            $(this.settings.mapContainer).empty().removeAttr('style');
            this.displayTotalCount();
            if (append) {
                this.appendProducts(items);
            } else {
                this.replaceProducts(items);
            }
            this.displayPager();
        }

        /**
         * 抽象方法.根据当前页数组对象返回html字符串.
         * @param array models 当前页的数组对象.
         * @private
         */

    }, {
        key: '_models2HtmlStr',
        value: function _models2HtmlStr(models) {}
    }], [{
        key: 'noSearchData',
        get: function get() {
            return '<li class="no-data">no data\uFF01</li>';
        }
    }]);

    return AbstractView;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 该类继承AbstractView, 该类实现了_models2HtmlStr()抽象方法.
 */
var ListView = function (_AbstractView) {
    _inherits(ListView, _AbstractView);

    function ListView(pagination, options) {
        _classCallCheck(this, ListView);

        var _this = _possibleConstructorReturn(this, (ListView.__proto__ || Object.getPrototypeOf(ListView)).call(this, pagination, options));

        _this.name = 'list'; //为当前对象命名.
        return _this;
    }

    _createClass(ListView, [{
        key: '_models2HtmlStr',
        value: function _models2HtmlStr(models) {
            var self = this;
            var htmlStr = '';
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = models[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var model = _step.value;

                    var itemHtmlStr = '\n                             <div class="listitem" data-id="' + model.id + '">\n                             <div class="row">\n                              <div class="col-md-1">\n                                  </div>\n\n                                  <div class="col-md-3">\n                                     <div class="img" style="">\n                                        <img src="' + model.img + '" style="width:200px;height:200px">\n                                      </div>\n                                  </div>\n\n                                  <div class="col-md-4">\n                                      <div class="content" style="padding-top:60px">\n                                      <h3>' + model.Item + '</h3>\n                                      </div>\n                                  </div>\n                                  \n\n                                  <div class="col-md-3">\n                                      <div class="content" style="padding-top:50px">\n                            \n                                      <h3 class="" style="color:#ffd43d">Score\uFF1A' + model.Score + '</h3>\n                                  \n                                      </div>\n                                  </div>\n                                  <div class="col-md-1">\n                                  </div>\n                                  \n                              </div>\n                              </div>\n                              <div style="width:100%;height:2px;background-color:#f0f0f0"></div>\n                                ';
                    htmlStr = htmlStr + itemHtmlStr;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return htmlStr;
        }
    }]);

    return ListView;
}(AbstractView);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 该类继承AbstractView, 该类实现了_models2HtmlStr()抽象方法.
 */
var GridView = function (_AbstractView) {
    _inherits(GridView, _AbstractView);

    function GridView(pagination, options) {
        _classCallCheck(this, GridView);

        var _this = _possibleConstructorReturn(this, (GridView.__proto__ || Object.getPrototypeOf(GridView)).call(this, pagination, options));

        _this.name = 'grid'; //为当前对象命名.
        return _this;
    }

    _createClass(GridView, [{
        key: '_models2HtmlStr',
        value: function _models2HtmlStr(models) {
            var self = this;
            var $container = $('<div>').addClass('ui four stackable cards');
            var htmlStr = '';
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = models[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var model = _step.value;

                    var itemHtmlStr = '<div class="ui card" data-id="' + model.id + '">\n          <div class="ui slide masked reveal image">\n            <img src="' + model.img + '">\n          </div>\n          <div class="content">\n            <a class="header">' + model.Item + '</a>\n            <div class="meta">\n              <span class="priceLabel">Nutrition Score\uFF1A </span>\n              <span style="color:#ffd43d">' + model.Score + '</span>\n            </div>\n          </div>\n        </div><!--end item-->';
                    htmlStr = htmlStr + itemHtmlStr;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            $container.append(htmlStr);
            return $container;
        }
    }]);

    return GridView;
}(AbstractView);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 地图
 */
var MapView = function (_AbstractView) {
    _inherits(MapView, _AbstractView);

    function MapView(pagination, options) {
        _classCallCheck(this, MapView);

        var _this = _possibleConstructorReturn(this, (MapView.__proto__ || Object.getPrototypeOf(MapView)).call(this, pagination, options));

        _this.settings = $.extend({
            listContainer: '#itemlist',
            mapContainer: 'mapContainer',
            containerHeight: 600,
            modalContainer: '#modalContainer',
            pagerCountainer: '.pager',
            totalCount: '.total .count'
        }, options || {});
        _this.pagination = pagination;
        _this.name = 'map';
        return _this;
    }

    _createClass(MapView, [{
        key: 'init',
        value: function init() {
            $(this.settings.pagerCountainer).empty();
            $(this.settings.listContainer).empty();
            $('#' + this.settings.mapContainer).height(this.settings.containerHeight);
            this.map = new BMap.Map(this.settings.mapContainer);
            this.map.enableScrollWheelZoom(true);
            this.centerPoint = new BMap.Point(116.404, 39.915);
            this.map.centerAndZoom(this.centerPoint, 15);
        }

        /**
         * display modal of detail information
         * @param object model
         */

    }, {
        key: 'detail',
        value: function detail(model) {
            var self = this;
            $(self.settings.modalContainer).empty().append('<div class="ui modal">\n              <i class="close icon"></i>\n              <div class="header">\n                ' + model.name + '\n              </div>\n              <div class="image content">\n                <div class="ui medium image">\n                  <img src="' + model.img + '">\n                </div>\n                <div class="description">\n                  <div class="ui header">' + model.name + '</div>\n                  <p>\n                      <span class="priceLabel">\u4EF7\u683C: </span>\n                      <span class="price">' + model.price + '</span> \u5143\n                  </p>\n                </div>\n              </div>\n              <div class="actions">\n                <div class="ui black deny button">\n                  \u5173\u95ED\n                </div>\n                <div class="ui positive right labeled icon button">\n                  \u4ED8\u6B3E\n                  <i class="checkmark icon"></i>\n                </div>\n              </div>\n            </div>');
            $('.ui.modal').modal('show');
            $('.ui.modal').modal({ onHidden: function onHidden(event) {
                    $(this).remove();
                } });
        }
    }, {
        key: 'display',
        value: function display(items) {
            this.displayTotalCount();
            this.addMarks(items);
        }
    }, {
        key: 'addMarks',
        value: function addMarks(items) {
            var self = this;
            self.map.clearOverlays();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    var point = new BMap.Point(item.coord.x, item.coord.y);
                    var html = {};
                    html.food = '<div data-id="' + item.id + '" class="mapmarker ' + item.type + '"><i class="food icon"></i>' + item.name + ' ' + item.price + '</div>';
                    html.movie = '<div data-id="' + item.id + '" class="mapmarker ' + item.type + '"><i class="record icon"></i>' + item.name + ' ' + item.price + '</div>';
                    var marker = new BMapLib.RichMarker(html[item.type], point);
                    marker.addEventListener('click', function (event) {
                        var id = $(this._content).data('id');
                        window.controller.viewDetail(id);
                    });
                    self.map.addOverlay(marker);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }]);

    return MapView;
}(AbstractView);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 该类实现了页面显示，设置产品类型、视图模式等方法
 */
var Controller = function () {
    /**
     * 构造器
     * @param Model model. Model类型，数据模型对象
     * @param AbstractView view. AbstractView类型，视图对象
     * @param string type. 字符串，产品类型
     */
    function Controller(model, view) {
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        _classCallCheck(this, Controller);

        this._view = view;
        this.model = model;
        this._type = type;
    }

    /**
     * 私有方法，渲染地图.
     * @private
     */


    _createClass(Controller, [{
        key: '_renderMap',
        value: function _renderMap() {
            var self = this;
            if (this._type) {
                self.model.findType(this._type).then(function (data) {
                    self._view.display(data, false);
                });
            } else {
                self.model.findAll().then(function (data) {
                    self._view.display(data, false);
                });
            }
        }
        /**
         * render index page
         * 渲染索引页面
         * @param integer page 整数，表示当前第几页
         */

    }, {
        key: 'index',
        value: function index(page) {
            var self = this;
            if (self._view.name == 'map') {
                self._renderMap();
            } else {
                self.model.find({ page: page, type: self._type }).then(function (data) {
                    self._view.display(data, false);
                });
            }
        }
        /**
         * 设置产品类型.
         * @param string val. 字符串，产品类型
         */

    }, {
        key: 'viewDetail',

        /**
         * 显示产品详细信息
         */
        value: function viewDetail(id) {
            var self = this;
            var model = self.model.findById(id);
            if (model) {
                this._view.detail(model);
            }
        }
    }, {
        key: 'type',
        set: function set(val) {
            this._type = val;
        }

        /**
         * change view model. list or grid or map.
         * 改变视图模式，列表模式、大图模式、地图模式.
         * @param AbstractView view,  AbstractView类型，视图对象.
         */

    }, {
        key: 'viewModel',
        set: function set(view) {
            var self = this;
            this._view = view;
            self._view.init();
            if (self._view.name == 'map') {
                self._renderMap();
            } else {
                this._view.display(this.model.cache.last, false);
            }
        }
        /**
         * 返回视图对象
         */
        ,
        get: function get() {
            return this._view;
        }
    }]);

    return Controller;
}();