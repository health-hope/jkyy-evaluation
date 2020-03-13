$(function() {
    FastClick.attach(document.body);
    /**
     * 初始化数据
     */
    var evaluationCode = Ev.getUrlParams('evaluationCode'); //获取评测编码
    var basicInfoData = [{
            "title": "姓名",
            "type": "1",
            "name": "userName",
            "unit": ""
        },
        {
            "title": "性别",
            "type": "2",
            "name": "gender",
            "unit": ""
        },
        {
            "title": "出生日期",
            "type": "3",
            "name": "birthday",
            "unit": ""
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
                basicInfoData: basicInfoData,
                nextBtnState: false, //下一步按钮状态
                userName: '', //姓名
                gender: '2', //性别 1 男 2 女
                birthday: '1990-01-01', //出生年月
                height: '', //身高
                weight: '', //体重 
                genderList: [{
                        'value': '2',
                        'name': '女'
                    },
                    {
                        'value': '1',
                        'name': '男'
                    }
                ],
                userInfo: {}, //用户基础数据输出
                specialEval: ['CHYSCP', 'YQYSCP'], //产后饮食、孕期饮食
                hideGender: true,
            }
        },
        beforeCreate () {
            var evaluationCode = Ev.getUrlParams("evaluationCode")
            var userId = Ev.getUrlParams("userId")
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
                console.log("111" + JSON.stringify(res));
                // 将来evaluationType 存入缓存中 防止快应用那边获取不到
                window.localStorage.setItem('evaluationType',res.evaluationType)
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
        created () {
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
            //从url获取参数
            var gender = Ev.getUrlParams("gender");
            var userName = Ev.getUrlParams("userName");
            var birthday = Ev.getUrlParams("birthday");
            var height = Ev.getUrlParams("height");
            var weight = Ev.getUrlParams("weight");
            if (!Ev.isEmpty(gender)) {
                //如果有性别
                if (gender == '1' || gender == '2') {
                    this.gender = gender;
                } else {
                    this.gender = "2";
                }
            } else {
                this.gender = "2"; //默认女
            }
            if (!Ev.isEmpty(userName)) {
                //如果有性别
                this.userName = userName;
            } else {
                this.userName = ""; //默认空
            }
            if (!Ev.isEmpty(birthday)) {
                //如果有性别
                if (Ev.checkFormdate(birthday)) {
                    //格式不匹配
                    this.birthday = birthday;
                } else {
                    this.birthday = "1990-01-01"; //默认1990-01-01
                }
            } else {
                this.birthday = "1990-01-01"; //默认1990-01-01
            }
            if (!Ev.isEmpty(height)) {
                //如果有身高
                this.height = height;
            } else {
                this.height = "";
            }
            if (!Ev.isEmpty(weight)) {
                //如果有身高
                this.weight = weight;
            } else {
                this.weight = "";
            }
            this.$nextTick(function() {
                setTimeout(function() {
                    Ev.hideLoading();
                }, 2000);
                if (this.evaluationCode != '') {
                    for (var i = 0; i < this.specialEval.length; i++) {
                        var code = this.specialEval[i];
                        if (code == this.evaluationCode) {
                            this.hideGender = false;
                            break;
                        }
                    }
                }
                this.initFn();
            });
        },
        watch: {
            userName: function(newValue, oldValue) {
                this.checkIsActive();
            }
        },
        methods: {
            /**
             * 选择性别
             */
            selectGender: function(gender) {
                this.gender = gender.value;
                this.checkIsActive();
            },
            /**
             * 初始化方法
             */
            initFn: function() {
                var date = new Date();
                var seperator1 = "-";
                var year = date.getFullYear() - 18;
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = year + seperator1 + month + seperator1 + strDate;

                currentdate = currentdate.replace(/-/g, "/");
                var currentdate = new Date(currentdate);
                // console.log(currentdate);

                var _this = this;
                /**
                 * 选择生日
                 */
                $.each(_this.basicInfoData, function(index, item) {
                    if (item.title == '性别') {
                        $(".birthdayInput").mobiscroll().date({
                            theme: "ios7", //主题
                            lang: "zh", //语言
                            display: "bottom", //显示方式
                            mode: "scroller", //操作方式
                            cssClass: "birthday-model", //自定义类名
                            setText: "确定", //确定按钮
                            cancelText: "取消", //取消按钮
                            dateFormat: "yy-mm-dd", //日期格式
                            defaultValue: new Date("1990-01-01"), //默认日期
                            minDate: new Date("1900-01-01"), //最小日期
                            maxDate: currentdate, //最大日期new Date()
                            onSelect: function(a, b) {
                                _this.birthday = b.val;
                                //判断下一步按钮状态
                                _this.checkIsActive();
                            },
                        });
                        $(".birthdayValue").on("click", function() {
                            $(".birthdayInput").click();
                        });
                    }
                });
            },
            /**
             * 判断下一步按钮状态
             */
            checkIsActive: function() {
                var _this = this;
                if (_this.userName != "" && _this.gender != "" && _this.birthday != "") {
                    _this.nextBtnState = true;
                } else {
                    _this.nextBtnState = false;
                }
            },
            /**
             * 点击下一步
             */
            clickNextBtn: function() {
                this.userInfo.userName = this.userName;
                this.userInfo.gender = this.gender;
                this.userInfo.birthday = this.birthday;
                this.userInfo.height = this.height;
                this.userInfo.weight = this.weight;
                if (Ev.getStrLength(this.userName) > 20) {
                    Ev.toast("姓名不能超过20个字符");
                    return;
                } else {
                    Ev.setStorage('local', 'userInfo', this.userInfo);
                    Ev.go('/evaluting/views/userInfo.html?evaluationCode=' + this.evaluationCode);
                }
            }
        }
    })
});