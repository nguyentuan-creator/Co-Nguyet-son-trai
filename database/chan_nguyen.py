# -*- coding: utf-8 -*-
"""
MÔ HÌNH TÍNH TOÁN TIÊU HAO CHÂN NGUYÊN - CỔ CHÂN NHÂN (QUYỂN 1)
Hàm suy luận động thay thế việc lưu trữ thuộc tính đa trị trong CSDL.
Quy luật: 1 thành Đỉnh phong = 2 thành Cao giai = 4 thành Trung giai = 8 thành Sơ giai.
Quy luật đại cảnh giới (Dòng 3806): 1 phần Xích Thiết = 10 phần Thanh Đồng.
"""

HE_SO_TIEU_CANH_GIOI = {
    "sơ giai": 1.0,      # Tiêu chuẩn cơ sở (1x)
    "trung giai": 0.5,    # Dùng bền gấp 2 (0.5x)
    "cao giai": 0.25,     # Dùng bền gấp 4 (0.25x)
    "đỉnh phong": 0.125   # Dùng bền gấp 8 (0.125x)
}

MAU_CHAN_NGUYEN = {
    1: {
        "sơ giai": "Xanh biếc (Thúy lục)",
        "trung giai": "Thương lục (Xanh rêu)",
        "cao giai": "Thâm lục (Xanh đậm)",
        "đỉnh phong": "Xanh thẫm / Mặc lục"
    },
    2: {
        "sơ giai": "Thiển xích (Đỏ nhạt / Thiển hồng)",
        "trung giai": "Phi hồng (Đỏ tươi)",
        "cao giai": "Thâm hồng (Đỏ thẫm)",
        "đỉnh phong": "Ám hồng (Đỏ sậm)"
    },
    3: {
        "sơ giai": "Đạm ngân (Bạc nhạt)",
        "trung giai": "Lượng ngân (Bạc sáng)",
        "cao giai": "Bạch ngân (Bạc ròng)",
        "đỉnh phong": "Tuyết ngân (Bạc tuyết)"
    }
}

DUNG_LUONG_TU_CHAT = {
    "Đinh": (2.0, 2.9),  # 2 - 3 thành (20% - 29%)
    "Bính": (4.0, 4.9),  # 4 - 5 thành (40% - 49%)
    "Ất":   (6.0, 7.9),  # 6 - 7 thành (60% - 79%)
    "Giáp": (8.0, 9.9)   # 8 - 9 thành (80% - 99%)
}

# TỶ LỆ QUY ĐỔI VỀ ĐƠN VỊ CHUẨN DUY NHẤT: XANH BIẾC (Thanh Đồng Sơ Giai)
# Dòng 3806: 1 phần Xích Thiết = 10 phần Thanh Đồng
# Dòng 11965: 1 phần Đỉnh phong = 8 phần Sơ giai
TY_LE_QUY_DOI_XANH_BIEC = {
    # Nhất chuyển (Thanh Đồng)
    "xanh biếc": 1.0,     # 1.0x (Đơn vị gốc)
    "thương lục": 2.0,    # 1 thành thương lục = 2 thành xanh biếc
    "thâm lục": 4.0,      # 1 thành thâm lục = 4 thành xanh biếc
    "mặc lục": 8.0,       # 1 thành mặc lục / xanh thẫm = 8 thành xanh biếc
    "xanh thẫm": 8.0,
    
    # Nhị chuyển (Xích Thiết)
    "thiển hồng": 10.0,   # 1 thành thiển hồng (Xích Thiết sơ giai) = 10 thành xanh biếc
    "thiển xích": 10.0,
    "phi hồng": 20.0,     # 1 thành phi hồng = 20 thành xanh biếc
    "thâm hồng": 40.0,    # 1 thành thâm hồng = 40 thành xanh biếc
    "ám hồng": 80.0       # 1 thành ám hồng (Xích Thiết đỉnh phong) = 80 thành xanh biếc
}

def quy_doi_ve_xanh_biec(so_thanh, loai_chan_nguyen="xanh biếc"):
    """
    Quy đổi số thành từ sổ tay (xanh biếc, thiển hồng, ám hồng) về đơn vị duy nhất XANH BIẾC để lưu trữ vào CSDL.
    - Nhất chuyển (xanh biếc): 1 thành = 1 thành xanh biếc.
    - Nhị chuyển (thiển hồng): 1 thành thiển hồng = 10 thành xanh biếc.
    - Tam chuyển (ám hồng): 1 thành ám hồng = 80 thành xanh biếc (7 thành ám hồng = 560 thành xanh biếc).
    """
    key = loai_chan_nguyen.lower().strip()
    ty_le = TY_LE_QUY_DOI_XANH_BIEC.get(key, 1.0)
    return round(so_thanh * ty_le, 3)

def tinh_tieu_hao_thuc_te(tieu_hao_co_so_thanh, tieu_canh_gioi="sơ giai"):
    """
    Tính mức tiêu hao chân nguyên thực tế (theo Thành) tại một tiểu cảnh giới cụ thể.
    :param tieu_hao_co_so_thanh: Mức tiêu hao cơ sở ở sơ giai (vd: 1.0 cho Nguyệt Quang Cổ, 2.0 cho Cậy Mạnh Thiên Ngưu).
    :param tieu_canh_gioi: 'sơ giai', 'trung giai', 'cao giai', hoặc 'đỉnh phong'.
    :return: float - Số thành tiêu hao thực tế.
    """
    tcg = tieu_canh_gioi.lower().strip()
    he_so = HE_SO_TIEU_CANH_GIOI.get(tcg, 1.0)
    return tieu_hao_co_so_thanh * he_so

def tinh_so_lan_su_dung(tieu_hao_co_so_thanh, tu_chat_thanh, tieu_canh_gioi="sơ giai"):
    """
    Tính số lần Cổ sư có thể kích hoạt Cổ trùng trước khi cạn kiệt nguyên hải.
    :param tieu_hao_co_so_thanh: Mức tiêu hao cơ sở ở sơ giai.
    :param tu_chat_thanh: Dung tích nguyên hải (vd: 4.4 cho Bính đẳng 44%, 8.5 cho Giáp đẳng).
    :param tieu_canh_gioi: Tiểu cảnh giới hiện tại.
    :return: int - Số lần kích hoạt tối đa.
    """
    tieu_hao = tinh_tieu_hao_thuc_te(tieu_hao_co_so_thanh, tieu_canh_gioi)
    if tieu_hao <= 0:
        return float('inf')  # Cổ thụ động không tốn chân nguyên
    return int(tu_chat_thanh // tieu_hao)

def kiem_tra_thoi_dong_3c(tu_chat_thanh, tieu_canh_gioi="đỉnh phong"):
    """
    Kiểm tra điều kiện Cổ sư Nhị chuyển thôi động Cổ trùng Tam chuyển (3c).
    Quy tắc: Cần đúng 7.0 thành Ám hồng chân nguyên (= 560 thành xanh biếc).
    Bức tường tư chất: Đinh đẳng (2-3 thành) & Bính đẳng (4-5 thành) vĩnh viễn không đủ dung lượng!
    :param tu_chat_thanh: Dung tích nguyên hải (vd: 4.4 thành, 8.5 thành).
    :param tieu_canh_gioi: Tiểu cảnh giới hiện tại.
    :return: dict
    """
    tcg = tieu_canh_gioi.lower().strip()
    if tcg != "đỉnh phong":
        return {
            "co_the_thoi_dong": False,
            "ly_do": f"Chưa đạt chân nguyên Ám hồng (Hiện tại là {tcg}). Bắt buộc phải có chân nguyên Nhị chuyển đỉnh phong."
        }
    
    if tu_chat_thanh < 7.0:
        return {
            "co_the_thoi_dong": False,
            "ly_do": f"Không đủ tư chất ({tu_chat_thanh:.1f} thành < 7.0 thành chuẩn). Đinh đẳng và Bính đẳng bị chặn bởi giới hạn trần tư chất, vĩnh viễn không thể thôi động Cổ 3 chuyển!"
        }
    
    so_du = tu_chat_thanh - 7.0
    return {
        "co_the_thoi_dong": True,
        "tieu_hao_am_hong": 7.0,
        "quy_doi_xanh_biec": quy_doi_ve_xanh_biec(7.0, "ám hồng"),
        "loai_chan_nguyen": "Ám hồng chân nguyên",
        "so_du_con_lai": round(so_du, 2),
        "mo_ta": f"Thôi động thành công Cổ 3 chuyển! Tiêu hao 7.0 thành Ám hồng (tương đương 560 thành xanh biếc). Không khiếu còn dư: {so_du:.1f} thành."
    }
