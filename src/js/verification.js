/**
 * 校验用户身份
 * paramList=u+PxRsejiwG4jG/17PSUul6iRw9FPtdp1lxjSnbYQNXbolu8eSTTfGvFa0w5AFbYALLe1hJcVTi5PaF6RJSCTDqIYis+IoaqhB/kW5p5j5VAOPspIi7GSt6INzTHKYxG
 */
function verificationUser() {
    var paramList = Ev.getUrlParams("paramList");
    console.log(paramList);
    if (!Ev.isEmpty(paramList)) {
        //校验用户
        $.get("http://yyzx.51kys.cn/InterFace/WebService/WebAPIV2.aspx?Type=18&paramList=" + paramList, function (data) {
            console.log("response：" + JSON.stringify(data));
            if (data.ReturnSuccess == 0) {
                return true;
            } else {
                Ev.toast(data.ReturnMsg);
                return false;
            }
        });
    } else {
        Ev.toast("参数key不存在");
        return false;
    }

}