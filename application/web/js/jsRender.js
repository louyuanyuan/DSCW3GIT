'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by francis on 17-6-5.
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
            val = val - 1;
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
 * Created by francis on 17-6-5.
 */
var Model = function () {
    function Model(pagination) {
        _classCallCheck(this, Model);

        var self = this;
        self.data_file = 'data.json';
        self.pagination = pagination;
        self.data = $.getJSON(self.data_file);
    }

    _createClass(Model, [{
        key: 'find',
        value: function find(condition) {
            var self = this;
            var defer = $.Deferred();
            self.data.done(function (data) {
                var items = null;
                if (condition && condition.type) {
                    items = data.items.filter(function (elem, index, self) {
                        return elem.type == condition.type;
                    });
                } else {
                    items = data.items;
                }
                self.pagination.totalCount = items.length;
                var pagination = self.pagination;
                items = items.slice(pagination.offset, pagination.offset + pagination.limit);
                defer.resolve(items);
            });
            return defer;
        }
    }]);

    return Model;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by francis on 17-6-4.
 */
var AbstractRender = function () {
    function AbstractRender(pagination, options) {
        _classCallCheck(this, AbstractRender);

        this.settings = $.extend({ listContainer: '.itemlist', pagerCountainer: '.pager',
            totalCount: '.total .count' }, options || {});
        this.pagination = pagination;
    }

    _createClass(AbstractRender, [{
        key: 'displayTotalCount',
        value: function displayTotalCount() {
            console.log('this.pagination.totalCount:', this.pagination.totalCount);
            $(this.settings.totalCount).text(this.pagination.totalCount);
        }
    }, {
        key: 'displayPager',
        value: function displayPager() {
            var $pages = this._pageButtons();
            $(this.settings.pagerCountainer).append($pages);
        }
    }, {
        key: '_pageButtons',
        value: function _pageButtons() {
            var $container = $('<div>').addClass('ui pagination menu');
            var pagerange = this.pagination.pageRange;
            for (var i = pagerange[0]; i <= pagerange[1]; i++) {
                var $btn = $('<a>').addClass('item').text(i + 1);
                if (i == this.pagination.page) {
                    $btn.addClass('active');
                }
                $container.append($btn);
            }
            return $container;
        }
    }, {
        key: 'replaceProducts',
        value: function replaceProducts(items) {
            var self = this;
            var htmlString = this._models2HtmlStr(items);
            if (htmlString) $(self.settings.listContainer).html(htmlString);else {
                $(self.settings.listContainer).html(this.constructor.noSearchData);
            }
        }
    }, {
        key: 'appendProducts',
        value: function appendProducts(items) {
            var self = this;
            var htmlString = this._models2HtmlStr(items);
            if (htmlString) $(self.settings.listContainer).append(htmlString);
        }
    }, {
        key: 'display',
        value: function display(items) {
            var append = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            this.displayTotalCount();
            if (append) {
                this.appendProducts(items);
            } else {
                this.replaceProducts(items);
            }
            this.displayPager();
        }
    }, {
        key: '_models2HtmlStr',
        value: function _models2HtmlStr(models) {}
    }], [{
        key: 'noSearchData',
        get: function get() {
            return '<li class="no-data">\u5F53\u524D\u67E5\u8BE2\u6761\u4EF6\u4E0B\u6CA1\u6709\u4FE1\u606F\uFF0C\u53BB\u8BD5\u8BD5\u5176\u4ED6\u67E5\u8BE2\u6761\u4EF6\u5427\uFF01</li>';
        }
    }]);

    return AbstractRender;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by francis on 17-6-5.
 */
var ListRender = function (_AbstractRender) {
  _inherits(ListRender, _AbstractRender);

  function ListRender() {
    _classCallCheck(this, ListRender);

    return _possibleConstructorReturn(this, (ListRender.__proto__ || Object.getPrototypeOf(ListRender)).apply(this, arguments));
  }

  _createClass(ListRender, [{
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

          var itemHtmlStr = '<div class="item">\n                                  <div class="image">\n                                    <img src="' + model.img + '">\n                                  </div>\n                                  <div class="content">\n                                    <a class="header">' + model.name + '</a>\n                                    <div class="meta">\n                                      <span>' + model.price + '</span>\n                                    </div>\n                                  </div>\n                                </div><!--end item-->';
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

  return ListRender;
}(AbstractRender);