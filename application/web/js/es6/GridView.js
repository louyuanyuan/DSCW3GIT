/**
 * 该类继承AbstractView, 该类实现了_models2HtmlStr()抽象方法.
 */
class GridView extends AbstractView{
    constructor(pagination, options){
        super(pagination, options);
        this.name = 'grid'; //为当前对象命名.
    }
    
    _models2HtmlStr(models){
        var self = this;
        var $container = $('<div>').addClass('ui four stackable cards');
        var htmlStr = '';
        for(var model of models){
            var itemHtmlStr = `<div class="ui card" data-id="${model.id}">
          <div class="ui slide masked reveal image">
            <img src="${model.img}">
          </div>
          <div class="content">
            <a class="header">${model.Item}</a>
            <div class="meta">
              <span class="priceLabel">Nutrition Score： </span>
              <span style="color:#ffd43d">${model.Score}</span>
            </div>
          </div>
        </div><!--end item-->`;
            htmlStr = htmlStr + itemHtmlStr;
        }
        $container.append(htmlStr);
        return $container;
    }
}