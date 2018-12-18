/**
 * 该类继承AbstractView, 该类实现了_models2HtmlStr()抽象方法.
 */
class ListView extends AbstractView{
    constructor(pagination, options){
        super(pagination, options);
        this.name = 'list'; //为当前对象命名.
    }
    _models2HtmlStr(models){
        var self = this;
        var htmlStr = '';
        for(var model of models){
            var itemHtmlStr = `
                             <div class="listitem" data-id="${model.id}">
                             <div class="row">
                              <div class="col-md-1">
                                  </div>

                                  <div class="col-md-3">
                                     <div class="img" style="">
                                        <img src="${model.img}" style="width:200px;height:200px">
                                      </div>
                                  </div>

                                  <div class="col-md-4">
                                      <div class="content" style="padding-top:60px">
                                      <h3>${model.Item}</h3>
                                      </div>
                                  </div>
                                  

                                  <div class="col-md-3">
                                      <div class="content" style="padding-top:50px">
                            
                                      <h3 class="" style="color:#ffd43d">Score：${model.Score}</h3>
                                  
                                      </div>
                                  </div>
                                  <div class="col-md-1">
                                  </div>
                                  
                              </div>
                              </div>
                              <div style="width:100%;height:2px;background-color:#f0f0f0"></div>
                                `;
            htmlStr = htmlStr + itemHtmlStr;
        }
        return htmlStr;
    }
}

