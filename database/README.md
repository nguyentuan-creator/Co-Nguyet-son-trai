# CƠ SỞ DỮ LIỆU CỔ TRÙNG RANK 1 & RANK 2 (HỆ THỐNG ROLEPLAY ENGINE)

> **Căn cứ nguồn chuẩn xác 100%:** `thiet_ke_co_trung_rank1_rank2.md`, `quyen1.md` (33.661 dòng) và chỉ mục tra cứu `tachQ1.md`.  
> **Nguyên tắc biên soạn:**  
> 1. Tuyệt đối giữ nguyên vẹn 100% nguyên tác, **không suy diễn bất kỳ thông tin nào chưa có**.  
> 2. Các Cổ chỉ xuất hiện trong 1 chiêu thức/phân cảnh được trích dẫn câu văn gốc kèm ghi chú rõ: `(không chắc)`.  
> 3. Trường dữ liệu nào tác giả không đề cập đều được gắn nhãn minh bạch: `Thiếu thông tin (văn bản không đề cập)`.  
> 4. Đúng chuẩn **12 thuộc tính cốt lõi** theo yêu cầu người dùng (đã loại bỏ mục cổ phương & tỷ lệ hợp thành).

---

## 1. TỔNG QUAN CƠ SỞ DỮ LIỆU

* **Tổng số lượng Cổ trùng:** **98** Cổ trùng phàm giai.
  * **Nhất Chuyển (Rank 1):** **51** Cổ trùng (Sử dụng Thanh Đồng chân nguyên - Xanh biếc).
  * **Nhị Chuyển (Rank 2):** **47** Cổ trùng (Sử dụng Xích Thiết chân nguyên - Thiển hồng).
* **Định dạng tệp tin:**
  1. `gu_database.json`: File dữ liệu JSON chuẩn UTF-8 phục vụ Engine trò chơi và logic lập trình.
  2. `co_trung.db`: Cơ sở dữ liệu SQLite đã lập chỉ mục (Indexes) trên `pham_cap` và `do_quy_hiem`.
  3. `co_trung.sql`: Kịch bản lệnh DDL/DML khởi tạo bảng và 98 câu lệnh INSERT.

---

## 2. BẢNG ĐẶC TẢ 12 THUỘC TÍNH CHUẨN HÓA (SCHEMA)

| STT | Tên thuộc tính | Khóa JSON / Cột SQL | Mô tả chi tiết |
| :---: | :--- | :--- | :--- |
| 1 | **Tên gọi** | `ten_goi` | Tên Cổ trùng kèm chữ Hán nguyên tác và dòng trích dẫn gốc trong `quyen1.md`. |
| 2 | **Phẩm cấp** | `pham_cap` | Nhất Chuyển (Rank 1) hoặc Nhị Chuyển (Rank 2). |
| 3 | **Độ quý hiếm** | `do_quy_hiem` | Bậc quý hiếm thực tế (Mạt phẩm, Phổ thông, Thượng phẩm, Cực phẩm, Trấn tộc...). |
| 4 | **Hình thái** | `hinh_thai` | Hình thái sinh vật/thảo mộc/khoáng thạch tự nhiên của Cổ trùng trích nguyên văn hoặc suy luận. |
| 5 | **Thay đổi ngoại hình khi ký túc** | `thay_doi_ngoai_hinh_ky_tuc` | Biến đổi ngoại hình trên cơ thể Cổ sư khi ký sinh/kích hoạt (hoặc ghi rõ ký sinh trong không khiếu). |
| 6 | **Công năng cụ thể** | `cong_nang_cu_the` | Toàn bộ cơ chế vận hành, tầm tác chiến, uy lực đòn đánh (kèm trích đoạn nguyên tác). |
| 7 | **Cách tiêu hao chân nguyên** | `cach_tieu_hao_chan_nguyen` | Đơn vị chuẩn: **Xanh biếc** (Rank 1) hoặc **Thiển hồng** (Rank 2), mức tiêu hao cơ sở. |
| 8 | **Tác dụng phụ / Tệ đoan** | `tac_dung_phu_te_doan` | Điểm yếu chí mạng, giới hạn cơ thể, phản lực, nguy cơ phản phệ. |
| 9 | **Loại thức ăn** | `loai_thuc_an` | Thức ăn duy trì (hoa nguyệt lan, thịt tươi, bột quặng, rượu ngon, sương mai...). |
| 10 | **Khẩu phần & Tần suất ăn** | `khau_phan_va_tan_suat_an` | Lượng thức ăn mỗi bữa và chu kỳ cho ăn định kỳ. |
| 11 | **Giá thị trường** | `gia_thi_truong` | Giá quy đổi ra Nguyên thạch hoặc điểm Chiến công. |
| 12 | **Mô tả triết lý** | `mo_ta_triet_ly` | Đại đạo chi mật mã, triết lý nhân sinh và thế giới quan gửi gắm qua Cổ trùng. |

---

## 3. DANH MỤC TRA CỨU NHANH CỔ TRÙNG

### Nhất Chuyển (Rank 1 - 51 Cổ trùng)
- **`GU_R1_01` Nguyệt Quang Cổ (月光蛊) `[Dòng 1080, 1464, 1470, 3170]`**: Trấn tộc / Gia truyền độc quyền | Ăn 2 cánh hoa Nguyệt Lan Thảo mỗi bữa, cứ 10 ngày cho ăn 1 lần (hoa tươi hái từ vườn nguyệt lan của sơn trại) `[Dòng 1474, 1516]`. Chi phí nuôi rất rẻ. | Giá thị trường 100 – 150 nguyên thạch. Học đường gia tộc phát miễn phí 1 con cho mỗi học viên khai khiếu.
- **`GU_R1_02` Tiểu Quang Cổ (小光蛊) `[Dòng 9204, 9206, 9267, 10308, 14924]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | 20 – 30 nguyên thạch.
- **`GU_R1_03` Loang Loáng Cổ / Thiểm Quang Cổ (闪光蛊) `[Dòng 11229, 11237]`**: Phổ thông / Tiêu hao phẩm | Cổ tiêu hao dùng một lần nổ tung, không cần nuôi dưỡng `[Dòng 11237]`. | 20 – 40 nguyên thạch.
- **`GU_R1_04` Nhất Khí Kim Quang Cổ / Trùng (一气金光虫) `[Dòng 6641]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Bán tại chợ phiên thương đội Cổ Phú.

---
- **`GU_R1_05` Thủy Quang Cổ (水光蛊) `[Dòng 25697, 25699]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Khảm trên bốn vách đá mật thất của gia tộc Cổ Nguyệt để chiếu sáng khi Phương Nguyên vào tra cứu chiến công.

---
- **`GU_R1_06` Bạch Thỉ Cổ (白豕蛊) `[Dòng 9170, 9186, 9464, 9470]`**: Cực phẩm | Thịt tươi sống của heo rừng (Phương Nguyên săn heo rừng dưới chân núi lấy thịt nuôi cổ) `[Dòng 9534]`. | 600 nguyên thạch trên thị trường tự do, xuất hiện là bị mua ngay lập tức, giữ giá 100% (luyện xong sức mạnh có thể bán lại thu hồi vốn) `[Dòng 9186, 9194]`.
- **`GU_R1_07` Hắc Thỉ Cổ (黑豕蛊) `[Dòng 6264, 6266, 9170, 9186, 9468]`**: Cực phẩm | Thịt tươi sống của lợn đen `[Dòng 9534]`. | 600 nguyên thạch `[Dòng 9186]`. Cổ Kim Sinh từng dùng Thối Thí Phì Trùng giả mạo Hắc Thỉ Cổ để lừa đảo tại chợ phiên.
- **`GU_R1_08` Hoa Thỉ Cổ (花豕蛊) `[Dòng 9170, 9176, 9180, 12367]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | 80 – 100 nguyên thạch.
- **`GU_R1_09` Phấn Thỉ Cổ (粉豕蛊) `[Dòng 9170, 9172, 11414]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Rẻ nhất trong họ Thỉ Cổ, khoảng 50 nguyên thạch.
- **`GU_R1_10` Cậy Mạnh Thiên Ngưu Cổ (恃强天牛蛊) `[Dòng 5591, 9126, 9130, 9144, 9152]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Bán tại chợ phiên thương đội `[Dòng 5591]`.
- **`GU_R1_11` Hoàng Lạc Thiên Ngưu Cổ (黄烙天牛蛊) `[Dòng 9148, 9152, 9154, 12351]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Giá thị trường ngang ngửa Nguyệt Quang Cổ (100 - 150 nguyên thạch), chỉ xếp sau Ngọc Bì Cổ và Tửu Trùng `[Dòng 9154]`.

---
- **`GU_R1_12` Ngọc Bì Cổ (玉皮蛊) `[Dòng 9112, 9116, 9120, 9301, 11772]`**: Cực phẩm | Ngọc vụn (quặng ngọc thạch) `[Dòng 9118]`. | 150 – 200 nguyên thạch, rất hiếm ở hàng ngũ Nhất chuyển `[Dòng 9120]`.
- **`GU_R1_13` Đồng Bì Cổ (铜皮蛊) `[Dòng 3568, 3570, 9098, 9112]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | 80 – 100 nguyên thạch.
- **`GU_R1_14` Thiết Bì Cổ / Sắt Lá Cổ (铁皮蛊) `[Dòng 9104, 9106, 9112]`**: Phổ thông / Tiêu chuẩn | Bột quặng sắt `[Dòng 9106]`. | Phổ biến trên kệ Cổ thất.
- **`GU_R1_15` Thạch Bì Cổ (石皮蛊) `[Dòng 9100, 9102, 9112, 11283]`**: Phổ thông / Tiêu chuẩn | Bột quặng đá / Vụn đá cuội (thức ăn rẻ tiền bậc nhất) `[Dòng 9104]`. | 30 – 50 nguyên thạch.
- **`GU_R1_16` Da Thú Cổ (兽皮蛊) `[Dòng 9114, 9116, 11414]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Rẻ tiền, xếp sau Thiết Bì Cổ `[Dòng 9114]`.
- **`GU_R1_17` Kim Chung Cổ (金钟蛊) `[Dòng 6234]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Rất đắt, Cổ sư phàn nàn trả giá nửa ngày không được bớt `[Dòng 6234]`.
- **`GU_R1_18` Ngư Lân Cổ (鱼鳞蛊) `[Dòng 19587, 19591, 19633]`**: Phổ thông / Tiêu chuẩn | Vảy cá tươi `[Dòng 19607]`. | 300 – 400 nguyên thạch trong thời chiến Lang Triều `[Dòng 19587]`.
- **`GU_R1_19` Thủy Chu Cổ (水蛛蛊 - Nhất chuyển) `[Dòng 6641, 6645]`**: Phổ thông / Tiêu chuẩn | Nước mưa / Nước sạch `[Dòng 6645]`. | Phổ biến trong đoàn thương buôn.

---
- **`GU_R1_20` Sinh Tức Thảo (生息草) `[Dòng 11204, 12381, 15688]`**: Phổ thông / Tiêu chuẩn | Đất ẩm và giọt sương mai `[Dòng 12381]`. | Được gia tộc bảo hộ, giá trị trao đổi cao.
- **`GU_R1_21` Sinh Cơ Diệp (生机叶) `[Dòng 15690, 15692, 16286, 17112]`**: Phổ thông / Tiêu hao phẩm | Không cần cho ăn (tách từ Cửu Diệp Sinh Cơ Thảo ra cất dùng dần) `[Dòng 15700]`. | 50 nguyên thạch/chiếc cố định; thời kỳ Lang Triều sốt giá lên tới 60 – 70 nguyên thạch `[Dòng 15692, 21112]`.

---
- **`GU_R1_22` Tửu Trùng (酒虫) `[Dòng 1066, 1147, 2022, 3369, 16115]`**: Cực phẩm / Quý hiếm hy thế | Rượu quý hảo hạng (Hầu Nhi Tửu, Thanh Trúc Tửu...). Thả ngâm trong vò rượu định kỳ cho uống no say `[Dòng 2471, 3397]`. | 500 – 580 nguyên thạch tại chợ đen `[Dòng 6212]`.
- **`GU_R1_23` Thanh Đồng Xá Lợi Cổ (青铜舍利蛊) `[Dòng 17207]`**: Quý hiếm / Cực phẩm đấu giá | Tiêu hao phẩm, không cần nuôi `[Dòng 17207]`. | 500 nguyên thạch.

---
- **`GU_R1_24` Ẩn Thạch Cổ (隐石蛊) `[Dòng 18155, 18197, 18211, 19265]`**: Quý hiếm | Vụn đá hoa cương `[Dòng 18211]`. | Cổ ẩn hình quý hiếm của dã thú.
- **`GU_R1_25` Long Hoàn Khúc Khúc Cổ (龙丸曲曲蛊) `[Dòng 9232, 12484, 14087]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | 80 – 100 nguyên thạch.
- **`GU_R1_26` Thư Trùng (书虫) `[Dòng 7166, 10541, 10545]`**: Phổ thông / Tiêu chuẩn | Da thú bản đồ, sách vở, văn tự mực in [Dòng 10541, 10543] | Giá trị tương đương Tửu Trùng và Bạch Thỉ Cổ (khoảng 500 – 600 nguyên thạch), luôn trong trạng thái cháy hàng tại chợ phiên [Dòng 10545]
- **`GU_R1_27` Khóa Khí Cổ (锁气蛊) `[Dòng 10310]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Cổ phụ trợ đi săn dã ngoại do Phương Nguyên phân tích cấu hình tác chiến.

---
- **`GU_R1_28` Tiễu Bước Cổ (悄步蛊) `[Dòng 10310]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Cổ phụ trợ di chuyển nhẹ nhàng, bổ khuyết khuyết điểm khi đi săn dã ngoại.

---
- **`GU_R1_29` Khê Lưu Cổ (溪流蛊) `[Dòng 3170, 19605, 25861]`**: Trấn tộc / Gia truyền độc quyền | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Độc quyền Bạch gia.
- **`GU_R1_30` Thảo Nhân Cổ (草人蛊) `[Dòng 3262, 3347]`**: Phổ thông / Tiêu chuẩn | Nước bùn và cỏ tươi `[Dòng 3262]`. | Dùng trong dịch vụ trường bắn học đường.
- **`GU_R1_31` Thiết Đằng Cổ (铁藤蛊) `[Dòng 23997, 24387]`**: Phổ thông / Tiêu chuẩn | Mạt sắt và nước `[Dòng 24387]`. | Chiến lược phòng thủ.
- **`GU_R1_32` Độc Hoa Cổ (毒花蛊) `[Dòng 23997, 24387]`**: Phổ thông / Tiêu chuẩn | Độc dịch và bùn đất `[Dòng 24389]`. | Vật tư quân sự.
- **`GU_R1_33` Dầu Hỏa Cổ (油火蛊) `[Dòng 24941, 24943]`**: Phổ thông / Tiêu hao phẩm | Tiêu hao phẩm, không cần nuôi `[Dòng 24943]`. | 20 – 30 nguyên thạch.
- **`GU_R1_34` Đơn Khiếu Hỏa Than Cổ / Hỏa Than Cổ (单窍火炭蛊 / 火炭蛊) `[Dòng 24933, 24937]`**: Phổ thông / Tiêu chuẩn | Than củi `[Dòng 24933]`. | 30 – 50 nguyên thạch (Cổ Viêm đạo phàm giai học viện/kho chiến công).
- **`GU_R1_35` Gió Xoáy Cổ (旋风蛊) `[Dòng 16326, 16997]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | 80 – 100 nguyên thạch.
- **`GU_R1_36` Cuồng Phong Cổ (狂风蛊) `[Dòng 27723, 27731]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | 80 – 120 nguyên thạch.
- **`GU_R1_37` Toàn Chủng Cổ (旋种蛊) `[Dòng 27723, 27731]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Phổ biến trong chiến đấu.
- **`GU_R1_38` Ngân Thạch Cổ (银石蛊) `[Dòng 16324, 16997, 25711]`**: Phổ thông / Tiêu chuẩn | Quặng bạc vụn `[Dòng 25711]`. | 100 – 120 nguyên thạch.
- **`GU_R1_39` Thanh Ti Cổ (青丝蛊) `[Dòng 6627, 6633, 9468]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | 30 – 40 nguyên thạch.
- **`GU_R1_40` Hồng Châm Hạt (红针蝎) `[Dòng 11204]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Độc cổ hoang dã.
- **`GU_R1_41` Quả Phụ Chu (寡妇蛛) `[Dòng 11204]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Độc cổ hoang dã.

---
- **`GU_R1_42` Du Tự Cổ (游字蛊) `[Dòng 20307, 20319]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Do thương hội Cổ gia mang đến bán hoặc hỗ trợ trang bị cho Bảng chiến công ba trại Thanh Mao sơn trong đợt thú triều.

---
- **`GU_R1_43` Túi Cơm Thảo Cổ (饭袋草蛊) `[Dòng 2172, 2174, 9009]`**: Phổ thông / Tiêu chuẩn | Là thảo cổ tự nhiên, chỉ cần tưới chân nguyên để duy trì và kết quả [Dòng 2176] | Tiết kiệm chi phí ăn uống.
- **`GU_R1_44` Túi Rượu Hoa Cổ (酒袋花蛊) `[Dòng 2172, 2174, 2358, 9009]`**: Phổ thông / Tiêu chuẩn | Là thảo cổ tự nhiên, chỉ cần tưới chân nguyên để duy trì và tiết mật [Dòng 2176] | Tiện ích đời sống.
- **`GU_R1_45` Ôn Ti Chu (温丝蛛) `[Dòng 12281]`**: Phổ thông / Tiêu chuẩn | Lá dâu tằm `[Dòng 12281]`. | 40 – 50 nguyên thạch.
- **`GU_R1_46` Thủy Tinh Biêu Cổ (水晶瓢虫) `[Dòng 6186]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Dụng cụ bảo quản cao cấp.
- **`GU_R1_47` Thiên Chân Cái Nấm (天真蘑菇) `[Dòng 6170]`**: Phổ thông / Tiêu chuẩn | Bụi bặm và trọc khí `[Dòng 6170]`. | Cổ đời sống thương đội.
- **`GU_R1_48` Tri Tâm Thảo (知心草) `[Dòng 5593, 5599, 5601]`**: Phổ thông / Tiêu chuẩn | Thảo mộc tự nhiên. | 2 nguyên thạch / 1 cân tại chợ phiên thương đội (rẻ hơn nhiều so với mua hoa nguyệt lan 10 cánh / 1 NT) [Dòng 5603]
- **`GU_R1_49` Thối Thí Phì Trùng (臭屁肥虫) `[Dòng 6264, 8248, 13338]`**: Mạt phẩm | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Cổ mạt phẩm rẻ tiền, giá trị thực tế dưới 10 nguyên thạch (Cổ Kim Sinh dùng để lừa đảo bán giá 250 NT) [Dòng 6264, 6274]
- **`GU_R1_50` Đâu Lung Thảo (兜笼草) `[Dòng 26489]`**: Phổ thông / Tiêu chuẩn | Hấp thu dưỡng chất vi lượng từ không khiếu cổ sư. | Lưu giữ trong kho vật phẩm hậu cần gia tộc Cổ Nguyệt.

---
- **`GU_R1_51` Tín Hiệu Cổ (信号蛊) `[Dòng 21433, 21435, 21793]`**: Phổ thông / Tiêu hao phẩm | Cổ tiêu hao một lần, không yêu cầu nuôi dưỡng lâu dài. | Cổ sư các gia tộc (như Hùng Lâm, trinh sát cổ sư) trang bị rộng rãi để phối hợp tác chiến trong lang triều.

---

### Nhị Chuyển (Rank 2 - 47 Cổ trùng)
- **`GU_R2_01` Nguyệt Mang Cổ (月芒蛊) `[Dòng 14924, 14926, 16312, 16477]`**: Phổ thông / Tiêu chuẩn | Cánh hoa Nguyệt Lan Thảo (khẩu phần nhiều hơn Nguyệt Quang Cổ) `[Dòng 16318]`. | 700 – 800 nguyên thạch (vũ khí tiêu chuẩn của Cổ sư Nhị chuyển Cổ Nguyệt).
- **`GU_R2_02` Nguyệt Toàn Cổ (月旋蛊) `[Dòng 15978, 16326, 22903, 25727]`**: Phổ thông / Tiêu chuẩn | Cánh hoa Nguyệt Lan Thảo và gió xoáy `[Dòng 25727]`. | 600 – 700 nguyên thạch.
- **`GU_R2_03` Nguyệt Ngân Cổ (月痕蛊 / 月银蛊) `[Dòng 16324, 25707, 25711]`**: Phổ thông / Tiêu chuẩn | Quặng bạc vụn và cánh hoa Nguyệt Lan `[Dòng 25711]`. | 800 nguyên thạch.
- **`GU_R2_04` Nguyệt Nghê Thường (月霓裳) `[Dòng 14956, 15930, 15938, 16328]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Cổ hiếm nhánh phòng ngự Quang đạo.
- **`GU_R2_05` Chiếu Ảnh Cổ (照影蛊) `[Dòng 25669, 25673, 25687]`**: Phổ thông / Tiêu chuẩn | Hút ánh sáng `[Dòng 25673]`. | Cổ văn khố gia tộc.

---
- **`GU_R2_06` Bạch Ngọc Cổ (白玉蛊) `[Dòng 9470, 11772, 14924, 15264, 15312]`**: Cực phẩm phòng ngự Nhị chuyển | Bạch ngọc vụn (Ngọc trắng hảo hạng) `[Dòng 15268]`. | 1.000 – 1.500 nguyên thạch.
- **`GU_R2_07` Bàn Thạch Cổ (磐石蛊) `[Dòng 16634, 16764, 21459, 21463]`**: Phổ thông / Tiêu chuẩn | Đá hoa cương / Quặng đá cứng `[Dòng 21465]`. | Đổi được 3.900 chiến công trên bảng chiến công `[Dòng 21463]`.
- **`GU_R2_08` Hắc Tông Cổ (黑鬃蛊) `[Dòng 6635, 6637, 9468]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | 400 – 500 nguyên thạch.
- **`GU_R2_09` Sinh Thiết Cổ (生铁蛊) `[Dòng 29533, 29535, 29561]`**: Phổ thông / Tiêu chuẩn | Quặng sắt `[Dòng 29571]`. | Vật phẩm Kim đạo.

---
- **`GU_R2_10` Hùng Lực Cổ (熊力蛊) `[Dòng 3170, 9659, 19523, 25861]`**: Trấn tộc / Gia truyền độc quyền | Mật ong rừng tươi nguyên chất (Hùng gia trại thu mua lượng mật ong khổng lồ để nuôi cổ này) `[Dòng 9659]`. | 600 – 800 nguyên thạch (hàng trấn tộc).
- **`GU_R2_11` Ngự Hùng Cổ (驭熊蛊) `[Dòng 23907, 23911, 24033, 24919]`**: Phổ thông / Tiêu chuẩn | Thịt tươi hoặc mật gấu `[Dòng 24033]`. | 600 – 700 nguyên thạch.

---
- **`GU_R2_12` Gấu Ngựa Bản Lực Cổ / Hắc Hùng Bản Lực Cổ (黑熊本力蛊) `[Dòng 19303, 23131, 23139]`**: Phổ thông / Tiêu chuẩn | Mật ong dại nguyên chất `[Dòng 9659]`. | Hùng Lực (đệ nhất dũng sĩ Nhị chuyển Hùng gia trại) sở hữu; Phương Nguyên từng định thu hồi từ thi thể Hùng Lực nhưng bị Hùng Lâm mang đi.

---
- **`GU_R2_13` Cửu Diệp Sinh Cơ Thảo (九叶生机草) `[Dòng 15686, 15700, 16258, 16284]`**: Quý hiếm / Trân bảo Mộc đạo vô giá | Hút chân nguyên của Cổ sư trực tiếp trong không khiếu, không cần thức ăn ngoài `[Dòng 15702]`. | Vô giá. Giúp Phương Nguyên thu về hàng ngàn nguyên thạch và chiến công trong Lang Triều.
- **`GU_R2_14` Tứ Vị Tửu Trùng (四味酒虫) `[Dòng 16115, 16479, 18854, 19201]`**: Cực phẩm / Quý hiếm hy thế Nhị chuyển | Uống luân phiên rượu mang 4 vị khác nhau: Cay (Tân), Ngọt (Điềm), Chua (Toan), Đắng (Khổ) `[Dòng 19201]`. | 1.500 – 2.000 nguyên thạch.
- **`GU_R2_15` Xích Thiết Xá Lợi Cổ (赤铁舍利蛊) `[Dòng 17207, 17351, 17500, 18854]`**: Quý hiếm / Cực phẩm đấu giá | Tiêu hao phẩm, không cần nuôi `[Dòng 17207]`. | 3.000 nguyên thạch, thời chiến bị đẩy lên 5.000 – 8.000 nguyên thạch `[Dòng 17209]`.

---
- **`GU_R2_16` Bạch Trùng Kiển (白虫茧) `[Dòng 16071, 16073, 16091]`**: Phổ thông / Tiêu chuẩn | Tiêu tốn thực lương nuôi nấng liên tục trong thời gian hóa kén (rượu hoặc tinh chất). | Xuất hiện trong bí phương truyền thừa của Hoa Tửu Hành Giả để lại cho Phương Nguyên.

---
- **`GU_R2_17` Vãng Sinh Thảo Cổ (往生草蛊) `[Dòng 29533, 29535]`**: Phổ thông / Tiêu chuẩn | Thảo mộc sinh cơ và đất đai màu mỡ. | Bảo vật gia truyền bảo lưu trong bí kho Mạc mạch của Cổ Nguyệt Mạc Trần; Phương Nguyên dùng bí mật giết Cổ Kim Sinh để tống tiền ép Mạc Trần giao nộp cùng Sinh Thiết Cổ.

---
- **`GU_R2_18` Ẩn Lân Cổ (隐鳞蛊) `[Dòng 19265, 19591, 20261, 20277]`**: Phổ thông / Tiêu chuẩn | Nước suối và vảy cá tươi `[Dòng 19593]`. | Tiêu tốn hàng trăm nguyên thạch để dung hợp `[Dòng 19265]`.
- **`GU_R2_19` Tam Bộ Phương Thảo (三步芳草蛊) `[Dòng 21333, 21335, 24119, 25177]`**: Phổ thông / Tiêu chuẩn | Đất ẩm và giọt sương mai `[Dòng 21337]`. | Đổi bằng chiến công diệt thú.
- **`GU_R2_20` U Ảnh Tùy Hành Cổ (幽影随行蛊) `[Dòng 11146, 11221, 11237]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Ma đạo cổ trùng.
- **`GU_R2_21` Du Cương Cổ (游僵蛊) `[Dòng 19891, 20176, 22165, 32361]`**: Phổ thông / Tiêu chuẩn | Máu tươi hoặc xác chết `[Dòng 20176]`. | Phổ biến trong ma đạo và thể tu.

---
- **`GU_R2_22` Băng Nhận Cổ (冰刃蛊) `[Dòng 22740, 23027, 23079, 27679]`**: Cực phẩm cận chiến Nhị chuyển (Độc quyền Bạch gia) | Nước đá tuyết tinh khiết `[Dòng 23079]`. | Cực phẩm cận chiến Nhị chuyển.
- **`GU_R2_23` Băng Trùy Cổ (冰锥蛊) `[Dòng 22839, 27711, 32019]`**: Phổ thông / Tiêu chuẩn | Khối băng đá `[Dòng 22839]`. | 400 – 500 nguyên thạch.
- **`GU_R2_24` Thủy Tráo Cổ (水罩蛊) `[Dòng 22081, 22091, 22879]`**: Phổ thông / Tiêu chuẩn | Nước suối ngọt tinh khiết. | Bạch Ngưng Băng và các Cổ sư tinh anh Bạch gia trại sử dụng phòng thân.

---
- **`GU_R2_25` Thủy Toản Cổ (水钻蛊) `[Dòng 19881, 19907]`**: Phổ thông / Tiêu chuẩn | Cát ngọc dưới đáy sông suối. | Cổ sư Bạch gia trại sử dụng trong các trận giáp lá cà tại lôi đài và chiến trường thú triều.

---
- **`GU_R2_26` Tịnh Thủy Cổ (净水蛊) `[Dòng 7160, 13735, 17305, 25573]`**: Phổ thông / Tiêu chuẩn | Nước suối tinh khiết hoặc giọt sương. | Cổ sư tinh anh Bạch gia trại sử dụng để vây bắt hoang dã cổ trùng bay ra từ xác Lôi Quan Đầu Lang.

---
- **`GU_R2_27` Thủy Lung Cổ (水笼蛊) `[Dòng 27905, 27907]`**: Phổ thông / Tiêu chuẩn | Nước suối tinh khiết hoặc giọt sương. | Cổ sư tinh anh Bạch gia trại sử dụng để vây bắt hoang dã cổ trùng bay ra từ xác Lôi Quan Đầu Lang.

---
- **`GU_R2_28` Thủy Đồn Cổ (水豚蛊) `[Dòng 19790]`**: Phổ thông / Tiêu chuẩn | Thủy thảo và cá nhỏ tươi sống. | Cổ bản mệnh / chiến đấu của Bạch Trọng Thủy - nữ cổ sư Nhị chuyển cao giai nổi danh Bạch gia trại.

---
- **`GU_R2_29` Ái Sinh Ly (爱生离) `[Dòng 11188, 11202, 11204]`**: Quý hiếm / Đệ nhất độc cổ Nhị chuyển | Độc vật `[Dòng 11204]`. | Độc cổ khét tiếng của ma đầu Vương Đại.
- **`GU_R2_30` Thanh Đằng Cổ (青藤蛊) `[Dòng 15966, 20154, 22772, 23069]`**: Phổ thông / Tiêu chuẩn | Nước và ánh sáng mặt trời `[Dòng 15966]`. | 400 – 500 nguyên thạch.
- **`GU_R2_31` Tùng Châm Cổ (松针蛊) `[Dòng 22875, 22903, 23179]`**: Phổ thông / Tiêu chuẩn | Nhựa cây thông `[Dòng 23179]`. | Cổ Mộc đạo viễn trình.
- **`GU_R2_32` Huyết Khí Cổ (血气蛊) `[Dòng 20176, 25781, 25815]`**: Phổ thông / Tiêu chuẩn | Máu tươi động vật `[Dòng 25815]`. | Cổ Huyết đạo phàm giai.
- **`GU_R2_33` Song Khiếu Hỏa Lô Cổ (双窍火炉蛊) `[Dòng 19501]`**: Phổ thông / Tiêu chuẩn | Than đỏ / Than đá `[Dòng 19501]`. | Cổ chuyên dụng luyện đạo.
- **`GU_R2_34` Tạc Lôi Cổ (炸雷蛊) `[Dòng 24529, 24573, 24611]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | 600 nguyên thạch.
- **`GU_R2_35` Lôi Khiếu Cổ (雷窍蛊) `[Dòng 24611, 24679]`**: Phổ thông / Tiêu chuẩn | Sấm sét / Tia điện `[Dòng 24679]`. | Nguy hiểm, dễ nổ không khiếu nếu không biết kiểm soát.

---
- **`GU_R2_36` Hủ Huyết Thảo Cổ (腐血草蛊) `[Dòng 14284, 14288, 14294]`**: Phổ thông / Tiêu chuẩn | Huyết nhục thối rữa của dã thú. | Nữ cổ sư Hoa Hân thuộc tiểu tổ của Giác Tam sử dụng khi thanh trừng lợn rừng vương.

---
- **`GU_R2_37` Xà Tín Cổ (蛇信蛊) `[Dòng 14135, 20283, 21467]`**: Phổ thông / Tiêu chuẩn | Lưỡi ếch tươi `[Dòng 14135]`. | Trinh sát phổ biến của trinh sát viên Nhị chuyển (Xích Thiệt dùng).
- **`GU_R2_38` Hùng Hào Cổ (熊嚎蛊) `[Dòng 19153, 20078, 20112]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Cổ âm đạo Nhị chuyển.
- **`GU_R2_39` Ảnh Thương Cổ (影伤蛊) `[Dòng 19931, 19933, 22155, 22251]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Ma đạo / Cổ chiến thuật kỳ dị.
- **`GU_R2_40` Cường Thủ Cổ (强取蛊) `[Dòng 21157, 21197, 21213]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Cực phẩm truy bắt đạo tặc.
- **`GU_R2_41` Phiên Nhiên Cổ (幡然蛊) `[Dòng 17581, 17583, 17593]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Cổ chuyên dụng che giấu bảo vật.
- **`GU_R2_42` Địa Tàng Hoa Cổ (地藏花蛊) `[Dòng 9359, 9363, 12102, 20454]`**: Phổ thông / Tiêu hao phẩm | Hút địa khí và chất dinh dưỡng của đất `[Dòng 9363]`. | Cổ trữ vật bí mật một lần.
- **`GU_R2_43` Lại Thổ Cáp Mô (癞土蛤蟆) `[Dòng 5615, 5692, 5986, 6000]`**: Phổ thông / Tiêu chuẩn | Bùn vàng (hoàng nê), mỗi bữa ăn 1 cân bùn vàng sạch `[Dòng 6000]`. | 500 nguyên thạch tại chợ phiên thương đội [Dòng 5986, 6000]
- **`GU_R2_44` Minh Lộ Điệp (鸣路蝶) `[Dòng 8276, 8278]`**: Phổ thông / Tiêu chuẩn | Phấn hoa thơm hoặc hương liệu đặc biệt. | Cổ Phú và hộ vệ Cổ gia sử dụng để lần theo dấu vết Hồn hương trên người Giang Nha và Phương Nguyên khi điều tra án mạng Cổ Kim Sinh.

---
- **`GU_R2_45` Thú Ngữ Cổ (兽语蛊) `[Dòng 20283]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Liệt kê trong danh sách cổ trùng trinh sát đặc thù có khả năng phá vỡ ngụy trang của Ẩn Lân Cổ.

---
- **`GU_R2_46` Thuận Phong Nhĩ Cổ (顺风耳蛊) `[Dòng 20283]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Cổ trinh sát thính giác dã ngoại cao cấp đối kháng ẩn nặc.

---
- **`GU_R2_47` Trực Giác Cổ (直觉蛊) `[Dòng 29101, 29467, 29643]`**: Phổ thông / Tiêu chuẩn | Thiếu thông tin (văn bản chưa đề cập loại thức ăn) | Cổ chuyên dụng điều tra phá án độc môn.

---


---

## 5. QUY LUẬT CHÂN NGUYÊN & TIÊU HAO THEO "THÀNH" (3 CHUYỂN TRỞ XUỐNG)

### 5.1. Khái Niệm "Thành" (成) & Ảnh Hưởng Sống Còn Của Tư Chất
Trong thế giới Cổ Chân Nhân, không khiếu của Cổ sư được tính theo dung tích tiêu chuẩn là **10 Thành (Thập Thành = 100% dung tích)**, trong đó 1 Thành = 10 Phân:
* **Tư chất Đinh đẳng (D-grade):** Nguyên hải chỉ đạt **2 – 3 thành** (20% – 29% dung tích khiếu).
* **Tư chất Bính đẳng (C-grade):** Nguyên hải đạt **4 – 5 thành** (40% – 49% dung tích khiếu, ví dụ Phương Nguyên: 4 thành 4 phân = 44%).
* **Tư chất Ất đẳng (B-grade):** Nguyên hải đạt **6 – 7 thành** (60% – 79% dung tích khiếu).
* **Tư chất Giáp đẳng (A-grade):** Nguyên hải đạt **8 – 9 thành** (80% – 99% dung tích khiếu, ví dụ Phương Chính: 8 thành 5 phân = 85%).

> [!IMPORTANT]
> **Ý nghĩa thực chiến:**  
> Khi Nguyệt Quang Cổ tiêu hao **1 thành chân nguyên sơ giai / phát bắn**:
> * Cổ sư **Đinh đẳng** (2 thành) chỉ bắn được đúng **2 phát** là cạn kiệt đáy khiếu.
> * Cổ sư **Bính đẳng** (4.4 thành) bắn được **4 phát**.
> * Cổ sư **Giáp đẳng** (8.5 thành) bắn được liên tiếp **8 phát**, tạo nên sự áp đảo vượt trội về hỏa lực trong thực chiến.

---

### 5.2. Bảng Phân Cấp Chân Nguyên (Tam Chuyển Trở Xuống)
Trong cùng một cảnh giới phẩm cấp, chân nguyên ở tiểu cảnh giới cao hơn có mật độ nén và độ dùng bền gấp đôi so với tiểu cảnh giới trước đó:
$$\text{1 thành Đỉnh Phong} = \text{2 thành Cao Giai} = \text{4 thành Trung Giai} = \text{8 thành Sơ Giai}$$

| Phẩm cấp | Tiểu cảnh giới | Tên gọi Chân Nguyên | Màu sắc nguyên tác | Hệ số dùng bền | Mức tiêu hao tương đương (so với 1 thành Sơ giai) |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Nhất Chuyển**<br>*(Thanh Đồng)* | **Sơ giai** | Xanh biếc chân nguyên | Thúy lục / Đạm lục | $1\times$ | **1.0 thành** (10 phân) |
| | **Trung giai** | Thương lục chân nguyên | Xanh rêu / Xanh cỏ | $2\times$ | **0.5 thành** (5 phân) |
| | **Cao giai** | Thâm lục chân nguyên | Xanh đậm | $4\times$ | **0.25 thành** (2.5 phân) |
| | **Đỉnh phong** | Xanh thẫm / Mặc lục | Xanh mực tối | $8\times$ | **0.125 thành** (1.25 phân) |
| **Nhị Chuyển**<br>*(Xích Thiết)* | **Sơ giai** | Thiển xích chân nguyên | Đỏ nhạt / Đạm hồng | $1\times$ | **1.0 thành** (10 phân) |
| | **Trung giai** | Phi hồng chân nguyên | Đỏ tươi / Đỏ thắm | $2\times$ | **0.5 thành** (5 phân) |
| | **Cao giai** | Thâm hồng chân nguyên | Đỏ thẫm / Đỏ đậm | $4\times$ | **0.25 thành** (2.5 phân) |
| | **Đỉnh phong** | Ám hồng chân nguyên | Đỏ sậm / Hồng biến hắc | $8\times$ | **0.125 thành** (1.25 phân) |
| **Tam Chuyển**<br>*(Bạch Ngân)* | **Sơ giai** | Đạm ngân chân nguyên | Bạc nhạt (ngân quang thản nhiên) | $1\times$ | **1.0 thành** (10 phân) |
| | **Trung giai** | Lượng ngân chân nguyên | Bạc sáng / Hoa ngân lóng lánh | $2\times$ | **0.5 thành** (5 phân) |
| | **Cao giai** | Bạch ngân chân nguyên | Bạc ròng thuần khiết | $4\times$ | **0.25 thành** (2.5 phân) |
| | **Đỉnh phong** | Tuyết ngân chân nguyên | Bạc tuyết / Trắng muốt như tuyết | $8\times$ | **0.125 thành** (1.25 phân) |

> [!NOTE]
> Các cấp độ 4 chuyển (Hoàng Kim), 5 chuyển (Tử Tinh), 6 chuyển (Tiên nguyên) chỉ đóng vai trò làm bối cảnh truyền thuyết và bối cảnh thế giới trong Quyển 1, không đưa vào tính toán thực chiến trong hệ thống này.

---

### 5.3. Quy Tắc Vượt Cấp Thôi Động Cổ Trùng Tam Chuyển (3c)
Khi Cổ sư muốn vượt cấp thôi động một Cổ trùng Tam chuyển (3c) bằng chân nguyên Nhị chuyển:
* **Định mức tiêu hao chuẩn:** **`7 thành Ám hồng chân nguyên`** (tương đương 70% dung tích của một không khiếu tiêu chuẩn).
* **Bức tường giới hạn Tư chất (Sự thật về dung tích nguyên hải):**
  * Nâng chân nguyên lên Ám hồng (chất) chỉ là điều kiện cần. **Tư chất (lượng)** mới là ranh giới phân định nghiệt ngã nhất!
  * **Đinh đẳng (chỉ chứa tối đa 2 – 3 thành)** và **Bính đẳng (chỉ chứa tối đa 4 – 5 thành):** Kể cả khi toàn bộ nguyên hải là Ám hồng đỉnh phong và được nạp đầy 100%, tổng dung tích cũng **vĩnh viễn không bao giờ gom đủ 7 thành chân nguyên**. Vì vậy, **không đủ tư chất thì tuyệt đối không thể thôi động Cổ trùng cấp cao hơn!**
  * **Chỉ Cổ sư có tư chất từ 7 thành trở lên (Ất đẳng đạt 70%+ hoặc Giáp đẳng 80% – 90%)** mới có không khiếu đủ dung lượng để tích tụ và thôi động thành công Cổ 3 chuyển.

### 5.4. Hàm Tính Toán Tiêu Hao Chân Nguyên (Mô Hình Đơn Trị Chuẩn Hóa)
Thay vì lưu trữ các thuộc tính đa trị cồng kềnh trong CSDL, CSDL chỉ lưu **Tiêu hao cơ sở** (đơn vị: Thành). Các thông số tiêu hao cụ thể theo từng tiểu cảnh giới và số lần sử dụng tối đa được tính toán động qua mã nguồn [database/chan_nguyen.py](file:///d:/qoder/CoChanNhanRolePlay/database/chan_nguyen.py):

```python
from database.chan_nguyen import tinh_tieu_hao_thuc_te, tinh_so_lan_su_dung, kiem_tra_thoi_dong_3c

# 1. Tính mức tiêu hao thực tế của Nguyệt Quang Cổ (Cơ sở: 1.0 thành sơ giai)
tieu_hao_so = tinh_tieu_hao_thuc_te(1.0, "sơ giai")     # 1.0 thành (Xanh biếc)
tieu_hao_trung = tinh_tieu_hao_thuc_te(1.0, "trung giai") # 0.5 thành (Thương lục)
tieu_hao_dinh = tinh_tieu_hao_thuc_te(1.0, "đỉnh phong") # 0.125 thành (Mặc lục)

# 2. Tính số lần bắn liên tiếp của Cổ sư Bính đẳng (Phương Nguyên: 4.4 thành)
ban_so_giai = tinh_so_lan_su_dung(1.0, 4.4, "sơ giai")    # 4 phát bắn
ban_trung_giai = tinh_so_lan_su_dung(1.0, 4.4, "trung giai") # 8 phát bắn

# 3. Kiểm tra thôi động Cổ 3 chuyển (Cần 7 thành Ám hồng chân nguyên)
pn_kq = kiem_tra_thoi_dong_3c(4.4, "đỉnh phong")
# -> False: "Không đủ tư chất (4.4 thành < 7.0 thành chuẩn). Bính đẳng không thể thôi động Cổ 3 chuyển!"

giap_kq = kiem_tra_thoi_dong_3c(8.5, "đỉnh phong")
# -> True: "Thôi động thành công Cổ 3 chuyển! Tiêu hao 7.0 thành Ám hồng. Không khiếu còn dư: 1.5 thành."
```


---

### 5.5. Quy Chuẩn Đồng Bộ: Chuyển Đổi Về Đơn Vị Chuẩn "Xanh Biếc" (Thanh Đồng Sơ Giai)
Khi người dùng điền thông tin mức tiêu hao chân nguyên trong sổ tay [so_tay_co_trung_rank1_rank2.md](file:///d:/qoder/CoChanNhanRolePlay/so_tay_co_trung_rank1_rank2.md):
* **Cổ Nhất chuyển (1c):** Điền số thành theo **Xanh biếc** (Thanh Đồng sơ giai).
* **Cổ Nhị chuyển (2c):** Điền số thành theo **Thiển hồng** (Xích Thiết sơ giai).
* **Cổ Tam chuyển (3c):** Điền số thành theo **Ám hồng** (Xích Thiết đỉnh phong).

Khi hệ thống quét và đồng bộ dữ liệu từ sổ tay vào CSDL (`gu_database.json`, `co_trung.db`, `co_trung.sql`), toàn bộ sẽ được hàm `quy_doi_ve_xanh_biec()` quy về đơn vị chuẩn duy nhất là **XANH BIẾC** theo đúng tỷ lệ nguyên tác:
* **Nhất chuyển:** $1\text{ thành Xanh biếc} = \mathbf{1.0\text{ thành Xanh biếc}}$
* **Nhị chuyển:** $1\text{ thành Thiển hồng} = \mathbf{10.0\text{ thành Xanh biếc}}$ *(Dòng 3806 nguyên tác: một phần Xích Thiết sánh bằng mười phần Thanh Đồng)*
* **Tam chuyển:** $1\text{ thành Ám hồng} = 8\text{ thành Thiển hồng} = \mathbf{80.0\text{ thành Xanh biếc}}$ *(Dòng 11965: đỉnh phong gấp 8 lần sơ giai)*  
  $\rightarrow$ **Thôi động Cổ 3 chuyển tiêu hao:** $7\text{ thành Ám hồng} = 7 \times 80 = \mathbf{560\text{ thành Xanh biếc}}$!
