new Vue({
    el: '#evaluationReport',
    data: function() {
        return {
            showView: false,
            showScore: false,
            score: '', //分数
            riskLevel: '', //风险等级图片
            showRiskLevel: false,
            showReportContent: false,
            reportContent: '', //报告内容
            example: {},
            evaluationReport: {}, //评估报告
            evaluationId: '',
            showBtn: false, //判断是否有管理方案
        }
    },
    mounted: function() {
        var _this = this;
        this.$nextTick(function() {
            _this.getJson();
            setTimeout(function() {
                Ev.hideLoading();
                _this.showView = true;
            }, 500);

        });
        _this.pushHistory();
        window.addEventListener("popstate", function(e) {
            window.location.href = "evaluationManagement.html?evaluationId=" + _this.evaluationId;
            _this.pushHistory();
        }, false);
    },
    methods: {
        pushHistory: function() {
            var state = {
                title: "title",
                url: "#"
            };
            // console.log("state：" + state);
            window.history.pushState(state, "title", "#");
        },
        goManagementPlan: function() {
            var os = Ev.versions();
            // console.log("os:" + os);
            if (os === 'ios') {
                Ev.go("managementPlan.html?type=1");
            } else {
                Ev.go("managementPlan.html?type=2");
            }
        },
        getJson: function() {
            var resData = Ev.getStorage('local', "resData");
            this.evaluationId = resData.evaluationId;
            if (resData.managementPlan) {
                this.showBtn = true;
            }
            //获取评估报告
            var evaluationReport = resData.evaluationReport;
            console.log(resData);
            //没有分数不显示
            if (evaluationReport.score !== '' && evaluationReport.score) {
                this.showScore = true;
                this.score = evaluationReport.score;
            }
            //判断有等级图片
            if (resData.riskGradeImageUrl && resData.riskGradeImageUrl != '') {
                this.showRiskLevel = true;
                this.riskLevel = resData.riskGradeImageUrl;
            } else if (resData.riskGrade != '' && resData.riskGrade) { //显示风险等级
                this.showRiskLevel = true;
                if (resData.riskGrade === '1') { //低风险
                    this.riskLevel = '../images/evalutingReport/lowRisk.png';
                } else if (resData.riskGrade === '2') { //中风险
                    this.riskLevel = '../images/evalutingReport/middleRisk.png';
                } else { //高风险
                    this.riskLevel = '../images/evalutingReport/highRisk.png';
                }
            }
            var _this = this;
            evaluationReport.content.forEach(function(report, i) {
                console.log(report);
                //中医体质类型模板
                if (report.templateType == 'ZY_TYPE') {
                    _this.reportContent += _this.$options.methods.getZyTypeTem(report.template);
                }
                //模板1
                if (report.templateType === "CONTENT_TEMPLATE_1") {
                    _this.reportContent += _this.$options.methods.getContentTemplate1(report.template);
                }
                //模板 2
                if (report.templateType === "CONTENT_TEMPLATE_2") {
                    _this.reportContent += _this.$options.methods.getContentTemplate2(report.template);
                }
                //模板3
                if (report.templateType === "CONTENT_TEMPLATE_3") {
                    _this.reportContent += _this.$options.methods.getContentTemplate3(report.template);
                }
                //新增------
                //模板4
                if (report.templateType === 'CONTENT_TEMPLATE_4') {
                    _this.reportContent += _this.$options.methods.getContentTemplate4(report.template);
                }
                //风险因素模板
                if (report.templateType === 'RISK_FACTOR_TEMPLATE') {
                    _this.reportContent += _this.$options.methods.getRiskFactorTemplate(report.template);
                }
                //健康指数模板
                if (report.templateType === 'HEALTH_INDEX_TEMPLATE') {
                    _this.reportContent += _this.$options.methods.getHealthIndexTempalte(report.template);
                }
                //饮食结构模板
                if (report.templateType === 'FOOD_STRUCTURE') {
                    _this.reportContent += _this.$options.methods.getDietStructure(report.template);
                }
                //内容模板6
                if (report.templateType === 'CONTENT_TEMPLATE_6') {
                    _this.reportContent += _this.$options.methods.getContentTemplate6(report.template);
                }
                //内容模板8
                if (report.templateType === 'CONTENT_TEMPLATE_8') {
                    _this.reportContent += _this.$options.methods.getContentTemplate4(report.template);
                }
            })
            if (this.reportContent != '') {
                this.showReportContent = true;
            } else {
                this.showReportContent = false;
            }
        },
        //测评回顾
        questionReview: function() {
            Ev.go("question-review.html?evaluationId=" + this.evaluationId);
        },
        //中医体质模板
        getZyTypeTem: function(templateInfo) {
            var template = '';
            if (templateInfo) {
                if (templateInfo.imageUrl) {
                    template += '<section class="zyTypeTem" style="background: url(' + templateInfo.imageUrl + ');">';
                    if (templateInfo.title && templateInfo.title != '') {
                        template += '<span>' + templateInfo.title + '</span>';
                    }
                    if (templateInfo.type && templateInfo.type != '') {
                        template += '<span>' + templateInfo.type + '</span>';
                    }
                    if (templateInfo.remark && templateInfo.remark != '') {
                        template += '<span>' + templateInfo.remark + '</span>';
                    }
                    template += '</section>';
                }
            }
            return template;
        },
        //内容模板1
        getContentTemplate1: function(templateInfo) {
            var template1 = '';
            if (templateInfo) {
                template1 = ' <section class="contentBox templateOne">';
                if (templateInfo.title != '' && templateInfo.title != undefined) {
                    template1 += '<div class="temTitle marb_36">' + templateInfo.title + '</div>';
                }
                if (templateInfo.value.length > 0) {
                    template1 += '<ul>'
                    templateInfo.value.forEach(function(valueList, i) {
                        var sort = i + 1;
                        template1 += '<li><span class="number">' + sort +
                            '</span><span class="temConLi">' + valueList.replace(/\</g, "＜") + '</span></li>';
                    })
                    template1 += '</ul>'
                }
                template1 += '</section>';
            }
            return template1;
        },
        //内容模板2
        getContentTemplate2: function(templateInfo) {
            var template2 = '';
            if (templateInfo) {
                template2 += '<section class="contentBox templateTwo">';
                if (templateInfo.title != '' && templateInfo.title != undefined) {
                    template2 += '<div class="temTitle">' + templateInfo.title + '</div>'
                }
                if (templateInfo.explain != '' && templateInfo.explain != undefined) {
                    template2 += '<div class="explain">';
                    templateInfo.explain.forEach(function(explain, i) {
                        if (i === templateInfo.explain.length) {
                            template2 += '<p style="margin-bottom:.5rem;">' + explain + '</p>';
                        } else {
                            template2 += '<p>' + explain + '</p>';
                        }

                    })
                    template2 += '</div>';
                }
                //模板2引用表格模板
                if (templateInfo.templateType === 'TABLE_TEMPLATE') {
                    var tableTemplate = templateInfo.template.rows; //数组
                    template2 += '<div class="reportTable"><table>';
                    for (var index in tableTemplate) {
                        var tableCellList = tableTemplate[index].cells;
                        template2 += "<tr>"
                        for (var i = 0; i < tableCellList.length; i++) {
                            var cell = tableCellList[i];
                            if (cell.type === 'TH') { //表头th
                                var rows = cell.rowspan === 0 ? '' : cell.rowspan;
                                var cols = cell.colspan === 0 ? '' : cell.colspan;
                                var valueList = cell.value;
                                template2 += '<' + cell.type + ' align="' + cell.align + '" rowspan="' + rows + '" colspan="' + cols + '">';
                                valueList.forEach(function(value, i) {
                                    template2 += value + '<br/>';
                                })
                                template2 += '</' + cell.type + '>';
                            } else { //行td
                                var rows = cell.rowspan === 0 ? '' : cell.rowspan;
                                var cols = cell.colspan === 0 ? '' : cell.colspan;
                                var valueList = cell.value;
                                template2 += '<' + cell.type + ' align="' + cell.align + '" rowspan="' + rows + '" colspan="' + cols + '">';
                                valueList.forEach(function(value, i) {
                                    template2 += value + '<br/>';
                                })
                                template2 += '</' + cell.type + '>';
                            }
                        }
                        template2 += "</tr>"
                    }
                    template2 += '</table></div>'
                        //拼接备注
                    if (templateInfo.remark && templateInfo.remark.length > 0) {
                        var remark = templateInfo.remark;
                        template2 += '<div class="remark">'
                        remark.forEach(function(remarkVal, i) {
                            template2 += '<p>' + remarkVal + '</p>';
                        })
                        template2 += '</div>';
                    }
                }
                //模板2引用内容模板3
                if (templateInfo.templateType === 'CONTENT_TEMPLATE_3') {
                    var template = templateInfo.template;
                    template2 += this.$options.methods.getContentTemplate3(template);
                }
                //模板2引用模板4
                if (templateInfo.templateType === 'CONTENT_TEMPLATE_4') {
                    var template = templateInfo.template;
                    template2 += this.$options.methods.getContentTemplate4(template);
                }
                //模板2引用风险因素模板
                if (templateInfo.templateType === 'RISK_FACTOR_TEMPLATE') {
                    var template = templateInfo.template;
                    template2 += this.$options.methods.getRiskFactorTemplate(template);
                }
                //模板2引用健康指数模板
                if (templateInfo.templateType === 'HEALTH_INDEX_TEMPLATE') {
                    var template = templateInfo.template;
                    template2 += this.$options.methods.getHealthIndexTempalte(template);
                }
                template2 += '</section>';
            }
            return template2;
        },
        //内容模板3
        getContentTemplate3: function(templateInfo) {
            var template3 = '';
            if (templateInfo) {
                if (templateInfo.length > 0) {
                    template3 += '<section class="newTemplateThree">';
                    templateInfo.forEach(function(value, i) {
                        template3 += '<span>' + value + '</span>';
                    })
                    template3 += '</section>';
                }
            }
            return template3;
        },
        //内容模板4
        getContentTemplate4: function(templateInfo) {
            var template4 = '';
            if (templateInfo) {
                template4 += '<section class="contentBox templateFour">';
                if (templateInfo.title != '' && templateInfo.title != undefined) {
                    template4 += '<div class="temTitle">' + templateInfo.title + '</div>';
                }
                if (templateInfo.explain && templateInfo.explain.length > 0) {
                    templateInfo.explain.forEach(function(explain, i) {
                        template4 += ' <div class="subDetail">' + explain + '</div>';
                    })
                }
                if (templateInfo.dataList.length > 0) {
                    template4 += '<ul>';
                    templateInfo.dataList.forEach(function(data, i) {
                        template4 += ' <li class="mart_44">';
                        if (data.subTitle != '' && data.subTitle != undefined) {
                            template4 += '<span class="subtitle">' + data.subTitle + '</span>';
                        }
                        if (data.subContent.length > 0) {
                            template4 += '<div class="mart_16 vam">';
                            data.subContent.forEach(function(subContent, i) {
                                template4 += '<span class="subSubTitle">' + subContent + '</span>';
                            })
                            template4 += '</div>';
                        }
                        template4 += '</li>';
                    })
                    template4 += '</ul>';
                }
                template4 += '</section>';
            }
            return template4;
        },
        //风险因素模板
        getRiskFactorTemplate: function(templateInfo) {
            var riskFatorTem = '';
            if (templateInfo != undefined) {
                riskFatorTem += '<section class="contentBox riskFactorTem">';
                if (templateInfo.title != '' && templateInfo.title != undefined) {
                    riskFatorTem += '<div class="temTitle">' + templateInfo.title + '</div>';
                }
                if (templateInfo.dataList.length > 0) {
                    riskFatorTem += '<ul>';
                    var length = templateInfo.dataList.length;
                    templateInfo.dataList.forEach(function(data, i) {
                        // if (i !== length - 1) {
                        // riskFatorTem += ' <li class="marb_32">';
                        // } else {
                        riskFatorTem += ' <li>';
                        // }
                        riskFatorTem += ' <div class="riskFactorTitleLevel">';
                        if (data.factorName != '' && data.factorName != undefined) {
                            var num = i + 1;
                            riskFatorTem += '<div class="flex_box">';
                            riskFatorTem += '<span class="number">' + num + '</span>';
                            riskFatorTem += '<span class="riskFactor">' + data.factorName + '</span>';
                            riskFatorTem += '</div>';
                        }

                        riskFatorTem += '<div class="riskLevelCon">';
                        riskFatorTem += ' <span>危险等级：</span>';
                        for (var i = 0; i < data.riskLevel; i++) {
                            riskFatorTem += '<image src="../images/evalutingReport/checkedRisk.png" class="riskImg"></image>';
                        }
                        for (var j = 0; j < 5 - data.riskLevel; j++) {
                            riskFatorTem += '<image src="../images/evalutingReport/uncheckedRisk.png" class="riskImg"></image>';
                        }
                        riskFatorTem += '</div>';
                        riskFatorTem += '</div>';

                        riskFatorTem += '<div class="riskFactorRangeResult">';
                        riskFatorTem += '<div class="referRange"><span>参考范围：</span><span>' + data.referScope + '</span></div>';
                        riskFatorTem += '<div class="riskLevelCon riskLevel"> <span>本次结果：</span><span>' + data.result + '</span></div>';
                        riskFatorTem += '</div>';

                        riskFatorTem += '</li>';
                    })
                    riskFatorTem += '</ul>';
                }
                riskFatorTem += '</section>';
            }
            return riskFatorTem;
        },
        //健康指数模板
        getHealthIndexTempalte: function(templateInfo) {
            var healthIndexTem = '';
            if (templateInfo != undefined) {
                healthIndexTem += '<section class="contentBox healthIndexTem">';
                //标题
                if (templateInfo.title != '' && templateInfo.title != undefined) {
                    healthIndexTem += '<div class="temTitle">' + templateInfo.title + '</div>';
                }
                //说明
                if (templateInfo.explain != undefined && templateInfo.explain.length > 0) {
                    templateInfo.explain.forEach(function(explain) {
                        healthIndexTem += '<div class="subDetail">' + explain + '</div>';
                    })
                }

                if (templateInfo.dataList.length > 0) {
                    templateInfo.dataList.forEach(function(data, i) {

                        if (i == 0) {
                            healthIndexTem += '<div class="mart_32 clear">';
                        } else {
                            healthIndexTem += '<div class="mart_32 clear">';
                        }

                        if (data.indexName != '' && data.indexName != undefined) {
                            healthIndexTem += '<span class="glsSubTitle">' + data.indexName + '</span>';
                        }


                        healthIndexTem += '<div class="mart_40"><div class="scrollContent">';
                        if (data.scopeList.length > 0) {
                            // 计算总宽度
                            var boxWidth = "15.75";
                            // var scopeCount = data.scopeList.length;//个数
                            var widthSum = 0; //宽度
                            // var firstSumWidth = 0;//前3个的宽度
                            // var lastSumWidth = 0;//后面的宽度
                            // var dataNum = data.scopeList.length;
                            data.scopeList.forEach(function(scope, i) {
                                    // if (i < 3) {
                                    //     firstSumWidth += ((scope.scopeName.length + 6) * 0.4 + scopeCount * 0.075);
                                    // } else {
                                    //     lastSumWidth += ((scope.scopeName.length + 6) * 0.4 + scopeCount * 0.075);
                                    // }
                                    widthSum += ((scope.scopeName.length + 9) * 0.4 + 0.075);
                                })
                                // var eachWidth = '';//平均值
                                // var scopeListNum = data.scopeList.length;//总个数
                                // eachWidth = parseInt((boxWidth - firstSumWidth) / 3);//平均宽度
                                // console.log("lastSumWidth=" + lastSumWidth);
                                // widthSum = parseInt(boxWidth) + parseInt(lastSumWidth);
                                // console.log("widthSum=" + widthSum);

                            healthIndexTem += '<div style="width:' + widthSum + 'rem;">';

                            data.scopeList.forEach(function(scopeData, i) {
                                //计算单个指数的宽度
                                var scopeDataWidth = '';
                                // if (i < 3) {
                                //     scopeDataWidth = (scopeData.scopeName.length + 6) * 0.4;
                                // } else {
                                //     scopeDataWidth = (scopeData.scopeName.length + 6) * 0.4
                                // }
                                scopeDataWidth = (scopeData.scopeName.length + 9) * 0.4;
                                healthIndexTem += '<div style="width:' + scopeDataWidth + 'rem;" class="sub">';
                                healthIndexTem += '<span class="subblock">' + scopeData.scopeName + '</span>';
                                if (i == 0) {
                                    healthIndexTem += ' <span class="glsImg border_left" style="background-color: ' + scopeData.scopeColor + ';"></span>';
                                } else if (i == data.scopeList.length - 1) {
                                    healthIndexTem += ' <span class="glsImg border_right" style="background-color: ' + scopeData.scopeColor + ';"></span>';
                                } else {
                                    healthIndexTem += ' <span class="glsImg" style="background-color: ' + scopeData.scopeColor + ';"></span>';
                                }
                                healthIndexTem += '<span class="glsNum">' + scopeData.index + '</span>';
                                healthIndexTem += '</div>';
                            })
                            healthIndexTem += '</div>';
                        }
                        healthIndexTem += '</div>';
                        //查看更多
                        if (widthSum > boxWidth) {
                            healthIndexTem += '<div class="seeMore"><i class="iconfont icon-zhankaixuanze-copy xz_icon "></i>左划查看更多</div>';
                        }
                        healthIndexTem += '</div>';
                        healthIndexTem += '</div>';
                    })
                }
                //备注
                if (templateInfo.remark && templateInfo.remark.length > 0) {
                    healthIndexTem += '<section class="templateThree"><ul>';
                    templateInfo.remark.forEach(function(remark) {
                        healthIndexTem += '<li><img src="../images/managementPlan/bluecircle.png" alt="">';
                        healthIndexTem += '<span class="temThreeTitle">' + remark + '</span>';
                        healthIndexTem += '</li>';
                    })
                    healthIndexTem += '</ul></section>';
                }
                healthIndexTem += '</section>';
            }
            return healthIndexTem;
        },
        //饮食结构模板
        getDietStructure: function(templateInfo) {
            var dietStructure = '';
            if (templateInfo) {
                dietStructure += '<section class="contentBox dietStructureTem">';
                if (templateInfo.title && templateInfo.title != '') {
                    dietStructure += '<div class="temTitle">' + templateInfo.title + '</div>';
                }
                if (templateInfo.dataList && templateInfo.dataList.length > 0) {
                    dietStructure += '<ul>';
                    templateInfo.dataList.forEach(function(item, index) {
                        dietStructure += '<li>';
                        dietStructure += '<div class="flex_box">';
                        dietStructure += '<span class="num">' + (index + 1) + '</span>';
                        if (item.classify && item.classify != '') {
                            dietStructure += '<span class="classify">' + item.classify + '</span>';
                        }
                        if (item.imageUrl && item.imageUrl != '') {
                            dietStructure += '<span class="result">评估结果：</span>';
                            dietStructure += '<img src="' + item.imageUrl + '" alt="" />';
                        }
                        dietStructure += '</div>';
                        //参考范围
                        if (item.remark && item.remark != '') {
                            dietStructure += '<div class="range">';
                            // dietStructure += '<span>参考范围：</span>';
                            dietStructure += '<span>' + item.remark + '</span>';
                            dietStructure += '</div>';
                        }
                        dietStructure += '</li>';
                    })
                    dietStructure += '</ul>';
                }
                dietStructure += '</section>';
            }
            return dietStructure;
        },
        /**内容模板6 */
        getContentTemplate6: function(template) {
            var template6 = '';
            if (template) {
                template6 += '<section class="templateSix">';
                //标题
                if (template.title) {
                    template6 += '<div class="title">' + template.title + '</div>';
                }
                //小模板
                if (template.dataList && template.dataList.length > 0) {
                    template.dataList.forEach(function(item, i) {
                        template6 += '<section class="lifeTemplate">';
                        template6 += '<div class="flexbox">';
                        if (item.imageUrl) {
                            template6 += '<img src="' + item.imageUrl + '" class="bigImage">';
                        }
                        if (item.subTitle) {
                            template6 += ' <span class="classify">' + item.subTitle + '</span>';
                        }
                        template6 += '</div>';
                        if (item.subContent) {
                            template6 += ' <div class="marl_76">';
                            template6 += '<p class="lifeVal">' + item.subContent + '</p>';
                            template6 += '</div>';
                        }
                        template6 += '</section>';
                    })
                    template6 += '</section>';
                }
                template6 += '</section>';
            }
            return template6;
        },
    }
})