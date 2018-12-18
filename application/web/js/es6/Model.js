/**
 * 该类实现了产品数据的获取和处理
 */
class Model{
    /**
     * 构造器
     * @param Pagination pagination. Pagination类型，pagination对象
     */
    constructor(pagination){
        var self = this;
        self.data_file = 'data.json';
        self.pagination = pagination;
        self.data = window.json_items
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
    _paginationCut(data, condition){
        var self = this;
        self.pagination.totalCount = data.length;
        self.pagination.page = condition.page;
        console.log('self.pagination.page:', self.pagination.page);
        console.log('self.pagination.offset:', self.pagination.offset);
        var pagination = self.pagination;
        console.log('pagination.offset:', pagination.offset);
        data = data.slice(pagination.offset, pagination.offset+pagination.limit);
        self.cache.last = data;
        return data;
    }

    /**
     * 返回给定条件的数据.
     * @param object condition, object类型,给定的条件
     * @return defer. 返回defer类型.
     */
    find(condition){
        var self = this;
        var defer = $.Deferred();
        if(condition.type){
            this.findType(condition.type).then(function(data){
                data = self._paginationCut(data, condition);
                defer.resolve(data);
            });
        }else{
            this.findAll().then(function(data){
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
    findAll(){
        var self = this;
        var defer = $.Deferred();
        if(self.cache.all){
            self.pagination.totalCount = self.cache.all.length;
            defer.resolve(self.cache.all);
        }else{
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
    findType(type){
        var self = this;
        var defer = $.Deferred();
        if(self.cache[type]){
            self.pagination.totalCount = self.cache[type].length;
            defer.resolve(self.cache[type]);
        }else{
            var items = self.data.filter(function(elem, index, self) {
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
    findById(id){
        var self = this;
        var result = self.cache.all.filter(function(element, index, array) {
            return element['id'] == id;
        });
        // console.log('findById:', result);
        if(result.length>0)
            return result[0];
        else
            return false;
    }
}
