/**
 * 翻页
 */
class Pagination{
    constructor(options){
        this.settings = $.extend({linkNext:'.next',linkPrev:'.prev',
            linkFirst:'.first',linkLast:'.last',pageSize:20,maxButtonCount:10}, options||{});
        this.pageSize = this.settings.pageSize;
        this._page = 0;
        this.maxButtonCount = this.settings.maxButtonCount;
    }

    get totalCount(){
        return this._totalCount;
    }
    set totalCount(number){
        this._totalCount = number;
    }
    /**
     * @return int number of pages
     */
    get pageCount(){
        if(this.pageSize<1){
            return this.totalCount > 0 ? 1 : 0;
        }else{
            var totalCount = this.totalCount < 0 ? 0 : this.totalCount;
            return Math.floor(((totalCount + this.pageSize - 1) / this.pageSize));
        }
    }

    /**
     * Returns the zero-based current page number.
     * @return int the zero-based current page number.
     */
    get page() {
        return this._page;
    }

    set page(val){
        // val = val-1;
        if (val < 0) {
            val = 0;
        }
        var pagecount = this.pageCount;
        if(val >= pagecount){
            val = pagecount - 1;
        }
        this._page = val;
    }

    /**
     * @return int the offset of the data.
     */
    get offset() {
        var pagesize = this.pageSize;
        return pagesize < 1 ? 0 : this.page * pagesize;
    }

    get limit(){
        var pagesize = this.pageSize;
        // console.log('limit:',pagesize);
        return pagesize < 1 ? -1 : pagesize;
    }

    get pageRange(){
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
}