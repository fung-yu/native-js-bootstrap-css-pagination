/*
 *  javascript原生分页插件
 *	使用bootstrap样式
 *	支持 IE8+
 * 	使用方法：https://github.com/fung-yu/native-js-bootstrap-css-pagination
 */

;(function () {
	function Pagination(users) {
		this.setting = {
			id: null,
			total: 21,
			showButtons: 6,
			callback: null
		}

		this.cur = 1;

		for (var attr in users) {
			this.setting[attr] = users[attr];
		}
		this.setting.id = document.getElementById(this.setting.id);
		this.render();
	}

	// 初始dom
	Pagination.prototype.doInit = function (index, cur) {
		index = index || 0;
		cur = cur || 0;
		var html = '';
		var showButtons = this.setting.showButtons;
		var total = this.setting.total;
		if (total === 0) return '<li></li>';
		var pages = showButtons >= total ? total : showButtons;
		for (var i = index, lens = pages + index; i < lens; i++) {

			if (i == cur) {
				html += '<li class="page-item active"><a href="javascript:;" class="page-link">' + (i + 1) + '<span class="sr-only">(current)</span></a></li>';
			} else {
				html += '<li class="page-item"><a href="javascript:;" class="page-link" href="#">' + (i + 1) + '</a></li>';
			}
		}

		if (cur == 0 && total > showButtons) {
			return '<li class="page-item disabled"><span id="prev" class="page-link"><</span></li>'+html + '<li class="page-item"><span id="next" class="page-link" href="#">></span></li>';
		} else if (cur == this.setting.total - 1 && total > showButtons) {
			return '<li class="page-item"><span id="prev" class="page-link"><</span></li>' + html+'<li class="page-item disabled"><span id="next" class="page-link" href="#">></span></li>';
		} else if (showButtons >= total) {
			return '<li  class="page-item disabled"><span id="prev" class="page-link"><</span></li>' + html + '<li class="page-item disabled"><span id="next" class="page-link" href="#">></span></li>';
		}

		return '<li class="page-item"><span id="prev" class="page-link"><</span></li>' + html + '<li class="page-item"><span id="next" class="page-link" href="#">></span></li>';
	}

	// 渲染
	Pagination.prototype.render = function () {
		var self = this;
		this.setting.id.innerHTML = this.doInit();
		this.setting.id.onclick = function (e) {
			e = e || window.event;
			self.handle(e)
		};
	}

	// click
	Pagination.prototype.handle = function (e) {
		var target = e.target || e.srcElement;
		if (target.className === 'active') {
			return false;
		}

		var pageList = this.setting.id;
		var items = pageList.querySelectorAll('a');
		var len = items.length;
		var end = items[len - 1].innerHTML; // 最后一个按钮的页码
		var num = Number(target.innerHTML);
		this.cur = num ? num : this.cur;
		var cur = this.cur;
		var total = this.setting.total;
		var pages = this.setting.showButtons;

		// 点击分页 
		if (target.nodeName === 'A') {
			// 往右 
			if ((cur == end - 1 && cur != total - 1) || (cur == end && cur == total - 1)) { // 倒二  每次1页
				pageList.innerHTML = this.doInit(end - (len - 1), cur - 1);
			} else if (cur == end && cur != total) { // 倒一 每次2页
				pageList.innerHTML = this.doInit(end - (len - 2), cur - 1);
			}

			// 往左
			else if (cur == end - (len - 1) && cur > 2) { // 左1 每次2页
				pageList.innerHTML = this.doInit(end - (len + 2), cur - 1);
			} else if ((cur == end - (len - 2) && cur != 2) || (cur == end - (len - 1) && cur == 2)) { // 左2 每次1页
				pageList.innerHTML = this.doInit(end - (len + 1), cur - 1);
			}

			// 最左2个 最右2个 中间
			else {
				if (total > pages) {
					pageList.innerHTML = this.doInit(end - pages, cur - 1);
				} else {
					for (var i = 0; i < len; i++) {
						items[i].className = '';
					}
					e.target.className = 'active';
				}
			}
		}

		// 上一页 previous page
		if (target.id === 'prev') {
			if(target.parentNode.className.indexOf('disabled')>=0) return;
			this.cur--;
			if (this.cur < end - (len - 3) && this.cur > 2) {
				end--;
			}
			pageList.innerHTML = this.doInit(end - pages, this.cur - 1);
		}

		// 下一页 next page
		if (target.id === 'next') {
			if(target.parentNode.className.indexOf('disabled')>=0) return;
			this.cur++;
			if (this.cur > end - 2 && this.cur < total - 1) {
				end++;
			}
			pageList.innerHTML = this.doInit(end - pages, this.cur - 1);
		}
		this.setting.callback && this.setting.callback(this.cur - 1);
	}

	window.Pagination = Pagination;
})();