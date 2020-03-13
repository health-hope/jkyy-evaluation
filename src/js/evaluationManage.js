/**
 * 自定义模板
 */
Vue.component('banner', {
    props: ['bannerImg'],
    mounted() {
        // console.log("11:" + this.bannerImg);
    },
    template: "#banner",
});
new Vue({
    el: '#evaluationManage',
    data: function () {
        return {
            showView: false,
            showEvalReport: false, //评估报告
            showPhysicalExam: false, //检查建议
            showManagePlan: false, //管理方案
            evaluationId: '', //评测结果ID
            evaluationCode: '', //评测编码
            evaluationName: '', //评测名称
            imageUrl: '',
            userInfo: {}
        }
    },
    mounted: function () {
        console.log(window.WeixinJSBridge + "....16:12.." + window.__wxjs_environment)
        var _this = this;
        this.$nextTick(function () {
            _this.getEvaluationManageInfo();

        });

        if (!window.WeixinJSBridge || !window.WeixinJSBridge.invoke) {

            document.addEventListener('WeixinJSBridgeReady', _this.ready, false)
        } else {

            _this.ready();
        }
        if (!window.WeixinJSBridge) {
            console.log("pushhi")
            _this.pushHistory();

            window.addEventListener("popstate", function (e) {

                window.location.href = "evaluationManagement.html?evaluationId=" + _this.evaluationId;
                _this.pushHistory();
            }, false);
        }

    },
    methods: {
        ready: function () {
            let _this = this;

            console.log(window.WeixinJSBridge + ".ready..16:28.." + window.__wxjs_environment)
            console.log("len:", history.length)
            // 判断是否在小程序环境中，需要引入微信sdk js库
            if (window.__wxjs_environment === 'miniprogram') {

                _this.pushHistoryMini();
                window.addEventListener("popstate", function (e) {
                 
                    wx.miniProgram.navigateBack();
                    window.history.pushState('forward', null, '#');
                    window.history.forward(1);


                    return false;

                    // _this.pushHistoryMini();
                }, false);

            }
        },
        pushHistory: function () {
            if (window.__wxjs_environment === 'miniprogram') return;
            var state = {
                title: "title",
                url: "#"
            };
            // console.log("state：" + state);
            window.history.pushState(state, "title", "#");
        },
        pushHistoryMini: function () {
        
            window.history.pushState("forward", null, "#");
        },
        getEvaluationManageInfo: function () {
            // 为以后留个口子,兼容下config配置
            var uiStyleType = 0
            if(config.uiStyleType != undefined) {
                uiStyleType = Number(config.uiStyleType)?Number(config.uiStyleType):0
            }else{
                uiStyleType = Number(Ev.uiStyleType)?Number(Ev.uiStyleType):0
            }
            this.evaluationId = Ev.getUrlParams("evaluationId");
            var params = {
                //高血脂 5b8cf0fdad726a39dc005340 中风险
                //糖尿病 5b8ce3fcad726a445cab783e 高风险 5b8ce5c1ad726a23888e09dc 低风险 5b8ce69cad726a4908158e56 中风险
                //三高 5b8cf6e8ad726a38148e6a21 高风险
                //高血压 5b8e349414cced7ae3ef7053
                "evaluationId": this.evaluationId,
                "uiStyleType": uiStyleType
                //this.evaluationId
                //this.evaluationId
            };
            var _this = this;
            Ev.ajaxRequest('/v2/evaluation/result/load.do', "POST", params, function (data) {
                var res = JSON.parse(data);
                console.log(res);
                Ev.setStorage('local', "resData", res);
                _this.evaluationCode = res.evaluationCode; //评测编码
                if (res.retCode === 'SUCCESS') {
                    _this.userInfo = res.userInfo;
                    if (res.imageUrl != '' && res.imageUrl != undefined) {
                        _this.imageUrl = res.imageUrl;
                        var shopBannerUrl = res.imageUrl;
                        // $("div[class='manageHeadBox']")[0].style.backgroundImage = "url(" + shopBannerUrl + ")";
                    }
                    if (res.evaluationReport != null) {
                        _this.showEvalReport = true;
                    }
                    if (res.physicalExam != null) {
                        _this.showPhysicalExam = true;
                    }
                    if (res.managementPlan != null) {
                        _this.showManagePlan = true;
                    }
                    _this.evaluationName = res.evaluationName;
                } else {
                    Ev.toast(res.retInfo);
                }
                Ev.hideLoading();
                _this.showView = true;
            })
        },
        //评估报告
        goToEvalReport: function () {
            // Ev.go("evaluationReport.html");
            window.location.href = "./evaluationReport.html";
        },
        //检查建议
        goInspectSuggest: function () {
            Ev.go("./physicalExam.html");
        },
        //管理方案
        goManagePlan: function () {
            Ev.go("./managementPlan.html");
        },
        //重新评估
        reEval: function () {
            // console.log(this.evaluationCode);
            // 重新测评加个字段校验 reType
            var userId = Ev.getStorage("session","userId")
            Ev.go("/evaluting/views/basicInfo.html?evaluationCode=" + this.evaluationCode + "&gender=" + this.userInfo.gender + "&userName=" + this.userInfo.userName + "&birthday=" + this.userInfo.birthday + "&height=" + this.userInfo.height + "&weight=" + this.userInfo.weight + "&reType=1" + "&userId=" + userId);
        }
    }
});