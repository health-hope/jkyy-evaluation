new Vue({
    el: '#nutritionalState',
    data: function() {
        return {
            showView: false,
            evaluationId: '',
            evaluationCode: '',
            nutritiousStatus: '',
            nutritious: {}, //无营养缺乏
            innutrition: [], //有营养缺乏
            userInfo: {},
        }
    },
    mounted: function() {
        var _this = this;
        this.$nextTick(function() {
            _this.getResult();
        });
        _this.pushHistory();
        window.addEventListener("popstate", function(e) {
            window.location.href = "../views/nutritionalState.html?evaluationId=" + _this.evaluationId;
            _this.pushHistory();
        }, false);
    },
    methods: {
        pushHistory: function() {
            var state = {
                title: "title",
                url: "#"
            };
            console.log("state：" + state);
            window.history.pushState(state, "title", "#");
        },
        getResult: function() {
            this.evaluationId = Ev.getUrlParams("evaluationId");
            var params = {
                "evaluationId": this.evaluationId
            };
            var _this = this;
            Ev.ajaxRequest('/v2/evaluation/result/load.do', "POST", params, function(data) {
                var res = JSON.parse(data);
                console.log(res);
                Ev.setStorage('local', "resData", res);
                _this.evaluationCode = res.evaluationCode; //评测编码
                if (res.retCode === 'SUCCESS') {
                    //用户信息
                    _this.userInfo = res.userInfo;
                    //报告信息
                    if (res.nutritionalReport) {
                        var nutritionalReport = res.nutritionalReport;
                        _this.nutritiousStatus = nutritionalReport.nutritiousStatus;
                        //判断营养是否缺乏
                        if (nutritionalReport.nutritiousStatus == '0') { //无营养缺乏
                            //背景图
                            if (nutritionalReport.nutritious.imageUrl) {
                                var nutritionalImgurl = nutritionalReport.nutritious.imageUrl;
                                $(".psySec")[0].style.backgroundImage = "url(" + nutritionalImgurl + ")";
                            }
                            //结果
                            if (nutritionalReport.nutritious) {
                                _this.nutritious = nutritionalReport.nutritious;
                            }
                        }
                        if (nutritionalReport.nutritiousStatus == '1') { //营养缺乏
                            _this.innutrition = nutritionalReport.innutrition;
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
        questionReview: function() {
            Ev.go("question-review.html?evaluationId=" + this.evaluationId);
        },
        //重新测评
        reEval: function() {
            console.log(this.evaluationCode);
            var userId = Ev.getStorage("session","userId")
            Ev.go("/evaluting/views/basicInfo.html?evaluationCode=" + this.evaluationCode + "&gender=" + this.userInfo.gender + "&userName=" + this.userInfo.userName + "&birthday=" + this.userInfo.birthday + "&height=" + this.userInfo.height + "&weight=" + this.userInfo.weight+ "&reType=1"+ "&userId=" + userId);
            // Ev.go("/evaluting/views/question.html?evaluationCode=" + this.evaluationCode);
        },
    }
})