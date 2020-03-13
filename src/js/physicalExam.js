new Vue({
    el: '#physicalExam',
    data: function () {
        return {
            showView: false,
            physicalExamContent: '',//检查建议内容
        }
    },
    mounted: function () {
        var _this = this;
        this.$nextTick(function () {
            _this.getJson();
            _this.showView = true;
            Ev.hideLoading();
        });
    },
    methods: {
        getJson: function () {
            var resData = Ev.getStorage('local', "resData");
            //获取检查建议
            var physicalExam = resData.physicalExam;
            console.log(physicalExam);
            var _this = this;
            physicalExam.content.forEach(function (physical, i) {
                console.log(physical);
                //模板1
                if (physical.templateType === "CONTENT_TEMPLATE_1") {
                    _this.physicalExamContent += _this.$options.methods.getContentTemplate1(physical.template);
                }
                //模板 2
                if (physical.templateType === "CONTENT_TEMPLATE_2") {
                    _this.physicalExamContent += _this.$options.methods.getContentTemplate2(physical.template);
                }
            })
        },
        getContentTemplate1: function (templateInfo) {
            var template1 ='';
            if (templateInfo.title != '' && templateInfo.title!=undefined){
                template1 += '<div class="reportContentTitle">' + templateInfo.title + '</div>';
            }
            if (templateInfo.value.length>0){
                template1+='<div>';
                templateInfo.value.forEach(function (value, i) {
                    template1 += '<div class="reportContent">' + value + '</div>';
                })
                template1 += '</div>';
            }
            return template1;
        },
        getContentTemplate2: function (templateInfo) {
            var template2 ='';
            if (templateInfo.title != '' && templateInfo.title!=undefined){
                template2 += '<div class="reportContentTitle">' + templateInfo.title + '</div>';
            }
            if (templateInfo.explain != '' && templateInfo.explain!=undefined){
                template2 += '<div class="reportContent2">' + templateInfo.explain + '</div>';
            }
            //模板2引用表格模板
            if (templateInfo.templateType === 'TABLE_TEMPLATE') {
                var tableTemplate = templateInfo.template.rows;
                template2 += '<div class="reportTable"><table>';
                for (var index in tableTemplate) {
                    var tableCellList = tableTemplate[index].cells;
                    template2 += "<tr>"
                    for (var i = 0; i < tableCellList.length; i++) {
                        var cell = tableCellList[i];
                        if (cell.type === 'TH') {//表头th
                            var rows = cell.rowspan === 0 ? '' : cell.rowspan;
                            var cols = cell.colspan === 0 ? '' : cell.colspan;
                            var valueList = cell.value;
                            template2 += '<' + cell.type + ' align="' + cell.align + '" rowspan="' + rows + '" colspan="' + cols + '">';
                            valueList.forEach(function (value, i) {
                                template2 += value + '<br/>';
                            })
                            template2 += '</' + cell.type + '>';
                        } else {//行td
                            var rows = cell.rowspan === 0  ? '' : cell.rowspan;
                            var cols = cell.colspan === 0  ? '' : cell.colspan;
                            var valueList = cell.value;
                            template2 += '<' + cell.type + ' align="' + cell.align + '" rowspan="' + rows + '" colspan="' + cols + '">';
                            valueList.forEach(function (value, i) {
                                template2 += value + '<br/>';
                            })
                            template2 += '</' + cell.type + '>';
                        }
                    }
                    template2 += "</tr>"
                }
                template2 += '</table></div>'
                //拼接备注
                var remark = templateInfo.remark;
                if (remark != undefined && remark.length>0){
                    template2 += '<div class="remark">'
                    remark.forEach(function (remarkVal, i) {
                        template2 += '<p>' + remarkVal + '</p>';
                    })
                    template2 += '</div>';
                }
            }
            //模板2引用模板3
            if (templateInfo.templateType === 'CONTENT_TEMPLATE_3') {
                var remarkList = templateInfo.remark;
                if (remarkList != undefined && remarkList.length>0){
                    remarkList.forEach(function (remark, i) {
                        template2 += '<div class="reportContent">' + remark + '</div>'
                    })
                }
            }
            return template2;
        },
        // 模板3
        getContentTemplate3: function (templateInfo) {
            var template3 = '';
            if (templateInfo.length>0){
                templateInfo.forEach(function (value, i) {
                    template3 += '<div class="reportContent">' + value + '</div>';
                })
            }
            return template3;
        },
    }
})
