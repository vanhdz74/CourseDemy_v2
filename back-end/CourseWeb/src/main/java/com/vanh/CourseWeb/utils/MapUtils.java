package com.vanh.CourseWeb.utils;

import java.util.Map;

public class MapUtils {
//	<T>: generic type trả về.
//	params: map chứa dữ liệu (thường value là String hoặc số).
//	key: khóa cần lấy.
//	tClass: lớp mong muốn chuyển về (ví dụ Long.class, Integer.class, String.class).

    public static <T> T getObject(Map<String, Object> params, String key, Class<T> tClass) {
        Object obj = params.getOrDefault(key, null);
        if (obj != null) {
            if (tClass.getTypeName().equals("java.lang.Long")) {
                obj = obj != "" ? Long.valueOf(obj.toString()) : null;
            } else if (tClass.getTypeName().equals("java.lang.Integer")) {
                obj = obj != "" ? Integer.valueOf(obj.toString()) : null;
            } else if (tClass.getTypeName().equals("java.lang.String")) {
                obj = obj.toString();
            }
            return tClass.cast(obj); // Ép tclass theo obj
        }
        return null;
    }
}