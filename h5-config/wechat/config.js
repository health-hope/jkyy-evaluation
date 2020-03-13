/**
 * 测试环境配置文件
 */
var config = {
    /**
     * 颜色主题
     * @param 1 #43CEA9 减约官方色
     * @param 2 #4E95E9 蓝色
     * @param 3 E9674E 红色
     * @param 4 3D4459 深蓝色
     */
    theme: '2',

    /**
       提供两种签名方式：
       1、推荐使用signUrl参数，配置服务器端的签名接口，开发者需要在自己的服务器端实现签名算法。
          请求方式：GET
          协议类型：https，使用http可能造成访问异常。
          签名算法：
            1）返回数据示例：{"nonceStr":"your nonceStr","appId":"your appId","version":"2.0","timestamp":"2018-09-25 19:06:16","sign":"your sign"}
            2) 生成密钥步骤：
               a.打开网站：http://web.chacuo.net/netrsakeypair ，密钥位数选择2048位，密钥格式选择PKCS#8（java适用）或PKCS#（非java适用）,证书密码不填写，点击生成密钥对，会生成一个公钥和一个私钥
               b.接入方把私钥保存好，用于请求报文签名时使用，并把公钥信息发送给健康有益，健康有益会单独保存并反馈接入方appId。
               c.签名字段：
                  appId ：应用ID；
                  version ：版本号，固定为2.0
                  timestamp ： 请求时间，格式"yyyy-MM-dd HH:mm:ss"
                  nonceStr ： 随机字符串，建议使用UUID
               d.签名字段排序(替换掉=号右边的值),得到签名串：appId=your_appId&nonceStr=your_nonceStr&timestamp=your_timestamp&version=2.0
               e. 使用各自语言对应的SHA256WithRSA签名函数利用客户私钥对待签名字符串进行签名，并进行Base64编码，以下给出java示例，content为签名串，privateKey为私钥，input_charset固定为UTF-8
                  
                    public static String signWithSHA256(String content, String privateKey,String input_charset) {
                            try {
                                PKCS8EncodedKeySpec priPKCS8 = new PKCS8EncodedKeySpec(
                                        Base64Util.decode(privateKey));
                                KeyFactory keyf = KeyFactory.getInstance("RSA");
                                PrivateKey priKey = keyf.generatePrivate(priPKCS8);
                    
                                java.security.Signature signature = java.security.Signature
                                        .getInstance("SHA256withRSA");
                    
                                signature.initSign(priKey);
                                signature.update(content.getBytes(input_charset));
                    
                                byte[] signed = signature.sign();
                    
                                return Base64Util.encode(signed);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                    
                            return null;
                    } 
									
									
       2、不推荐直接privateKey（私钥）、私钥使用PKCS#8格式，前端暴露私钥并不安全，私钥不带-----BEGIN PRIVATE KEY-----开头和-----END PRIVATE KEY-----结尾，不带换行。
          程序优先使用该参数，不使用该模式，请配置为''。			
									     
     */
    signUrl: '',

    privateKey: '',
    // appId 开发者的应用ID
    appId: '',
    //版本号 固定为2.0
    version: '2.0',

    /****存在用户信息处理 ******
     * 1.访问地址：/evaluting/index.html?evaluationCode=FPFXPC&userId=xxxx
     * 2. 参数说明：
     *   a) evaluationCode 评测编码 必须
     *   b）userId 用户ID  非必需
     *   
     */
}