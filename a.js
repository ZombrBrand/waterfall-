//瀑布流渲染
var waterfall = {
    init: function () {
        this.isloading = true
        this.bind()
    },
    //初始化数据
    dataInit: function () {
        this.imgNumber = null //img有多少个
        this.heightArray = []
        this.imgWidth = $('.container img').outerWidth(true)
        this.minHeight = null
        this.minIndex = null
        this.imgNumber = Math.floor($('.container').width() / this.imgWidth)
        for (let i = 0; i < this.imgNumber; i++) {
            this.heightArray[i] = 0 //初始化高度数组都是0这样第一行所有图片都会在顶部
        }
        this.lineNumber = Math.floor($(window).height() / $('.container img').outerHeight(true)) //计算有多少行
    },
    bind: function () {
        let _this = this
        // 先初始化数据
        this.dataInit()
        // 根据用户浏览器大小插入相应数量的img
        this.imgTemplate(this.imgNumber, this.lineNumber)
        // 对加载完的img进行瀑布流布局
        this.imgLoad()
        // 判断img加载完成Hide windowLoading
        this.loadingTimer = setInterval(function () {
            _this.winLoad()
        }, 1000)
    },
    //瀑布流核心代码，思路是load会为加载完成图片处理
    imgLoad: function () {
        var _this = this
        $('img').on('load', function () {
            _this.minHeight = _this.heightArray[0]
            _this.minIndex = 0
            for (let i = 0; i < _this.imgNumber; i++) {
                if (_this.heightArray[i] < _this.minHeight) {
                    _this.minHeight = _this.heightArray[i]
                    _this.minIndex = i
                }
            }
            $(this).css({
                left: _this.minIndex * _this.imgWidth,
                top: _this.minHeight,
                opacity: 1
            })
            _this.heightArray[_this.minIndex] += $(this).outerHeight(true)
        })
    },
    //值得注意的是需要将当前所有img遍历改变布局，相关数据需要初始化
    imgResize: function () {
        var _this = this
        $(window).on('resize', function () {
            _this.dataInit()
            $('img').each(function () {
                _this.minHeight = _this.heightArray[0]
                _this.minIndex = 0
                for (let i = 0; i < _this.imgNumber; i++) {
                    if (_this.heightArray[i] < _this.minHeight) {
                        _this.minHeight = _this.heightArray[i]
                        _this.minIndex = i
                    }
                }
                $(this).css({
                    left: _this.minIndex * _this.imgWidth,
                    top: _this.minHeight,
                    opacity: 1
                })
                _this.heightArray[_this.minIndex] += $(this).outerHeight(true)
                // console.log(_this.heightArray)
            })
        })
    },
    //img模版
    imgTemplate: function (imgNumber, lineNumber) {
        this.sumNumber = imgNumber * lineNumber
        for (let i = 0; i < this.sumNumber; i++) {
            let $img = $('<img>')
            let $color = Math.floor(Math.random() * 256)
            let $imgSize = Math.floor(Math.random() * 300)
            $img.attr({
                src: `http://via.placeholder.com/100x${$imgSize}/${$color}`,
                alt: '图片'
            })
            $('.container').append($img)
            console.log('append')
        }

    },
    // 懒加载+函数节流
    imgScroll: function () {
        let _this = this
        let timer = null
        $(window).on('scroll', function () {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(function () {
                let imgNumber = _this.imgNumber
                let lineNumber = _this.lineNumber
                if (_this.hasLoad($('img').last())) {
                    console.log(1)
                    _this.imgTemplate(imgNumber / 2, lineNumber / 2)
                    _this.imgLoad()
                    _this.loadingTimer = setInterval(function () {
                        _this.winLoad()
                    }, 1000)
                }
            }, 800)

        })
    },
    // 懒加载核心代码
    hasLoad: function ($node) {
        let $winHeight = $(window).height()
        let $scrollTop = $(window).scrollTop()
        let $nodeHeight = $node.outerHeight(true)
        let $offset = $node.offset().top
        if ($winHeight + $scrollTop >= $offset - $nodeHeight) {
            return true
        } else {
            return false
        }
    },
    // 由于前边会setInterval，需要每次进入先off（load）
    winLoad: function () {
        let _this = this
        $(window).off('load')
        $(window).on('load', function () {
            _this.isloading = false
            // 当视口加载完成后 清除setInterval
            clearInterval(_this.loadingTimer)
            // 添加scroll事件
            _this.imgScroll()
            // 添加resize事件
            _this.imgResize()
            $('.loading').hide()
        })
        console.log(_this.isloading, 'isloading')
    }
}
waterfall.init()