/**
 * 该类是视图的抽象类. ListView , GridView继承该类.
 */
class AbstractView{
    /**
     * 构造器.
     * @param Pagination pagination. Pagination类型，pagination对象
     * @param object options, 视图选项
     */
    constructor(pagination, options){
        this.settings = $.extend({
            listContainer:      '#itemlist',
            mapContainer:      '#mapContainer',
            modalContainer:     '#modalContainer',
            pagerCountainer:    '.pager',
            totalCount:         '.total .count'
        }, options||{});
        this.pagination = pagination;
        this.name = 'abstract';
    }

    /**
     * 抽象方法
     */
    init(){}

    /**
     * 返回没有数据时显示的信息.
     * @returns {string}
     */
    static get noSearchData(){
        return `<li class="no-data">no data！</li>`;
    }

    /**
     * 以modal窗口显示详细信息.
     * @param model, 产品对象
     */
    detail(model){
        var self = this;
        $(self.settings.modalContainer).empty().append(
            `
<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="mymodal" >
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content" >
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">${model.Item}</h4>
      </div>
      <div class="modal-body">

       <div class="row">  
             <div class="col-md-4">
                 <img src="${model.img}" style="width:200px;height:200px"class="center-block">
                
             </div>          
             <div class="col-md-4 text-left">
             <p></p>

                <p><strong>Type:</strong><span>  ${model.type}</span></p>
                <p><strong>Serving Size:</strong><span>  ${model.ServingSize}</span></p>
                <p><strong>Calories:</strong><span>  ${model.Calories}Kcal</span></p>
                <p><strong>Total Fat:</strong><span>  ${model.TotalFat}g</span></p>
                <p><strong>Trans Fat:</strong><span>  ${model.TransFat}g</span></p>
                <p><strong>Saturated Fat:</strong><span>  ${model.SaturatedFat}g</span></p>
                <div style="width:100%;height:1px;background-color:#f0f0f0"></div>          
             </div>  

             <div class="col-md-4 text-left" >
                <p></p>
                <p><strong>Cholesterol:</strong><span>  ${model.Cholesterol}g</span></p>
                <p><strong>Sodium:</strong><span>  ${model.Sodium}g</span></p>
                <p><strong>Carbohydrates:</strong><span>  ${model.Carbohydrates}g</span></p>
                <p><strong>Dietary Fiber:</strong><span>  ${model.DietaryFiber}g</span></p>
                <p><strong>Sugars:</strong> ${model.Sugars}g</span></p> 
                <p><strong>Protein:</strong> ${model.Protein}mg</span></p>                              
                <div style="width:100%;height:1px;background-color:#f0f0f0"></div> 
             </div>                
         </div>
         <div class="row"> 
             <div class="col-md-8">
                <div class="center-block" id="figure"></div>
             </div> 
             <div class="col-md-4">
                 
             </div> 
         </div>

         <div class="row">  
             <div class="col-md-4 text-center" style="padding-top:40px">
             <h2>Score:<span style="color:#ffd43d"> ${model.Score}</span></h2> 
             </div>          
             <div class="col-md-2 text-center" style="padding-top:35px"> 
             <h1>≈</h1> 
             </div>  
             <div class="col-md-6 text-center" style="padding-top:40px">
             <h3><span style="color:#ffd43d"> ${model.Match}</span></h3> 
             </div>     
         </div>


         <div class="row hide"> 
             <div class="col-md-12" style="margin-top:80px;padding-left:20px">
                 <div class="center-block" id="echart" style="height:600px;width:800px"></div>
             </div> 
         </div>

         <div class="row" style="margin-top:80px"> 
         <div class="col-md-1"></div>
             <div class="col-md-10">

                 <div class="progress">
                     <div class="progress-bar" role="progressbar" aria-valuenow="${model.TotalFatDV}" aria-valuemin="0" aria-valuemax="100" style="width: ${model.TotalFatDV}%;">
                      TotalFat DV ${model.TotalFatDV}%
                     </div>
                 </div>
                 <div class="progress">
                     <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="${model.SaturatedFatDV}" aria-valuemin="0" aria-valuemax="100" style="width: ${model.SaturatedFatDV}%;">
                      SaturatedFat DV ${model.SaturatedFatDV}%
                     </div>
                 </div>
                 <div class="progress">
                     <div class="progress-bar  progress-bar-info" role="progressbar" aria-valuenow="${model.CholesterolDV}" aria-valuemin="0" aria-valuemax="100" style="width: ${model.CholesterolDV}%;">
                      Cholesterol DV ${model.CholesterolDV}%
                     </div>
                 </div>
                 <div class="progress">
                     <div class="progress-bar " role="progressbar" aria-valuenow="${model.DietaryFiberDV}" aria-valuemin="0" aria-valuemax="100" style="width: ${model.DietaryFiberDV}%;">
                      DietaryFiber DV ${model.DietaryFiberDV}%
                     </div>
                 </div>
                 <div class="progress">
                     <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="${model.VitaminADV}" aria-valuemin="0" aria-valuemax="100" style="width: ${model.VitaminADV}%;">
                      VitaminA DV ${model.VitaminADV}%
                     </div>
                 </div>
                 <div class="progress">
                     <div class="progress-bar" role="progressbar" aria-valuenow="${model.SodiumDV}" aria-valuemin="0" aria-valuemax="100" style="width: ${model.SodiumDV}%;">
                      Sodium DV ${model.SodiumDV}%
                     </div>
                 </div>
                 <div class="progress">
                     <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="${model.CalciumDV}" aria-valuemin="0" aria-valuemax="100" style="width: ${model.CalciumDV}%;">
                      Calcium DV ${model.CalciumDV}%
                     </div>
                 </div>

             </div> 
         <div class="col-md-1"></div>
         </div>



      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal"style="background-color: #ffd43d;border-color:#ffd43d">Close</button>
      
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

            `
        );
        $('#mymodal').modal('show')


        var myChart = echarts.init(document.getElementById('echart'));
var weatherIcons = {
    '': '',
    '': '',
    '': ''
};

var seriesLabel = {
    normal: {
        show: true,
        textBorderColor: '#333',
        textBorderWidth: 2
    }
}

        // 指定图表的配置项和数据
        var option = {
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
            formatter: function (value) {
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
    series: [
        {
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
                data: [
                    {type: 'max', name: 'max: '},
                    {type: 'this', name: 'this: '}
                ]
            }
        },
        {
            name: 'average',
            type: 'bar',
            label: seriesLabel,
            data: [145, 135, 110]
        },
        {
            name: 'this',
            type: 'bar',
            label: seriesLabel,
            data: [155, 136, 130]
        }
    ]
};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);



}
    
    /**
     * 显示一共找到多少条满足条件
     */
    displayTotalCount(){
        console.log('this.pagination.totalCount:',this.pagination.totalCount);
        $(this.settings.totalCount).text(this.pagination.totalCount);
    }

    /**
     * 显示翻页按钮
     */
    displayPager(){
        var $pages = this._pageButtons();
        $(this.settings.pagerCountainer).empty().append($pages);
    }

    _pageButtons(){
        var $container = $('<div>').addClass('ui pagination menu');
        var pagerange = this.pagination.pageRange;
        for(var i = pagerange[0]; i <= pagerange[1]; i++){
            var $btn = $('<a>').addClass('item').text(i+1);
            if(i == this.pagination.page){
                $btn.addClass('active').css("background-color","#ffc21f");;
            }
            $container.append($btn);
        }
        return $container;
    }

    /**
     * 删除前一页内容, 显示当前页内容.
     * @param array items 当前页的数组对象.
     */
    replaceProducts(items){
        var self = this;
        $(self.settings.listContainer).empty().removeAttr('style');
        var htmlString = this._models2HtmlStr(items);
        if(htmlString)
            $(self.settings.listContainer).html(htmlString);
        else{
            $(self.settings.listContainer).html(this.constructor.noSearchData);
        }
       // window.scrollTo(0,0);
    }
    /**
     * 保持前一页内容, 在前页内容的后面继续添加当前页的内容
     * @param array items 当前页的数组对象.
     */
    appendProducts(items){
        var self = this;
        var htmlString = this._models2HtmlStr(items);
        if(htmlString)
            $(self.settings.listContainer).append(htmlString);
    }

    /**
     * public方法, 该方法调用displayTotalCount(),appendProducts(),和displayPager().
     * @param items 当前页的数组对象.
     * @param append 默认保留前一页内容, 在前一页后面继续添加当前页内容
     */
    display(items, append=true){
        $(this.settings.mapContainer).empty().removeAttr('style');
        this.displayTotalCount();
        if(append){
            this.appendProducts(items);
        }else{
            this.replaceProducts(items);
        }
        this.displayPager();
    }

    /**
     * 抽象方法.根据当前页数组对象返回html字符串.
     * @param array models 当前页的数组对象.
     * @private
     */
    _models2HtmlStr(models){

    }
}