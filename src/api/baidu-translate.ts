
import md5 from "md5";
import axios from "axios";

export const translate = async (content: string, appid: string, key: string, fromLang: string, toLang: string) => {
    const salt = new Date().getTime();
    const query = content;
    const from = fromLang;
    const to = toLang;
    const str1 = appid + query + salt + key;
    const sign = md5(str1);
    const res = await axios.get(
        "http://api.fanyi.baidu.com/api/trans/vip/translate",
        {
            params: {
                q: query,
                appid: appid,
                salt: salt,
                from: from,
                to: to,
                sign: sign,
            },
        }
    );


    const resData =
        res.data instanceof Object ? res.data : JSON.parse(res.data);
        
    if ("trans_result" in resData) {
        const successRes = resData as translateRes;
        return successRes.trans_result;
    } else {
        return null;
    }
};


