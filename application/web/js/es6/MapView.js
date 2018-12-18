/**
 * 地图
 */
class MapView extends AbstractView{
    constructor(pagination, options){
        super(pagination, options);
        this.settings = $.extend({
            listContainer:          '#itemlist',
            mapContainer:      'mapContainer',
            containerHeight:    600,
            modalContainer:     '#modalContainer',
            pagerCountainer:    '.pager',
            totalCount:         '.total .count'
        }, options||{});
        this.pagination = pagination;
        this.name = 'map';
    }

    init(){
        $(this.settings.pagerCountainer).empty();
        $(this.settings.listContainer).empty();
        $('#'+this.settings.mapContainer).height(this.settings.containerHeight);
        this.map = new BMap.Map(this.settings.mapContainer);
        this.map.enableScrollWheelZoom(true);
        this.centerPoint = new BMap.Point(116.404, 39.915);
        this.map.centerAndZoom(this.centerPoint, 15);
    }

    /**
     * display modal of detail information
     * @param object model
     */
    detail(model){
        var self = this;
        $(self.settings.modalContainer).empty().append(
            `<div class="ui modal">
              <i class="close icon"></i>
              <div class="header">
                ${model.name}
              </div>
              <div class="image content">
                <div class="ui medium image">
                  <img src="${model.img}">
                </div>
                <div class="description">
                  <div class="ui header">${model.name}</div>
                  <p>
                      <span class="priceLabel">价格: </span>
                      <span class="price">${model.price}</span> 元
                  </p>
                </div>
              </div>
              <div class="actions">
                <div class="ui black deny button">
                  关闭
                </div>
                <div class="ui positive right labeled icon button">
                  付款
                  <i class="checkmark icon"></i>
                </div>
              </div>
            </div>`
        );
        $('.ui.modal').modal('show');
        $('.ui.modal').modal({onHidden:function(event){
            $(this).remove();
        }});
    }

    display(items){
        this.displayTotalCount();
        this.addMarks(items);
    }

    addMarks(items){
        var self = this;
        self.map.clearOverlays();
        for(var item of items){
            var point = new BMap.Point(item.coord.x, item.coord.y);
            var html = {};
            html.food = `<div data-id="${item.id}" class="mapmarker ${item.type}"><i class="food icon"></i>${item.name} ${item.price}</div>`;
            html.movie = `<div data-id="${item.id}" class="mapmarker ${item.type}"><i class="record icon"></i>${item.name} ${item.price}</div>`;
            var marker = new BMapLib.RichMarker(html[item.type], point);
            marker.addEventListener('click', function(event){
                var id = $(this._content).data('id');
                window.controller.viewDetail(id);
            });
            self.map.addOverlay(marker);
        }

    }
}