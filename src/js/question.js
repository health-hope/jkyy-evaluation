$(function() {
    /**
     * 初始化数据
     */
    //获取评测编码
    var evaluationCode = Ev.getUrlParams("evaluationCode");
    //获取用户基础信息
    var userInfo = Ev.getStorage('local', 'userInfo');
    //用户选择答案
    var userOptions = [];
    //获取页面数据
    getPageData();


    function getPageData() {
        var reqData = {
            "evaluationCode": evaluationCode,
            "userInfo": userInfo
        };
        Ev.ajaxRequest("/v2/evaluation/content/load.do", 'POST', reqData, function(resData) {
            var data = JSON.parse(resData);
            if (data.retCode == 'SUCCESS') {
                //评测名称
                var evaluationName = data.evaluationName;
                document.title = evaluationName;
                //题库ID
                var quesBankId = data.quesBankId;
                //问题和选项
                var quesOptions = data.quesOptions;
                //导语
                var guideWords = Ev.isEmpty(data.guideWords) ? [] : data.guideWords;
                Ev.setStorage("local", "guideWords", guideWords);
                //给基础题添加附属属性 show、btnShow、newFadeInUp、newFadeInDown、newFadeOutUp、newFadeOutDown；选项添加active属性
                $.each(quesOptions, function(index, item) {
                    //下一步按钮状态
                    item.btnShow = false;
                    if (index == 0) {
                        // item.questionType = '3'; //测试数据
                        //第一题默认显示
                        item.show = true;
                        //第一题题目类型是3，日期选择，下一步默认可点击状态
                        if (item.questionType == '3') {
                            item.btnShow = true;
                        }
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
                    $.each(item.options, function(i, e) {
                        //选项状态
                        e.active = false;
                    });
                });

                //新数组
                // console.log(JSON.stringify(quesOptions));
                var newQuesOptions = quesOptions;
                //添加索引
                $.each(newQuesOptions, function(index, item) {
                    item.index = index + 1;
                });

                //废弃题
                var abandonedQuestion = [];
                // console.log(JSON.stringify(newQuesOptions));
                new Vue({
                    el: "#ev-question",
                    data: function() {
                        return {
                            newQuesOptions: newQuesOptions, //评测题
                            qsIndex: 1, // 当前默认题号
                            count: 0, //定时
                            progress: 0, //进度
                            quesBankId: quesBankId, //体库ID
                            evaluationName: evaluationName, //评测名称,
                            evaluationCode: evaluationCode, //评测编码,
                            guideWords: guideWords, //导语
                            userInfo: userInfo, //基础信息
                            requestFlag: true, //防止重复提交
                            isRemind: false, //是否显示提示
                            topSize: '', //顶部距离
                            topManSize: '',
                            guideHeight: '',
                            deviceWidth: '',
                            curTime: '', //当前选择的时间
                        }
                    },
                    beforeCreate () {
                        var evaluationCode = Ev.getUrlParams("evaluationCode")
                        var userId = Ev.getUrlParams("userId") || Ev.getUrlParams("userId")
                        // 判断是不是重新测评 reType
                        var reType = Ev.getUrlParams("reType")
                        if(!userId || Number(reType) == 1) return
                        // 查询最新测评结果ID 若该用户有测评报告则直接跳转测评报告页
                        var reqData = {
                            "evaluationCode": evaluationCode,
                            "userId": userId
                        };
                        Ev.ajaxRequest("/v2/evaluation/latest/record/find.do", 'POST', reqData, function(data) {
                            var res = JSON.parse(data);
                            // 将来evaluationType 存入缓存中 防止快应用那边获取不到
                            window.localStorage.setItem('evaluationType',res.evaluationType)
                            console.log("111" + JSON.stringify(res));
                            if (res.retCode == 'SUCCESS') {
                                if(res.evaluationId) {
                                    if (res.evaluationType == '2') {
                                        Ev.go('/evaluting/views/psychologicalReport.html?evaluationId=' + res.evaluationId);
                                    } else if (res.evaluationType == '3') {
                                        Ev.go('/evaluting/views/nutritionalState.html?evaluationId=' + res.evaluationId);
                                    } else {
                                        Ev.go('/evaluting/views/evaluationManagement.html?evaluationId=' + res.evaluationId);
                                    }
                                }
                            } else {
                                Ev.toast(res.retCode + res.retInfo);
                            }
                        });
                    },
                    mounted: function() {
                        var _this = this;
                        this.$nextTick(function() {
                            //初始化时间控件
                            this.initTime('0', '21:00');
                            this.guideHeight = $(".guide").outerHeight();
                            this.deviceWidth = document.documentElement.clientWidth;
                            this.setTop();
                            setTimeout(function() { Ev.hideLoading(); }, 1000);
                            this.doProgress();
                            // this.checkISRemind();
                            $(".scroll").on('scroll', function() {
                                _this.isRemind = false;
                            })
                        });
                    },
                    methods: {
                        /**
                         * 初始化时间
                         */
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
                                lang: 'zh',
                                timeFormat: 'HH:ii',
                                timeWheels: 'HHii',
                                onSelect: function(a, b) {
                                    console.log(b);
                                }
                            };
                            var optTime = $.extend(opt['time'], opt['default']);
                            $("#time_" + idx).val(curTime); //默认值
                            $("#time_" + idx).mobiscroll().time(optTime); //时分型
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
                            // console.log(_this.qsIndex);
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
                         * 点击选项
                         * @param item 当前题目
                         * @param qs 当前选项
                         */
                        selectAnswerOption: function(item, qs) {
                            // console.log(JSON.stringify(item));
                            // console.log(JSON.stringify(qs));
                            if (item.questionType == '1') {
                                //单选
                                if (!qs.active) {
                                    $.each(item.options, function(index, value) {
                                        value.active = false;
                                    });
                                    //本选项选中
                                    qs.active = true;
                                    //下一步按钮激活状态
                                    item.btnShow = true;
                                }
                            } else if (item.questionType == '2') {
                                //多选
                                if (!qs.active) { //未选中
                                    if (qs.unique) {
                                        //本选项位以上都无(互斥)
                                        $.each(item.options, function(index, value) {
                                            //所有选项都未选种
                                            value.active = false;
                                        });
                                    } else {
                                        //本选项为正常选项（不互斥）
                                        $.each(item.options, function(index, value) {
                                            if (value.unique) {
                                                value.active = false;
                                            }
                                        });
                                    }
                                    //本选项选中
                                    qs.active = true;
                                    //下一步按钮激活状态
                                    item.btnShow = true;
                                } else { //本选项处于选中状态
                                    //使该选项未选中
                                    qs.active = false;
                                    var flag = true;
                                    $.each(item.options, function(index, value) {
                                        if (value.active) {
                                            flag = false;
                                        }
                                    });
                                    if (flag) {
                                        item.btnShow = false;
                                    }
                                }
                            }
                        },
                        /**
                         * 点击下一题
                         * @param item 当前题目
                         */
                        clickNextQuestion: function(item) {
                            // console.log("optionsNext:" + JSON.stringify(item));
                            var _this = this;
                            //下一题编码
                            var nextQuesCode = item.nextQuesCode;
                            var idx = (parseInt(nextQuesCode) - 1) == 0 ? 0 : parseInt(nextQuesCode) - 1;
                            if (idx == 2) {
                                this.initTime(idx, '7:00');
                            } else {

                            }
                            //下一题是时间选择，需要改变下一题按钮的状态
                            if (this.newQuesOptions && this.newQuesOptions.length > 0) {
                                $.each(this.newQuesOptions, function(index, qes) {
                                    if (nextQuesCode == index && qes.questionType == '3') {
                                        qes.btnShow = true;
                                    }
                                })
                            }
                            // console.log(nextQuesCode);
                            //获取下一题选项，并将答案输出
                            var optionsNext = ""; //选项优先权
                            var tempData = { "questionCode": item.questionCode, "value": "", "optionCodes": [] };
                            //有选项，遍历选项
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

                                if (optionsNext) {
                                    //新题
                                    // var optionNextObj = null;
                                    // //新题编码
                                    // var newQuestionCode = optionsNext;
                                    // //从题目选中新题目
                                    // $.each(_this.newQuesOptions, function (index, value) {
                                    //     if (value.questionCode == newQuestionCode) {
                                    //         optionNextObj = value;
                                    //     }
                                    // });
                                    // console.log(JSON.stringify(optionNextObj));
                                    //给新题目天添加nextQuesCode属性，并将新题目添加到现有题目
                                    // $.each(newQuestion, function (index, value) {
                                    //     if (newQuestion[index + 1]) {
                                    //         value.nextQuesCode = newQuestion[index + 1].questionCode;
                                    //     } else {
                                    //         value.nextQuesCode = nextQuesCode;
                                    //     }
                                    //     console.log(JSON.stringify(newQuestion));
                                    //     _this.newQuesOptions.splice(item.index + index, 0, value);
                                    // });

                                    // //下一题编码
                                    // nextQuesCode = newQuestion[0].questionCode;
                                    // //给现有题目添加index属性
                                    // $.each(_this.newQuesOptions, function (index, value) {
                                    //     value.index = index + 1;
                                    // });

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
                                //缓存当前答题记录，用作回顾
                                var reviewInfo = {
                                    "quesOptions": _this.newQuesOptions,
                                    "evaluationName": _this.evaluationName
                                };
                                Ev.setStorage('local', 'reviewInfo', reviewInfo);
                                if (Ev.isEmpty(_this.userInfo)) {
                                    var reqData = {
                                        "quesBankId": _this.quesBankId,
                                        "evaluationCode": _this.evaluationCode,
                                        "userOptions": userOptions
                                    };
                                } else {
                                    var reqData = {
                                        "quesBankId": _this.quesBankId,
                                        "evaluationCode": _this.evaluationCode,
                                        "userInfo": _this.userInfo,
                                        "userOptions": userOptions
                                    };
                                }
                                // 添加额外参数notifyUrl uiStyleType(0是默认, 1是快应用)
                                var reqObj = {}
                                // 兼容下config 为以后留个口子
                                if(config.notifyUrl != undefined) {
                                    reqObj.notifyUrl = config.notifyUrl
                                }else {
                                    reqObj.notifyUrl = Ev.notifyUrl
                                }
                                if(reqObj.notifyUrl) reqData = Object.assign(reqData,reqObj)
                                // 有userId  传过去
                                var userId = Ev.getStorage("session","userId")
                                if(userId) {
                                    if(reqData.userInfo) {
                                        reqData.userInfo.userId = userId
                                    }else {
                                        reqData.userInfo = {}
                                        reqData.userInfo.userId = userId
                                    }
                                }
                                // 将用户的轨迹存入后台，用做回显，从而取代localstorage中的回显示
                                reqData.reviewInfo = JSON.stringify(reviewInfo)
                                //生成评测报告
                                if (_this.requestFlag) {
                                    Ev.showLoading()
                                    _this.requestFlag = false;
                                    Ev.ajaxRequest("/v2/evaluation/data/save.do", "POST", reqData, function(res) {
                                        _this.requestFlag = true;
                                        var data = JSON.parse(res);
                                        if (data.retCode == 'SUCCESS') {
                                            Ev.hideLoading()
                                            var evaluationType = window.localStorage.getItem("evaluationType");
                                            if (evaluationType == '2') {
                                                Ev.go('/evaluting/views/psychologicalReport.html?evaluationId=' + data.evaluationId);
                                            } else if (evaluationType == '3') {
                                                Ev.go('/evaluting/views/nutritionalState.html?evaluationId=' + data.evaluationId);
                                            } else {
                                                Ev.go('/evaluting/views/evaluationManagement.html?evaluationId=' + data.evaluationId);
                                            }
                                        } else {
                                            Ev.toast(res.retInfo);
                                            Ev.hideLoading()
                                        }
                                    });
                                }

                            }
                        },

                        /**
                         * 点击上一题
                         * @param item 当前题目
                         */
                        clickPreQuestion: function(item) {
                            // this.initTime();
                            var _this = this;
                            $.each(item.options, function(index, value) {
                                //所有选项未选中
                                value.active = false;
                            });
                            //下一步按钮状态不能点击
                            item.btnShow = false;
                            //去除已选答案重复数据
                            if (userOptions.length > 0) {
                                //获取上一题编码
                                var lastQuestionCode = userOptions[userOptions.length - 1].questionCode;
                                if (item.questionCode == lastQuestionCode) {
                                    userOptions.pop();
                                    var lastQuestionCode = userOptions[userOptions.length - 1].questionCode;
                                }
                            }
                            // console.log("111:" + JSON.stringify(abandonedQuestion));
                            // $.each(abandonedQuestion, function(index, value) {
                            //     if (item.questionCode == value[0]) {
                            //         $.each(value, function(index, value) {
                            //             //废弃题Id
                            //             var abandonedQuestionId = value;
                            //             //从现有题中除去废弃题
                            //             $.each(_this.newQuesOptions, function(index, value) {
                            //                 if (value) {
                            //                     if (value.questionCode == abandonedQuestionId) {
                            //                         _this.newQuesOptions.splice(index, 1);
                            //                     }
                            //                 }
                            //             });
                            //         });
                            //     }
                            // });
                            //给现有题目添加索引
                            $.each(_this.newQuesOptions, function(index, value) {
                                //页面序号
                                value.index = index + 1;
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
                            // console.log()
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
                        //检测题目的大小
                        checkISRemind(nextQuesCode) {
                            var curOptions = null;
                            this.newQuesOptions.forEach(function(item, index) {
                                if (item.questionCode == nextQuesCode) {
                                    curOptions = item;
                                }
                            });
                            // console.log(JSON.stringify(curOptions));
                            // console.log(nextQuesCode);
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
            } else {
                Ev.toast(data.retCode + data.retInfo);
            }
        });
    }


});