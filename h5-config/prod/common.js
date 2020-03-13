// (function() {
/**
 * rem适配
 */
function resizeBaseFontSize() {
    var rootHtml = document.documentElement,
        deviceWidth = rootHtml.clientWidth;
    if (deviceWidth > 1182) {
        deviceWidth = 1182;
        window.resizeTo(deviceWidth, document.body.clientHeight);
    }
    rootHtml.style.fontSize = deviceWidth / 18.75 + "px";
}
resizeBaseFontSize();
window.addEventListener("resize", resizeBaseFontSize, false);
window.addEventListener("orientationchange", resizeBaseFontSize, false);

/**
 * 渲染loading
 */
createLoading(function() {
    // $.getJSON("/evaluting/data/loading.json", function(data) {
    //     var anim = bodymovin.loadAnimation({
    //         container: document.getElementById("loading"),
    //         renderer: "svg",
    //         loop: true,
    //         autoplay: true,
    //         animationData: data,
    //     });
    //     window.onresize = anim.resize.bind(anim);
    // });
    //禁止弹出层滑动
    $(".loading").on("touchmove", function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            window.event.returnValue = false;
        }
    });
});

/**
 * toast提示
 */
createToast();
//禁止弹出层滑动
$(".toast").on("touchmove", function(e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        window.event.returnValue = false;
    }
});
/**
 * 动态加载js
 */
// dynmicLoadJs('jsrsasign-latest-all-min', '1');

/**
 * 动态加载css样式表，根据不同主题
 */
if (config.theme === "1") {
    //#43CEA9
    //主题1  默认绿色
    dynmicLoadCss(["style-green"], "1"); //加载多个css
} else if (config.theme === "2") {
    //#4E95E9
    dynmicLoadCss(["style-blue"], "1");
} else if (config.theme === "3") {
    //#E9674E
    dynmicLoadCss(["style-red"], "1");
} else if (config.theme === "4") {
    //#3D4459
    dynmicLoadCss(["style-black"], "1");
}

var Ev = {
    //api接口
    ApiUrl: 'https://api.jiankangyouyi.com/ego-gw', //生产环境
    notifyUrl: '', // 回调地址 20190415
    uiStyleType: '', // (0是默认, 1是快应用) 20190415
};
/**
 * 判断是否是数据
 * @param {*} obj
 */
Ev.isArray = function(obj) {
    return Array.isArray(obj);
};

/**
 * 判断其他类型
 */
["Function", "String", "Number", "Date", "Boolean"].forEach(function(
    value
) {
    Ev["is" + value] = function(obj) {
        return (
            Object.prototype.toString.call(obj) === "[object " + value + "]"
        );
    };
});
/**
 * 判断是否为空
 * @param {*} obj
 */
Ev.isEmpty = function(keys) {
    if (typeof keys === "string") {
        keys = keys
            .replace(/\"|&nbsp;|\\/g, "")
            .replace(/(^\s*)|(\s*$)/g, "");
        if (
            keys == "" ||
            keys == null ||
            keys == "null" ||
            keys === "undefined"
        ) {
            return true;
        } else {
            return false;
        }
    } else if (typeof keys === "undefined") {
        // 未定义
        return true;
    } else if (typeof keys === "number") {
        return false;
    } else if (typeof keys === "boolean") {
        return false;
    } else if (typeof keys == "object") {
        if (JSON.stringify(keys) == "{}") {
            return true;
        } else if (keys == null) {
            // null
            return true;
        } else {
            return false;
        }
    }
    if (keys instanceof Array && keys.length == 0) {
        // 数组
        return true;
    }
};
/**
 * 获取URl地址参数
 * @param {*} name  参数名称
 */
Ev.getUrlParams = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
};
/**
 * 生成随机字符串
 * @param {*} length 长度
 */
Ev.randomString = function(length) {
    length = length || 32;
    var chars = "abcdefhijkmnprstwxyz012345678";
    var maxPos = chars.length;
    var pwd = "";
    for (var i = 0; i < length; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};
/**
 * ajax数据请求封装
 * @param {*} url  接口地址
 * @param {*} type  请求类型
 * @param {*} signStr json串需要加签
 * @param {*} callback 成功之后回调函数
 */
Ev.ajaxRequest = function(url, type, reqData, callback) {
    var _this = this;
    var code = window.localStorage.getItem("code");
    var token = window.sessionStorage.getItem("token");
    if(!token) {
        if (config.privateKey != "") {
            //使用签名
            var nonceStr = _this.randomString(32); //随机字符串
            var timestamp = _this.formatDate("yyyy-MM-dd hh:mm:ss", new Date()); //时间戳
            var signStr =
                "appId=" +
                config.appId +
                "&nonceStr=" +
                nonceStr +
                "&timestamp=" +
                timestamp +
                "&version=" +
                config.version;
            var privateKey =
                `-----BEGIN PRIVATE KEY-----` +
                config.privateKey +
                `-----END PRIVATE KEY-----`;
            var sign = doSign(signStr, privateKey, "sha256");
            var params = {
                appId: config.appId,
                version: config.version,
                timestamp: timestamp,
                nonceStr: nonceStr,
                sign: sign,
            };
            var params;
            // Object.assign(params,reqData)
            params.reqData = reqData;
            $.ajax({
                url: _this.ApiUrl + url + '?type=' + code,
                type: type,
                data: JSON.stringify(params),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function(data) {
                    var resData = data.resData;
                    callback(resData);
                },
                error: function(err) {
                    console.log(err);
                }
            });
        } else if(config.signUrl != "") {
            //通过接口
            $.get(config.signUrl, function(data) {
                if (data) {
                    var params = data;
                    params.reqData = reqData;
                    $.ajax({
                        url: _this.ApiUrl + url + '?type=' + code,
                        type: type,
                        data: JSON.stringify(params),
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        success: function(data) {
                            var resData = data.resData;
                            callback(resData);
                        },
                        error: function(err) {
                            console.log(err);
                        }
                    });
                } else {
                    _this.toast("请检查签名");
                }
            });
        }else {
            _this.toast("请检查签名或配置token");
        }
    }else {
        // token
        var nonceStr = _this.randomString(32); //随机字符串
        var timestamp = _this.formatDate("yyyy-MM-dd hh:mm:ss", new Date()); //时间戳
        var params = {
            reqData: reqData,
            appId: config.appId,
            version: config.version,
            timestamp: timestamp,
            nonceStr: nonceStr,
        };
        $.ajax({
            headers: {
                "token": token
            },
            url: _this.ApiUrl + url + '?type=' + code,
            type: type,
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function(data) {
                var resData = data.resData;
                callback(resData);
            },
            error: function(err) {
                console.log(err);
            }
        });
    }
};
/**
 * 日志打印
 * @param {*} data
 */
Ev.log = function(data) {
    console.log(JSON.stringify(data));
};
/**
 * 判断终端
 */
Ev.versions = function() {
    var u = navigator.userAgent,
        os;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    if (isiOS) {
        os = "ios";
    } else if (isAndroid) {
        os = "android";
    } else {
        os = "";
    }
    return os;
};
/**
 * 显示laading
 */
Ev.showLoading = function() {
    $(".loading").show();
};
/**
 * 隐藏loading
 */

Ev.hideLoading = function() {
    $(".loading").hide();
};
/**
 * toast提示
 */
Ev.toast = function(value) {
    $(".toast p").html(value);
    $(".toast").show();
    $(".toast .toast-box")
        .removeClass("fadeOutUp")
        .addClass("fadeInDown")
        .show();
    setTimeout(function() {
        $(".toast .toast-box")
            .removeClass("fadeInDown")
            .addClass("fadeOutUp");
        setTimeout(function() {
            $(".toast").fadeOut();
        }, 800);
    }, 2000);
};
/**
 * 获取缓存
 * @param {*} key
 */
Ev.getStorage = function(type, key) {
    if (type == "local") {
        if (!key) return;
        var r
        if ((Number(window.localStorage.getItem(key))).toString() !== "NaN") {
            r = window.localStorage.getItem(key);
        } else {
            try {
                r = JSON.parse(window.localStorage.getItem(key));
            } catch (error) {
                r = window.localStorage.getItem(key);
            }
        }
        if (r != null) return r;
        return null;
    } else if (type == "session") {
        if (!key) return;
        var r
        if ((Number(window.sessionStorage.getItem(key))).toString() !== "NaN") {
            console.log(window.sessionStorage.getItem(key));
            r = window.sessionStorage.getItem(key);
        } else {
            try {
                console.log("111");
                r = JSON.parse(window.sessionStorage.getItem(key));
            } catch (error) {
                console.log("222");
                r = window.sessionStorage.getItem(key);
            }
        }
        if (r != null) return r;
        return null;
    }
};
/**
 * 设置缓存
 * @param {*} key
 * @param {*} value
 */
Ev.setStorage = function(type, key, value) {
    if (type == "local") {
        if (!key) return;
        if (typeof value != "string") {
            value = JSON.stringify(value);
        }
        window.localStorage.setItem(key, value);
    } else if (type == "session") {
        if (!key) return;
        if (typeof value != "string") {
            value = JSON.stringify(value);
        }
        window.sessionStorage.setItem(key, value);
    }
};
/**
 * 删除缓存
 * @param {*} key
 */
Ev.delStorage = function(type, key) {
    if (type == "local") {
        if (!key) return;
        window.localStorage.removeItem(key);
    } else if (type == "session") {
        if (!key) return;
        window.sessionStorage.removeItem(key);
    }
};
/**
 * 图片预加载
 * @param {*} arr
 */
Ev.preLoadImage = function(arr) {
    var newImage = [],
        loadedImage = 0;
    var postAction = function() {};
    var arr = typeof arr != "object" ? [arr] : arr;

    function imageLoadPost() {
        loadedImage++;
        if (loadedImage == arr.length) {
            postAction(newImage);
        }
    }
    for (var i = 0; i < arr.length; i++) {
        newImage[i] = new Image();
        newImage[i].src = arr[i];
        newImage[i].onload = function() {
            imageLoadPost();
        };
        newImage[i].onerror = function() {
            imageLoadPost();
        };
    }
    return {
        done: function(f) {
            postAction = f || postAction;
        }
    };
};
/**
 * 获取字符串长度
 */
Ev.getStrLength = function(str) {
    var cArr = str.match(/[^\x00-\xff]/gi);
    return str.length + (cArr == null ? 0 : cArr.length);
};
/**
 * 生日转换年龄
 * @param {*} birthday
 */
Ev.birthdayToAge = function(birthday) {
    var birthdayDate = new Date(birthday.replace(/-/g, "/")),
        nowDate = new Date(),
        newDate = new Date(
            nowDate.getFullYear(),
            birthdayDate.getMonth(),
            birthdayDate.getDate()
        );
    var age = new Date().getFullYear() - birthdayDate.getFullYear() - 1;
    if (nowDate > newDate) {
        age += 1;
    }
    return age;
};
/**
 * 吸顶
 * @param {*} obj
 */
Ev.ceiling = function(obj) {
    var os = Ev.versions();
    if (os == "android") {
        var offTop = document.getElementById("tabBox").offsetTop;
        document.onscroll = function() {
            var scrollTop =
                document.body.scrollTop ||
                document.documentElement.scrollTop;
            if (scrollTop >= offTop) {
                obj.attr("data-fixed", "fixed");
                obj.addClass("clearfix");
            } else {
                obj.attr("data-fixed", "");
                obj.removeClass("clearfix");
            }
        };
    } else if (os == "ios") {
        if (
            CSS.supports("position", "sticky") ||
            CSS.supports("position", "-webkit-sticky")
        ) {
            obj.addClass("sticky");
        } else {
            var offTop = parseInt($("#headTop").height());
            document.onscroll = function() {
                var scrollTop =
                    document.body.scrollTop ||
                    document.documentElement.scrollTop;
                obj.attr("data-fixed", scrollTop >= offTop ? "fixed" : "");
            };
        }
    }
};
/**
 * 页面跳转
 */
Ev.go = function(path) {
    window.location.href = String(path);
};
/**
 * 页面返回
 */
Ev.back = function() {
    window.history.back(-1);
};

/**
 * 时间格式化
 * @param {*} time
 */
Ev.formatDate = function(format, date) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(format))
        format = format.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ?
                o[k] :
                ("00" + o[k]).substr(("" + o[k]).length)
            );
    return format;
};

/***
 * 校验是否为yyyy-MM-dd格式的日期
 */
Ev.checkFormdate = function(value) {
    var reg = /^(\d{4})-(\d{2})-(\d{2})$/;
    if (!reg.test(value)) {
        return false;
    } else {
        return true;
    }
};

// })(window);

/**
 * 动态加载css样式表
 * @param {*} cssarr  css数组
 * @param {*} length  长度
 */
function dynmicLoadCss(cssarr, length) {
    if (!cssarr || cssarr.length === 0) {
        throw new Error("加载css样式表链接不能为空");
    }

    if (length > 1) {
        //多个css
        for (var i = 0; i < length; i++) {
            // console.log(cssarr[i])
            appendCss(cssarr[i]);
        }
    } else {
        appendCss(cssarr);
    }

    /**
     * 渲染css
     * @param {*} cssName css名称
     */
    function appendCss(cssName) {
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.href = "/evaluting/css/" + cssName + ".css";
        link.rel = "stylesheet";
        link.type = "text/css";
        head.appendChild(link);
    }
}

function dynmicLoadJs(jsarr, length) {
    if (!jsarr || jsarr.length === 0) {
        throw new Error("加载js不能为空");
    }

    if (length > 1) {
        //多个css
        for (var i = 0; i < length; i++) {
            // console.log(jsarr[i])
            appendJS(jsarr[i]);
        }
    } else {
        appendJS(jsarr);
    }

    /**
     * 渲染css
     */
    function appendJS(jsName) {
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.href = "/evaluting/js/" + jsName + ".js";
        link.type = "text/javascript";
        head.appendChild(link);
    }
}

/**
 * 创建loading
 */
function createLoading(callback) {
    // var loading_box = $('<div class="loading"></div>');
    // $('<div class="loading-box" id="loading"></div>').appendTo(loading_box);
    // $('body').append(loading_box);
    callback();
}

/**
 * 创建toast提示
 */
function createToast() {
    var toast_box = $('<div class="toast"></div>').css("display", "none");
    var toast_main = $('<div class="toast-box animated"></div>').appendTo(
        toast_box
    );
    $("<p></p>").appendTo(toast_main);
    $("body").append(toast_box);
}

/**
 * 签名加密
 * @param {*} signData 加密数据
 * @param {*} privateKey 私钥
 * @param {*} hashAlg 默认256
 */
function doSign(signData, privateKey, hashAlg) {
    var rsa = new RSAKey(); // 新建RSA对象
    rsa = KEYUTIL.getKey(privateKey); // 设置私钥
    var hashAlg = hashAlg || "sha256"; // 设置sha1
    var hSig;
    if (rsa.signString) {
        //rsa在不同版本有不同方法。。
        hSig = rsa.signString(signData, hashAlg); // 加签
        hSig = hex2b64(hSig); // hex 转 b64
    } else if (rsa.sign) {
        hSig = rsa.sign(signData, hashAlg); // 加签
        hSig = hex2b64(hSig); // hex 转 b64
    }
    return hSig;
}