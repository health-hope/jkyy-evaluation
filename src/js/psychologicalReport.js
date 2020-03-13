new Vue({
    el:'#psychologicalReport',
    data:function(){
        return{
            showView: false,
            evaluationId:'',
            evaluationCode:'',
            result:'',
            psyConList:[],
            userInfo:{},
        }
    },
    mounted:function(){
        console.log("mountted")
        var _this = this;
        this.$nextTick(function () {
            _this.getResult();
            
        });
        if (!window.WeixinJSBridge || !window.WeixinJSBridge.invoke) {

            document.addEventListener('WeixinJSBridgeReady', _this.ready, false)
        } else {

            _this.ready();
        }
        if (!window.WeixinJSBridge) {
            console.log("pushhi2")
            _this.pushHistory();

            window.addEventListener("popstate", function (e) {
              
                window.location.href = "../views/psychologicalReport.html?evaluationId=" + _this.evaluationId;
                _this.pushHistory();
            }, false);
        }

    },
    methods:{
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
        getResult:function(){
            this.evaluationId = Ev.getUrlParams("evaluationId");
            var params={
                "evaluationId": this.evaluationId
            };
            var _this=this;
            Ev.ajaxRequest('/v2/evaluation/result/load.do', "POST", params, function (data) {
                var res = JSON.parse(data);
                console.log(res);
                Ev.setStorage('local', "resData", res);
                _this.evaluationCode = res.evaluationCode;//评测编码
                if (res.retCode === 'SUCCESS') {
                    //用户信息
                    _this.userInfo = res.userInfo;
                    //报告信息
                    if (res.psychicReport){
                        var psychicReport = res.psychicReport;
                        //背景图
                        if (psychicReport.imageUrl){
                            var psyImageUrl = psychicReport.imageUrl;
                            $(".psySec")[0].style.backgroundImage = "url(" + psyImageUrl + ")";
                        }
                        //结果
                        if (psychicReport.result){
                            _this.result = psychicReport.result;
                        }
                        //结果内容
                        if (psychicReport.content && psychicReport.content.length>0){
                            _this.psyConList = psychicReport.content;
                        }
                    }
                } else {
                    Ev.toast(res.retInfo);
                }
                _this.showView = true;
                Ev.hideLoading();
            })
        },
        //测评回顾
        questionReview: function () {
            Ev.go("question-review.html?evaluationId=" + this.evaluationId);
        },
        //重新测评
        reEval:function(){
            console.log(this.evaluationCode);
            var userId = Ev.getStorage("session","userId")
            Ev.go("/evaluting/views/question.html?evaluationCode=" + this.evaluationCode+ "&reType=1"+ "&userId=" + userId);
        },
    }
})