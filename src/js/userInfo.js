$(function() {

    FastClick.attach(document.body);
    /**
     * 初始化数据
     */
    var evaluationCode = Ev.getUrlParams('evaluationCode'); //获取评测编码
    var userInfo = Ev.getStorage('local', 'userInfo');
    // console.log(JSON.stringify(userInfo));
    var userInfoData = [{
            "title": "身高",
            "type": "4",
            "name": "height",
            "unit": "厘米",
            "value": "175"
        },
        {
            "title": "体重",
            "type": "4",
            "name": "weight",
            "unit": "公斤",
            "value": "75"
        }
    ]; //默认身体数据

    /**
     * vue实例对象
     */
    new Vue({
        el: "#ev-basicInfo",
        data: function() {
            return {
                evaluationCode: evaluationCode, //评测编码
                userInfoData: userInfoData,
                nextBtnState: false, //下一步按钮状态
                height: '175', //身高  女生 165 男生 175
                weight: '75', //体重 女生 60 男生 75
                userInfo: userInfo, //用户基础数据输出
            }
        },
        mounted: function() {
            this.$nextTick(function() {
                setTimeout(function() { Ev.hideLoading(); }, 600);
                this.initFn();
                this.checkIsActive();
            });
        },
        methods: {
            /**
             * 初始化方法
             */
            initFn: function() {
                var userInfo = Ev.getStorage('local', 'userInfo');
                var gender = userInfo.gender;
                var _this = this;
                /**
                 * 身高
                 */
                $.each(_this.userInfoData, function(index, value) {
                    if (value.title == "身高") {
                        for (var i = 120; i <= 200; i++) {
                            $(".heightSelect").append("<option id=" + i + ">" + i + "</option>");
                        }
                        if (!Ev.isEmpty(userInfo.height)) {
                            value.value = userInfo.height;
                            var opId = userInfo.height;
                            $(".heightSelect option[id='" + opId + "']").attr("selected", true);
                            _this.height = userInfo.height;
                        } else {
                            if (gender == '2') { //女生，修改身高体重默认值
                                value.value = '165';
                                $(".heightSelect option[id='165']").attr("selected", true);
                                _this.height = '165';
                            } else {
                                $(".heightSelect option[id='175']").attr("selected", true);
                            }
                        }

                        $(".heightSelect").mobiscroll().select({
                            theme: "ios7", //主题
                            lang: "zh", //语言
                            display: "bottom", //显示方式
                            mode: "scroller", //操作方式
                            cssClass: "scrollTwo", //自定义类名
                            onSelect: function(a, b) {
                                $(".heightData").html(b.val);
                                _this.height = b.val;
                                //判断下一步按钮状态
                                _this.checkIsActive();
                            },
                        });
                        $(".heightValue").on("click", function() {
                            $(".heightSelect").click();
                        });
                    }
                });
                /**
                 * 体重
                 */
                $.each(_this.userInfoData, function(index, value) {
                    if (value.title == "体重") {
                        for (var i = 30; i <= 150; i++) {
                            for (var j = 0; j <= 9; j++) {
                                if (i == 150) {
                                    $(".weightSelect").append("<option id=" + (i + "." + 0) + ">" + (i + "." + 0) + '' + "</option>");
                                    break;
                                } else {
                                    $(".weightSelect").append("<option id=" + (i + "." + j) + ">" + (i + "." + j) + "</option>");
                                }
                            }
                        }
                        if (!Ev.isEmpty(userInfo.weight)) {
                            value.value = userInfo.weight;
                            var opId = parseFloat(userInfo.weight).toFixed(1);
                            $(".weightSelect option[id='" + opId + "']").attr("selected", true);
                            _this.weight = userInfo.weight;
                        } else {
                            if (gender == '2') { //女生，修改身高体重默认值
                                value.value = '60';
                                $(".weightSelect option[id='60.0']").attr("selected", true);
                                _this.weight = '60';
                            } else {
                                $(".weightSelect option[id='75.0']").attr("selected", true);
                            }
                        }
                        $(".weightSelect").mobiscroll().select({
                            theme: "ios7", //主题
                            lang: "zh", //语言
                            display: "bottom", //显示方式
                            mode: "scroller", //操作方式
                            cssClass: "scrollThree", //自定义类名
                            onSelect: function(a, b) {
                                $(".weightData").html(b.val);
                                _this.weight = b.val;
                                //判断下一步按钮状态
                                _this.checkIsActive();
                            },
                        });
                        $(".weightValue").on("click", function() {
                            $(".weightSelect").click();
                        });
                    }
                });
            },
            /**
             * 判断下一步按钮状态
             */
            checkIsActive: function() {
                var _this = this;
                if (_this.height != "" && _this.height != "") {
                    _this.nextBtnState = true;
                } else {
                    _this.nextBtnState = false;
                }
            },
            /**
             * 点击下一步
             */
            clickNextBtn: function() {
                this.userInfo.height = this.height;
                this.userInfo.weight = this.weight;
                Ev.setStorage('local', 'userInfo', this.userInfo);
                Ev.go('/evaluting/views/question.html?evaluationCode=' + this.evaluationCode);
            }
        }
    })
});