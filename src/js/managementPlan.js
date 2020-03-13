$(function() {
    // var vConsole = new VConsole();
    // console.log('VConsole is cool');

    var resData = Ev.getStorage('local', "resData");
    console.log(resData);
    initData(resData);
    //获取type
    var type = Ev.getUrlParams("type");
    console.log(type,111);
    pushHistory();
    window.addEventListener("popstate", function(e) {
        //是从报告页面进来的管理方案，返回到报告页面
        // alert("type="+type);
        if (type === '1') {
            // alert("返回evaluationReport");
            window.location.href = "evaluationReport.html";
            // pushHistory();
        } else if (type === '2') {
            window.location.href = "evaluationReport.html";
        } else {
            if (Ev.versions() === 'ios') {
                // alert("返回evaluationManagement");
                window.location.href = "evaluationManagement.html?evaluationId=" + resData.evaluationId;
                // pushHistory();
            } else {
                window.location.href = "evaluationManagement.html?evaluationId=" + resData.evaluationId;
            }
        }

    }, false);


    function pushHistory() {
        var state = {
            title: "title",
            url: "#"
        };
        console.log("state：" + state.title);
        window.history.pushState(state, "title", "#");
    }
    //初始化数据
    function initData(data) {


        //管理方案 

        //用户信息
        var userInfo = data.userInfo;
        var userName = userInfo ? userInfo.userName : ''; //用户信息
        var gender;
        if (userInfo && userInfo.gender) {
            gender = userInfo.gender === '1' ? '男士' : '女士'; //用户性别
        } else {
            gender = '';
        }


        //管理方案
        var managementPlan = data.managementPlan;
        // console.log(managementPlan);
        //背景图
        // var managePlanImageUrl = managementPlan.managePlanImageUrl;
        // $(".managementHead")[0].style.backgroundImage = "url(" + managePlanImageUrl + ")";
        // //背景主题图
        // var themeImage = managementPlan.personImageUrl;
        //健康管理建议
        var healthAdvice = managementPlan.healthAdvice;
        //处理风险等级
        var showRiskLevel = false;
        var riskLevelImage = '';
        if (data.riskGrade != undefined && data.riskGrade != '') {
            showRiskLevel = true;
            if (data.riskGrade === '1') { //低风险
                riskLevelImage = '../images/managementPlan/lowRisk.png';
            } else if (data.riskGrade === '2') { //中风险
                riskLevelImage = '../images/managementPlan/middleRisk.png';
            } else { //高风险
                riskLevelImage = '../images/managementPlan/highRisk.png';
            }
        }
        //健康管理重点干预内容
        if (managementPlan.importentContent != null) {
            var importentContent = managementPlan.importentContent.template;
            var importentContentTitle = importentContent.title;
            var importentContentValueList = new Array();
            if (importentContent != undefined) {
                importentContentTitle = importentContent.title;
                importentContentValueList = importentContent.value;
            }
        }

        var planName = new Array();
        var planContentStr = '';
        managementPlan.planClassify.forEach(function(plan, i) {
                if (plan != null) {
                    //页签信息
                    planName.push(plan.planName);
                    //模板信息
                    var planContent = plan.content;
                    // console.log(show);
                    planContentStr += '<section data-id="' + i + '" style="display:none;">';
                    planContent.forEach(function(templateInfo, i) {
                        getPlanContentTemOne
                        // console.log(templateInfo);
                        //内容模板1
                        if (templateInfo.templateType === 'CONTENT_TEMPLATE_1') {
                            planContentStr += getPlanContentTemOne(templateInfo.template);
                        }
                        //内容模板2
                        if (templateInfo.templateType === 'CONTENT_TEMPLATE_2') {
                            planContentStr += getPlanContentTemTwo(templateInfo.template);
                        }
                        //内容模板3
                        if (templateInfo.templateType === 'CONTENT_TEMPLATE_3') {
                            planContentStr += getPlanContentTemThree(templateInfo.template);
                        }
                        //内容模板4
                        if (templateInfo.templateType === 'CONTENT_TEMPLATE_4') {
                            planContentStr += getContentTemplateFour(templateInfo.template);
                        }
                        //饮食模板1
                        // if (templateInfo.templateType === 'MEAL_DATA_TEMPLATE_1') {
                        //     planContentStr += getPlanMealTemOne(templateInfo.template);
                        // }
                        //饮食模板
                        if (templateInfo.templateType === 'MEAL_DATA_TEMPLATE') {
                            planContentStr += getPlanMealTemTwo(templateInfo.template, i);
                        }
                        //运动模板
                        if (templateInfo.templateType === 'SPORT_DATA_TEMPLATE_1') {
                            planContentStr += getSportTem(templateInfo.template);
                        }
                        //生活方式模板
                        if (templateInfo.templateType === 'LIFE_STYLE_TEMPLATE_1') {
                            planContentStr += getLifeStyleTem(templateInfo.template);
                        }
                        //膳食推荐模板
                        if (templateInfo.templateType === 'FOOD_RECOMMEND_TEMPLATE') {
                            planContentStr += getFoodRecommendTem(templateInfo.template);
                        }
                        //图片列表模板
                        if (templateInfo.templateType === 'IMAGE_LIST_TEMPLATE') {
                            planContentStr += getImageListTem(templateInfo.template);
                        }
                        //标签模板
                        if (templateInfo.templateType === 'LABEL_TEMPLATE') {
                            planContentStr += getLabelTem(templateInfo.template);
                        }
                        //空白模板
                        if (templateInfo.templateType === 'BLANK_PAGE_TEMPLATE') {
                            planContentStr += getBlankPageTem(templateInfo.template);
                        }
                        //内容模板7
                        if (templateInfo.templateType === 'CONTENT_TEMPLATE_7') {
                            planContentStr += getPlanContentTemSeven(templateInfo.template);
                        }
                        //内容模板8
                        if (templateInfo.templateType === 'CONTENT_TEMPLATE_8') {
                            planContentStr += getPlanContentTemEight(templateInfo.template);
                        }
                        //内容模板10
                        if (templateInfo.templateType === 'CONTENT_TEMPLATE_10') {
                            planContentStr += getPlanContentTemTen(templateInfo.template);
                        }

                    })
                    planContentStr += "</section>";
                    $("#planContentStr").html(planContentStr);


                }
            })
            //内容模板1
        function getPlanContentTemOne(template) {
            if (template != undefined) {
                var planTemOne = ' <section class="contentBox templateOne">';
                if (template.title != '' && template.title != undefined) {
                    planTemOne += '<div class="temTitle marb_36">' + template.title + '</div>';
                }
                // console.log(template.value);
                if (template.value.length > 0) {
                    planTemOne += '<ul>'
                    template.value.forEach(function(valueList, i) {
                        var sort = i + 1;
                        if (valueList != '') {
                            planTemOne += '<li><span class="number">' + sort +
                                '</span><span class="temConLi">' + valueList + '</span></li>';
                        }
                    })
                    planTemOne += '</ul>'
                }
                planTemOne += '</section>';
                return planTemOne;
            } else {
                return '';
            }
        }
        //内容模板2
        function getPlanContentTemTwo(template) {
            if (template != undefined) {
                var planTemTwo = '<section class="contentBox templateTwo">'
                    //标题
                if (template.title != '' && template.title != undefined) {
                    planTemTwo += '<div class="temTitle">' + template.title + '</div>';
                }
                //说明
                if (template.explain != '' && template.explain != undefined) {
                    planTemTwo += '<div class="explain">' + template.explain + '</div>';
                }
                //引用模板
                //引用表格模板
                if (template.templateType === 'TABLE_TEMPLATE') {
                    planTemTwo += getTableTem(template.template);
                }
                //引用内容模板3
                if (template.templateType === 'CONTENT_TEMPLATE_3') {
                    planTemTwo += getPlanContentTemThree(template.template);
                }
                planTemTwo += '</section>'
                return planTemTwo;
            } else {
                return '';
            }
        }
        //内容模板3
        function getPlanContentTemThree(template) {
            var template3 = '';
            if (template) {
                if (template.value.length > 0) {
                    var template3 = '<section class="newTemplateThree">';
                    template.value.forEach(function(value, i) {
                        template3 += '<span>' + value + '</span>';
                    })
                    template3 += '</section>'
                }
            }
            return template3;
        }
        //内容模板4
        function getContentTemplateFour(templateInfo) {
            var template4 = '';
            if (templateInfo != undefined) {
                template4 += '<section class="contentBox templateFour">';
                if (templateInfo.title != '' && templateInfo.title != undefined) {
                    template4 += '<div class="temTitle">' + templateInfo.title + '</div>';
                }
                if (templateInfo.explain && templateInfo.explain.length > 0) {
                    templateInfo.explain.forEach(function(explain, i) {
                        template4 += ' <div class="subDetail">' + explain + '</div>';
                    })
                }
                if (templateInfo.dataList && templateInfo.dataList.length > 0) {
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
        }
        //饮食模板1：已废弃不使用
        // function getPlanMealTemOne(template) {
        //     if (template != undefined) {
        //         var dietTemOne = '<section class="dietTemplateOne"><div>';
        //         if (template.imageUrl != '' && template.imageUrl != undefined) {
        //             dietTemOne += '<img src="' + template.imageUrl + '" class="bigImage">';
        //         }
        //         if (template.classify != '' && template.classify != undefined) {
        //             dietTemOne += '<span class="classify">' + template.classify + '</span>';
        //         }
        //         dietTemOne += '</div><div class="subClassifyData">';
        //         if (template.subClassifyData.length > 0) {
        //             template.subClassifyData.forEach(function (subClassifyData, i) {
        //                 if (subClassifyData.count != '' && subClassifyData.count != undefined) {
        //                     dietTemOne += ' <p class="count">' + subClassifyData.count;
        //                     if (subClassifyData.unit != '' && subClassifyData.unit != undefined) {
        //                         dietTemOne += '<span class="unit">' + subClassifyData.unit + '</span>';
        //                     }
        //                     dietTemOne += '</p>';
        //                 }
        //                 if (subClassifyData.subClassify != '' && subClassifyData.subClassify != undefined) {
        //                     dietTemOne += ' <p class="subClassify ';
        //                     if (i % 2 != 1) {
        //                         dietTemOne += 'submarb">';
        //                     } else {
        //                         dietTemOne += '">';
        //                     }
        //                     dietTemOne += subClassifyData.subClassify + '</p>';
        //                 }
        //             })
        //         }
        //         dietTemOne += '</div></section>'
        //         return dietTemOne;
        //     } else {
        //         return '';
        //     }
        // }
        //饮食模板2
        function getPlanMealTemTwo(template, i) {
            if (template != undefined) {
                var dietTemTwo = '<section class="dietTemplateTwo ';
                if (i % 2 == 1) {
                    dietTemTwo += 'marr">';
                } else {
                    dietTemTwo += '">';
                }
                dietTemTwo += '<div>';
                if (template.imageUrl != '' && template.imageUrl != undefined) {
                    dietTemTwo += '<img src="' + template.imageUrl + '" class="smallImage">';
                }
                if (template.classify != '' && template.classify != undefined) {
                    dietTemTwo += ' <span class="dietClassify">' + template.classify + '</span>';
                }
                dietTemTwo += '</div>';
                if (template.count != '' && template.count != undefined) {
                    dietTemTwo += ' <span class="count countPos">' + template.count;
                    if (template.unit != '' && template.unit != undefined) {
                        dietTemTwo += '<span class="unit">' + template.unit + '</span>';
                    }
                    dietTemTwo += '</span>';
                }
                dietTemTwo += '</section>';
                return dietTemTwo;
            } else {
                return '';
            }

        }
        //运动模板
        function getSportTem(template) {
            if (template != undefined) {
                var sportTem = '<section class="sportTemplate"><div class="sportImg">';
                if (template.imageUrl != '' && template.imageUrl != undefined) {
                    sportTem += '<img src="' + template.imageUrl + '" class="bigImage">';
                }
                if (template.classify != '' && template.classify != undefined) {
                    sportTem += '<span class="classify">' + template.classify + '</span>';
                }
                sportTem += '</div><div class="sportInfo">';
                if (template.value != undefined) {
                    template.value.forEach(function(value, i) {
                        if (i == template.value.length) {
                            sportTem += '<p class="sportVal">' + value + '</p>';
                        } else {
                            sportTem += '<p class="sportVal sportMart">' + value + '</p>';
                        }
                    });
                }
                if (template.count != '' && template.count != undefined) {
                    sportTem += '<p class="mart sportCount">' + template.count;
                    if (template.unit != '' && template.unit != undefined) {
                        sportTem += '<span class="sportUnit">' + template.unit + '</span>';
                    }
                    sportTem += '</p>';
                }
                sportTem += '</div></section>';
                return sportTem;
            } else {
                return '';
            }
        }
        //生活方式模板
        function getLifeStyleTem(template) {
            if (template != undefined) {
                var lifeTem = '<section class="lifeTemplate"><div style="align-self:flex-start;">';
                if (template.imageUrl != '' && template.imageUrl != undefined) {
                    lifeTem += '<img src="' + template.imageUrl + '" class="bigImage">';
                }
                if (template.classify != '' && template.classify != undefined) {
                    lifeTem += '<span class="classify">' + template.classify + '</span>';
                }
                lifeTem += '</div><div class="lifeInfo">';
                if (template.value.length > 0) {
                    template.value.forEach(function(value, i) {
                        if (i == template.value.length) {
                            lifeTem += '<p class="lifeVal">' + value + '</p>';
                        } else {
                            lifeTem += '<p class="lifeVal lifeMarb">' + value + '</p>';
                        }
                    });
                }
                if (template.count != '' && template.count != undefined) {
                    lifeTem += '<p class="mart sportCount">' + template.count;
                    if (template.unit != '' && template.unit != undefined) {
                        lifeTem += '<span class="sportUnit">' + template.unit + '</span>';
                    }
                    lifeTem += '</p>';
                }
                lifeTem += '</div></section>';
                return lifeTem;
            } else {
                return '';
            }
        }
        //表格模板
        function getTableTem(template) {
            if (template.rows.length > 0) {
                var tableTem = ' <div class="planTable"><table>';
                template.rows.forEach(function(row, i) {
                    tableTem += '<tr>';
                    row.cells.forEach(function(cell, i) {
                        var rows = cell.rowspan === undefined ? '' : cell.rowspan;
                        var cols = cell.colspan === undefined ? '' : cell.colspan;
                        var valueList = cell.value;
                        tableTem += '<' + cell.type + ' align="' + cell.align + '" rowspan="' + rows + '" colspan="' + cols + '" >';
                        valueList.forEach(function(value, i) {
                            tableTem += value + '<br/>';
                        });
                        tableTem += '</' + cell.type + '>';
                    })
                    tableTem += '</tr>';
                });
                tableTem += '</table></div>';
                return tableTem;
            } else {
                return '';
            }
        }
        //膳食推荐模板
        function getFoodRecommendTem(template) {
            if (template != undefined) {
                var foodRecommendTem = '<section class="foodRecommend mart_56">';
                //标题
                if (template.title != '' && template.title != undefined) {
                    foodRecommendTem += '<div class="foodRecommend_title marl_16">' + template.title + '</div>';
                }
                //说明
                if (template.explain.length > 0) {
                    template.explain.forEach(function(explain, i) {
                        foodRecommendTem += '<div class="foodRecommend_explain marl_16">' + explain + '</div>';
                    })
                }
                //内容
                if (template.content.length > 0) {
                    foodRecommendTem += '<div class="foodRecommend_content"><ul>';
                    template.content.forEach(function(content, i) {
                        foodRecommendTem += '<li><div class="foodRecommend_flex">';
                        //图片、分类
                        foodRecommendTem += '<div class="foodRecommendClassFlex">';
                        if (content.imageUrl != '' && content.imageUrl != undefined) {
                            foodRecommendTem += '<image src="' + content.imageUrl + '" class="smallImage"></image>';
                        }
                        if (content.classify != '' && content.classify != undefined) {
                            foodRecommendTem += '<span class="foodRecommend_classify">' + content.classify + '</span>';
                        }
                        if (content.remark != undefined && content.remark.length > 0) {
                            var showId = "show" + i;
                            foodRecommendTem += '<image src="../images/managementPlan/unfoldDetail.png" class="foodRecommend_detail" id="' + showId + '"@click="showFoodDetail(' + i + ')"></image>';
                        }
                        foodRecommendTem += '</div>';
                        //数量和单位
                        foodRecommendTem += '<div>';
                        if (content.count != '' && content.count != undefined) {
                            foodRecommendTem += '<span class="foodRecommend_count">' + content.count + '</span>';
                        }
                        if (content.unit != '' && content.unit != undefined) {
                            foodRecommendTem += '<span class="unit">' + content.unit + '</span>';
                        }
                        foodRecommendTem += '</div>';
                        foodRecommendTem += '</div>';

                        //详情内容
                        if (content.remark != undefined && content.remark.length > 0) {
                            var id = "detail" + i;
                            foodRecommendTem += '<div class="classifyDetialCon" style="display:none;" id="' + id + '">';
                            var commentStr = '';
                            content.remark.forEach(function(remark) {
                                commentStr += (remark + ',');
                            })
                            if (commentStr.indexOf(',') > 0) {
                                commentStr = commentStr.substring(0, commentStr.length - 1);
                            }
                            foodRecommendTem += '<span class="classifyDetial">' + commentStr + '</span>';
                            foodRecommendTem += '</div>';
                        }

                        foodRecommendTem += '</li>';
                    })
                    foodRecommendTem += '</ul>';
                    //备注
                    if (template.remark != undefined && template.remark.length > 0) {
                        foodRecommendTem += ' <section class="templateThree"><ul>';
                        template.remark.forEach(function(remark) {
                            foodRecommendTem += '<li><img src="../images/managementPlan/bluecircle.png" alt="">';
                            foodRecommendTem += '<span class="temThreeTitle">' + remark + '</span>'
                            foodRecommendTem += '</li>';
                        })

                        foodRecommendTem += '</ul></section>';
                    }
                    foodRecommendTem += '</div>';
                }

                foodRecommendTem += '</section>';
                return foodRecommendTem;
            } else {
                return '';
            }
        }
        //图片列表模板
        function getImageListTem(template) {
            if (template != undefined) {
                var imageListTem = '<section class="imageListTemplate">';
                if (template.title != '' && template.title != undefined) {
                    imageListTem += '<div class="foodRefer marl_16" @click="hideImageList">' + template.title + '<i class="iconxs iconfont icon-zhankaixuanze-copy" :class="showImageList?\'icon_xs\':\'\'"></i></div>';
                }
                if (template.imageUrls.length > 0) {
                    imageListTem += '<div class="mart_32" v-show="showImageList">';
                    template.imageUrls.forEach(function(imageUrl, i) {
                        if (i == 0) {
                            imageListTem += ' <image src="' + imageUrl + '" class="foodReferImg marr_14"></image>';
                        } else if (i == 1) {
                            imageListTem += ' <image src="' + imageUrl + '" class="foodReferImg"></image>';
                        } else {
                            if (i % 2 == 1) {
                                imageListTem += ' <image src="' + imageUrl + '" class="foodReferImg mart_20"></image>';
                            } else {
                                imageListTem += ' <image src="' + imageUrl + '" class="foodReferImg marr_14 mart_20"></image>';
                            }
                        }
                    })
                    imageListTem += '</div>';
                }
                imageListTem += '</section>';
                return imageListTem;
            } else {
                return '';
            }
        }
        //标签模板
        function getLabelTem(template) {
            if (template != undefined) {
                var labelTem = '<section class="contentBox labelTemplate mart_32">';
                if (template.title != '' && template.title != undefined) {
                    labelTem += '<div class="cookWay">' + template.title + '</div>';
                }
                if (template.labels.length > 0) {
                    labelTem += ' <div class="cookwayList"> <ul class="cookWayFlex">';
                    template.labels.forEach(function(label, i) {
                        labelTem += '<li class="way">' + label + '</li>';
                    })
                    labelTem += '</ul></div>';
                }
                labelTem += '</section>';
                return labelTem;
            } else {
                return '';
            }
        }
        //空白模板
        function getBlankPageTem(template) {
            // console.log(template);
            if (template != undefined) {
                var blankPageTem = '';
                blankPageTem += '<section class="whiteContent">';
                if (template.imageUrl != '' && template.imageUrl != undefined) {
                    blankPageTem += ' <image src="' + template.imageUrl + '" class="goodImg"></image>';
                }
                if (template.content != undefined && template.content.length > 0) {
                    template.content.forEach(function(content) {
                        blankPageTem += '<div class="whiteText">' + content + '</div>';
                    })
                }
                blankPageTem += '</section>';
                return blankPageTem;
            } else {
                return '';
            }
        }
        //内容模板7
        function getPlanContentTemSeven(template) {
            var template7 = '';
            if (template) {
                template7 += '<section class="contentBox templateSeven">';
                if (template.title && template.title != '') {
                    template7 += '<div class="temTitle">' + template.title + '</div>';
                }
                if (template.dataList && template.dataList.length > 1) {
                    template.dataList.forEach(function(data) {
                        template7 += '<div class="tem">';
                        if (data.explain && data.explain != '') {
                            template7 += '<span>' + data.explain + '</span>';
                        }
                        if (data.imgUrl && data.imgUrl != '') {
                            template7 += '<img src="' + data.imgUrl + '">';
                        }
                        template7 += '</div>';
                    })
                }
                template7 += '</section>';
            }
            return template7;
        }
        //内容模板10
        function getPlanContentTemTen(template) {
            var template10 = '';
            if (template) {
                template10 += '<section class="contentBox exercisesTem">';
                if (template.content && template.content.length > 0) {
                    template.content.forEach(function(content) {
                        template10 += '<div class="explainInfo">' + content + '</div>';
                    })
                }
                if (template.dataList && template.dataList.length > 0) {
                    template10 += '<ul class="exercises">';
                    template.dataList.forEach(function(data) {
                        template10 += '<li>';
                        if (data.subTitle) {
                            template10 += '<span>' + data.subTitle + '</span>';
                        }
                        if (data.subContent && data.subContent.length > 0) {
                            data.subContent.forEach(function(sub) {
                                template10 += '<span>' + sub + '</span>';
                            })
                        }
                        template10 += '</li>';
                    })
                    template10 += '</ul>';
                }
                template10 += '</section>';
            }
            return template10;
        }
        //内容模板8
        function getPlanContentTemEight(template) {
            var template8 = '';
            if (template) {
                template8 = '<section class="contentBox templateEight">';
                if (template.dataList && template.dataList.length > 0) {
                    template8 += ' <ul>';
                    template.dataList.forEach(function(data, index) {
                        template8 += '<li>';
                        var num = index + 1;
                        template8 += '<span class="number">' + num + '</span>';
                        template8 += '<div class="marl_64">';
                        if (data.subTitle) {
                            template8 += '<span class="subTitle">' + data.subTitle + '</span>';
                        }
                        if (data.subContent && data.subContent.length > 0) {
                            data.subContent.forEach(function(sub) {
                                template8 += '<div class="temConLi">' + sub + '</div>';
                            })
                        }
                        template8 += '</div>';
                        template8 += '</li>';
                    })
                    template8 += ' </ul>';
                }
                template8 + '</section>';
            }
            return template8;
        }

        var vm = new Vue({
            el: '#managementPlan',
            data: function() {
                return {
                    showView: false,
                    showRiskLevel: showRiskLevel, //风险等级图
                    riskLevelImage: riskLevelImage, //风险等级图片
                    // themeImage: themeImage, //主题图片
                    userName: userName, //用户姓名
                    gender: gender, //性别
                    healthAdvice: healthAdvice, //健康管理建议
                    importentContentTitle: importentContentTitle,
                    importentContentValueList: importentContentValueList,
                    planName: planName, //页签
                    planContentStr: planContentStr,
                    showIndex: '0', //默认显示
                    contentMart: '',
                    showImageList: true,
                    unfoldDetail: '../images/managementPlan/unfoldDetail.png',
                    takeupDetail: '../images/managementPlan/takeupDetail.png',
                    type: type,
                }
            },
            mounted: function() {
                // this.pushHistory();
            },
            methods: {

                selectPlanNanme: function(index) {
                    this.showIndex = index;
                    $("section[data-id]").hide();
                    $("section[data-id='" + index + "']").show();
                },
                showFoodDetail: function(id) {
                    var showId = "#show" + id;
                    // console.log(showId);
                    if ($(showId).attr("src") === this.unfoldDetail) {
                        $(showId).attr("src", this.takeupDetail);
                    } else {
                        $(showId).attr("src", this.unfoldDetail);
                    }
                    id = "#detail" + id;
                    $(id).toggle();
                },
                hideImageList: function() {
                    this.showImageList = !this.showImageList;
                }
            }
        });
        //默认显示第一个
        $("section[data-id='0']").show();
        vm.showView = true;
        Ev.hideLoading();
        //吸顶占位符:防止在临界值 导航被fixed上去，下面内容会直接占取导航位置，页面会出现抖动，给吸顶的位置添加占位符即可
        var tit = document.getElementById("tabBox");
        //alert(tit);
        //占位符的位置
        // var rect = tit.getBoundingClientRect(); //获得页面中导航条相对于浏览器视窗的位置
        var inser = document.createElement("div");
        tit.parentNode.replaceChild(inser, tit);
        inser.appendChild(tit);
        inser.style.height = "2.1rem";
        // 吸顶
        var os = Ev.versions();
        if (os != 'ios') {
            window.onload = function() {
                Ev.ceiling($("#tabBox"));
            }
        } else {
            Ev.ceiling($("#tabBox"));
        }

    }
});