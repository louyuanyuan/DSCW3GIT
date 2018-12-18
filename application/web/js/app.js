
$(document).ready(function () {
    var pagination = new Pagination();
    var listview = new ListView(pagination);
    var gridview = new GridView(pagination);
    var mapview = new MapView(pagination);
    var model = new Model(pagination);
    window.controller = new Controller(model, listview);

    function init(){
        controller.index(0);
    }
    init();

    /**
     * change category event.
     * 点击不同分类的事件
     */
    $('.condition-area a').on('click tap', function(event){
        if(!$(this).hasClass('active')){
            var type = $(this).data('type');
            controller.type = type;
            controller.index(0);
            $('.condition-area a').removeClass("active");
            $(this).addClass('active');
        }

        //return false;
    });


    /**
     * change view type event
     * 切换视图事件
     */
    $('.viewtypes a').on('click tap', function(event){
        if(!$(this).hasClass('active')){
            if($(this).data('view') == 'list'){
                controller.viewModel = listview;
                $('.viewtypes a').removeClass("active");
            $(this).addClass('active');
            }else if($(this).data('view') == 'grid'){
                controller.viewModel = gridview;
                $('.viewtypes a').removeClass("active");
            $(this).addClass('active');
            }
            
        }
        //return false;
    });
    /**
     * click pager event
     * 翻页事件
     */
    $(document).on('click tap','.ui.pagination.menu a.item', function(event){
        if(!$(this).hasClass('active')){
            var page = $(this).index();
            controller.index(page);
        }
        return false;
    });

    /**
     * click view detail event
     * 查看详细信息事件
     */
    $(document).on('click tap','#itemlist .item, #itemlist .ui.card,.mapmarker,.listitem', function(event){
        var id = $(this).data("id");
        controller.viewDetail(id);
        return false;
    });

    



});