/**
 * 自定义模板
 */
Vue.component('banner', {
    props: ['bannerImg'],
    mounted: function() {
        // console.log("11:" + this.bannerImg);
    },
    template: "#banner",
});
var index = new Vue({
    el: "#evIndex",
    data: function() {
        return {
            showView: false,
            evaluationCode: '', //评测编码 GXYPC
            evaluationName: '', //评测名称
            evaluationBasis: '', //评估依据
            imageUrl: '', //评测封面图
            references: [], //参考资料
            isFist: false, //兼容第一批测评
            isSecond: false, //兼容第二批测评
            isOther: false, //剩余测评
            evaluationType: '', //评测类型 1或空为疾病测评 2心理测评
            firstEvaluations: ['TNBPC', 'GXYPC', 'GXZPC', 'SGPC', 'FPFXPC'], //第一批评测编码
            secondEvaluations: ['GXBPC', 'GZSSPC', 'TFPC', 'JZBPC', 'JYYDFSCP', 'JLSPCP', 'YYZPCP'], //第二批测评编码
            imageUrlList: [],
            contentIntroduce: {}, //内容介绍
            showContentIntroduce: false, //是否显示内容介绍
            showContentTemOne: false,
            showContentTemTwo: false,
        }
    },
    created () {
        if(Ev.getUrlParams('token')) {
            window.sessionStorage.setItem('token',Ev.getUrlParams('token'))
        }
        // 获取地址栏中有没有userId
        var userId = Ev.getUrlParams("userId")
        // 将userId存入缓存中
        if(userId) {
            Ev.setStorage("session","userId",userId)
        }else {
            // 清空操作
            Ev.setStorage("session","userId",null)
        }
    },
    mounted: function() {
        console.log(Ev);
        var _this = this;
        this.$nextTick(function() {
            _this.evaluationCode = Ev.getUrlParams("evaluationCode"); //JYYDFSCP
            // alert(_this.evaluationCode);
            Ev.setStorage('local', 'code', _this.evaluationCode);
            //兼容老版本
            if (this.firstEvaluations.indexOf(this.evaluationCode) > -1) {
                this.isFist = true;
                this.isSecond = false;
                this.isOther = false;
            } else if (this.secondEvaluations.indexOf(this.evaluationCode) > -1) {
                this.isFist = false;
                this.isSecond = true;
                this.isOther = false;
            } else {
                this.isFist = false;
                this.isSecond = false;
                this.isOther = true;
            }
            //兼容第一批
            // _this.isFist = false;
            // for (var i = 0; i < _this.firstEvaluations.length; i++) {
            //     var code = _this.firstEvaluations[i];
            //     if (_this.evaluationCode === code) {
            //         _this.isFist = true;
            //         _this.isSecond = false;
            //         _this.isOther = false;
            //         break;
            //     }
            // }
            //兼容第二批
            // _this.isSecond = false;
            // for (var i = 0; i < _this.secondEvaluations.length; i++) {
            //     var code = _this.secondEvaluations[i];
            //     if (_this.evaluationCode === code) {
            //         _this.isFist = false;
            //         _this.isSecond = true;
            //         _this.isOther = false;
            //         break;
            //     }
            // }
            //获取数据
            this.getEvaluationData();
        });
    },
    methods: {
        /**
         * 获取评测数据
         */
        getEvaluationData: function() {
            var _this = this;
            var reqData = {
                "evaluationCode": _this.evaluationCode
            };
            Ev.ajaxRequest("/v2/evaluation/brief/load.do", 'POST', reqData, function(data) {
                var res = JSON.parse(data);
                // console.log("111" + JSON.stringify(res));
                // console.log("是否存在：" + Ev.isEmpty(res.contentIntroduce));
                if (res.retCode == 'SUCCESS') {
                    _this.evaluationName = res.evaluationName;
                    _this.evaluationBasis = res.evaluationBasis;
                    _this.imageUrl = res.imageUrl;
                    _this.references = res.references;
                    _this.evaluationType = res.evaluationType;
                    _this.imageUrlList = Ev.isEmpty(res.imageUrlList) ? [] : res.imageUrlList;
                    _this.contentIntroduce = Ev.isEmpty(res.contentIntroduce) ? {} : res.contentIntroduce;
                    if (_this.contentIntroduce.textContent && _this.contentIntroduce.textContent.length > 0) {
                        _this.showContentIntroduce = true;
                        _this.showContentTemOne = true;

                    } else if (_this.contentIntroduce.iconList && _this.contentIntroduce.iconList.length > 0) {
                        _this.showContentIntroduce = true;
                        _this.showContentTemTwo = true;
                    }
                    document.title = _this.evaluationName;
                    Ev.setStorage('local', 'evaluationType', _this.evaluationType);
                } else {
                    Ev.toast(res.retCode + res.retInfo);
                }
                //隐藏loading
                setTimeout(function() {
                    Ev.hideLoading();
                }, 2000);
            });
            _this.showView = true;
        },
        /**
         * 开始评估
         */
        startEval: function() {
            var userId = Ev.getUrlParams("userId")
            // 将userId存入缓存中
            if(userId) {
                Ev.setStorage("session","userId",userId)
            }else {
                // 清空操作
                Ev.setStorage("session","userId",null)
            }
            // 判断有没有userId
            var userId = Ev.getStorage("session","userId")
            if (this.evaluationType == '2') {
                if(userId) {
                    Ev.go('/evaluting/views/question.html?evaluationCode=' + this.evaluationCode + '&userId=' + userId);
                }else {
                    Ev.go('/evaluting/views/question.html?evaluationCode=' + this.evaluationCode);
                }
            } else {
                // 包含evaluationType为 1  3  和空
                if(userId) {
                    Ev.go('/evaluting/views/basicInfo.html?evaluationCode=' + this.evaluationCode + '&userId=' + userId);
                }else {
                    Ev.go('/evaluting/views/basicInfo.html?evaluationCode=' + this.evaluationCode);
                }
            }
        }
    }
})