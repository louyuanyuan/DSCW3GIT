/**
 * 该类实现了页面显示，设置产品类型、视图模式等方法
 */
class Controller{
    /**
     * 构造器
     * @param Model model. Model类型，数据模型对象
     * @param AbstractView view. AbstractView类型，视图对象
     * @param string type. 字符串，产品类型
     */
    constructor(model, view, type=null){
        this._view = view;
        this.model = model;
        this._type = type;
    }

    /**
     * 私有方法，渲染地图.
     * @private
     */
    _renderMap(){
        var self = this;
        if(this._type){
            self.model.findType(this._type).then(function(data){
                self._view.display(data, false);
            });
        }else{
            self.model.findAll().then(function(data){
                self._view.display(data, false);
            });
        }
    }
    /**
     * render index page
     * 渲染索引页面
     * @param integer page 整数，表示当前第几页
     */
    index(page){
        var self = this;
        if(self._view.name == 'map'){
            self._renderMap();
        }else{
            self.model.find({page:page,type:self._type}).then(function(data){
                self._view.display(data, false);
            });
        }
    }
    /**
     * 设置产品类型.
     * @param string val. 字符串，产品类型
     */
    set type(val){
        this._type = val;
    }

    /**
     * change view model. list or grid or map.
     * 改变视图模式，列表模式、大图模式、地图模式.
     * @param AbstractView view,  AbstractView类型，视图对象.
     */
    set viewModel(view){
        var self = this;
        this._view = view;
        self._view.init();
        if(self._view.name == 'map'){
            self._renderMap();
        }else{
            this._view.display(this.model.cache.last, false);
        }
    }
    /**
     * 返回视图对象
     */
    get viewModel(){
        return this._view;
    }
    /**
     * 显示产品详细信息
     */
    viewDetail(id){
        var self = this;
        var model = self.model.findById(id);
        if(model){
            this._view.detail(model);
        }
    }
}
