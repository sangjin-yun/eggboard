package com.sdplex.egg.utility;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;


/**
 * @author goldbug
 *
 */
public class JsonUtils {

	private JsonUtils() {
		throw new IllegalStateException("Utility class");
	}

	public static Map<String, Object> requestToMap(HttpServletRequest request) {
		return JsonUtils.jsonToMap(JsonUtils.requestToJson(request));
	}

	public static JSONObject requestToJson(HttpServletRequest request) {
		Map<String, Object> map = new HashMap<>();
		Enumeration<String> params = request.getParameterNames();
		while (params.hasMoreElements()) {
			String param = params.nextElement();
			String replaceParam = param.replaceAll("\\.", "-");
			if (!replaceParam.equals("password")) {
				map.put(replaceParam, request.getParameter(param));
			}
		}
		return new JSONObject(map);
	}

	public static Map<String, Object> jsonToMap(JSONObject json) {
        Map<String, Object> retMap = new HashMap<>();

        if(json != null) {
            retMap = toMap(json);
        }
        return retMap;
    }

	public static Map<String, Object> toMap(JSONObject object) {
        Map<String, Object> map = new HashMap<>();

        Iterator<String> keysItr = object.keySet().iterator();
        while(keysItr.hasNext()) {
            String key = keysItr.next();
            Object value = object.get(key);

            if (value instanceof JSONArray) {
                value = toList((JSONArray) value);
            } else if(value instanceof JSONObject) {
                value = toMap((JSONObject) value);
            }
            map.put(key, value);
        }
        return map;
    }

    public static List<Object> toList(JSONArray array) {
        List<Object> list = new ArrayList<>();
        for(int i = 0; i < array.size(); i++) {
            Object value = array.get(i);
            if(value instanceof JSONArray) {
                value = toList((JSONArray) value);
            }

            else if(value instanceof JSONObject) {
                value = toMap((JSONObject) value);
            }
            list.add(value);
        }
        return list;
    }

}
