$(function() {
    /**
     * 初始化数据
     */
    // 根据报告结果页的数据去请求对应的 测评回顾的数据
    
    //获取评测题
    var _reviewInfo = Ev.getStorage('local', 'resData');
    var reviewInfo;
    try {
        reviewInfo = _reviewInfo && JSON.parse(_reviewInfo.reviewInfo)
    } catch (error) {
        reviewInfo = _reviewInfo.reviewInfo
    }
    if (!reviewInfo) {
        Ev.toast("获取评测回顾数据失败");
        return;
    }
    var quesOptions = reviewInfo.quesOptions;
    var evaluationName = reviewInfo.evaluationName;
    var guideWords = Ev.getStorage("local", "guideWords");

    if (Ev.isEmpty(guideWords)) {
        guideWords = [];
    }
    console.log(guideWords);
    if (evaluationName) {
        document.title = evaluationName;
    }
    var resData = Ev.getStorage('local', 'resData');
    if (!resData.userOptions || resData.userOptions.length < 1) {
        Ev.toast("获取评测回顾数据失败");
        return;
    }
    //用户选择答案
    var userOptions = [];
    var curTime;
    $.each(quesOptions, function(index, item) {
        //下一步按钮状态
        item.btnShow = true;
        if (index == 0) {
            //默认第一题显示
            item.show = true;
            // item.questionType = '3'; //测试数据
            //第一题默认显示
            item.show = true;
            //第一题题目类型是3，日期选择，下一步默认可点击状态
            // if (item.questionType == '3') {
            //     item.btnShow = true;
            //     var resData = Ev.getStorage('local', 'resData');
            //     if (resData && resData.userOptions) {
            //         curTime = resData.userOptions[index].value;

            //     }
            // }
        } else {
            item.show = false;
        }

        //向上切入状态
        item.newFadeInUp = false;
        //向下切入状态
        item.newFadeInDown = false;
        //向上切出状态
        item.newFadeOutUp = false;
        //向下切出状态
        item.newFadeOutDown = false;
    });

    //新数组
    var newQuesOptions = quesOptions;

    //废弃题
    var abandonedQuestion = [];
    /**
     * 初始化vue实例
     */
    new Vue({
        el: "#ev-question",
        data: function() {
            return {
                newQuesOptions: newQuesOptions, //评测题
                qsIndex: 1, // 当前默认题号
                count: 0, //定时
                progress: 0, //进度
                isRemind: false,
                guideWords: guideWords, //导语
                topSize: '', //顶部距离
                topManSize: '',
                guideHeight: '',
                deviceWidth: '',
                curTime: curTime,
                userOptions: resData.userOptions, //评测结果用户选择
            }
        },
        mounted: function() {
            var _this = this;
            this.$nextTick(function() {
                //初始化时间控件
                if (this.newQuesOptions && this.newQuesOptions.length > 0) {
                    var _this = this;
                    $.each(this.newQuesOptions, function(index, item) {
                        //时间类型，需要初始化用户已选择时间
                        if (item.questionType == '3') {
                            if (_this.userOptions && _this.userOptions.length > 0) {
                                $.each(_this.userOptions, function(idx, option) {
                                    if (index == idx) {
                                        var curTime = option.value;
                                        _this.initTime(idx, curTime);
                                    }
                                })
                            }
                        }
                    })
                }
                this.guideHeight = $(".guide").outerHeight();
                this.deviceWidth = document.documentElement.clientWidth;
                this.setTop();
                setTimeout(function() { $(".blue").removeClass('blue'); }, 100);
                setTimeout(function() { Ev.hideLoading(); }, 200);
                this.doProgress();
                $(".scroll").on('scroll', function() {
                    _this.isRemind = false;
                })
            });
            _this.pushHistory();
            window.addEventListener("popstate", function(e) {
                var evaluationId = Ev.getUrlParams("evaluationId");
                var evaluationType = window.localStorage.getItem("evaluationType");
                if (evaluationType == '2') {
                    Ev.go('../views/psychologicalReport.html?evaluationId=' + evaluationId);
                } else if (evaluationType == '3') {
                    Ev.go('../views/nutritionalState.html?evaluationId=' + evaluationId);
                } else {
                    Ev.go("../views/evaluationReport.html"); //退出回顾调转到评估报告页面
                }
                _this.pushHistory();
            }, false);

        },
        methods: {
            initTime: function(idx, timeStr) {
                var curTime;
                //为空，初始化当前系统时间
                if (timeStr == '') {
                    var hours = new Date().getHours();
                    var min = new Date().getMinutes();
                    var time = hours + ':' + min;
                    curTime = time;
                } else {
                    //不为空，初始化已选择的时间
                    curTime = timeStr;
                }
                var opt = {};
                opt.time = {
                    preset: 'time'
                };
                opt.default = {
                    theme: 'android-ics light', //皮肤样式
                    display: 'inline', //显示方式 
                    mode: 'scroller', //日期选择模式
                    readonly: true,
                    lang: 'zh',
                    timeFormat: 'HH:ii',
                    timeWheels: 'HHii',
                    onSelect: function(a, b) {
                        console.log(b);
                    }
                };
                var optTime = $.extend(opt['time'], opt['default']);
                $("#time_" + idx).val(curTime);
                $("#time_" + idx).mobiscroll().time(optTime); //时分型
            },
            pushHistory: function() {
                var state = {
                    title: "title",
                    url: "#"
                };
                console.log("state：" + state);
                window.history.pushState(state, "title", "#");
            },
            /**
             * 转换题号
             */
            changeEn: function(index) {
                switch (index) {
                    case 0:
                        return 'A.';
                        break;
                    case 1:
                        return 'B.';
                        break;
                    case 2:
                        return 'C.';
                        break;
                    case 3:
                        return 'D.';
                        break;
                    case 4:
                        return 'E.';
                        break;
                    case 5:
                        return 'F.';
                        break;
                    case 6:
                        return 'G.';
                        break;
                    case 7:
                        return 'H.';
                        break;
                    case 8:
                        return 'I.';
                        break;
                    case 9:
                        return 'J.';
                        break;
                    case 10:
                        return 'K.';
                        break;
                    case 11:
                        return 'L.';
                        break;
                    case 12:
                        return 'M.';
                        break;
                    case 13:
                        return 'N.';
                        break;
                    case 14:
                        return 'O.';
                        break;
                    case 15:
                        return 'P.';
                        break;
                    case 16:
                        return 'Q.';
                        break;
                    case 17:
                        return 'R.';
                        break;
                    case 18:
                        return 'S.';
                        break;
                    case 19:
                        return 'T.';
                        break;
                    case 20:
                        return 'U.';
                        break;
                    case 21:
                        return 'V.';
                        break;
                    case 22:
                        return 'W.';
                        break;
                    case 23:
                        return 'X.';
                        break;
                    case 24:
                        return 'Y.';
                        break;
                    case 25:
                        return 'Z.';
                        break;
                }
            },
            /**
             * 绘制进度条
             */
            setProgress: function(progress) {
                if (progress) {
                    $(".bar").css("width", String(progress) + '%');
                }
            },
            /**
             * 前进进度条动画
             */
            doProgress: function() {
                var _this = this;
                var total = (parseInt(_this.qsIndex) / parseInt(_this.newQuesOptions.length)) * 100;
                var totalProgress = parseInt(total);
                if (_this.count > totalProgress) {
                    return;
                } else {
                    _this.count++;
                    setTimeout(function() {
                        _this.doProgress();
                    }, 100);
                    _this.setProgress(_this.count);

                }
            },
            /**
             * 后退进度条
             */
            backProgress: function() {
                var _this = this;
                var total = (parseInt(_this.qsIndex) / parseInt(_this.newQuesOptions.length)) * 100;
                var totalProgress = parseInt(total);
                if (_this.count < totalProgress) {
                    return;
                } else {
                    _this.count--;
                    setTimeout(function() {
                        _this.backProgress();
                    }, 100);
                    _this.setProgress(_this.count);
                }
            },
            /**
             * 点击下一题
             * @param item 当前题目
             */
            clickNextQuestion: function(item) {
                var _this = this;
                //下一题编码
                var nextQuesCode = item.nextQuesCode;
                // console.log(nextQuesCode);
                $.each(this.newQuesOptions, function(index, item) {
                    if (item.questionType == '3') {
                        $.each(_this.userOptions, function(idx, option) {
                            if (index == idx) {
                                var curTime = option.value;
                                _this.initTime(idx, curTime);
                            }
                        })
                    }
                })
                $(".blue").removeClass('blue');
                //获取下一题选项，并将答案输出
                var optionsNext = ""; //选项优先权
                var tempData = { "questionCode": item.questionCode, "value": "", "optionCodes": [] };
                if (item.options && item.options.length > 0) {
                    $.each(item.options, function(index, value) {
                        if (value.active) {
                            //选中项
                            tempData.optionCodes.push(value.optionCode);
                            if (value.nextQuesCode) {
                                //不为空调换下一题
                                optionsNext = value.nextQuesCode;
                                //废弃题
                                abandonedQuestion.push(optionsNext);
                            }
                        }
                    });
                } else {
                    var curIdx = (parseInt(item.index) - 1) == 0 ? 0 : parseInt(item.index) - 1;
                    var curTime = $("#time_" + curIdx).val();
                    tempData.value = curTime;
                }
                //已选择选项 去除重复数据
                if (userOptions.length > 0) {
                    //上一题编码
                    var lastQuestionCode = userOptions[userOptions.length - 1].questionCode;
                    if (item.questionCode == lastQuestionCode) {
                        userOptions.pop();
                    }
                }
                userOptions.push(tempData);
                if (nextQuesCode) { //有下一题
                    //下一步按钮隐藏
                    // item.btnShow = false;
                    //向上切出
                    _this.vue_newFadeOutUp(item);
                    console.log("optionsNext:" + optionsNext);

                    if (optionsNext) {
                        nextQuesCode = optionsNext;
                    }

                    //向上切入
                    $.each(_this.newQuesOptions, function(index, value) {
                        if (value.questionCode == nextQuesCode) {
                            //获取下一题题号
                            _this.qsIndex = _this.newQuesOptions[index].index;
                            _this.vue_newFadeInUp(value);
                        }
                    });
                    _this.doProgress();
                    $(window).scrollTop(0);
                    _this.checkISRemind(nextQuesCode);
                } else { //没有下一题
                    var evaluationId = Ev.getUrlParams("evaluationId");
                    var evaluationType = window.localStorage.getItem("evaluationType");
                    if (evaluationType == '2') {
                        Ev.go('../views/psychologicalReport.html?evaluationId=' + evaluationId);
                    } else if (evaluationType == '3') {
                        Ev.go('../views/nutritionalState.html?evaluationId=' + evaluationId);
                    } else {
                        Ev.go("../views/evaluationReport.html"); //退出回顾调转到评估报告页面
                    }
                }
            },
            /**
             * 点击上一题
             * @param item 当前题目
             */
            clickPreQuestion: function(item) {
                var _this = this;
                //去除已选答案重复数据
                if (userOptions.length > 0) {
                    //获取上一题编码
                    var lastQuestionCode = userOptions[userOptions.length - 1].questionCode;
                    if (item.questionCode == lastQuestionCode) {
                        userOptions.pop();
                        var lastQuestionCode = userOptions[userOptions.length - 1].questionCode;
                    }
                }
                $.each(abandonedQuestion, function(index, value) {
                    if (item.questionCode == value[0]) {
                        $.each(value, function(index, value) {
                            //废弃题Id
                            var abandonedQuestionId = value;
                            //从现有题中除去废弃题
                            $.each(_this.newQuesOptions, function(index, value) {
                                if (value) {
                                    if (value.questionCode == abandonedQuestionId) {
                                        _this.newQuesOptions.splice(index, 1);
                                    }
                                }
                            });
                        });
                    }
                });
                //向下切出页面
                _this.vue_newFadeOutDown(item);
                $.each(_this.newQuesOptions, function(index, value) {
                    if (value.questionCode == lastQuestionCode) {
                        //获取上一题题号
                        _this.qsIndex = _this.newQuesOptions[index].index;
                        _this.vue_newFadeInDown(value);
                        if (value.type == "checkbox") {
                            //下一步按钮显示
                            setTimeout(function() {
                                value.btnShow = true;
                            }, 300);
                        }
                    }
                });
                _this.backProgress();
                $(window).scrollTop(0);
                _this.checkISRemind(lastQuestionCode);
            },
            logoutReive: function() {
                var evaluationId = Ev.getUrlParams("evaluationId");
                var evaluationType = window.localStorage.getItem("evaluationType");
                if (evaluationType == '2') {
                    Ev.go('../views/psychologicalReport.html?evaluationId=' + evaluationId);
                } else if (evaluationType == '3') {
                    Ev.go('../views/nutritionalState.html?evaluationId=' + evaluationId);
                } else {
                    Ev.go("../views/evaluationReport.html"); //退出回顾调转到评估报告页面
                }
            },
            /**
             * 清除所有效果
             */
            vue_clean: function(item) {
                item.newFadeInUp = false;
                item.newFadeInDown = false;
                item.newFadeOutUp = false;
                item.newFadeOutDown = false;
            },
            /**
             * 向上切入效果
             */
            vue_newFadeInUp: function(item) {
                this.vue_clean(item);
                this.setTop(item.index);
                item.newFadeInUp = true;
                setTimeout(function() {
                    item.show = true;
                }, 200);
            },
            //向下切入效果
            vue_newFadeInDown: function(item) {
                this.vue_clean(item);
                this.setTop(item.index);
                item.newFadeInDown = true;
                setTimeout(function() {
                    item.show = true;
                }, 200);
            },
            /**
             * 向上切出效果
             */
            vue_newFadeOutUp: function(item) {
                this.vue_clean(item);
                item.newFadeOutUp = true;
                setTimeout(function() {
                    item.show = false;
                }, 200);
            },
            //向下切出效果
            vue_newFadeOutDown: function(item) {
                this.vue_clean(item);
                item.newFadeOutDown = true;
                setTimeout(function() {
                    item.show = false;
                }, 200);
            },
            checkISRemind(nextQuesCode) {
                // console.log(JSON.stringify(item));
                // console.log(JSON.stringify(this.newQuesOptions));
                var curOptions = null;
                this.newQuesOptions.forEach(function(item, index) {
                    if (item.questionCode == nextQuesCode) {
                        curOptions = item;
                    }
                });
                // console.log(JSON.stringify(curOptions));
                if (curOptions.options.length > 6) {
                    this.isRemind = true;
                } else if (this.evaluationCode == "GZSSPC" && nextQuesCode == 13) {
                    this.isRemind = true;
                } else if (this.evaluationCode == "MXGYCP" && nextQuesCode == 16) {
                    this.isRemind = true;
                } else {
                    this.isRemind = false;
                }
            },
            /**
             * 换算top
             * @param   {[type]}  index  当前题号
             *
             * @return  {[type]}
             */
            setTop(index) {
                if (index && index != 1) {
                    this.topSize = 1;
                    this.topManSize = 2;
                } else {
                    if (this.guideWords.length > 0) {
                        var size = (this.deviceWidth / this.guideHeight).toFixed(2);
                        this.topSize = size;
                        this.topManSize = parseFloat(size) + 1;
                    } else {
                        this.topSize = 1;
                        this.topManSize = 2;
                    }
                }
                // console.log(index,this.topSize,this.topManSize);
            }
        }
    })

});