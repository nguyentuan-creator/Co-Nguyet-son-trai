# Ghi chú Hiệu đính Nguyên tác (Đối chiếu trực tiếp `quyen1.md`)

Tài liệu này ghi nhận toàn bộ các sai lệch giữa các file tóm tắt cũ (`ban_do_2d_thanh_mao_son.md`, `ban_do_thanh_mao_son.md`, `suKien1Nam.md`) với văn bản nguyên tác **`quyen1.md`** (dòng 1 → 13146 cho Năm 1), đã được hiệu đính trực tiếp vào bộ dữ liệu chuẩn `database/*.json`.

---

## I. Các sai lệch về Bản đồ & Địa lý đã hiệu đính
1. **Vị trí Cổ Thất Học Đường (`quyen1.md` dòng 1099):**
   - *Tài liệu cũ:* Ghi Cổ Thất nằm ngầm bên dưới Gia Tộc Từ Đường cạnh Linh Tuyền (`Z = 0`).
   - *Nguyên tác:* `"Học đường bên cạnh thiết lập một cái cổ thất. Cổ thất cũng không lớn, chỉ có sáu mươi bình phương mét."`
   - *Đã sửa trong `locations.json`:* Đặt `loc_co_that` ở tầng `Z = 1`, nối trực tiếp cạnh `loc_hoc_duong` (`travelMinutes: 2`), còn `loc_linh_tuyen` (`Z = 0`) nằm riêng ngầm dưới Từ Đường.
2. **Bãi sông đá cuội & Lối vào Động Hoa Tửu (`quyen1.md` dòng 2100–2122):**
   - *Nguyên tác:* Đi men theo sơn khê phía sau rừng Thanh Mâu Trúc tới một **bãi sông đá cuội nông** (thường khô cạn, chỉ tích nước nông sau trận mưa to 3 ngày 3 đêm), cuối bãi có **rèm thác mini** (nhánh nhỏ của Đại Thác Nước Hậu Sơn) đổ xuống tảng cự thạch che khe hở Động Hoa Tửu Tầng 1.
   - *Đã sửa trong `locations.json`:* Tách rõ tuyến `loc_rung_truc_sau_trai` → `loc_bai_song_khe_hoa_tuu` (`Z = 1`) → `loc_dong_hoa_tuu_t1` (`Z = -1`) → `loc_dong_hoa_tuu_t2` (`Z = -1`).
3. **Khu phố nội trại & Thôn phàm nhân chân núi (`quyen1.md` dòng 1653, 1750, 9593–9625):**
   - *Nguyên tác:* Nội trại có **3 tửu quán** và **1 khách sạn lớn** do cữu phụ Phương Nguyên quản lý; xuống chân núi khoảng **30 phút đi bộ** qua Sơn Đạo & Ruộng Bậc Thang là **các thôn trang phàm nhân** nương theo con sông nhỏ và khu rừng săn lợn rừng.
   - *Đã sửa trong `locations.json`:* Tách `loc_son_dao_ruong_bac_thang` (15 phút từ Đông Môn) → `loc_thon_pham_nhan` (15 phút nữa = đúng 30 phút từ trại) → `loc_rung_san_heo_rung`.
4. **Tách bạch bối cảnh Năm 1 khỏi các sự kiện Năm 2–3:**
   - Lang Triều, Hội Minh Pha, Thôn Giang Thiềm, Tầng 3–4 Động Hoa Tửu (Cứ Xỉ Kim Ngô, Huyết Hồ Cổ Nguyệt Sơ Đại) là biến cố của Năm 2–3, không nhồi vào sự kiện Năm 1 dù giữ các địa danh lớn (Bạch Gia Trại, Hùng Gia Trại, Đại Thác Nước, Đỉnh Thanh Mao Sơn) trên bản đồ 5 tầng `Z = -1..3`.

---

## II. Các sai lệch về Biên niên Sự kiện Năm 1 đã hiệu đính
1. **Phần thưởng Hạng Nhất Luyện Hóa Bản Mệnh Cổ (`quyen1.md` dòng 1181, 3041, 3403):**
   - *`suKien1Nam.md` cũ:* Ghi thưởng 15 nguyên thạch + chức Ban Trưởng.
   - *Nguyên tác:* Thưởng chính xác **20 khối nguyên thạch** và **không có chức Ban Trưởng** ở kỳ này. Chức **Ban Đầu (10 NT/tuần)** & **Phó Ban Đầu (5 NT/tuần)** chỉ được công bố sau buổi bắn bia Thảo Nhân (`L3808`) gắn với cuộc đua đột phá **Nhất chuyển trung giai** (thưởng **30 nguyên thạch + quyền ưu tiên chọn cổ thứ 2**).
2. **Tách rõ Kiểm tra Bắn Bia Thảo Nhân vs Niên Trung Khảo Hạch (`quyen1.md` dòng 3294, 10600–10676, 12112):**
   - *`suKien1Nam.md` cũ:* Gộp nhầm bắn bia Thảo Nhân vào Mùa Hạ là "Khảo hạch giữa kỳ".
   - *Nguyên tác:* Bắn bia Thảo Nhân diễn ra sớm ngay **Mùa Xuân** (3 ngày sau khi luyện hóa Bản Mệnh Cổ). **Niên Trung Khảo Hạch** thực sự diễn ra vào **cuối tháng 6 (Mùa Hạ)** với nội dung **săn lợn rừng nộp Răng Nanh Lợn Rừng** đổi điểm & nguyên thạch.
3. **Sửa hoàn toàn bối cảnh Ma đạo Cổ sư Vương Đại (`quyen1.md` dòng 7470, 7972, 9717–11650, 11975):**
   - *`suKien1Nam.md` cũ:* Nhầm Vương Đại là người hầu bị đuổi khỏi trại, phục kích nhầm Phương Chính vào Mùa Đông.
   - *Nguyên tác:* Có 2 nhân vật cùng tên Vương Đại — thị vệ học đường Vương Đại (bị Phương Nguyên đánh phế cùng Ngô Nhị) và **Ma đạo Nhị chuyển Vương Đại (con trai cả của lão thợ săn Vương Lão Hán, anh trai Vương Nhị)** mất tích 3 năm trước, sở hữu **U Ảnh Tùy Hành Cổ + Ái Sinh Ly**, quay về báo thù **Phương Nguyên** vào **cuối Mùa Hạ / đầu Mùa Thu** (không phải Mùa Đông và không phải nhầm Phương Chính).
4. **Mốc thời gian Thương đội Cổ Phú & Ngọc Bì Cổ Tầng 2 (`quyen1.md` dòng 5491, 5515, 11705–11848):**
   - Thương đội Cổ Phú đến vào **tháng 5** (giao mùa Xuân – Hạ, muộn hơn mọi năm 1 tháng).
   - Mùa Thu sau khi đạt **1 trư lực** từ Bạch Thỉ Cổ, Phương Nguyên đẩy được cửa đá ở Động Hoa Tửu Tầng 2, lấy **Ngọc Bì Cổ** hoang dã và phát hiện đàn **Ngọc Nhãn Thạch Hầu**.
5. **Phần thưởng Quán quân Niên Mạt Khảo Hạch (`quyen1.md` dòng 13063):**
   - *`suKien1Nam.md` cũ (dòng 137):* Ghi 150 khối nguyên thạch (tự mâu thuẫn với chính trích lục ở dòng 324!).
   - *Nguyên tác:* Chính xác là **100 khối nguyên thạch** + quyền ưu tiên chọn cổ trùng + đặc cách chọn tiểu tổ.
6. **Khẩu phần ăn Nguyệt Quang Cổ (`quyen1.md` dòng 3397):**
   - 1 khối nguyên thạch mua được **10 cánh hoa Nguyệt Lan**, Nguyệt Quang Cổ tiêu hao **4 cánh/ngày** (đã cập nhật chuẩn vào `items.json` và `gu.json`).
