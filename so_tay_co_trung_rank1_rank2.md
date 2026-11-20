# SỔ TAY THIẾT KẾ CỔ TRÙNG RANK 1 & RANK 2 (BẢN ĐIỀN THÔNG TIN & SÁNG TẠO)
> **Mục đích:** Cung cấp toàn bộ 98 Cổ trùng chuẩn hóa 12 thuộc tính. Các trường nguyên tác có sẵn được bảo lưu; các trường nguyên tác bỏ trống đã được suy luận và điền đầy đủ 100% thông tin theo sát nguyên tác Quyển 1 (Núi Thanh Mao).
> **Hệ thống Chân Nguyên Đơn Trị:** CSDL chỉ lưu **Mức tiêu hao cơ sở** ngắn gọn, không đa trị. Mức tiêu hao theo từng tiểu cảnh giới được suy luận động qua hàm `chan_nguyen.py` (tỷ lệ $1 : 0.5 : 0.25 : 0.125$).
> **Quy tắc vượt cấp thôi động Cổ 3 chuyển:** Cần đúng **7 thành Ám hồng chân nguyên**. Giới hạn trần tư chất: Đinh đẳng (2–3 thành) và Bính đẳng (4–5 thành) vĩnh viễn không thể thôi động Cổ 3 chuyển; chỉ Cổ sư tư chất từ 7 thành trở lên (Ất đẳng đạt 70%+ / Giáp đẳng) mới có thể thi triển.

---

## MỤC LỤC TRA CỨU NHANH
### Danh Mục Nhất Chuyển (Rank 1 - 51 Cổ trùng)
- [GU_R1_01 Nguyệt Quang Cổ (月光蛊) `[Dòng 1080, 1464, 1470, 3170]`](#gu_r1_01-nguyệt-quang-cổ)
- [GU_R1_02 Tiểu Quang Cổ (小光蛊) `[Dòng 9204, 9206, 9267, 10308, 14924]`](#gu_r1_02-tiểu-quang-cổ)
- [GU_R1_03 Loang Loáng Cổ / Thiểm Quang Cổ (闪光蛊) `[Dòng 11229, 11237]`](#gu_r1_03-loang-loáng-cổ-/-thiểm-quang-cổ)
- [GU_R1_04 Nhất Khí Kim Quang Cổ / Trùng (一气金光虫) `[Dòng 6641]`](#gu_r1_04-nhất-khí-kim-quang-cổ-/-trùng)
- [GU_R1_05 Thủy Quang Cổ (水光蛊) `[Dòng 25697, 25699]`](#gu_r1_05-thủy-quang-cổ)
- [GU_R1_06 Bạch Thỉ Cổ (白豕蛊) `[Dòng 9170, 9186, 9464, 9470]`](#gu_r1_06-bạch-thỉ-cổ)
- [GU_R1_07 Hắc Thỉ Cổ (黑豕蛊) `[Dòng 6264, 6266, 9170, 9186, 9468]`](#gu_r1_07-hắc-thỉ-cổ)
- [GU_R1_08 Hoa Thỉ Cổ (花豕蛊) `[Dòng 9170, 9176, 9180, 12367]`](#gu_r1_08-hoa-thỉ-cổ)
- [GU_R1_09 Phấn Thỉ Cổ (粉豕蛊) `[Dòng 9170, 9172, 11414]`](#gu_r1_09-phấn-thỉ-cổ)
- [GU_R1_10 Cậy Mạnh Thiên Ngưu Cổ (恃强天牛蛊) `[Dòng 5591, 9126, 9130, 9144, 9152]`](#gu_r1_10-cậy-mạnh-thiên-ngưu-cổ)
- [GU_R1_11 Hoàng Lạc Thiên Ngưu Cổ (黄烙天牛蛊) `[Dòng 9148, 9152, 9154, 12351]`](#gu_r1_11-hoàng-lạc-thiên-ngưu-cổ)
- [GU_R1_12 Ngọc Bì Cổ (玉皮蛊) `[Dòng 9112, 9116, 9120, 9301, 11772]`](#gu_r1_12-ngọc-bì-cổ)
- [GU_R1_13 Đồng Bì Cổ (铜皮蛊) `[Dòng 3568, 3570, 9098, 9112]`](#gu_r1_13-đồng-bì-cổ)
- [GU_R1_14 Thiết Bì Cổ / Sắt Lá Cổ (铁皮蛊) `[Dòng 9104, 9106, 9112]`](#gu_r1_14-thiết-bì-cổ-/-sắt-lá-cổ)
- [GU_R1_15 Thạch Bì Cổ (石皮蛊) `[Dòng 9100, 9102, 9112, 11283]`](#gu_r1_15-thạch-bì-cổ)
- [GU_R1_16 Da Thú Cổ (兽皮蛊) `[Dòng 9114, 9116, 11414]`](#gu_r1_16-da-thú-cổ)
- [GU_R1_17 Kim Chung Cổ (金钟蛊) `[Dòng 6234]`](#gu_r1_17-kim-chung-cổ)
- [GU_R1_18 Ngư Lân Cổ (鱼鳞蛊) `[Dòng 19587, 19591, 19633]`](#gu_r1_18-ngư-lân-cổ)
- [GU_R1_19 Thủy Chu Cổ (水蛛蛊 - Nhất chuyển) `[Dòng 6641, 6645]`](#gu_r1_19-thủy-chu-cổ)
- [GU_R1_20 Sinh Tức Thảo (生息草) `[Dòng 11204, 12381, 15688]`](#gu_r1_20-sinh-tức-thảo)
- [GU_R1_21 Sinh Cơ Diệp (生机叶) `[Dòng 15690, 15692, 16286, 17112]`](#gu_r1_21-sinh-cơ-diệp)
- [GU_R1_22 Tửu Trùng (酒虫) `[Dòng 1066, 1147, 2022, 3369, 16115]`](#gu_r1_22-tửu-trùng)
- [GU_R1_23 Thanh Đồng Xá Lợi Cổ (青铜舍利蛊) `[Dòng 17207]`](#gu_r1_23-thanh-đồng-xá-lợi-cổ)
- [GU_R1_24 Ẩn Thạch Cổ (隐石蛊) `[Dòng 18155, 18197, 18211, 19265]`](#gu_r1_24-ẩn-thạch-cổ)
- [GU_R1_25 Long Hoàn Khúc Khúc Cổ (龙丸曲曲蛊) `[Dòng 9232, 12484, 14087]`](#gu_r1_25-long-hoàn-khúc-khúc-cổ)
- [GU_R1_26 Thư Trùng (书虫) `[Dòng 7166, 10541, 10545]`](#gu_r1_26-thư-trùng)
- [GU_R1_27 Khóa Khí Cổ (锁气蛊) `[Dòng 10310]`](#gu_r1_27-khóa-khí-cổ)
- [GU_R1_28 Tiễu Bước Cổ (悄步蛊) `[Dòng 10310]`](#gu_r1_28-tiễu-bước-cổ)
- [GU_R1_29 Khê Lưu Cổ (溪流蛊) `[Dòng 3170, 19605, 25861]`](#gu_r1_29-khê-lưu-cổ)
- [GU_R1_30 Thảo Nhân Cổ (草人蛊) `[Dòng 3262, 3347]`](#gu_r1_30-thảo-nhân-cổ)
- [GU_R1_31 Thiết Đằng Cổ (铁藤蛊) `[Dòng 23997, 24387]`](#gu_r1_31-thiết-đằng-cổ)
- [GU_R1_32 Độc Hoa Cổ (毒花蛊) `[Dòng 23997, 24387]`](#gu_r1_32-độc-hoa-cổ)
- [GU_R1_33 Dầu Hỏa Cổ (油火蛊) `[Dòng 24941, 24943]`](#gu_r1_33-dầu-hỏa-cổ)
- [GU_R1_34 Đơn Khiếu Hỏa Than Cổ / Hỏa Than Cổ (单窍火炭蛊 / 火炭蛊) `[Dòng 24933, 24937]`](#gu_r1_34-đơn-khiếu-hỏa-than-cổ-/-hỏa-than-cổ)
- [GU_R1_35 Gió Xoáy Cổ (旋风蛊) `[Dòng 16326, 16997]`](#gu_r1_35-gió-xoáy-cổ)
- [GU_R1_36 Cuồng Phong Cổ (狂风蛊) `[Dòng 27723, 27731]`](#gu_r1_36-cuồng-phong-cổ)
- [GU_R1_37 Toàn Chủng Cổ (旋种蛊) `[Dòng 27723, 27731]`](#gu_r1_37-toàn-chủng-cổ)
- [GU_R1_38 Ngân Thạch Cổ (银石蛊) `[Dòng 16324, 16997, 25711]`](#gu_r1_38-ngân-thạch-cổ)
- [GU_R1_39 Thanh Ti Cổ (青丝蛊) `[Dòng 6627, 6633, 9468]`](#gu_r1_39-thanh-ti-cổ)
- [GU_R1_40 Hồng Châm Hạt (红针蝎) `[Dòng 11204]`](#gu_r1_40-hồng-châm-hạt)
- [GU_R1_41 Quả Phụ Chu (寡妇蛛) `[Dòng 11204]`](#gu_r1_41-quả-phụ-chu)
- [GU_R1_42 Du Tự Cổ (游字蛊) `[Dòng 20307, 20319]`](#gu_r1_42-du-tự-cổ)
- [GU_R1_43 Túi Cơm Thảo Cổ (饭袋草蛊) `[Dòng 2172, 2174, 9009]`](#gu_r1_43-túi-cơm-thảo-cổ)
- [GU_R1_44 Túi Rượu Hoa Cổ (酒袋花蛊) `[Dòng 2172, 2174, 2358, 9009]`](#gu_r1_44-túi-rượu-hoa-cổ)
- [GU_R1_45 Ôn Ti Chu (温丝蛛) `[Dòng 12281]`](#gu_r1_45-ôn-ti-chu)
- [GU_R1_46 Thủy Tinh Biêu Cổ (水晶瓢虫) `[Dòng 6186]`](#gu_r1_46-thủy-tinh-biêu-cổ)
- [GU_R1_47 Thiên Chân Cái Nấm (天真蘑菇) `[Dòng 6170]`](#gu_r1_47-thiên-chân-cái-nấm)
- [GU_R1_48 Tri Tâm Thảo (知心草) `[Dòng 5593, 5599, 5601]`](#gu_r1_48-tri-tâm-thảo)
- [GU_R1_49 Thối Thí Phì Trùng (臭屁肥虫) `[Dòng 6264, 8248, 13338]`](#gu_r1_49-thối-thí-phì-trùng)
- [GU_R1_50 Đâu Lung Thảo (兜笼草) `[Dòng 26489]`](#gu_r1_50-đâu-lung-thảo)
- [GU_R1_51 Tín Hiệu Cổ (信号蛊) `[Dòng 21433, 21435, 21793]`](#gu_r1_51-tín-hiệu-cổ)

### Danh Mục Nhị Chuyển (Rank 2 - 47 Cổ trùng)
- [GU_R2_01 Nguyệt Mang Cổ (月芒蛊) `[Dòng 14924, 14926, 16312, 16477]`](#gu_r2_01-nguyệt-mang-cổ)
- [GU_R2_02 Nguyệt Toàn Cổ (月旋蛊) `[Dòng 15978, 16326, 22903, 25727]`](#gu_r2_02-nguyệt-toàn-cổ)
- [GU_R2_03 Nguyệt Ngân Cổ (月痕蛊 / 月银蛊) `[Dòng 16324, 25707, 25711]`](#gu_r2_03-nguyệt-ngân-cổ)
- [GU_R2_04 Nguyệt Nghê Thường (月霓裳) `[Dòng 14956, 15930, 15938, 16328]`](#gu_r2_04-nguyệt-nghê-thường)
- [GU_R2_05 Chiếu Ảnh Cổ (照影蛊) `[Dòng 25669, 25673, 25687]`](#gu_r2_05-chiếu-ảnh-cổ)
- [GU_R2_06 Bạch Ngọc Cổ (白玉蛊) `[Dòng 9470, 11772, 14924, 15264, 15312]`](#gu_r2_06-bạch-ngọc-cổ)
- [GU_R2_07 Bàn Thạch Cổ (磐石蛊) `[Dòng 16634, 16764, 21459, 21463]`](#gu_r2_07-bàn-thạch-cổ)
- [GU_R2_08 Hắc Tông Cổ (黑鬃蛊) `[Dòng 6635, 6637, 9468]`](#gu_r2_08-hắc-tông-cổ)
- [GU_R2_09 Sinh Thiết Cổ (生铁蛊) `[Dòng 29533, 29535, 29561]`](#gu_r2_09-sinh-thiết-cổ)
- [GU_R2_10 Hùng Lực Cổ (熊力蛊) `[Dòng 3170, 9659, 19523, 25861]`](#gu_r2_10-hùng-lực-cổ)
- [GU_R2_11 Ngự Hùng Cổ (驭熊蛊) `[Dòng 23907, 23911, 24033, 24919]`](#gu_r2_11-ngự-hùng-cổ)
- [GU_R2_12 Gấu Ngựa Bản Lực Cổ / Hắc Hùng Bản Lực Cổ (黑熊本力蛊) `[Dòng 19303, 23131, 23139]`](#gu_r2_12-gấu-ngựa-bản-lực-cổ-/-hắc-hùng-bản-lực-cổ)
- [GU_R2_13 Cửu Diệp Sinh Cơ Thảo (九叶生机草) `[Dòng 15686, 15700, 16258, 16284]`](#gu_r2_13-cửu-diệp-sinh-cơ-thảo)
- [GU_R2_14 Tứ Vị Tửu Trùng (四味酒虫) `[Dòng 16115, 16479, 18854, 19201]`](#gu_r2_14-tứ-vị-tửu-trùng)
- [GU_R2_15 Xích Thiết Xá Lợi Cổ (赤铁舍利蛊) `[Dòng 17207, 17351, 17500, 18854]`](#gu_r2_15-xích-thiết-xá-lợi-cổ)
- [GU_R2_16 Bạch Trùng Kiển (白虫茧) `[Dòng 16071, 16073, 16091]`](#gu_r2_16-bạch-trùng-kiển)
- [GU_R2_17 Vãng Sinh Thảo Cổ (往生草蛊) `[Dòng 29533, 29535]`](#gu_r2_17-vãng-sinh-thảo-cổ)
- [GU_R2_18 Ẩn Lân Cổ (隐鳞蛊) `[Dòng 19265, 19591, 20261, 20277]`](#gu_r2_18-ẩn-lân-cổ)
- [GU_R2_19 Tam Bộ Phương Thảo (三步芳草蛊) `[Dòng 21333, 21335, 24119, 25177]`](#gu_r2_19-tam-bộ-phương-thảo)
- [GU_R2_20 U Ảnh Tùy Hành Cổ (幽影随行蛊) `[Dòng 11146, 11221, 11237]`](#gu_r2_20-u-ảnh-tùy-hành-cổ)
- [GU_R2_21 Du Cương Cổ (游僵蛊) `[Dòng 19891, 20176, 22165, 32361]`](#gu_r2_21-du-cương-cổ)
- [GU_R2_22 Băng Nhận Cổ (冰刃蛊) `[Dòng 22740, 23027, 23079, 27679]`](#gu_r2_22-băng-nhận-cổ)
- [GU_R2_23 Băng Trùy Cổ (冰锥蛊) `[Dòng 22839, 27711, 32019]`](#gu_r2_23-băng-trùy-cổ)
- [GU_R2_24 Thủy Tráo Cổ (水罩蛊) `[Dòng 22081, 22091, 22879]`](#gu_r2_24-thủy-tráo-cổ)
- [GU_R2_25 Thủy Toản Cổ (水钻蛊) `[Dòng 19881, 19907]`](#gu_r2_25-thủy-toản-cổ)
- [GU_R2_26 Tịnh Thủy Cổ (净水蛊) `[Dòng 7160, 13735, 17305, 25573]`](#gu_r2_26-tịnh-thủy-cổ)
- [GU_R2_27 Thủy Lung Cổ (水笼蛊) `[Dòng 27905, 27907]`](#gu_r2_27-thủy-lung-cổ)
- [GU_R2_28 Thủy Đồn Cổ (水豚蛊) `[Dòng 19790]`](#gu_r2_28-thủy-đồn-cổ)
- [GU_R2_29 Ái Sinh Ly (爱生离) `[Dòng 11188, 11202, 11204]`](#gu_r2_29-ái-sinh-ly)
- [GU_R2_30 Thanh Đằng Cổ (青藤蛊) `[Dòng 15966, 20154, 22772, 23069]`](#gu_r2_30-thanh-đằng-cổ)
- [GU_R2_31 Tùng Châm Cổ (松针蛊) `[Dòng 22875, 22903, 23179]`](#gu_r2_31-tùng-châm-cổ)
- [GU_R2_32 Huyết Khí Cổ (血气蛊) `[Dòng 20176, 25781, 25815]`](#gu_r2_32-huyết-khí-cổ)
- [GU_R2_33 Song Khiếu Hỏa Lô Cổ (双窍火炉蛊) `[Dòng 19501]`](#gu_r2_33-song-khiếu-hỏa-lô-cổ)
- [GU_R2_34 Tạc Lôi Cổ (炸雷蛊) `[Dòng 24529, 24573, 24611]`](#gu_r2_34-tạc-lôi-cổ)
- [GU_R2_35 Lôi Khiếu Cổ (雷窍蛊) `[Dòng 24611, 24679]`](#gu_r2_35-lôi-khiếu-cổ)
- [GU_R2_36 Hủ Huyết Thảo Cổ (腐血草蛊) `[Dòng 14284, 14288, 14294]`](#gu_r2_36-hủ-huyết-thảo-cổ)
- [GU_R2_37 Xà Tín Cổ (蛇信蛊) `[Dòng 14135, 20283, 21467]`](#gu_r2_37-xà-tín-cổ)
- [GU_R2_38 Hùng Hào Cổ (熊嚎蛊) `[Dòng 19153, 20078, 20112]`](#gu_r2_38-hùng-hào-cổ)
- [GU_R2_39 Ảnh Thương Cổ (影伤蛊) `[Dòng 19931, 19933, 22155, 22251]`](#gu_r2_39-ảnh-thương-cổ)
- [GU_R2_40 Cường Thủ Cổ (强取蛊) `[Dòng 21157, 21197, 21213]`](#gu_r2_40-cường-thủ-cổ)
- [GU_R2_41 Phiên Nhiên Cổ (幡然蛊) `[Dòng 17581, 17583, 17593]`](#gu_r2_41-phiên-nhiên-cổ)
- [GU_R2_42 Địa Tàng Hoa Cổ (地藏花蛊) `[Dòng 9359, 9363, 12102, 20454]`](#gu_r2_42-địa-tàng-hoa-cổ)
- [GU_R2_43 Lại Thổ Cáp Mô (癞土蛤蟆) `[Dòng 5615, 5692, 5986, 6000]`](#gu_r2_43-lại-thổ-cáp-mô)
- [GU_R2_44 Minh Lộ Điệp (鸣路蝶) `[Dòng 8276, 8278]`](#gu_r2_44-minh-lộ-điệp)
- [GU_R2_45 Thú Ngữ Cổ (兽语蛊) `[Dòng 20283]`](#gu_r2_45-thú-ngữ-cổ)
- [GU_R2_46 Thuận Phong Nhĩ Cổ (顺风耳蛊) `[Dòng 20283]`](#gu_r2_46-thuận-phong-nhĩ-cổ)
- [GU_R2_47 Trực Giác Cổ (直觉蛊) `[Dòng 29101, 29467, 29643]`](#gu_r2_47-trực-giác-cổ)

---


# ============================================================
## PHẦN: NHẤT CHUYỂN (RANK 1)
# ============================================================

### <a id="gu_r1_01-nguyệt-quang-cổ"></a>1. Nguyệt Quang Cổ (月光蛊) `[Dòng 1080, 1464, 1470, 3170]` (`GU_R1_01`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 1080, 1464, 1470, 3170]`

* **1. Tên gọi:** Nguyệt Quang Cổ (月光蛊) `[Dòng 1080, 1464, 1470, 3170]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Trấn tộc / Gia truyền độc quyền
* **4. Hình thái:** Giống như một vầng trăng khuyết nhỏ bằng lam thủy tinh (pha lê xanh lam), tinh xảo sáng ngời, nằm gọn trong lòng bàn tay [Dòng 1464, 2174]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong lòng bàn tay cổ sư, tạo thành một ấn ký hình trăng khuyết màu xanh lam nhạt [Dòng 1470]
* **6. Công năng cụ thể:** Tiêu hao 1 thành Thanh Đồng chân nguyên sơ giai mỗi lần phát động. Bắn ra một lưỡi đao trăng (nguyệt nhận) màu xanh lam nhạt, tầm xa 10m (khoảng 10 bước), chém đứt da thịt, cắt gãy cọc gỗ tập luyện [Dòng 1464, 1478]. Độ chính xác cao, tốc độ bay trung bình.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) / phát bắn [Dòng 1464, 1482] (áp dụng hàm chan_nguyen.py để suy ra các bậc cao hơn)
* **8. Tác dụng phụ / Tệ đoan:** Bắn liên tục trong cự ly ngắn gây căng cơ lòng bàn tay và kinh mạch phát nhiệt nhẹ; không thể xuyên phá trực tiếp các giáp trụ phòng ngự hạng nặng.
* **9. Loại thức ăn:** Ăn 2 cánh hoa Nguyệt Lan Thảo mỗi bữa, cứ 10 ngày cho ăn 1 lần (hoa tươi hái từ vườn nguyệt lan của sơn trại) `[Dòng 1474, 1516]`. Chi phí nuôi rất rẻ.
* **10. Khẩu phần & Tần suất ăn:** Ăn 2 cánh hoa Nguyệt Lan Thảo mỗi bữa, cứ 10 ngày cho ăn 1 lần (nếu trộn 1 cọng Tri Tâm Thảo thì chỉ cần 1 cánh hoa là no) [Dòng 1474, 5601]
* **11. Giá thị trường:** Giá thị trường 100 – 150 nguyên thạch. Học đường gia tộc phát miễn phí 1 con cho mỗi học viên khai khiếu.
* **12. Mô tả triết lý:** Biểu tượng gia truyền tộc Cổ Nguyệt; minh chứng cho quy tắc 'Bản mệnh cổ định hình cơ thạch và lộ tuyến tác chiến cả đời, tánh mạng giao tu' [Dòng 1470, 16354].

---

### <a id="gu_r1_02-tiểu-quang-cổ"></a>2. Tiểu Quang Cổ (小光蛊) `[Dòng 9204, 9206, 9267, 10308, 14924]` (`GU_R1_02`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 9204, 9206, 9267, 10308, 14924]`

* **1. Tên gọi:** Tiểu Quang Cổ (小光蛊) `[Dòng 9204, 9206, 9267, 10308, 14924]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Hình ngôi sao năm cánh nhỏ như ngón tay cái, thân phát ra ánh sáng vàng trắng ấm áp [Dòng 9204, 10308]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trôi nổi bên trong khiếu hải chân nguyên, không làm biến đổi hình thái cơ thể bên ngoài.
* **6. Công năng cụ thể:** Hình sao 5 cánh nhỏ như ngón tay cái. Khi thúc giục phát ra ánh sáng vàng trắng ấm áp soi đường trong đêm `[Dòng 10308]`; khi kết hợp phụ trợ cùng chiêu thức Quang đạo thì tăng 30% uy lực cho Nguyệt Nhận `[Dòng 9204]`.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao 0.5 thành Thanh Đồng chân nguyên sơ giai (xanh biếc) mỗi 10 hơi thở duy trì phát sáng; tiêu hao 1 thành xanh biếc khi phối hợp cường hóa Nguyệt Nhận.
* **8. Tác dụng phụ / Tệ đoan:** Ánh sáng phát ra khó che giấu trong bóng đêm, dễ làm lộ vị trí nếu không phối hợp cùng Cổ che giấu quang tức.
* **9. Loại thức ăn:** Ánh sáng tinh hoa của đá huỳnh quang phát sáng hoặc tro tàn của nến sáp trắng.
* **10. Khẩu phần & Tần suất ăn:** Ăn bụi đá huỳnh quang hoặc tro nến nhỏ, 7 ngày cho ăn 1 lần.
* **11. Giá thị trường:** 20 – 30 nguyên thạch.
* **12. Mô tả triết lý:** Một đốm sáng nhỏ tuy mỏng manh nhưng khi hợp cùng đao trăng lại có thể chém đứt sinh tử.

---

### <a id="gu_r1_03-loang-loáng-cổ-/-thiểm-quang-cổ"></a>3. Loang Loáng Cổ / Thiểm Quang Cổ (闪光蛊) `[Dòng 11229, 11237]` (`GU_R1_03`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 11229, 11237]`

* **1. Tên gọi:** Loang Loáng Cổ / Thiểm Quang Cổ (闪光蛊) `[Dòng 11229, 11237]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu hao phẩm
* **4. Hình thái:** Một viên đom đóm tròn dẹp nhỏ bằng hạt đậu, thân màu trắng ngà trong suốt bao bọc điểm linh quang chói mắt.
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trôi nổi trong không khiếu, khi kích hoạt bay ra khỏi lòng bàn tay và tự bạo phát sáng.
* **6. Công năng cụ thể:** Tiêu hao chân nguyên tự bạo phát ra một vầng hào quang chói lòa cực độ trong nháy mắt, làm mù mắt đối phương tạm thời và xua tan mọi bóng tối trong phạm vi vài chục bước `[Dòng 11229]`. Là khắc tinh trực tiếp phá vỡ thuật ẩn nấp của *U Ảnh Tùy Hành Cổ* `[Dòng 11237]`. Dùng 1 lần là nổ tan biến.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao 0.5 thành Thanh Đồng chân nguyên sơ giai (xanh biếc) kích hoạt một lần duy nhất rồi tự bạo/tiêu biến hoàn toàn
* **8. Tác dụng phụ / Tệ đoan:** Cổ tiêu hao một lần tự bạo phát sáng chói lòa; nếu cổ sư không nhắm mắt kịp thời cũng bị lóa mắt tạm thời
* **9. Loại thức ăn:** Cổ tiêu hao dùng một lần nổ tung, không cần nuôi dưỡng `[Dòng 11237]`.
* **10. Khẩu phần & Tần suất ăn:** Cổ tiêu hao dùng một lần nổ tung hoặc biến mất, không yêu cầu nuôi dưỡng
* **11. Giá thị trường:** 20 – 40 nguyên thạch.
* **12. Mô tả triết lý:** Khoảnh khắc chói lòa ngắn ngủi thiêu đốt chính sinh mạng để đổi lấy cơ hội xoay chuyển thế cục.

---

### <a id="gu_r1_04-nhất-khí-kim-quang-cổ-/-trùng"></a>4. Nhất Khí Kim Quang Cổ / Trùng (一气金光虫) `[Dòng 6641]` (`GU_R1_04`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 6641]`

* **1. Tên gọi:** Nhất Khí Kim Quang Cổ / Trùng (一气金光虫) `[Dòng 6641]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Côn trùng nhỏ dạng bọ cánh cứng màu vàng kim óng ánh, trên mai có đường vân hình một dải mây khí lượn tròn.
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh bám trên ngực cổ sư, khi kích hoạt tỏa ra một vòng hào quang màu vàng kim bảo hộ toàn thân.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Một khi thúc giục, kim quang lóng lánh bọc quanh người, lực phòng ngự cực cường để cản đòn hiểm trong chớp mắt' [Dòng 6641] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao 1.5 thành Thanh Đồng chân nguyên sơ giai (xanh biếc) cho mỗi lần kích hoạt kim quang hộ thể trong 3 nhịp thở.
* **8. Tác dụng phụ / Tệ đoan:** Thời gian phòng ngự rất ngắn, tiêu hao chân nguyên đột ngột dễ làm gián đoạn việc di chuyển nếu chân nguyên không đủ dồi dào.
* **9. Loại thức ăn:** Mạt bột đồng vàng hoặc quặng kim loại vụn nghiền nhỏ.
* **10. Khẩu phần & Tần suất ăn:** Ăn vài hạt mạt bột đồng vàng vụn, cứ 10 ngày cho ăn 1 lần.
* **11. Giá thị trường:** Bán tại chợ phiên thương đội Cổ Phú.
* **12. Mô tả triết lý:** Phòng ngự trong nháy mắt là ranh giới giữa sống và chết trước những đòn đánh chí mạng.

---

### <a id="gu_r1_05-thủy-quang-cổ"></a>5. Thủy Quang Cổ (水光蛊) `[Dòng 25697, 25699]` (`GU_R1_05`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 25697, 25699]`

* **1. Tên gọi:** Thủy Quang Cổ (水光蛊) `[Dòng 25697, 25699]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng nhỏ phát sáng sống bám vào vách đá ngầm
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trôi nổi trong không khiếu hoặc bám trên vách đá ngầm, không gây biến dạng thân thể.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Cổ trùng phát sáng sống bám vào vách đá; thân thể phát ra ánh sáng dập dờn bồng bềnh như sóng nước biếc, quang ảnh biến ảo nhiều tầng lớp, sáng tối chập chờn dịu mắt' [Dòng 25697, 25699] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao 0.5 thành Thanh Đồng chân nguyên sơ giai (xanh biếc) duy trì quang ảnh sóng nước trong 1 khắc (15 phút).
* **8. Tác dụng phụ / Tệ đoan:** Chỉ dùng để chiếu sáng và ngụy trang quang ảnh dịu mắt, hoàn toàn không có uy lực công phòng thực chiến.
* **9. Loại thức ăn:** Nước suối ngầm thanh khiết dưới lòng đất Núi Thanh Mao.
* **10. Khẩu phần & Tần suất ăn:** Uống vài giọt nước ngầm thanh khiết, 7 ngày cho ăn 1 lần.
* **11. Giá thị trường:** Khảm trên bốn vách đá mật thất của gia tộc Cổ Nguyệt để chiếu sáng khi Phương Nguyên vào tra cứu chiến công.
* **12. Mô tả triết lý:** Ánh nước dập dờn mờ ảo, tỏ tường mà không chói gắt, thích hợp cho kẻ ẩn nhẫn mưu sâu.

---

### <a id="gu_r1_06-bạch-thỉ-cổ"></a>6. Bạch Thỉ Cổ (白豕蛊) `[Dòng 9170, 9186, 9464, 9470]` (`GU_R1_06`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 9170, 9186, 9464, 9470]`

* **1. Tên gọi:** Bạch Thỉ Cổ (白豕蛊) `[Dòng 9170, 9186, 9464, 9470]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Cực phẩm
* **4. Hình thái:** Sâu béo mập mạp hình lợn rừng màu trắng muốt như tuyết [Dòng 9170, 9464]
* **5. Thay đổi ngoại hình khi ký túc:** Cải tạo gân cốt, bắp thịt từ bên trong cơ thể để tăng sức mạnh cơ bắp thực sự, không làm biến dạng thể hình dị hợm [Dòng 9188]
* **6. Công năng cụ thể:** Tiêu hao chân nguyên để nuôi dưỡng và cải tạo gân cốt bắp thịt của Cổ sư. Tăng vĩnh viễn sức mạnh của 1 con heo rừng trắng (1 trư lực) `[Dòng 9188]`. Điểm đặc biệt tối cao: Lực lượng ngấm hẳn vào thân thể, hoàn toàn không tốn chân nguyên duy trì sau khi đã luyện xong; ngay cả khi Bạch Thỉ Cổ có chết thì lực lượng 1 trư vẫn ở lại vĩnh viễn trên cơ thể Cổ sư `[Dòng 9192]`.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) cho mỗi lần cải tạo gân cốt; sau khi tăng 1 trư lực hoàn tất thì phát lực hoàn toàn không tốn chân nguyên [Dòng 9192].
* **8. Tác dụng phụ / Tệ đoan:** Trong quá trình cải tạo gân cốt, cơ thể Cổ sư thường xuyên phát ra cảm giác nhức mỏi như rách cơ bắp và phát sinh cảm giác thèm ăn thịt mãnh liệt.
* **9. Loại thức ăn:** Thịt tươi sống của heo rừng (Phương Nguyên săn heo rừng dưới chân núi lấy thịt nuôi cổ) `[Dòng 9534]`.
* **10. Khẩu phần & Tần suất ăn:** Thịt tươi sống của heo rừng săn được từ dã ngoại, dùng dao róc thịt tươi đút ăn định kỳ [Dòng 9534]
* **11. Giá thị trường:** 600 nguyên thạch trên thị trường tự do, xuất hiện là bị mua ngay lập tức, giữ giá 100% (luyện xong sức mạnh có thể bán lại thu hồi vốn) `[Dòng 9186, 9194]`.
* **12. Mô tả triết lý:** Triết lý Lực đạo tối thượng: Lực lượng ngấm vào thân thể là vĩnh hằng, không phụ thuộc ngoại vật, giữ giá 100% khi bán lại [Dòng 9192, 9194]

---

### <a id="gu_r1_07-hắc-thỉ-cổ"></a>7. Hắc Thỉ Cổ (黑豕蛊) `[Dòng 6264, 6266, 9170, 9186, 9468]` (`GU_R1_07`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 6264, 6266, 9170, 9186, 9468]`

* **1. Tên gọi:** Hắc Thỉ Cổ (黑豕蛊) `[Dòng 6264, 6266, 9170, 9186, 9468]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Cực phẩm
* **4. Hình thái:** Thân sâu béo tròn màu đen nhánh như lợn đen [Dòng 6264, 9170]
* **5. Thay đổi ngoại hình khi ký túc:** Cải tạo gân cốt, cơ bắp thân thể từ bên trong, tăng vĩnh viễn 1 trư lực của loài lợn đen [Dòng 9188]
* **6. Công năng cụ thể:** Tính năng tương đương Bạch Thỉ Cổ, tăng vĩnh viễn 1 trư lực của loài lợn đen `[Dòng 9188]`.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) cải tạo cơ thể ban đầu; tăng lực vĩnh viễn không tốn chân nguyên duy trì [Dòng 9188].
* **8. Tác dụng phụ / Tệ đoan:** Khiến cổ sư thường xuyên cảm thấy thèm ăn thịt sống và cơ thể nóng ran trong giai đoạn cải tạo cơ bắp.
* **9. Loại thức ăn:** Thịt tươi sống của lợn đen `[Dòng 9534]`.
* **10. Khẩu phần & Tần suất ăn:** Thịt tươi sống của lợn đen dã ngoại định kỳ [Dòng 9534]
* **11. Giá thị trường:** 600 nguyên thạch `[Dòng 9186]`. Cổ Kim Sinh từng dùng Thối Thí Phì Trùng giả mạo Hắc Thỉ Cổ để lừa đảo tại chợ phiên.
* **12. Mô tả triết lý:** Thực lực tự thân là vĩnh viễn; tài sản đầu tư thanh khoản cao nhất hàng ngũ Nhất chuyển [Dòng 6274, 9186]

---

### <a id="gu_r1_08-hoa-thỉ-cổ"></a>8. Hoa Thỉ Cổ (花豕蛊) `[Dòng 9170, 9176, 9180, 12367]` (`GU_R1_08`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 9170, 9176, 9180, 12367]`

* **1. Tên gọi:** Hoa Thỉ Cổ (花豕蛊) `[Dòng 9170, 9176, 9180, 12367]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Thân sâu hình lợn nhỏ, mặt ngoài đầy hoa văn phối màu đen-trắng, đen-phấn, hoặc trắng-phấn [Dòng 9176]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong không khiếu, cải tạo thân thể nâng cao sức chịu đựng và cơ bắp dẻo dai.
* **6. Công năng cụ thể:** Lâm thời tăng cường 1 trư lực cho cổ sư trong khoảng 10 nhịp thở (thời gian duy trì gấp đôi Cậy Mạnh Thiên Ngưu Cổ) [Dòng 9180]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) cho mỗi lần cải tạo cơ bắp; tăng lực vĩnh viễn không tốn chân nguyên duy trì.
* **8. Tác dụng phụ / Tệ đoan:** Lực bộc phát nhỏ hơn Cậy Mạnh Thiên Ngưu nên di chứng chấn thương cơ bắp nhẹ hơn đáng kể, nhưng chỉ duy trì được 10 nhịp thở rồi biến mất [Dòng 9180, 9182]
* **9. Loại thức ăn:** Thịt heo đốm dã ngoại băm nhỏ tươi sống.
* **10. Khẩu phần & Tần suất ăn:** Ăn một miếng thịt heo đốm nhỏ tươi sống, 7 ngày một bữa.
* **11. Giá thị trường:** 80 – 100 nguyên thạch.
* **12. Mô tả triết lý:** Lực lượng muôn màu muôn vẻ, bắt đầu từ những bước rèn luyện thể chất thô sơ nhất.

---

### <a id="gu_r1_09-phấn-thỉ-cổ"></a>9. Phấn Thỉ Cổ (粉豕蛊) `[Dòng 9170, 9172, 11414]` (`GU_R1_09`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 9170, 9172, 11414]`

* **1. Tên gọi:** Phấn Thỉ Cổ (粉豕蛊) `[Dòng 9170, 9172, 11414]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Sâu nhỏ hình lợn màu hồng phấn mập mạp [Dòng 9170, 9172]
* **5. Thay đổi ngoại hình khi ký túc:** Khiến cổ sư béo phì, thân thể biến dạng thành kẻ mập mạp núng nính mỡ đệm [Dòng 9172]
* **6. Công năng cụ thể:** Quán chú chân nguyên khiến cổ sư tăng phì, tích tụ mỡ dày hấp thu xung lực va chạm [Dòng 9172]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) mỗi đợt nuôi dưỡng cơ bắp; tăng lực vĩnh viễn không tiêu hao chân nguyên sau khi hoàn tất.
* **8. Tác dụng phụ / Tệ đoan:** Làm biến dạng thân hình thành người béo phì ục ịch, giảm tốc độ di chuyển, hầu như không có cổ sư nào muốn chọn [Dòng 9172]
* **9. Loại thức ăn:** Thịt nạc tươi của heo rừng non dã ngoại.
* **10. Khẩu phần & Tần suất ăn:** Ăn một mẩu thịt nạc nhỏ tươi sống, 7 ngày một lần.
* **11. Giá thị trường:** Rẻ nhất trong họ Thỉ Cổ, khoảng 50 nguyên thạch.
* **12. Mô tả triết lý:** Mỗi phần sức mạnh tích lũy trên cơ thể là một tấm khiên vô hình trước mọi bất trắc.

---

### <a id="gu_r1_10-cậy-mạnh-thiên-ngưu-cổ"></a>10. Cậy Mạnh Thiên Ngưu Cổ (恃强天牛蛊) `[Dòng 5591, 9126, 9130, 9144, 9152]` (`GU_R1_10`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 5591, 9126, 9130, 9144, 9152]`

* **1. Tên gọi:** Cậy Mạnh Thiên Ngưu Cổ (恃强天牛蛊) `[Dòng 5591, 9126, 9130, 9144, 9152]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Thân hình bầu dục đồng, lưng hơi dẹp màu xích thiết, một đôi xúc giác thô có các đốt trúc (trúc tiết), cằm cứng khỏe đóng mở phát tiếng rắc rắc như cưa gỗ ('cưa thụ lang') [Dòng 9128, 9132]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong không khiếu, khi kích hoạt dồn lực khiến hai bắp tay nổi gân guốc cứng cáp.
* **6. Công năng cụ thể:** Lâm thời bộc phát sức mạnh của 1 con trâu (1 ngưu lực) trong vòng 5 nhịp thở khi va chạm húc tông [Dòng 9136, 9152]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) cho mỗi đợt vận lực bộc phát sức mạnh thiên ngưu.
* **8. Tác dụng phụ / Tệ đoan:** Nếu cổ sư thể chất mảnh khảnh yếu ớt, dùng quá nhiều sẽ làm rách cơ bắp (cơ thể lạp thương), thậm chí đứt gân cốt (thịt cân gãy); chỉ người thể trạng cường tráng mới kham nổi [Dòng 9142, 9190]
* **9. Loại thức ăn:** Vỏ cây cổ thụ lâu năm hoặc nhựa cây thông trên Núi Thanh Mao.
* **10. Khẩu phần & Tần suất ăn:** Ăn một mẩu vỏ cây thông tươi có nhựa, 10 ngày một lần.
* **11. Giá thị trường:** Bán tại chợ phiên thương đội `[Dòng 5591]`.
* **12. Mô tả triết lý:** Ý chí cậy mạnh đấu sức, dũng cảm đối kháng trực diện là bản tính nguyên sơ của muông thú.

---

### <a id="gu_r1_11-hoàng-lạc-thiên-ngưu-cổ"></a>11. Hoàng Lạc Thiên Ngưu Cổ (黄烙天牛蛊) `[Dòng 9148, 9152, 9154, 12351]` (`GU_R1_11`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 9148, 9152, 9154, 12351]`

* **1. Tên gọi:** Hoàng Lạc Thiên Ngưu Cổ (黄烙天牛蛊) `[Dòng 9148, 9152, 9154, 12351]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Thân hình hơi gầy dài hơn cậy mạnh thiên ngưu, toàn thân màu vàng sẫm (ám hoàng sắc), xúc giác dài không có đốt trúc, gốc râu màu vàng chuyển dần sang màu đen ở phía cuối [Dòng 9150]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong không khiếu, khi vận lực tỏa ra khí thế trầm ổn vàng nâu trên cánh tay.
* **6. Công năng cụ thể:** Ban cho cổ sư sự chịu đựng dẻo dai, làm giảm tốc độ tiêu hao thể lực, duy trì sức bền liên tục suốt 1 khắc (15 phút) [Dòng 9152]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) mỗi lần vận lực va chạm bộc phá.
* **8. Tác dụng phụ / Tệ đoan:** Không có di chứng làm tổn thương hay rách cơ bắp như Cậy Mạnh Thiên Ngưu Cổ [Dòng 9152]
* **9. Loại thức ăn:** Mùn gỗ mục và rễ cây hoàng đàn phơi khô ẩm.
* **10. Khẩu phần & Tần suất ăn:** Gặm một nhúm mùn gỗ mục ẩm, 10 ngày một lần.
* **11. Giá thị trường:** Giá thị trường ngang ngửa Nguyệt Quang Cổ (100 - 150 nguyên thạch), chỉ xếp sau Ngọc Bì Cổ và Tửu Trùng `[Dòng 9154]`.
* **12. Mô tả triết lý:** Vững vàng như núi đá, va chạm như cỗ xe đồng; sức mạnh là thước đo sinh tồn.

---

### <a id="gu_r1_12-ngọc-bì-cổ"></a>12. Ngọc Bì Cổ (玉皮蛊) `[Dòng 9112, 9116, 9120, 9301, 11772]` (`GU_R1_12`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 9112, 9116, 9120, 9301, 11772]`

* **1. Tên gọi:** Ngọc Bì Cổ (玉皮蛊) `[Dòng 9112, 9116, 9120, 9301, 11772]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Cực phẩm
* **4. Hình thái:** Cổ trùng họ Bì Cổ hình con rệp dẹp rộng, trong suốt sáng bóng như ngọc thạch [Dòng 9096, 9118]
* **5. Thay đổi ngoại hình khi ký túc:** Bao phủ làn da bằng một tầng ngọc quang trắng sáng thanh khiết, da dẻ mịn màng như ngọc bích [Dòng 9116, 12532]
* **6. Công năng cụ thể:** Bao phủ làn da bằng một tầng ngọc quang trắng sáng thanh khiết. Phòng ngự toàn diện cả cận chiến lẫn viễn trình, đỡ được nguyệt nhận sắc bén mà hoàn toàn không làm nặng nề cơ thể hay giảm tốc độ `[Dòng 9116, 12532]`. Cổ Nguyệt Bác ban riêng cho Phương Chính `[Dòng 9301]`.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) kích hoạt lớp màng ngọc bọc da thịt; duy trì tiêu hao 0.5 thành xanh biếc mỗi 10 hơi thở.
* **8. Tác dụng phụ / Tệ đoan:** Duy trì ngọc bọc toàn thân lâu khiến da hơi cứng và giảm nhẹ độ linh hoạt của các khớp ngón tay.
* **9. Loại thức ăn:** Ngọc vụn (quặng ngọc thạch) `[Dòng 9118]`.
* **10. Khẩu phần & Tần suất ăn:** Ngọc vụn (quặng ngọc thạch) định kỳ
* **11. Giá thị trường:** 150 – 200 nguyên thạch, rất hiếm ở hàng ngũ Nhất chuyển `[Dòng 9120]`.
* **12. Mô tả triết lý:** Triết lý lấy nhu thắng cương: Phòng ngự toàn diện mà không làm trĩu nặng thân thể hay giảm tốc độ di chuyển [Dòng 9116, 9120]

---

### <a id="gu_r1_13-đồng-bì-cổ"></a>13. Đồng Bì Cổ (铜皮蛊) `[Dòng 3568, 3570, 9098, 9112]` (`GU_R1_13`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 3568, 3570, 9098, 9112]`

* **1. Tên gọi:** Đồng Bì Cổ (铜皮蛊) `[Dòng 3568, 3570, 9098, 9112]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Giống con rệp (bọ chét), dẹp mà rộng, đầu rất nhỏ, thân hình trứng, cả vật thể vàng óng ánh tản ra ánh kim loại như đồng [Dòng 9096]
* **5. Thay đổi ngoại hình khi ký túc:** Khi thúc giục nhuộm da dẻ toàn thân cổ sư thành màu vàng đồng cổ óng ánh, phòng ngự tăng nhiều trước đòn cận chiến [Dòng 3570, 9098]
* **6. Công năng cụ thể:** Nhuộm da dẻ Cổ sư thành màu đồng cổ vàng óng, tăng mạnh lực phòng ngự vật lý, kháng đòn đấm đá cận chiến, đao kiếm thường chém không rách da `[Dòng 3570]`. Bản mệnh Cổ của Quyền cước Giáo đầu học đường `[Dòng 3568]`.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) kích hoạt giáp đồng bảo hộ trong 10 nhịp thở.
* **8. Tác dụng phụ / Tệ đoan:** Da đổi sang màu đồng xỉn tạm thời, hơi nặng nề và dễ dẫn điện nếu gặp Cổ Lôi đạo.
* **9. Loại thức ăn:** Bột quặng đồng vụn hoặc vảy gỉ đồng xanh thiên nhiên.
* **10. Khẩu phần & Tần suất ăn:** Ăn vài hạt bột quặng đồng vụn, 10 ngày một lần.
* **11. Giá thị trường:** 80 – 100 nguyên thạch.
* **12. Mô tả triết lý:** Thân như đồng đúc, đứng vững trước sóng gió mới mong có ngày tiến giai.

---

### <a id="gu_r1_14-thiết-bì-cổ-/-sắt-lá-cổ"></a>14. Thiết Bì Cổ / Sắt Lá Cổ (铁皮蛊) `[Dòng 9104, 9106, 9112]` (`GU_R1_14`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 9104, 9106, 9112]`

* **1. Tên gọi:** Thiết Bì Cổ / Sắt Lá Cổ (铁皮蛊) `[Dòng 9104, 9106, 9112]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Hình thể hình trứng dẹp tương tự Đồng Bì Cổ, nằm trong chén sắt, toàn thân tỏa ra ánh sáng lạnh lẽo như sắt đen (hắc thiết) [Dòng 9106]
* **5. Thay đổi ngoại hình khi ký túc:** Làm làn da ánh lên màu đen sẫm của sắt thép tôi luyện, kháng chém chém của đao thương tốt nhất trong Bì Cổ sơ cấp [Dòng 9106]
* **6. Công năng cụ thể:** Làm da ánh lên màu đen của sắt thép, khả năng kháng chém chém của đao thương tốt nhất trong các Bì Cổ sơ cấp `[Dòng 9106]`.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) duy trì màng sắt bảo vệ cơ thể trong 10 nhịp thở.
* **8. Tác dụng phụ / Tệ đoan:** Tăng trọng lượng cơ thể nhẹ, nếu rơi xuống nước sâu sẽ giảm khả năng bơi lội.
* **9. Loại thức ăn:** Bột quặng sắt `[Dòng 9106]`.
* **10. Khẩu phần & Tần suất ăn:** Bột quặng sắt định kỳ
* **11. Giá thị trường:** Phổ biến trên kệ Cổ thất.
* **12. Mô tả triết lý:** Sắt tôi qua lửa mới thành đao, da tôi qua đòn mới thành thiết giáp.

---

### <a id="gu_r1_15-thạch-bì-cổ"></a>15. Thạch Bì Cổ (石皮蛊) `[Dòng 9100, 9102, 9112, 11283]` (`GU_R1_15`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 9100, 9102, 9112, 11283]`

* **1. Tên gọi:** Thạch Bì Cổ (石皮蛊) `[Dòng 9100, 9102, 9112, 11283]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Hình thể hình trứng dẹp tương tự Đồng Bì Cổ, nhưng thân thể màu xám bụi bặm (bụi phác phác) như hàng mỹ nghệ tạc bằng đá [Dòng 9102]
* **5. Thay đổi ngoại hình khi ký túc:** Da dẻ trở nên thô ráp, xám xịt và chai sần như đá cuội [Dòng 9102]
* **6. Công năng cụ thể:** Da thô ráp xám xịt như đá cuội, chịu va đập đè nén cực tốt nhưng làm nặng nề thân thể, giảm khoảng 15% tốc độ di chuyển `[Dòng 9102]`.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) kích hoạt da đá chống đỡ va đập thô bạo.
* **8. Tác dụng phụ / Tệ đoan:** Làm nặng nề thân thể, giảm khoảng 15% tốc độ di chuyển [Dòng 9102]
* **9. Loại thức ăn:** Bột quặng đá / Vụn đá cuội (thức ăn rẻ tiền bậc nhất) `[Dòng 9104]`.
* **10. Khẩu phần & Tần suất ăn:** Bột quặng đá / Vụn đá cuội định kỳ (chi phí cực rẻ)
* **11. Giá thị trường:** 30 – 50 nguyên thạch.
* **12. Mô tả triết lý:** Đá thô tuy không hoa mỹ nhưng là lá chắn mộc mạc nhất che chở sinh mạng.

---

### <a id="gu_r1_16-da-thú-cổ"></a>16. Da Thú Cổ (兽皮蛊) `[Dòng 9114, 9116, 11414]` (`GU_R1_16`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 9114, 9116, 11414]`

* **1. Tên gọi:** Da Thú Cổ (兽皮蛊) `[Dòng 9114, 9116, 11414]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Phiến da nhỏ màu nâu sẫm cỡ ngón tay cái, dẻo dai và có lớp lông tơ mịn phủ ngoài bề mặt.
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh bám vào lớp da cổ sư, khiến biểu bì trở nên dẻo dai như da thú hoang dã.
* **6. Công năng cụ thể:** Khiến da dẻ dẻo dai như da thú rừng, giảm nội thương khi bị chấn động `[Dòng 9116]`.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.8 thành chân nguyên sơ giai (xanh biếc) kích hoạt màng da thú dẻo dai giảm chấn trong 10 nhịp thở.
* **8. Tác dụng phụ / Tệ đoan:** Da thô ráp hơn bình thường, khả năng cản đòn chém sắc bén kém hơn giáp đá hoặc giáp ngọc.
* **9. Loại thức ăn:** Mỡ thú hoang phơi khô hoặc gân hươu nai dã ngoại.
* **10. Khẩu phần & Tần suất ăn:** Ăn một mẩu mỡ thú khô nhỏ bằng móng tay, 7 ngày một lần.
* **11. Giá thị trường:** Rẻ tiền, xếp sau Thiết Bì Cổ `[Dòng 9114]`.
* **12. Mô tả triết lý:** Học theo loài dã thú chịu đòn bền bỉ, nhẫn nại chờ đợi thời cơ phản kích.

---

### <a id="gu_r1_17-kim-chung-cổ"></a>17. Kim Chung Cổ (金钟蛊) `[Dòng 6234]` (`GU_R1_17`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 6234]`

* **1. Tên gọi:** Kim Chung Cổ (金钟蛊) `[Dòng 6234]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng nhỏ có hoa văn hình chiếc chuông đồng vàng
* **5. Thay đổi ngoại hình khi ký túc:** Tạo ra một hư ảnh chuông vàng chụp lên thân thể cổ sư
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Tạo ra một đạo hư ảnh chuông vàng chụp lên thân thể để cản đòn công kích hiểm hóc' [Dòng 6234] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (xanh biếc) ngưng tụ hư ảnh chuông vàng hộ thể trong 3 nhịp thở.
* **8. Tác dụng phụ / Tệ đoan:** Khi trúng đòn va đập mạnh sẽ phát ra tiếng chuông ngân vang dội ngược vào tai, gây ù tai nhẹ.
* **9. Loại thức ăn:** Bột cát vàng mịn hoặc vụn quặng kim loại quý.
* **10. Khẩu phần & Tần suất ăn:** Ăn một nhúm bột cát vàng mịn, 10 ngày một lần.
* **11. Giá thị trường:** Rất đắt, Cổ sư phàn nàn trả giá nửa ngày không được bớt `[Dòng 6234]`.
* **12. Mô tả triết lý:** Chuông vàng che chở thân tâm, bất động như núi trước mọi đao kiếm phàm trần.

---

### <a id="gu_r1_18-ngư-lân-cổ"></a>18. Ngư Lân Cổ (鱼鳞蛊) `[Dòng 19587, 19591, 19633]` (`GU_R1_18`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 19587, 19591, 19633]`

* **1. Tên gọi:** Ngư Lân Cổ (鱼鳞蛊) `[Dòng 19587, 19591, 19633]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng dẹp mỏng hình chiếc vảy cá lấp lánh
* **5. Thay đổi ngoại hình khi ký túc:** Khiến làn da mọc lên một lớp vảy cá mỏng trơn trượt lấp lánh
* **6. Công năng cụ thể:** Khiến da mọc một lớp vảy cá mỏng, tăng khả năng bơi lội dưới nước và giúp cơ thể trơn trượt né đòn `[Dòng 19591]`.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) phủ lớp vảy cá trơn trượt phòng ngự đòn chém trong 10 nhịp thở.
* **8. Tác dụng phụ / Tệ đoan:** Để lại mùi tanh cá thoang thoảng trên da, giảm độ bám dính khi cần leo trèo vách đá trơn.
* **9. Loại thức ăn:** Vảy cá tươi `[Dòng 19607]`.
* **10. Khẩu phần & Tần suất ăn:** Vảy cá tươi định kỳ
* **11. Giá thị trường:** 300 – 400 nguyên thạch trong thời chiến Lang Triều `[Dòng 19587]`.
* **12. Mô tả triết lý:** Lấy nhu thắng cương, vảy cá trơn trượt hóa giải ngàn cân lực chém.

---

### <a id="gu_r1_19-thủy-chu-cổ"></a>19. Thủy Chu Cổ (水蛛蛊 - Nhất chuyển) `[Dòng 6641, 6645]` (`GU_R1_19`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 6641, 6645]`

* **1. Tên gọi:** Thủy Chu Cổ (水蛛蛊 - Nhất chuyển) `[Dòng 6641, 6645]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Nhện nước nhỏ màu lam biếc, chân dài lướt trên mặt nước
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh dưới lòng bàn chân hoặc bám ở gót giày, khi kích hoạt giăng chân nhện nước nâng đỡ thân thể.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Gặp nước mưa liên tục dệt thành lớp áo nước mỏng (thủy y) bao bọc cơ thể, che chắn mưa gió và cản đòn chém' [Dòng 6645] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.5 thành chân nguyên sơ giai (xanh biếc) mỗi 20 bước chân lướt đi trên mặt nước.
* **8. Tác dụng phụ / Tệ đoan:** Chỉ dùng được trên mặt nước tĩnh hoặc dòng chảy nhẹ; sóng lớn hoặc xoáy nước mạnh dễ khiến cổ sư mất thăng bằng ngã nhào.
* **9. Loại thức ăn:** Nước mưa / Nước sạch `[Dòng 6645]`.
* **10. Khẩu phần & Tần suất ăn:** Nước mưa hoặc nước sạch tinh khiết
* **11. Giá thị trường:** Phổ biến trong đoàn thương buôn.
* **12. Mô tả triết lý:** Đạp nước lướt đi như gió thoảng, mượn sức thiên nhiên vượt qua sông sâu hiểm trở.

---

### <a id="gu_r1_20-sinh-tức-thảo"></a>20. Sinh Tức Thảo (生息草) `[Dòng 11204, 12381, 15688]` (`GU_R1_20`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 11204, 12381, 15688]`

* **1. Tên gọi:** Sinh Tức Thảo (生息草) `[Dòng 11204, 12381, 15688]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Thảo cổ dạng mầm cỏ non mềm mại tỏa ánh hào quang màu lục biếc
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trôi nổi trong không khiếu, rễ cắm nhẹ vào thành khiếu để truyền sinh cơ phục hồi chân nguyên.
* **6. Công năng cụ thể:** Phát ra ánh sáng xanh dịu dàng chữa lành vết thương ngoài da, cầm máu và hồi sức. Dùng lâu dài thông qua tiêu hao chân nguyên (KHÔNG PHẢI cổ tiêu hao một lần) `[Dòng 12381]`. Cổ sư chọn con này định hình vai trò Trị liệu sư, được các tiểu tổ săn bắn tranh giành chào đón `[Dòng 12381]`.
* **7. Cách tiêu hao chân nguyên:** Thụ động tiêu hao chân nguyên dư thừa để nuôi mầm; khi cạn kiệt thì tự động tỏa sinh cơ bổ sung chân nguyên (xanh biếc).
* **8. Tác dụng phụ / Tệ đoan:** Tốc độ hồi phục chân nguyên chỉ mức sơ khai, nếu ép thúc giục quá tải cỏ sẽ héo rũ và mất tác dụng.
* **9. Loại thức ăn:** Đất ẩm và giọt sương mai `[Dòng 12381]`.
* **10. Khẩu phần & Tần suất ăn:** Đất ẩm và giọt sương mai định kỳ
* **11. Giá thị trường:** Được gia tộc bảo hộ, giá trị trao đổi cao.
* **12. Mô tả triết lý:** Sinh sinh bất tức, một cọng cỏ non cũng chứa đựng sinh cơ dồi dào của đất trời.

---

### <a id="gu_r1_21-sinh-cơ-diệp"></a>21. Sinh Cơ Diệp (生机叶) `[Dòng 15690, 15692, 16286, 17112]` (`GU_R1_21`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 15690, 15692, 16286, 17112]`

* **1. Tên gọi:** Sinh Cơ Diệp (生机叶) `[Dòng 15690, 15692, 16286, 17112]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu hao phẩm
* **4. Hình thái:** Thảo cổ hình chiếc lá ngọc
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong lòng bàn tay hoặc cất trong túi thơm, khi dùng áp vào vết thương để chữa lành.
* **6. Công năng cụ thể:** Thảo cổ hình chiếc lá ngọc. Dán vào vết thương, lá lập tức tan chảy thành luồng sinh cơ màu xanh lục ngấm sâu vào da thịt, cầm máu tức thì, khép miệng vết thương và chống hoại tử `[Dòng 15692]`. Dùng một lần là tiêu biến hoàn toàn.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) mỗi lần kích phát sinh cơ lá cây chữa lành vết thương.
* **8. Tác dụng phụ / Tệ đoan:** Chỉ cầm máu và liền sẹo vết thương phần mềm ngoài da, không chữa được gãy xương hoặc dập nát nội tạng.
* **9. Loại thức ăn:** Không cần cho ăn (tách từ Cửu Diệp Sinh Cơ Thảo ra cất dùng dần) `[Dòng 15700]`.
* **10. Khẩu phần & Tần suất ăn:** Cổ tiêu hao dùng một lần nổ tung hoặc biến mất, không yêu cầu nuôi dưỡng
* **11. Giá thị trường:** 50 nguyên thạch/chiếc cố định; thời kỳ Lang Triều sốt giá lên tới 60 – 70 nguyên thạch `[Dòng 15692, 21112]`.
* **12. Mô tả triết lý:** Lá xanh cứu mạng trong gang tấc; giữ được hơi tàn là còn hy vọng xoay chuyển cờ tàn.

---

### <a id="gu_r1_22-tửu-trùng"></a>22. Tửu Trùng (酒虫) `[Dòng 1066, 1147, 2022, 3369, 16115]` (`GU_R1_22`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 1066, 1147, 2022, 3369, 16115]`

* **1. Tên gọi:** Tửu Trùng (酒虫) `[Dòng 1066, 1147, 2022, 3369, 16115]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Cực phẩm / Quý hiếm hy thế
* **4. Hình thái:** Sâu rượu nhỏ béo tròn như tằm cưng (tằm tằm), mềm mại như cục bông tuyết, hai mắt tròn xoe lấp lánh, toàn thân tỏa hương rượu nồng đượm [Dòng 2022, 2174]
* **5. Thay đổi ngoại hình khi ký túc:** Nằm cuộn tròn ngủ say trong không khiếu nguyên hải, không làm biến đổi ngoại hình thân thể [Dòng 2022, 3369]
* **6. Công năng cụ thể:** Hút chân nguyên Thanh Đồng sơ giai (xanh biếc) vào bụng nhào nặn rồi nhả ra chân nguyên Thanh Đồng trung giai (thương lục) [Dòng 2499, 2501]. Giúp Cổ sư Nhất chuyển sở hữu trước chân nguyên trung giai, tăng 1 tiểu cảnh giới chiến lực [Dòng 2501, 4207].
* **7. Cách tiêu hao chân nguyên:** Hút chân nguyên Thanh Đồng sơ giai (xanh biếc) vào bụng nhào nặn rồi nhả ra chân nguyên Thanh Đồng trung giai; tiêu hao chân nguyên thuần túy theo tỷ lệ chuyển hóa tự nhiên [Dòng 1152].
* **8. Tác dụng phụ / Tệ đoan:** Chỉ tinh luyện được đến cảnh giới đỉnh phong của Nhất chuyển, không thể giúp vượt rào cản đại cảnh giới lên Nhị chuyển; cần rượu ngon liên tục để duy trì.
* **9. Loại thức ăn:** Rượu quý hảo hạng (Hầu Nhi Tửu, Thanh Trúc Tửu...). Thả ngâm trong vò rượu định kỳ cho uống no say `[Dòng 2471, 3397]`.
* **10. Khẩu phần & Tần suất ăn:** Thả ngâm trong vò rượu quý hảo hạng (Hầu Nhi Tửu, Thanh Trúc Tửu...) định kỳ cho uống no say [Dòng 2471, 3397]
* **11. Giá thị trường:** 500 – 580 nguyên thạch tại chợ đen `[Dòng 6212]`.
* **12. Mô tả triết lý:** Con đường nghịch thiên cải mệnh của kẻ tư chất thấp kém; ngưng tụ từ men say tự nhiên trăm năm, phá vỡ giới hạn phàm trần [Dòng 1066, 3375]

---

### <a id="gu_r1_23-thanh-đồng-xá-lợi-cổ"></a>23. Thanh Đồng Xá Lợi Cổ (青铜舍利蛊) `[Dòng 17207]` (`GU_R1_23`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 17207]`

* **1. Tên gọi:** Thanh Đồng Xá Lợi Cổ (青铜舍利蛊) `[Dòng 17207]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Quý hiếm / Cực phẩm đấu giá
* **4. Hình thái:** Dạng viên xá lợi tròn trịa như đầu ngón tay, phát ra ánh sáng đồng xanh thanh khiết mờ ảo [Dòng 17207]
* **5. Thay đổi ngoại hình khi ký túc:** Cổ tiêu hao một lần: tan chảy trực tiếp vào khiếu hải chân nguyên nâng thẳng 1 tiểu cảnh giới, không ký sinh lâu dài.
* **6. Công năng cụ thể:** Uống vào giúp Cổ sư Nhất chuyển tăng vọt 1 tiểu cảnh giới tu vi (sơ giai lên trung giai, hoặc trung giai lên cao giai, cao giai lên đỉnh phong) mà không để lại bất kỳ di chứng nào `[Dòng 17207]`. Dùng 1 lần là biến mất.
* **7. Cách tiêu hao chân nguyên:** Cổ tiêu hao một lần: nuốt trực tiếp vào bụng, tự động hòa tan nâng thẳng 1 tiểu cảnh giới Thanh Đồng (xanh biếc), không tiêu tốn thêm chân nguyên [Dòng 17207]
* **8. Tác dụng phụ / Tệ đoan:** Cổ tiêu hao một lần, dùng xong biến mất hoàn toàn [Dòng 17207]
* **9. Loại thức ăn:** Tiêu hao phẩm, không cần nuôi `[Dòng 17207]`.
* **10. Khẩu phần & Tần suất ăn:** Cổ tiêu hao dùng một lần nổ tung hoặc biến mất, không yêu cầu nuôi dưỡng
* **11. Giá thị trường:** 500 nguyên thạch.
* **12. Mô tả triết lý:** Kỳ tích đoạt tạo hóa đất trời: Con đường tắt đột phá tu vi không di chứng, phản ánh khát vọng vượt bậc của chúng sinh và giá trị khổng lồ của tài nguyên tu hành.

---

### <a id="gu_r1_24-ẩn-thạch-cổ"></a>24. Ẩn Thạch Cổ (隐石蛊) `[Dòng 18155, 18197, 18211, 19265]` (`GU_R1_24`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 18155, 18197, 18211, 19265]`

* **1. Tên gọi:** Ẩn Thạch Cổ (隐石蛊) `[Dòng 18155, 18197, 18211, 19265]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Quý hiếm
* **4. Hình thái:** Cổ trùng dạng viên đá nhỏ màu xám tro, ký sinh trong tim Thạch Hầu Vương
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong tim Thạch Hầu Vương hoặc cơ thể; khi đứng yên tựa vách đá khiến thân hình đổi màu hòa lẫn hoàn toàn vào tảng đá
* **6. Công năng cụ thể:** Ký sinh trong tim Thạch Hầu Vương (Khỉ đá). Khi Cổ sư đứng yên tựa lưng vào vách đá, thân hình đổi màu hòa lẫn hoàn toàn vào tảng đá, đánh lừa thị giác và trinh sát thông thường `[Dòng 18155, 18197]`. Nhược điểm chí mạng: chỉ tàng hình khi đứng yên, cử động là lộ diện.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao 0.5 thành Thanh Đồng chân nguyên sơ giai (xanh biếc) duy trì ngụy trang khi đứng yên áp vách đá
* **8. Tác dụng phụ / Tệ đoan:** Chỉ tàng hình khi đứng yên tựa lưng vào vách đá; cử động là lập tức lộ diện
* **9. Loại thức ăn:** Vụn đá hoa cương `[Dòng 18211]`.
* **10. Khẩu phần & Tần suất ăn:** Cổ ẩn nấp tự nhiên sống ký sinh trong kẽ đá, hút địa khí và bụi đá hoa cương 10 ngày một lần.
* **11. Giá thị trường:** Cổ ẩn hình quý hiếm của dã thú.
* **12. Mô tả triết lý:** Quy luật bất động như sơn: Hòa tan vào vách đá tĩnh lặng để tồn tại trước nanh vuốt kẻ thù, nhưng tĩnh quá hóa tù túng khi chỉ cần cử động là tan vỡ ngụy trang.

---

### <a id="gu_r1_25-long-hoàn-khúc-khúc-cổ"></a>25. Long Hoàn Khúc Khúc Cổ (龙丸曲曲蛊) `[Dòng 9232, 12484, 14087]` (`GU_R1_25`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 9232, 12484, 14087]`

* **1. Tên gọi:** Long Hoàn Khúc Khúc Cổ (龙丸曲曲蛊) `[Dòng 9232, 12484, 14087]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Hình dạng chú dế mèn có đôi râu dài uốn lượn như râu rồng [Dòng 9232, 12476]
* **5. Thay đổi ngoại hình khi ký túc:** Khi kích hoạt, hai chân cổ sư hiện lên một tầng ánh sáng nhạt màu đỏ cam (chanh hồng sắc ánh sáng nhạt) [Dòng 12476]
* **6. Công năng cụ thể:** Kích hoạt phát quang ở hai chân, nhẹ nhàng nhảy búng một cái lập tức triệt thoái hoặc né tránh lùi xa 10 mét (10m) trong nháy mắt [Dòng 12476, 12480]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.5 thành chân nguyên sơ giai (xanh biếc) kích thích dế gáy vang định vị kẻ địch trong 1 khắc.
* **8. Tác dụng phụ / Tệ đoan:** Nếu liên tục bật nhảy né tránh sẽ nhanh chóng cạn kiệt chân nguyên; cổ sư tư chất thấp (như Bính đẳng của Xích Thành) dễ bị đuối sức và hết chân nguyên trước đối thủ có tu vi cao hơn [Dòng 12484, 12486]
* **9. Loại thức ăn:** Hạt kê thơm hoặc hạt cỏ lúa mạch non của nông dân.
* **10. Khẩu phần & Tần suất ăn:** Ăn 3 hạt kê nhỏ mỗi bữa, 7 ngày cho ăn 1 lần.
* **11. Giá thị trường:** 80 – 100 nguyên thạch.
* **12. Mô tả triết lý:** Tiếng dế gáy vang vọng đêm dài, báo hiệu nguy nan giúp người phòng bị từ xa.

---

### <a id="gu_r1_26-thư-trùng"></a>26. Thư Trùng (书虫) `[Dòng 7166, 10541, 10545]` (`GU_R1_26`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 7166, 10541, 10545]`

* **1. Tên gọi:** Thư Trùng (书虫) `[Dòng 7166, 10541, 10545]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Sâu nhỏ màu trắng bạc chuyên ăn văn tự, chữ viết và mực in [Dòng 7166, 10541]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong đầu hoặc túi áo cổ sư, khi đọc tin tức tỏa ánh sáng vàng nhạt vào tâm trí.
* **6. Công năng cụ thể:** Đút da thú bản đồ hoặc sách vở cho nó ăn; từ nay về sau chỉ cần Thư Trùng không mất thì cổ sư vĩnh viễn nhớ rõ ràng toàn bộ bản đồ, kiến thức đó trong não bộ [Dòng 10541]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.2 thành chân nguyên sơ giai (xanh biếc) mỗi lần trích xuất hoặc ghi chép thông tin.
* **8. Tác dụng phụ / Tệ đoan:** Không có năng lực chiến đấu; nếu bị đòn chấn động mạnh đánh trúng thân thể dễ dập nát.
* **9. Loại thức ăn:** Da thú bản đồ, sách vở, văn tự mực in [Dòng 10541, 10543]
* **10. Khẩu phần & Tần suất ăn:** Ăn giấy sách, văn tự mực in định kỳ
* **11. Giá thị trường:** Giá trị tương đương Tửu Trùng và Bạch Thỉ Cổ (khoảng 500 – 600 nguyên thạch), luôn trong trạng thái cháy hàng tại chợ phiên [Dòng 10545]
* **12. Mô tả triết lý:** Đại diện cho Trí đạo: Tri thức, ký ức và mưu lược là ngọn đèn soi sáng đường tu; sức mạnh cơ bắp không có trí tuệ dẫn đường chỉ là vũ dũng vô mưu [Dòng 10541, 10549]

---

### <a id="gu_r1_27-khóa-khí-cổ"></a>27. Khóa Khí Cổ (锁气蛊) `[Dòng 10310]` (`GU_R1_27`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 10310]`

* **1. Tên gọi:** Khóa Khí Cổ (锁气蛊) `[Dòng 10310]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng hình chiếc khóa dẹp màu xám chì, thân không có cánh, không phát ra dao động hay tiếng động.
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh ở vùng yết hầu hoặc ngực, phong tỏa toàn bộ mùi cơ thể và hơi thở.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Khóa khí cổ, có thể che giấu hoàn toàn hơi thở và mùi cơ thể trong phạm vi mười bước, giúp tiếp cận con mồi mà không bị phát hiện' [Dòng 10310] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Duy trì tiêu hao cơ sở: 0.3 thành chân nguyên sơ giai (xanh biếc) mỗi nửa canh giờ ẩn nấp.
* **8. Tác dụng phụ / Tệ đoan:** Cổ sư phải thở nhẹ và hạn chế vận động mạnh; nếu chạy nước rút sẽ làm đứt đoạn tác dụng khóa khí.
* **9. Loại thức ăn:** Khí tức của đất mùn ẩm và rêu phong hang tối.
* **10. Khẩu phần & Tần suất ăn:** Hút khí rêu ẩm trong hang tối, 10 ngày một lần.
* **11. Giá thị trường:** Cổ phụ trợ đi săn dã ngoại do Phương Nguyên phân tích cấu hình tác chiến.
* **12. Mô tả triết lý:** Kẻ đi săn thượng thặng trước hết phải biết giấu kín hơi thở của chính mình.

---

### <a id="gu_r1_28-tiễu-bước-cổ"></a>28. Tiễu Bước Cổ (悄步蛊) `[Dòng 10310]` (`GU_R1_28`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 10310]`

* **1. Tên gọi:** Tiễu Bước Cổ (悄步蛊) `[Dòng 10310]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Hình dáng giống như một chiếc đệm móng mèo bằng lông tơ màu tro xám, cực kỳ mềm mại không trọng lượng.
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh dưới lòng hai bàn chân cổ sư, hình thành một lớp đệm khí vô hình.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Tiễu bước cổ, tiêu trừ triệt để tiếng động bước chân khi di chuyển, đi lại êm ru không một tiếng động (tiễu vô thanh tức)' [Dòng 10310] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.5 thành chân nguyên sơ giai (xanh biếc) cho mỗi 100 bước đi bộ im ắng.
* **8. Tác dụng phụ / Tệ đoan:** Chỉ triệt tiêu tiếng bước chân, không che giấu được bóng hình hay mùi vị cơ thể.
* **9. Loại thức ăn:** Lông tơ của các loài thú ăn đêm như chuột rừng hoặc chồn xám.
* **10. Khẩu phần & Tần suất ăn:** Nuốt vài sợi lông chuột rừng, 7 ngày một bữa.
* **11. Giá thị trường:** Cổ phụ trợ di chuyển nhẹ nhàng, bổ khuyết khuyết điểm khi đi săn dã ngoại.
* **12. Mô tả triết lý:** Đi không lưu dấu, bước không thành tiếng; ám dạ hành tẩu là đạo sinh tồn.

---

### <a id="gu_r1_29-khê-lưu-cổ"></a>29. Khê Lưu Cổ (溪流蛊) `[Dòng 3170, 19605, 25861]` (`GU_R1_29`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 3170, 19605, 25861]`

* **1. Tên gọi:** Khê Lưu Cổ (溪流蛊) `[Dòng 3170, 19605, 25861]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Trấn tộc / Gia truyền độc quyền
* **4. Hình thái:** Thủy trùng trong suốt hình giọt nước uốn cong, thân phát ra ánh lam nhạt của dòng suối nguồn.
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong lòng bàn tay hoặc ống tay áo, phóng ra dòng nước khi thúc giục.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Thúc giục tạo ra dòng nước chảy xiết mềm mại, dùng làm đòn đánh Thủy đạo cơ bản hoặc cấp nước sinh hoạt cho sơn trại' [Dòng 3170] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) bắn ra một luồng nước xiết đẩy lùi mục tiêu.
* **8. Tác dụng phụ / Tệ đoan:** Sát thương sắc nhọn kém, chủ yếu mang tính cản trở đẩy lùi hoặc dập lửa dã ngoại.
* **9. Loại thức ăn:** Nước suối đầu nguồn trong vắt từ đỉnh núi Thanh Mao.
* **10. Khẩu phần & Tần suất ăn:** Uống 5 giọt nước suối ngọt lành, 5 ngày một bữa.
* **11. Giá thị trường:** Độc quyền Bạch gia.
* **12. Mô tả triết lý:** Nước chảy đá mòn, suối nhỏ gom lại thành sông lớn; thủy đạo khởi đầu từ sự mềm mại.

---

### <a id="gu_r1_30-thảo-nhân-cổ"></a>30. Thảo Nhân Cổ (草人蛊) `[Dòng 3262, 3347]` (`GU_R1_30`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 3262, 3347]`

* **1. Tên gọi:** Thảo Nhân Cổ (草人蛊) `[Dòng 3262, 3347]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Hình nhân bện từ cỏ khô màu xanh lục nhạt, lớn bằng bàn tay, có mắt mũi bằng hạt đậu nhỏ.
* **5. Thay đổi ngoại hình khi ký túc:** Đặt ngoài đất hoặc cất trong giỏ tre, không ký sinh trực tiếp vào da thịt cổ sư.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Hóa thành các hình nhân bằng cỏ (thảo nhân) biết cử động để cổ sư luyện tập ngắm bắn Nguyệt Nhận hoặc làm mồi nhử dã thú' [Dòng 3262, 3347] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) để kích hoạt hình nhân cử động làm bia tập trong nửa canh giờ.
* **8. Tác dụng phụ / Tệ đoan:** Sức chịu đòn yếu ớt, trúng vài nguyệt nhận hoặc đòn chém mạnh là đứt gãy rơm rạ phải dùng cỏ bện lại.
* **9. Loại thức ăn:** Nước bùn và cỏ tươi `[Dòng 3262]`.
* **10. Khẩu phần & Tần suất ăn:** Hút sương mai bám trên ngọn cỏ, 7 ngày một lần.
* **11. Giá thị trường:** Dùng trong dịch vụ trường bắn học đường.
* **12. Mô tả triết lý:** Bia cỏ làm bạn luyện tập, đổ mồ hôi trên sân tập để bớt đổ máu ngoài chiến trường.

---

### <a id="gu_r1_31-thiết-đằng-cổ"></a>31. Thiết Đằng Cổ (铁藤蛊) `[Dòng 23997, 24387]` (`GU_R1_31`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 23997, 24387]`

* **1. Tên gọi:** Thiết Đằng Cổ (铁藤蛊) `[Dòng 23997, 24387]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Hạt giống mầm dây leo cứng cỏi màu đen sắt
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh quấn quanh cổ tay như một chiếc vòng gai sắt nhỏ màu đen xám.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Gieo mầm trên mặt đất hoặc tường thành, rót chân nguyên mọc lan thành bụi gai sắc nhọn như sắt thép ngăn chặn thú triều' [Dòng 23997, 24387] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) phóng ra dây gai sắt trói bắt mục tiêu trong 5 nhịp thở.
* **8. Tác dụng phụ / Tệ đoan:** Dây gai sắt cứng nhắc, tầm vươn cự ly ngắn; nếu đối phương có Cổ lực đạo cực lớn có thể giằng đứt dây gai.
* **9. Loại thức ăn:** Mạt sắt và nước `[Dòng 24387]`.
* **10. Khẩu phần & Tần suất ăn:** Mạt sắt và nước định kỳ
* **11. Giá thị trường:** Chiến lược phòng thủ.
* **12. Mô tả triết lý:** Dây leo cứng như sắt nguội, trói buộc kẻ địch cũng là tự khóa chặt sự linh hoạt.

---

### <a id="gu_r1_32-độc-hoa-cổ"></a>32. Độc Hoa Cổ (毒花蛊) `[Dòng 23997, 24387]` (`GU_R1_32`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 23997, 24387]`

* **1. Tên gọi:** Độc Hoa Cổ (毒花蛊) `[Dòng 23997, 24387]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Thảo hoa độc sắc sặc sỡ, nhị hoa mang gai độc
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trên đầu ngón tay, tạo hình đóa hoa tím nhỏ xíu ẩn dưới móng tay.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Trồng xen kẽ trên tường gai, nở hoa bắn gai độc và phấn hoa gây tê liệt bầy thú công thành' [Dòng 23997] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) bắn ra chùm phấn hoa độc gây ngứa rát và tê liệt nhẹ.
* **8. Tác dụng phụ / Tệ đoan:** Gió ngược dễ thổi ngược phấn hoa về phía bản thân; cổ sư cần uống giải dược phòng ngừa trước.
* **9. Loại thức ăn:** Độc dịch và bùn đất `[Dòng 24389]`.
* **10. Khẩu phần & Tần suất ăn:** Độc dịch và bùn đất định kỳ
* **11. Giá thị trường:** Vật tư quân sự.
* **12. Mô tả triết lý:** Hoa càng đẹp càng độc, nụ cười càng ngọt ngào càng ẩn chứa sát cơ.

---

### <a id="gu_r1_33-dầu-hỏa-cổ"></a>33. Dầu Hỏa Cổ (油火蛊) `[Dòng 24941, 24943]` (`GU_R1_33`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 24941, 24943]`

* **1. Tên gọi:** Dầu Hỏa Cổ (油火蛊) `[Dòng 24941, 24943]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu hao phẩm
* **4. Hình thái:** Cổ trùng bọc chất lỏng sền sệt bốc mùi dầu hỏa
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong khoang miệng hoặc ngón trỏ, phun ra vệt dầu hỏa đặc sánh khi phát động.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Bắn vào thân thể mục tiêu tự bạo thành khối dầu bốc cháy ngùn ngụt, làm ngọn lửa lan nhanh gấp bội' [Dòng 24941, 24943] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.8 thành chân nguyên sơ giai (xanh biếc) mỗi lần phun ra một vệt dầu hỏa dễ cháy.
* **8. Tác dụng phụ / Tệ đoan:** Dầu dính vào quần áo bản thân rất dễ bốc cháy lan nếu gặp tàn lửa đối phương.
* **9. Loại thức ăn:** Tiêu hao phẩm, không cần nuôi `[Dòng 24943]`.
* **10. Khẩu phần & Tần suất ăn:** Cổ tiêu hao dùng một lần nổ tung hoặc biến mất, không yêu cầu nuôi dưỡng
* **11. Giá thị trường:** 20 – 30 nguyên thạch.
* **12. Mô tả triết lý:** Dầu tưới thêm lửa, mượn thế trợ uy; tương trợ lẫn nhau mới phát huy uy lực lớn nhất.

---

### <a id="gu_r1_34-đơn-khiếu-hỏa-than-cổ-/-hỏa-than-cổ"></a>34. Đơn Khiếu Hỏa Than Cổ / Hỏa Than Cổ (单窍火炭蛊 / 火炭蛊) `[Dòng 24933, 24937]` (`GU_R1_34`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 24933, 24937]`

* **1. Tên gọi:** Đơn Khiếu Hỏa Than Cổ / Hỏa Than Cổ (单窍火炭蛊 / 火炭蛊) `[Dòng 24933, 24937]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng hình hòn than đỏ rực cháy âm ỉ
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong lòng bàn tay, khi vận dụng khiến lòng bàn tay đỏ rực như than hồng.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Hình hòn than đỏ rực cháy âm ỉ; khi phóng vào cơ thể mục tiêu (như qua đường miệng) sẽ khiến lục phủ ngũ tạng lập tức bốc cháy ngùn ngụt từ bên trong' [Dòng 24933, 24937] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) bắn ra một đốm than lửa nổ lép bép gây bỏng rát.
* **8. Tác dụng phụ / Tệ đoan:** Tầm bắn ngắn dưới 8 bước, uy lực sát thương diện hẹp chỉ đốt cháy quần áo hoặc da thịt bề mặt.
* **9. Loại thức ăn:** Than củi `[Dòng 24933]`.
* **10. Khẩu phần & Tần suất ăn:** Ăn than củi định kỳ
* **11. Giá thị trường:** 30 – 50 nguyên thạch (Cổ Viêm đạo phàm giai học viện/kho chiến công).
* **12. Mô tả triết lý:** Tàn than âm ỉ chờ gió bốc cháy; nhẫn nại tích lũy là cội nguồn của bộc phát.

---

### <a id="gu_r1_35-gió-xoáy-cổ"></a>35. Gió Xoáy Cổ (旋风蛊) `[Dòng 16326, 16997]` (`GU_R1_35`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 16326, 16997]`

* **1. Tên gọi:** Gió Xoáy Cổ (旋风蛊) `[Dòng 16326, 16997]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng mờ ảo bao quanh luồng gió xoáy nhỏ
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong ống tay áo hoặc kẽ ngón tay, khi thúc giục tạo ra luồng gió xoáy nhỏ đổi hướng đòn đánh.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Thổi bùng luồng gió xoáy nhỏ cuốn bay lá rụng hoặc làm chệch hướng bay của đòn đánh viễn trình' [Dòng 16326] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) thổi ra một luồng gió xoáy làm chệch hướng đòn đánh hoặc hỗ trợ Nguyệt Toàn Cổ.
* **8. Tác dụng phụ / Tệ đoan:** Sát thương trực tiếp rất thấp, chỉ đóng vai trò phụ trợ đổi hướng đường đạn.
* **9. Loại thức ăn:** Gió tự nhiên trên đỉnh đèo lộng gió hoặc hạt cỏ may rừng.
* **10. Khẩu phần & Tần suất ăn:** Hứng gió đầu ngọn núi Thanh Mao trong 1 khắc, 7 ngày một lần.
* **11. Giá thị trường:** 80 – 100 nguyên thạch.
* **12. Mô tả triết lý:** Gió xoay chuyển linh hoạt, né tránh cương trực để tìm kiếm góc hiểm bất ngờ.

---

### <a id="gu_r1_36-cuồng-phong-cổ"></a>36. Cuồng Phong Cổ (狂风蛊) `[Dòng 27723, 27731]` (`GU_R1_36`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 27723, 27731]`

* **1. Tên gọi:** Cuồng Phong Cổ (狂风蛊) `[Dòng 27723, 27731]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng mang luồng gió lốc màu lam xám cuộn trào
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trôi nổi trong không khiếu, khi vận dụng cuộn gió quanh hai cẳng chân hỗ trợ bộc phát lực.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Thổi luồng gió lốc mạnh mẽ gia tốc cho phi đao, đẩy lùi kẻ địch cận chiến' [Dòng 27723, 27731] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (xanh biếc) phóng ra luồng gió mạnh đẩy bật chướng ngại vật cản đường.
* **8. Tác dụng phụ / Tệ đoan:** Gió lớn cuốn theo bụi cát dễ làm mờ mắt chính cổ sư nếu không cẩn thận che chắn.
* **9. Loại thức ăn:** Lá cây thông rụng thu thập trong các trận giông bão lớn.
* **10. Khẩu phần & Tần suất ăn:** Gặm vài mảnh lá thông khô bão táp, 7 ngày một bữa.
* **11. Giá thị trường:** 80 – 120 nguyên thạch.
* **12. Mô tả triết lý:** Cuồng phong quét sạch lá rụng, thế công mãnh liệt trấn áp tinh thần đối phương.

---

### <a id="gu_r1_37-toàn-chủng-cổ"></a>37. Toàn Chủng Cổ (旋种蛊) `[Dòng 27723, 27731]` (`GU_R1_37`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 27723, 27731]`

* **1. Tên gọi:** Toàn Chủng Cổ (旋种蛊) `[Dòng 27723, 27731]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Hạt giống mộc đạo có các rãnh xoắn ốc trợ lực xoay tròn
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong lòng bàn tay, bắn ra hạt giống xoay tròn khi búng ngón tay.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Bắn ra hạt mầm xoay tròn với tốc độ cực cao, phụ trợ gia tăng lực xuyên phá cho đòn công kích' [Dòng 27723, 27731] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.8 thành chân nguyên sơ giai (xanh biếc) cho một phát bắn hạt giống xoay vòng găm sâu vào mục tiêu.
* **8. Tác dụng phụ / Tệ đoan:** Cần mang theo túi hạt giống dự trữ; hết hạt giống thì Cổ không thể phát huy công năng.
* **9. Loại thức ăn:** Bột phấn các loại hạt cây dại phơi khô nghiền mịn.
* **10. Khẩu phần & Tần suất ăn:** Ăn một nhúm bột hạt cỏ khô, 10 ngày một lần.
* **11. Giá thị trường:** Phổ biến trong chiến đấu.
* **12. Mô tả triết lý:** Hạt mầm tuy nhỏ xoay tít giữa không trung, cắm rễ vào da thịt gây ra vết thương hiểm ác.

---

### <a id="gu_r1_38-ngân-thạch-cổ"></a>38. Ngân Thạch Cổ (银石蛊) `[Dòng 16324, 16997, 25711]` (`GU_R1_38`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 16324, 16997, 25711]`

* **1. Tên gọi:** Ngân Thạch Cổ (银石蛊) `[Dòng 16324, 16997, 25711]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Khoáng thạch cổ nhỏ màu trắng bạc ánh kim
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh bám vào mu bàn tay, tạo vảy đá ánh bạc lấp lánh như vảy cá kim loại.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Khoáng thạch cổ phát ra ánh bạc sắc bén, dùng làm phụ liệu phối luyện hoặc công kích kim đạo' [Dòng 16324, 25711] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) phủ lớp đá bạc cường hóa độ cứng nắm đấm hoặc phối hợp gia tăng độ sắc nguyệt đao.
* **8. Tác dụng phụ / Tệ đoan:** Nắm đấm nặng nề, nếu đối đầu với Cổ Lôi đạo dễ bị dẫn truyền chấn thương.
* **9. Loại thức ăn:** Quặng bạc vụn `[Dòng 25711]`.
* **10. Khẩu phần & Tần suất ăn:** Quặng bạc vụn định kỳ
* **11. Giá thị trường:** 100 – 120 nguyên thạch.
* **12. Mô tả triết lý:** Đá bạc lấp lánh vừa sắc vừa cứng, gia trì thêm uy phong cho kẻ dũng cảm.

---

### <a id="gu_r1_39-thanh-ti-cổ"></a>39. Thanh Ti Cổ (青丝蛊) `[Dòng 6627, 6633, 9468]` (`GU_R1_39`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 6627, 6633, 9468]`

* **1. Tên gọi:** Thanh Ti Cổ (青丝蛊) `[Dòng 6627, 6633, 9468]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng mảnh dẻ như búi tơ tằm màu xanh lục
* **5. Thay đổi ngoại hình khi ký túc:** Khiến tóc cổ sư mọc dài nhanh chóng và đổi sang màu xanh biếc dai dẳng như dây leo
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Khiến tóc mọc dài nhanh và xanh biếc dai dẳng như dây leo' [Dòng 6627, 6633] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) kích thích tóc mọc dài và dai dẳng như dây leo cuốn bắt.
* **8. Tác dụng phụ / Tệ đoan:** Tóc mọc dài nhanh và đổi màu xanh lục vĩnh viễn, khi bị cắt đứt tóc cổ sư sẽ chịu cảm giác đau nhức da đầu.
* **9. Loại thức ăn:** Nước sắc lá chè xanh hoặc sương bọng lá trúc non.
* **10. Khẩu phần & Tần suất ăn:** Ngâm chùm tóc vào nước chè xanh loãng 10 ngày một lần.
* **11. Giá thị trường:** 30 – 40 nguyên thạch.
* **12. Mô tả triết lý:** Một sợi tóc mềm bện lại thành dây thừng; lấy nhu khắc cương, trói buộc nghịch cảnh.

---

### <a id="gu_r1_40-hồng-châm-hạt"></a>40. Hồng Châm Hạt (红针蝎) `[Dòng 11204]` (`GU_R1_40`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 11204]`

* **1. Tên gọi:** Hồng Châm Hạt (红针蝎) `[Dòng 11204]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Bọ cạp nhỏ màu đen có chiếc đuôi kim châm đỏ chót
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh ở ngón trỏ hoặc tay áo, khi tấn công thò đuôi bọ cạp chích nọc độc đỏ.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Bọ cạp tiết nọc độc kim đỏ làm tê liệt và thối rữa cơ bắp, phụ liệu phối luyện độc cổ' [Dòng 11204] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) phóng ra một mũi kim độc đỏ rực châm chích đối thủ.
* **8. Tác dụng phụ / Tệ đoan:** Đầu ngón tay ngứa ran sau khi phóng độc; phạm vi tấn công ngắn trong vòng 5 bước.
* **9. Loại thức ăn:** Máu tươi của cóc đỏ hoặc nhện nhỏ dã ngoại.
* **10. Khẩu phần & Tần suất ăn:** Hút một giọt máu cóc tươi, 7 ngày một bữa.
* **11. Giá thị trường:** Độc cổ hoang dã.
* **12. Mô tả triết lý:** Kim độc giấu trong tay áo, một kích lấy mạng kẻ sơ hở.

---

### <a id="gu_r1_41-quả-phụ-chu"></a>41. Quả Phụ Chu (寡妇蛛) `[Dòng 11204]` (`GU_R1_41`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 11204]`

* **1. Tên gọi:** Quả Phụ Chu (寡妇蛛) `[Dòng 11204]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Nhện độc màu đen tuyền mang hoa văn hình đồng hồ cát đỏ trên bụng
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh dưới nách hoặc vạt áo trong, giăng mạng nhện độc bảo vệ bản thân.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Nhện mang nọc độc cực mạnh phá hủy lục phủ ngũ tạng' [Dòng 11204] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.2 thành chân nguyên sơ giai (xanh biếc) phun ra mạng tơ dính đầy độc tố làm chậm kẻ thù.
* **8. Tác dụng phụ / Tệ đoan:** Khí độc tính âm hàn bám quanh thân, nếu thể chất cổ sư yếu ớt dễ sinh bệnh hàn phong.
* **9. Loại thức ăn:** Xác ruồi muỗi hoặc sâu bọ dã ngoại phơi khô.
* **10. Khẩu phần & Tần suất ăn:** Ăn 3 xác sâu bọ khô, 7 ngày một bữa.
* **11. Giá thị trường:** Độc cổ hoang dã.
* **12. Mô tả triết lý:** Kiên nhẫn dệt lưới đợi mồi; kẻ vội vã ắt sẽ tự sa vào cạm bẫy.

---

### <a id="gu_r1_42-du-tự-cổ"></a>42. Du Tự Cổ (游字蛊) `[Dòng 20307, 20319]` (`GU_R1_42`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 20307, 20319]`

* **1. Tên gọi:** Du Tự Cổ (游字蛊) `[Dòng 20307, 20319]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng dạng mực nước đen nhánh uốn lượn như chữ viết sống động
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trôi nổi trong không khiếu, hóa thành các nét chữ phát quang lơ lửng trong tâm trí.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Làm cho các chữ viết trên bảng chiến công tự do bơi lội như sinh linh, tự động sắp xếp lại thứ hạng và cập nhật điểm số theo thời gian thực' [Dòng 20307, 20319] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.3 thành chân nguyên sơ giai (xanh biếc) mỗi lần mã hóa hoặc truyền dẫn mật thư bí mật.
* **8. Tác dụng phụ / Tệ đoan:** Không có khả năng chiến đấu; thông tin mã hóa nếu gặp Cổ trí đạo cấp cao có thể bị giải mã.
* **9. Loại thức ăn:** Mực tàu thượng hạng hoặc giấy dó phơi sương.
* **10. Khẩu phần & Tần suất ăn:** Hút vài giọt mực tàu đen, 10 ngày một lần.
* **11. Giá thị trường:** Do thương hội Cổ gia mang đến bán hoặc hỗ trợ trang bị cho Bảng chiến công ba trại Thanh Mao sơn trong đợt thú triều.
* **12. Mô tả triết lý:** Chữ nghĩa truyền tải tâm tư, mật ngữ giấu kín cơ mưu giữa chốn hiểm nguy.

---

### <a id="gu_r1_43-túi-cơm-thảo-cổ"></a>43. Túi Cơm Thảo Cổ (饭袋草蛊) `[Dòng 2172, 2174, 9009]` (`GU_R1_43`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 2172, 2174, 9009]`

* **1. Tên gọi:** Túi Cơm Thảo Cổ (饭袋草蛊) `[Dòng 2172, 2174, 9009]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Thảo cổ tự nhiên dạng thân dây leo và cuống hoa [Dòng 2174]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh đeo ở thắt lưng như một chiếc túi cỏ nhỏ màu xanh thẫm mộc mạc.
* **6. Công năng cụ thể:** Chỉ cần quán chú chân nguyên là sinh trưởng, trong thảo túi kết ra các hạt cơm dẻo thơm ngào ngạt nuôi sống cổ sư dài ngày nơi hoang dã [Dòng 2174, 2176]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) kích thích túi cỏ sản sinh một bữa cơm nóng đủ no một người.
* **8. Tác dụng phụ / Tệ đoan:** Cơm thảo chỉ có vị nhạt như gạo lức, ăn nhiều gây ngán nhưng đảm bảo đủ năng lượng sinh tồn.
* **9. Loại thức ăn:** Là thảo cổ tự nhiên, chỉ cần tưới chân nguyên để duy trì và kết quả [Dòng 2176]
* **10. Khẩu phần & Tần suất ăn:** Tự quang hợp và hút nước đất
* **11. Giá thị trường:** Tiết kiệm chi phí ăn uống.
* **12. Mô tả triết lý:** Thực túc binh cường; có cơm ăn trong lúc khốn cùng là phúc lớn của kẻ lưu lạc.

---

### <a id="gu_r1_44-túi-rượu-hoa-cổ"></a>44. Túi Rượu Hoa Cổ (酒袋花蛊) `[Dòng 2172, 2174, 2358, 9009]` (`GU_R1_44`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 2172, 2174, 2358, 9009]`

* **1. Tên gọi:** Túi Rượu Hoa Cổ (酒袋花蛊) `[Dòng 2172, 2174, 2358, 9009]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Thảo cổ dạng hoa dây leo tự nhiên [Dòng 2174]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh đeo ở hông như một bông hoa hình bầu rượu nhỏ nhắn xinh xắn.
* **6. Công năng cụ thể:** Quán chú chân nguyên để hoa sinh trưởng; khi trưởng thành, hoa tâm tiết ra mật hoa rượu thơm ngon dùng giải khát hoặc nuôi Tửu Trùng [Dòng 2174, 2176]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (xanh biếc) ủ ra một bầu rượu hoa thơm nồng nàn.
* **8. Tác dụng phụ / Tệ đoan:** Uống rượu hoa liên tục dễ gây say mèm, mất đi sự tỉnh táo cảnh giác dã ngoại.
* **9. Loại thức ăn:** Là thảo cổ tự nhiên, chỉ cần tưới chân nguyên để duy trì và tiết mật [Dòng 2176]
* **10. Khẩu phần & Tần suất ăn:** Hút nước suối và ánh sáng
* **11. Giá thị trường:** Tiện ích đời sống.
* **12. Mô tả triết lý:** Một bầu rượu nhạt giải tỏa ngàn nỗi sầu, vừa làm ấm lòng người vừa nuôi dưỡng Cổ trùng.

---

### <a id="gu_r1_45-ôn-ti-chu"></a>45. Ôn Ti Chu (温丝蛛) `[Dòng 12281]` (`GU_R1_45`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 12281]`

* **1. Tên gọi:** Ôn Ti Chu (温丝蛛) `[Dòng 12281]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Nhện nhả tơ màu trắng ngà, thân ấm áp
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh bám trong lớp áo ấm lót ngực, dệt tơ giữ nhiệt sưởi ấm toàn thân.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Nhả tơ tằm giữ nhiệt ấm áp, dệt thành áo chống rét mùa đông' [Dòng 12281] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.5 thành chân nguyên sơ giai (xanh biếc) duy trì hơi ấm khắp cơ thể trong 2 canh giờ giữa trời đông giá rét.
* **8. Tác dụng phụ / Tệ đoan:** Nếu vào mùa hè oi bức mà kích hoạt sẽ khiến cơ thể đổ mồ hôi đầm đìa và mất nước.
* **9. Loại thức ăn:** Lá dâu tằm `[Dòng 12281]`.
* **10. Khẩu phần & Tần suất ăn:** Ăn lá dâu tằm tươi định kỳ
* **11. Giá thị trường:** 40 – 50 nguyên thạch.
* **12. Mô tả triết lý:** Hơi ấm giữa trời đông băng tuyết là ân huệ cứu sinh cho kẻ độc hành.

---

### <a id="gu_r1_46-thủy-tinh-biêu-cổ"></a>46. Thủy Tinh Biêu Cổ (水晶瓢虫) `[Dòng 6186]` (`GU_R1_46`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 6186]`

* **1. Tên gọi:** Thủy Tinh Biêu Cổ (水晶瓢虫) `[Dòng 6186]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Bọ rùa thủy tinh cực đại, cả vật thể trong suốt như pha lê, bụng rỗng tròn vo chứa được rượu dịch, leo bám đầu hướng xuống đuôi hướng lên [Dòng 6184, 6188]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh bám trên ngực áo như một chiếc huy hiệu bọ rùa thủy tinh lấp lánh.
* **6. Công năng cụ thể:** Chuyên dùng để chuyên chở và bảo quản các loại chất lỏng, rượu quý hoặc độc dược không bị bay hơi hay biến chất [Dòng 6186]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.5 thành chân nguyên sơ giai (xanh biếc) chiếu ra ánh sáng khúc xạ làm chói mắt đối phương cự ly gần.
* **8. Tác dụng phụ / Tệ đoan:** Vỏ thủy tinh giòn, trúng đòn va đập trực diện dễ nứt vỡ.
* **9. Loại thức ăn:** Giọt sương sớm đọng trên lá cỏ thơm dã ngoại.
* **10. Khẩu phần & Tần suất ăn:** Uống 3 giọt sương mai tinh khiết, 7 ngày một lần.
* **11. Giá thị trường:** Dụng cụ bảo quản cao cấp.
* **12. Mô tả triết lý:** Trong suốt không tì vết, phản chiếu chân tướng vạn vật mà lòng không dao động.

---

### <a id="gu_r1_47-thiên-chân-cái-nấm"></a>47. Thiên Chân Cái Nấm (天真蘑菇) `[Dòng 6170]` (`GU_R1_47`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 6170]`

* **1. Tên gọi:** Thiên Chân Cái Nấm (天真蘑菇) `[Dòng 6170]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cây nấm đủ mọi màu sắc sặc sỡ, mượt mà tròn trĩnh, có cái lớn như mặt bàn, có cái nhỏ như ghế đẩu, mặt ngoài mềm mại hơi lõm xuống như sofa [Dòng 6168, 6172]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trồng trong chậu đất nhỏ mang theo hoặc cất trong túi tre ẩm, không bám lên da thịt.
* **6. Công năng cụ thể:** Hấp thu bụi bặm và trọc khí ô uế, lọc sạch tịnh hóa không khí trong lều trại thương đội, là thảo cổ đời sống [Dòng 6170]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.5 thành chân nguyên sơ giai (xanh biếc) tưới tắm nuôi nấm lớn nhanh sản sinh chất dinh dưỡng.
* **8. Tác dụng phụ / Tệ đoan:** Nếu ăn sống chưa qua chế biến có thể gây ảo giác nhẹ hoặc cười vô cớ trong thời gian ngắn.
* **9. Loại thức ăn:** Bụi bặm và trọc khí `[Dòng 6170]`.
* **10. Khẩu phần & Tần suất ăn:** Hút bụi bặm và trọc khí ô uế trong không khí
* **11. Giá thị trường:** Cổ đời sống thương đội.
* **12. Mô tả triết lý:** Chớ coi thường cây nấm bé nhỏ mọc bờ rào; vị thuốc cứu đói chính là đây.

---

### <a id="gu_r1_48-tri-tâm-thảo"></a>48. Tri Tâm Thảo (知心草) `[Dòng 5593, 5599, 5601]` (`GU_R1_48`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 5593, 5599, 5601]`

* **1. Tên gọi:** Tri Tâm Thảo (知心草) `[Dòng 5593, 5599, 5601]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cọng cỏ thơm màu xanh lục biếc mọc tự nhiên [Dòng 5593, 5601]
* **5. Thay đổi ngoại hình khi ký túc:** Trồng trong vườn thảo dược hoặc cất trong hộp ngọc, lá mềm mại như hình trái tim.
* **6. Công năng cụ thể:** Phụ trợ thực liệu cho Cổ trùng: trộn cùng thức ăn giúp Cổ trùng hấp thu tốt hơn, giảm một nửa lượng thức ăn tiêu hao (ví dụ Nguyệt Quang Cổ từ 2 cánh hoa Nguyệt Lan giảm còn 1 cánh hoa) [Dòng 5599, 5601]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.3 thành chân nguyên sơ giai (xanh biếc) giữ cho cọng cỏ tươi tốt khi nghiền trộn vào thức ăn của Cổ trùng.
* **8. Tác dụng phụ / Tệ đoan:** Chỉ là thảo dược hỗ trợ giảm khẩu phần ăn của Cổ khác, không có năng lực tấn công hay phòng thủ.
* **9. Loại thức ăn:** Thảo mộc tự nhiên.
* **10. Khẩu phần & Tần suất ăn:** Hút nước bùn hữu cơ màu mỡ, 10 ngày một lần.
* **11. Giá thị trường:** 2 nguyên thạch / 1 cân tại chợ phiên thương đội (rẻ hơn nhiều so với mua hoa nguyệt lan 10 cánh / 1 NT) [Dòng 5603]
* **12. Mô tả triết lý:** Hiểu được lòng cổ trùng, tiết kiệm từng cánh hoa cọng cỏ để đi đường dài.

---

### <a id="gu_r1_49-thối-thí-phì-trùng"></a>49. Thối Thí Phì Trùng (臭屁肥虫) `[Dòng 6264, 8248, 13338]` (`GU_R1_49`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 6264, 8248, 13338]`

* **1. Tên gọi:** Thối Thí Phì Trùng (臭屁肥虫) `[Dòng 6264, 8248, 13338]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Mạt phẩm
* **4. Hình thái:** Thân sâu béo tròn đen nhánh giống hệt Hắc Thỉ Cổ nhưng ruột rỗng mềm nhũn [Dòng 6264]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong không khiếu, khi dùng lôi ra ngoài bóp mạnh hoặc thúc giục phun khí.
* **6. Công năng cụ thể:** Khi thúc giục chỉ biết xì ra một luồng khói rắm thối mù mịt gây sặc sụa để bỏ trốn, không hề tăng lực cơ bắp [Dòng 6264]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.5 thành chân nguyên sơ giai (xanh biếc) kích thích xì ra một luồng khí thối nồng nặc làm ngạt thở đối phương.
* **8. Tác dụng phụ / Tệ đoan:** Khí rắm xì ra bốc mùi hôi thối nồng nặc sặc sụa cho cả kẻ địch lẫn người xung quanh; không có khả năng chiến đấu trực diện
* **9. Loại thức ăn:** Rác rưởi hữu cơ ôi thiu hoặc phân bón hữu cơ hoai mục.
* **10. Khẩu phần & Tần suất ăn:** Gặm một mẩu thức ăn thừa thối rữa, 7 ngày một bữa.
* **11. Giá thị trường:** Cổ mạt phẩm rẻ tiền, giá trị thực tế dưới 10 nguyên thạch (Cổ Kim Sinh dùng để lừa đảo bán giá 250 NT) [Dòng 6264, 6274]
* **12. Mô tả triết lý:** Mùi xú uế tuy hạ lưu bỉ ổi nhưng là kế thoát thân tuyệt diệu trước bầy dã thú hung hãn.

---

### <a id="gu_r1_50-đâu-lung-thảo"></a>50. Đâu Lung Thảo (兜笼草) `[Dòng 26489]` (`GU_R1_50`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 26489]`

* **1. Tên gọi:** Đâu Lung Thảo (兜笼草) `[Dòng 26489]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Thảo cổ dạng lồng túi nhỏ cắm rễ vào không khiếu cổ sư, dùng để lưu trữ nguyên thạch và thực phẩm với dung tích nhỏ
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh đeo bên hông như một chiếc lồng cỏ nhỏ đan lưới mềm mộc mạc.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Thảo cổ dạng lồng túi nhỏ cắm rễ vào không khiếu cổ sư, dùng lưu trữ nguyên thạch và thực phẩm dung tích nhỏ; tiền thân của Đâu Suất Hoa' [Dòng 26489] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.5 thành chân nguyên sơ giai (xanh biếc) mở rộng miệng túi thảo mộc để thu giữ hoặc lấy ra vật phẩm nhỏ.
* **8. Tác dụng phụ / Tệ đoan:** Không gian chứa đồ chật hẹp, không thể cất giữ vật sắc nhọn dễ làm rách túi cỏ.
* **9. Loại thức ăn:** Hấp thu dưỡng chất vi lượng từ không khiếu cổ sư.
* **10. Khẩu phần & Tần suất ăn:** Hấp thu dưỡng chất vi lượng từ vách không khiếu cổ sư định kỳ
* **11. Giá thị trường:** Lưu giữ trong kho vật phẩm hậu cần gia tộc Cổ Nguyệt.
* **12. Mô tả triết lý:** Có chỗ chứa đồ phòng thân là bước đầu tiên để tích lũy tài nguyên tu hành.

---

### <a id="gu_r1_51-tín-hiệu-cổ"></a>51. Tín Hiệu Cổ (信号蛊) `[Dòng 21433, 21435, 21793]` (`GU_R1_51`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 21433, 21435, 21793]`

* **1. Tên gọi:** Tín Hiệu Cổ (信号蛊) `[Dòng 21433, 21435, 21793]`
* **2. Phẩm cấp:** Nhất Chuyển (Rank 1)
* **3. Độ quý hiếm:** Phổ thông / Tiêu hao phẩm
* **4. Hình thái:** Hình dạng như viên cầu nhỏ màu vàng có một đôi cánh sắc màu sặc sỡ
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong ống tay áo hoặc bàn tay, khi búng tay bay vút lên bầu trời.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Khi kích hoạt chấn sí bay vút lên trời cao rồi nổ tung thành quầng lửa khói rực rỡ chói lọi phạm vi trăm dặm đều thấy rõ để phát tín hiệu cầu viện khẩn cấp' [Dòng 21433, 21435] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.5 thành chân nguyên sơ giai (xanh biếc) cho một phát bắn pháo hiệu lên không trung.
* **8. Tác dụng phụ / Tệ đoan:** Bắn lên trời tạo vệt khói và tiếng nổ lớn, báo tin cho đồng đội nhưng cũng đồng thời làm lộ vị trí cho toàn bộ kẻ thù xung quanh.
* **9. Loại thức ăn:** Cổ tiêu hao một lần, không yêu cầu nuôi dưỡng lâu dài.
* **10. Khẩu phần & Tần suất ăn:** Cổ tiêu hao dùng một lần nổ tung hoặc biến mất, không yêu cầu nuôi dưỡng
* **11. Giá thị trường:** Cổ sư các gia tộc (như Hùng Lâm, trinh sát cổ sư) trang bị rộng rãi để phối hợp tác chiến trong lang triều.
* **12. Mô tả triết lý:** Tín hiệu bay cao giữa bầu trời mây mù, gọi tìm đồng đội giữa ranh giới sinh tử.

---

### <a id="gu_r2_01-nguyệt-mang-cổ"></a>52. Nguyệt Mang Cổ (月芒蛊) `[Dòng 14924, 14926, 16312, 16477]` (`GU_R2_01`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 14924, 14926, 16312, 16477]`

* **1. Tên gọi:** Nguyệt Mang Cổ (月芒蛊) `[Dòng 14924, 14926, 16312, 16477]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Hình vầng trăng khuyết màu xanh lam ngọc sắc bén, dài và thon hơn Nguyệt Quang Cổ
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong lòng bàn tay, ấn ký trăng khuyết màu xanh lam ngọc sắc bén và sáng rực rỡ hơn
* **6. Công năng cụ thể:** Tiêu hao 1 thành Xích Thiết chân nguyên sơ giai mỗi lần bắn. Nguyệt nhận dài đến 1m màu xanh lam ngọc rực rỡ, tầm bắn xa 15 – 20m, lực sát thương sắc bén cắt đá xẻ thịt [Dòng 14924, 16312].
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) / phát đao trăng tầm xa 20m.
* **8. Tác dụng phụ / Tệ đoan:** Bắn liên tục ở cự ly xa dễ làm căng tức kinh mạch cánh tay; tiêu hao chân nguyên gấp bội so với Nguyệt Quang Cổ.
* **9. Loại thức ăn:** Cánh hoa Nguyệt Lan Thảo (khẩu phần nhiều hơn Nguyệt Quang Cổ) `[Dòng 16318]`.
* **10. Khẩu phần & Tần suất ăn:** Ăn cánh hoa Nguyệt Lan Thảo, khẩu phần nhiều hơn Nguyệt Quang Cổ định kỳ
* **11. Giá thị trường:** 700 – 800 nguyên thạch (vũ khí tiêu chuẩn của Cổ sư Nhị chuyển Cổ Nguyệt).
* **12. Mô tả triết lý:** Đao trăng dài thêm một tấc, hiểm nguy lùi xa một trượng; tấn công sắc bén là đòn phòng ngự tối ưu.

---

### <a id="gu_r2_02-nguyệt-toàn-cổ"></a>53. Nguyệt Toàn Cổ (月旋蛊) `[Dòng 15978, 16326, 22903, 25727]` (`GU_R2_02`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 15978, 16326, 22903, 25727]`

* **1. Tên gọi:** Nguyệt Toàn Cổ (月旋蛊) `[Dòng 15978, 16326, 22903, 25727]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Hình trăng khuyết uốn cong hình cung tròn có vân gió xoáy
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong lòng bàn tay, ấn ký trăng khuyết có vân xoáy tròn mờ ảo
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Bắn ra nguyệt nhận xoay tròn uốn lượn hình vòng cung, có thể vòng qua khiên chắn hoặc chướng ngại vật đánh tập kích vào sườn lưng đối thủ' [Dòng 15978] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) / phát đao trăng xoay vòng đổi hướng.
* **8. Tác dụng phụ / Tệ đoan:** Nguyệt nhận lượn vòng cung đòi hỏi định lực điều khiển cao; nếu mất tập trung dễ chém trượt hoặc cắt vào vật cản bên sườn.
* **9. Loại thức ăn:** Cánh hoa Nguyệt Lan Thảo và gió xoáy `[Dòng 25727]`.
* **10. Khẩu phần & Tần suất ăn:** Ăn 4 cánh hoa Nguyệt Lan Thảo tươi, 7 ngày cho ăn 1 lần.
* **11. Giá thị trường:** 600 – 700 nguyên thạch.
* **12. Mô tả triết lý:** Đường thẳng dễ đoán, đường vòng khó lường; né tránh chướng ngại để đoạt mạng đối phương.

---

### <a id="gu_r2_03-nguyệt-ngân-cổ"></a>54. Nguyệt Ngân Cổ (月痕蛊 / 月银蛊) `[Dòng 16324, 25707, 25711]` (`GU_R2_03`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 16324, 25707, 25711]`

* **1. Tên gọi:** Nguyệt Ngân Cổ (月痕蛊 / 月银蛊) `[Dòng 16324, 25707, 25711]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Hình vầng trăng khuyết ánh bạc lấp lánh bén ngót
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong lòng bàn tay, ấn ký trăng khuyết ánh bạc sáng loáng
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Bắn ra nguyệt nhận ánh bạc sắc lẹm, khả năng xuyên thấu giáp trụ vượt trội hơn hẳn Nguyệt Mang Cổ' [Dòng 16324, 25707] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) / phát đao trăng ánh bạc bén ngót.
* **8. Tác dụng phụ / Tệ đoan:** Nguyệt nhận ánh bạc quá sắc bén, nếu va đập vào hộ giáp kim loại nặng sẽ tán vỡ thành mảnh vụn dễ văng ngược.
* **9. Loại thức ăn:** Quặng bạc vụn và cánh hoa Nguyệt Lan `[Dòng 25711]`.
* **10. Khẩu phần & Tần suất ăn:** Quặng bạc vụn và cánh hoa Nguyệt Lan Thảo định kỳ
* **11. Giá thị trường:** 800 nguyên thạch.
* **12. Mô tả triết lý:** Ánh trăng hóa bạc, sắc lẹm cắt đứt mọi giả dối phàm trần.

---

### <a id="gu_r2_04-nguyệt-nghê-thường"></a>55. Nguyệt Nghê Thường (月霓裳) `[Dòng 14956, 15930, 15938, 16328]` (`GU_R2_04`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 14956, 15930, 15938, 16328]`

* **1. Tên gọi:** Nguyệt Nghê Thường (月霓裳) `[Dòng 14956, 15930, 15938, 16328]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng dệt ánh sáng hình dải lụa mỏng ánh trăng
* **5. Thay đổi ngoại hình khi ký túc:** Khi kích hoạt, dệt thành một lớp xiêm y ánh trăng rực rỡ bao phủ toàn thân cổ sư
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Dệt ánh trăng thành một lớp xiêm y rực rỡ che chở toàn thân cổ sư trước đòn đánh nguyên tố' [Dòng 14956, 15938] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 2 thành chân nguyên sơ giai (thiển hồng) kích hoạt áo trăng phòng hộ; duy trì tiêu hao 0.8 thành thiển hồng mỗi 10 hơi thở.
* **8. Tác dụng phụ / Tệ đoan:** Áo trăng phát sáng rực rỡ trong đêm tối, hoàn toàn không thể dùng cho tác chiến ám sát hay phục kích.
* **9. Loại thức ăn:** Cánh hoa Nguyệt Lan Thảo ướp sương đêm cùng một sợi tơ tằm trắng.
* **10. Khẩu phần & Tần suất ăn:** Ăn 3 cánh hoa ướp sương cùng vài sợi tơ tằm, 7 ngày một bữa.
* **11. Giá thị trường:** Cổ hiếm nhánh phòng ngự Quang đạo.
* **12. Mô tả triết lý:** Xiêm y ánh trăng che chở thân ngọc, mỹ miều lộng lẫy mà uy nghiêm bất khả xâm phạm.

---

### <a id="gu_r2_05-chiếu-ảnh-cổ"></a>56. Chiếu Ảnh Cổ (照影蛊) `[Dòng 25669, 25673, 25687]` (`GU_R2_05`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 25669, 25673, 25687]`

* **1. Tên gọi:** Chiếu Ảnh Cổ (照影蛊) `[Dòng 25669, 25673, 25687]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng dạng phiến đá phẳng phát quang lưu giữ hình ảnh tĩnh
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong không khiếu, khi kích hoạt chiếu bóng ảo ảnh của cổ sư lên mặt đất hoặc tường đá.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Ghi lại hình ảnh tĩnh và lưu trữ phối phương hợp luyện trong các sắc màu ánh sáng khác nhau' [Dòng 25669, 25673] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) tạo ra một bóng mờ đánh lừa thị giác kẻ địch trong 10 nhịp thở.
* **8. Tác dụng phụ / Tệ đoan:** Bóng ảo chỉ có hình mà không có thực thể hay khí tức, cổ sư trinh sát có Cổ thính giác hoặc khứu giác nhạy bén sẽ phát hiện ngay.
* **9. Loại thức ăn:** Hút ánh sáng `[Dòng 25673]`.
* **10. Khẩu phần & Tần suất ăn:** Hút ánh sáng tự nhiên
* **11. Giá thị trường:** Cổ văn khố gia tộc.
* **12. Mô tả triết lý:** Thực thực hư hư, bóng ma che mắt kẻ mù quáng; mượn ảo ảnh đoạt sinh cơ.

---

### <a id="gu_r2_06-bạch-ngọc-cổ"></a>57. Bạch Ngọc Cổ (白玉蛊) `[Dòng 9470, 11772, 14924, 15264, 15312]` (`GU_R2_06`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 9470, 11772, 14924, 15264, 15312]`

* **1. Tên gọi:** Bạch Ngọc Cổ (白玉蛊) `[Dòng 9470, 11772, 14924, 15264, 15312]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Cực phẩm phòng ngự Nhị chuyển
* **4. Hình thái:** Cổ trùng hình bọ cánh cứng nhỏ màu trắng muốt tinh khiết như ngọc thạch mỡ cừu [Dòng 9470, 15264]
* **5. Thay đổi ngoại hình khi ký túc:** Bao phủ toàn thân một lớp quang mang bạch ngọc sáng loáng, da thịt cứng cáp tuyệt đối cản được nanh vuốt Cuồng Điện Lang và đao kiếm [Dòng 15264, 15312]
* **6. Công năng cụ thể:** Tiêu hao Xích Thiết chân nguyên bao phủ toàn thân một lớp quang mang bạch ngọc sáng loáng, cứng cáp tuyệt đối. Kháng chém, kháng đấm, cản được cả nanh vuốt của Cuồng Điện Lang và nguyệt nhận Nhị chuyển mà tiêu hao cực ít chân nguyên `[Dòng 15264, 15312]`. Phòng ngự vượt trội toàn bộ các Bì Cổ Nhất chuyển.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) duy trì toàn thân hóa bạch ngọc cứng cáp trong 10 nhịp thở [Dòng 15312].
* **8. Tác dụng phụ / Tệ đoan:** Tiêu hao chân nguyên liên tục khi duy trì ngọc bọc; nếu cạn kiệt chân nguyên đột ngột lớp ngọc sẽ vỡ tan để lộ da thịt trần trụi.
* **9. Loại thức ăn:** Bạch ngọc vụn (Ngọc trắng hảo hạng) `[Dòng 15268]`.
* **10. Khẩu phần & Tần suất ăn:** Bạch ngọc vụn (ngọc trắng hảo hạng) định kỳ
* **11. Giá thị trường:** 1.000 – 1.500 nguyên thạch.
* **12. Mô tả triết lý:** Phòng ngự toàn diện thanh khiết như ngọc mà không làm trĩu nặng thể xác hay cản trở tốc độ, biểu hiện đỉnh cao của sự hài hòa thân thể và pháp tắc [Dòng 15264]

---

### <a id="gu_r2_07-bàn-thạch-cổ"></a>58. Bàn Thạch Cổ (磐石蛊) `[Dòng 16634, 16764, 21459, 21463]` (`GU_R2_07`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 16634, 16764, 21459, 21463]`

* **1. Tên gọi:** Bàn Thạch Cổ (磐石蛊) `[Dòng 16634, 16764, 21459, 21463]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng dạng phiến đá hoa cương dày cộm kiên cố
* **5. Thay đổi ngoại hình khi ký túc:** Bao phủ toàn thân một lớp giáp đá dày cộm kiên cố như bàn thạch hoa cương
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Bao phủ cơ thể một lớp giáp đá kiên cố như bàn thạch, một người có thể đứng vững chặn đứng hàng chục con Điện Lang tấn công cắn xé' [Dòng 21459] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) hóa thân thể vững chắc như bàn thạch chống đỡ đòn đánh hạng nặng.
* **8. Tác dụng phụ / Tệ đoan:** Giảm mạnh tốc độ di chuyển và độ nhanh nhẹn khi đang kích hoạt giáp đá bàn thạch.
* **9. Loại thức ăn:** Đá hoa cương / Quặng đá cứng `[Dòng 21465]`.
* **10. Khẩu phần & Tần suất ăn:** Đá hoa cương / Quặng đá cứng định kỳ
* **11. Giá thị trường:** Đổi được 3.900 chiến công trên bảng chiến công `[Dòng 21463]`.
* **12. Mô tả triết lý:** Kiên định như tảng đá ngàn năm, mặc cho cuồng phong bão táp gầm gào.

---

### <a id="gu_r2_08-hắc-tông-cổ"></a>59. Hắc Tông Cổ (黑鬃蛊) `[Dòng 6635, 6637, 9468]` (`GU_R2_08`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 6635, 6637, 9468]`

* **1. Tên gọi:** Hắc Tông Cổ (黑鬃蛊) `[Dòng 6635, 6637, 9468]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng dạng búi lông cứng đen tuyền như gai nhím
* **5. Thay đổi ngoại hình khi ký túc:** Kích thích toàn bộ lông gáy trên thân thể cổ sư mọc dài, đen tuyền và cứng đờ như gai nhọn
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Kích thích toàn bộ lông gáy trên thân thể cổ sư mọc dài, đen tuyền và cứng đờ như gai nhọn, tạo thành lớp áo giáp gai cản đòn chém chém' [Dòng 6635, 6637] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) kích thích lớp lông bờm heo đen mọc dài đan kết thành giáp lông dẻo dai.
* **8. Tác dụng phụ / Tệ đoan:** Thân thể mọc đầy lông đen cứng như gai nhọn, giảm độ thẩm mỹ và cảm giác nóng bức khi giao chiến dưới trời nắng.
* **9. Loại thức ăn:** Thịt heo rừng đen dã ngoại thái mỏng tươi sống.
* **10. Khẩu phần & Tần suất ăn:** Ăn một miếng thịt heo đen tươi, 5 ngày một bữa.
* **11. Giá thị trường:** 400 – 500 nguyên thạch.
* **12. Mô tả triết lý:** Lông bờm dựng đứng trước hiểm nguy, hoang dã mãnh liệt của loài lợn rừng nghênh chiến bầy sói.

---

### <a id="gu_r2_09-sinh-thiết-cổ"></a>60. Sinh Thiết Cổ (生铁蛊) `[Dòng 29533, 29535, 29561]` (`GU_R2_09`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 29533, 29535, 29561]`

* **1. Tên gọi:** Sinh Thiết Cổ (生铁蛊) `[Dòng 29533, 29535, 29561]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng dạng thỏi sắt đen ánh kim loại
* **5. Thay đổi ngoại hình khi ký túc:** Hóa sắt lớp da đỡ đòn hoặc biến chân nguyên thành kim loại sắt cứng trên cơ thể
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Biến chân nguyên thành kim loại sắt cứng, dùng rèn vũ khí tức thì hoặc hóa sắt lớp da đỡ đòn' [Dòng 29533, 29535] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) kích hoạt giáp sắt sống chống đỡ đòn chém.
* **8. Tác dụng phụ / Tệ đoan:** Tăng tải trọng cơ thể đáng kể, nếu chiến đấu trên đầm lầy hoặc mặt nước rất dễ bị lún chìm.
* **9. Loại thức ăn:** Quặng sắt `[Dòng 29571]`.
* **10. Khẩu phần & Tần suất ăn:** Quặng sắt vụn định kỳ
* **11. Giá thị trường:** Vật phẩm Kim đạo.
* **12. Mô tả triết lý:** Sắt sống đúc thân, va đập thành gang thép; bản lĩnh tôi luyện từ đau đớn.

---

### <a id="gu_r2_10-hùng-lực-cổ"></a>61. Hùng Lực Cổ (熊力蛊) `[Dòng 3170, 9659, 19523, 25861]` (`GU_R2_10`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 3170, 9659, 19523, 25861]`

* **1. Tên gọi:** Hùng Lực Cổ (熊力蛊) `[Dòng 3170, 9659, 19523, 25861]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Trấn tộc / Gia truyền độc quyền
* **4. Hình thái:** Sâu béo hình con gấu đen thu nhỏ, toàn thân cơ bắp cuồn cuộn
* **5. Thay đổi ngoại hình khi ký túc:** Cải tạo gân cốt bắp thịt bên trong cơ thể (tăng cơ bắp nhưng không làm biến dạng quái dị)
* **6. Công năng cụ thể:** Cải tạo gân cốt bắp thịt Cổ sư, tăng vĩnh viễn sức mạnh của 1 con gấu ngựa (1 hùng lực) `[Dòng 19523, 25861]`. Không tốn chân nguyên duy trì sau khi đã luyện thành công.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) mỗi lần cải tạo xương tủy; tăng vĩnh viễn 1 hùng lực không tốn chân nguyên duy trì [Dòng 19523].
* **8. Tác dụng phụ / Tệ đoan:** Cải tạo gân cốt gây đau buốt xương tủy và làm tính khí cổ sư trở nên nóng nảy, hung hãn như loài gấu dữ trong thời gian luyện lực.
* **9. Loại thức ăn:** Mật ong rừng tươi nguyên chất (Hùng gia trại thu mua lượng mật ong khổng lồ để nuôi cổ này) `[Dòng 9659]`.
* **10. Khẩu phần & Tần suất ăn:** Ăn mật ong rừng nguyên chất định kỳ
* **11. Giá thị trường:** 600 – 800 nguyên thạch (hàng trấn tộc).
* **12. Mô tả triết lý:** Đại diện cho triết lý Lực đạo tối thượng: Thực lực tự thân ngấm vào gân cốt là vĩnh hằng, không hao tổn chân nguyên, bất biến dù cổ có chết đi, phản ánh giá trị cốt lõi của việc rèn luyện bản thân thay vì ỷ lại hoàn toàn vào ngoại vật.

---

### <a id="gu_r2_11-ngự-hùng-cổ"></a>62. Ngự Hùng Cổ (驭熊蛊) `[Dòng 23907, 23911, 24033, 24919]` (`GU_R2_11`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 23907, 23911, 24033, 24919]`

* **1. Tên gọi:** Ngự Hùng Cổ (驭熊蛊) `[Dòng 23907, 23911, 24033, 24919]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng dạng ấn ký hình đầu gấu đen
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong lòng bàn tay hoặc giữa trán, bắn ra một luồng linh quang khuất phục gấu hoang.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Nô dịch và khống chế hoàn toàn 1 con gấu đen hoang dã làm thú cưỡi và trợ thủ chiến đấu' [Dòng 23907, 23911] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 2 thành chân nguyên sơ giai (thiển hồng) để khắc ấn ký nô dịch lên một con gấu hoang dã.
* **8. Tác dụng phụ / Tệ đoan:** Chỉ khống chế được loài gấu bình thường hoang dã, không áp chế được Thú vương mang Cổ trùng
* **9. Loại thức ăn:** Thịt tươi hoặc mật gấu `[Dòng 24033]`.
* **10. Khẩu phần & Tần suất ăn:** Thịt tươi hoặc mật gấu định kỳ
* **11. Giá thị trường:** 600 – 700 nguyên thạch.
* **12. Mô tả triết lý:** Vạn thú quy phục trước ý chí kẻ mạnh; mượn vuốt gấu xé toạc kẻ thù.

---

### <a id="gu_r2_12-gấu-ngựa-bản-lực-cổ-/-hắc-hùng-bản-lực-cổ"></a>63. Gấu Ngựa Bản Lực Cổ / Hắc Hùng Bản Lực Cổ (黑熊本力蛊) `[Dòng 19303, 23131, 23139]` (`GU_R2_12`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 19303, 23131, 23139]`

* **1. Tên gọi:** Gấu Ngựa Bản Lực Cổ / Hắc Hùng Bản Lực Cổ (黑熊本力蛊) `[Dòng 19303, 23131, 23139]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Sâu béo hình con gấu đen thu nhỏ, toàn thân cơ bắp cuồn cuộn
* **5. Thay đổi ngoại hình khi ký túc:** Cải tạo gân cốt bắp thịt bên trong cơ thể (tăng cơ bắp nhưng không làm biến dạng quái dị)
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Tăng vĩnh viễn nhất hùng chi lực (sức một con gấu ngựa trưởng thành) vào gân cốt và cơ bắp cổ sư mà không cần tiêu hao chân nguyên trong lúc phát lực' [Dòng 19303, 23131] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) kích hoạt bộc phát toàn bộ sức mạnh nguyên bản của gấu ngựa.
* **8. Tác dụng phụ / Tệ đoan:** Đòi hỏi cổ sư phải có cơ sở thể chất chịu đựng tốt trước đó, nếu thể trạng ốm yếu mà vội luyện sức gấu ngựa sẽ bị rạn nứt xương khớp.
* **9. Loại thức ăn:** Mật ong dại nguyên chất `[Dòng 9659]`.
* **10. Khẩu phần & Tần suất ăn:** Ăn mật ong rừng nguyên chất định kỳ
* **11. Giá thị trường:** Hùng Lực (đệ nhất dũng sĩ Nhị chuyển Hùng gia trại) sở hữu; Phương Nguyên từng định thu hồi từ thi thể Hùng Lực nhưng bị Hùng Lâm mang đi.
* **12. Mô tả triết lý:** Đại diện cho triết lý Lực đạo tối thượng: Thực lực tự thân ngấm vào gân cốt là vĩnh hằng, không hao tổn chân nguyên, bất biến dù cổ có chết đi, phản ánh giá trị cốt lõi của việc rèn luyện bản thân thay vì ỷ lại hoàn toàn vào ngoại vật.

---

### <a id="gu_r2_13-cửu-diệp-sinh-cơ-thảo"></a>64. Cửu Diệp Sinh Cơ Thảo (九叶生机草) `[Dòng 15686, 15700, 16258, 16284]` (`GU_R2_13`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 15686, 15700, 16258, 16284]`

* **1. Tên gọi:** Cửu Diệp Sinh Cơ Thảo (九叶生机草) `[Dòng 15686, 15700, 16258, 16284]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Quý hiếm / Trân bảo Mộc đạo vô giá
* **4. Hình thái:** Thảo cổ dạng cây nhỏ cắm rễ trong không khiếu, xòe ra 9 chiếc lá ngọc bích xanh mướt lung linh [Dòng 15686, 15700]
* **5. Thay đổi ngoại hình khi ký túc:** Cắm rễ sinh trưởng trực tiếp trong không khiếu cổ sư, không làm biến đổi ngoại hình cơ thể bên ngoài [Dòng 15700]
* **6. Công năng cụ thể:** Mỗi lần bứt 1 chiếc lá tiêu hao chân nguyên hóa thành 1 Sinh Cơ Diệp (trị liệu Nhất chuyển cực tốt). Sau đó chân nguyên hải tự động ôn dưỡng để mọc lại đủ 9 lá [Dòng 15700, 15702]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) tưới tắm định kỳ; sản sinh ra các lá sinh cơ diệp cứu người.
* **8. Tác dụng phụ / Tệ đoan:** Cổ bản mệnh trân quý không thể dùng trực tiếp trong giao chiến; ngắt hết 9 lá cần thời gian dài bón nguyên thạch để hồi phục chồi non mới.
* **9. Loại thức ăn:** Hút chân nguyên của Cổ sư trực tiếp trong không khiếu, không cần thức ăn ngoài `[Dòng 15702]`.
* **10. Khẩu phần & Tần suất ăn:** Hút chân nguyên trực tiếp trong không khiếu cổ sư liên tục, không cần bất kỳ thức ăn ngoài nào [Dòng 15702]
* **11. Giá thị trường:** Vô giá. Giúp Phương Nguyên thu về hàng ngàn nguyên thạch và chiến công trong Lang Triều.
* **12. Mô tả triết lý:** Triết lý tư bản và tích lũy căn cơ: Cổ thảo mẫu tử sinh sôi không ngừng nghỉ, biến chân nguyên thành tài sản sống (Sinh Cơ Diệp), cội nguồn giàu có trường tồn [Dòng 15700, 16258]

---

### <a id="gu_r2_14-tứ-vị-tửu-trùng"></a>65. Tứ Vị Tửu Trùng (四味酒虫) `[Dòng 16115, 16479, 18854, 19201]` (`GU_R2_14`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 16115, 16479, 18854, 19201]`

* **1. Tên gọi:** Tứ Vị Tửu Trùng (四味酒虫) `[Dòng 16115, 16479, 18854, 19201]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Cực phẩm / Quý hiếm hy thế Nhị chuyển
* **4. Hình thái:** Sâu rượu béo tròn, trên thân biến ảo luân chuyển 4 tầng hào quang tương ứng bốn vị tân, điềm, toan, khổ [Dòng 16115, 18854]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trôi nổi bên trong khiếu hải chân nguyên Nhị chuyển, thân phát ra 4 loại hương rượu nồng nàn say đắm.
* **6. Công năng cụ thể:** Tinh luyện chân nguyên Xích Thiết lên 1 tiểu cảnh giới (Sơ giai thiển xích -> Trung giai phi hồng -> Cao giai thâm hồng -> Đỉnh phong ám hồng) [Dòng 16115, 23635].
* **7. Cách tiêu hao chân nguyên:** Hút chân nguyên Xích Thiết sơ giai (thiển hồng) tinh luyện thành chân nguyên Xích Thiết trung giai (phi hồng); tiêu hao chân nguyên thuần túy theo tỷ lệ chuyển hóa tự nhiên [Dòng 16115].
* **8. Tác dụng phụ / Tệ đoan:** Đòi hỏi phải nếm đủ 4 loại rượu ngon (chua, cay, ngọt, đắng) định kỳ; nếu thiếu rượu cổ trùng sẽ ngủ say và ngừng tinh luyện chân nguyên.
* **9. Loại thức ăn:** Uống luân phiên rượu mang 4 vị khác nhau: Cay (Tân), Ngọt (Điềm), Chua (Toan), Đắng (Khổ) `[Dòng 19201]`.
* **10. Khẩu phần & Tần suất ăn:** Uống luân phiên 4 loại rượu mang 4 vị khác nhau: Cay (Tân), Ngọt (Điềm), Chua (Toan), Đắng (Khổ) định kỳ [Dòng 19201]
* **11. Giá thị trường:** 1.500 – 2.000 nguyên thạch.
* **12. Mô tả triết lý:** Đại diện cho sự thăng hoa của men say và nghị lực: Nếm trải đủ tư vị cay đắng ngọt bùi của trần thế để phá vỡ gông cùm tư chất [Dòng 18854, 19201]

---

### <a id="gu_r2_15-xích-thiết-xá-lợi-cổ"></a>66. Xích Thiết Xá Lợi Cổ (赤铁舍利蛊) `[Dòng 17207, 17351, 17500, 18854]` (`GU_R2_15`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 17207, 17351, 17500, 18854]`

* **1. Tên gọi:** Xích Thiết Xá Lợi Cổ (赤铁舍利蛊) `[Dòng 17207, 17351, 17500, 18854]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Quý hiếm / Cực phẩm đấu giá
* **4. Hình thái:** Dạng viên xá lợi tròn như ngón tay, phát ra ánh sáng đỏ rực của sắt nung xích thiết [Dòng 17207]
* **5. Thay đổi ngoại hình khi ký túc:** Cổ tiêu hao một lần: tan chảy thẳng vào khiếu hải Xích Thiết nâng 1 tiểu cảnh giới, không ký sinh lâu dài.
* **6. Công năng cụ thể:** Nuốt vào giúp Cổ sư Nhị chuyển lập tức tăng vọt 1 tiểu cảnh giới tu vi (sơ giai lên trung giai, hoặc trung giai lên cao giai...) mà không hề để lại bất kỳ di chứng nào `[Dòng 17207]`. Dùng 1 lần là biến mất.
* **7. Cách tiêu hao chân nguyên:** Cổ tiêu hao một lần: nuốt trực tiếp vào bụng, tự động hòa tan giúp cổ sư Nhị chuyển thăng 1 tiểu cảnh giới Xích Thiết (thiển hồng), không tốn thêm chân nguyên [Dòng 17207]
* **8. Tác dụng phụ / Tệ đoan:** Cổ tiêu hao một lần, dùng xong tiêu biến hoàn toàn [Dòng 17207]
* **9. Loại thức ăn:** Tiêu hao phẩm, không cần nuôi `[Dòng 17207]`.
* **10. Khẩu phần & Tần suất ăn:** Cổ tiêu hao dùng một lần nổ tung hoặc biến mất, không yêu cầu nuôi dưỡng
* **11. Giá thị trường:** 3.000 nguyên thạch, thời chiến bị đẩy lên 5.000 – 8.000 nguyên thạch `[Dòng 17209]`.
* **12. Mô tả triết lý:** Kỳ tích đoạt tạo hóa đất trời: Con đường tắt đột phá tu vi không di chứng, phản ánh khát vọng vượt bậc của chúng sinh và giá trị khổng lồ của tài nguyên tu hành.

---

### <a id="gu_r2_16-bạch-trùng-kiển"></a>67. Bạch Trùng Kiển (白虫茧) `[Dòng 16071, 16073, 16091]` (`GU_R2_16`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 16071, 16073, 16091]`

* **1. Tên gọi:** Bạch Trùng Kiển (白虫茧) `[Dòng 16071, 16073, 16091]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Hình thái kén sâu trắng tròn trịa béo tốt, là hình thái chuyển tiếp bắt buộc khi hợp luyện tiến giai từ Tửu Trùng (Nhất chuyển) $\rightarrow$ Bạch Trùng Kiển (Nhị chuyển) $\rightarrow$ Mông Hãn Điệp (Tam chuyển)
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong ống tay áo hoặc kén bọc trong không khiếu, dùng làm vật liệu trung gian hợp luyện hoặc trị liệu.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Hình thái kén sâu chuyển tiếp bắt buộc khi hợp luyện tiến giai từ Tửu Trùng lên Mông Hãn Điệp; bản thân không có công dụng chiến đấu' [Dòng 16071, 16073] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) để ấp kén hoặc kích hoạt lớp tơ kén bảo hộ.
* **8. Tác dụng phụ / Tệ đoan:** Lớp kén tơ mỏng manh, không chịu được ngọn lửa hỏa đạo cháy dữ dội.
* **9. Loại thức ăn:** Tiêu tốn thực lương nuôi nấng liên tục trong thời gian hóa kén (rượu hoặc tinh chất).
* **10. Khẩu phần & Tần suất ăn:** Tiêu tốn thực lương nuôi nấng liên tục trong thời gian hóa kén (rượu hoặc tinh chất)
* **11. Giá thị trường:** Xuất hiện trong bí phương truyền thừa của Hoa Tửu Hành Giả để lại cho Phương Nguyên.
* **12. Mô tả triết lý:** Phá kén thành bướm, trải qua tăm tối mới đón nhận được ánh bình minh rực rỡ.

---

### <a id="gu_r2_17-vãng-sinh-thảo-cổ"></a>68. Vãng Sinh Thảo Cổ (往生草蛊) `[Dòng 29533, 29535]` (`GU_R2_17`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 29533, 29535]`

* **1. Tên gọi:** Vãng Sinh Thảo Cổ (往生草蛊) `[Dòng 29533, 29535]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Thảo cổ mang rễ vàng lá xanh chứa nguồn sinh cơ hồi phục dồi dào
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh bám vào ngực gần trái tim, duy trì một tia sinh mệnh cuối cùng khi cận kề cái chết.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Chứa đựng nguồn sinh mệnh hồi sinh dồi dào, chuyên dùng cứu chữa thương tổn chí mạng, kéo cổ sư từ cõi chết trở về' [Dòng 29533, 29535] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tự động tiêu hao toàn bộ chân nguyên thiển hồng còn sót lại trong không khiếu khi cổ sư nhận đòn chí mạng.
* **8. Tác dụng phụ / Tệ đoan:** Chỉ dùng một lần là cọng cỏ khô héo tiêu biến; sau khi hồi sinh thể trạng suy kiệt trầm trọng cần thời gian dài tĩnh dưỡng.
* **9. Loại thức ăn:** Thảo mộc sinh cơ và đất đai màu mỡ.
* **10. Khẩu phần & Tần suất ăn:** Cổ tiêu hao chờ kích hoạt, hút sinh khí dồi dào từ đất ẩm 10 ngày một lần.
* **11. Giá thị trường:** Bảo vật gia truyền bảo lưu trong bí kho Mạc mạch của Cổ Nguyệt Mạc Trần; Phương Nguyên dùng bí mật giết Cổ Kim Sinh để tống tiền ép Mạc Trần giao nộp cùng Sinh Thiết Cổ.
* **12. Mô tả triết lý:** Vãng sinh luân hồi, níu giữ hơi tàn giữa ranh giới sống chết để cầu lấy một tia hy vọng.

---

### <a id="gu_r2_18-ẩn-lân-cổ"></a>69. Ẩn Lân Cổ (隐鳞蛊) `[Dòng 19265, 19591, 20261, 20277]` (`GU_R2_18`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 19265, 19591, 20261, 20277]`

* **1. Tên gọi:** Ẩn Lân Cổ (隐鳞蛊) `[Dòng 19265, 19591, 20261, 20277]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng kết hợp hình vảy cá trong suốt và hoa văn đá ẩn nặc [Dòng 19591]
* **5. Thay đổi ngoại hình khi ký túc:** Bao phủ toàn thân bằng một lớp quang học trong suốt khiến cơ thể tàng hình hoàn toàn ngay cả khi đang di chuyển hoặc chạy bộ dưới mưa tuyết [Dòng 19591, 20261]
* **6. Công năng cụ thể:** Khắc phục nhược điểm của Ẩn Thạch Cổ: cho phép Cổ sư tàng hình ngay cả khi đang chạy bộ hoặc di chuyển dưới mưa tuyết `[Dòng 19591, 20261]`. Nhược điểm: tốn chân nguyên duy trì, nếu bị đánh trúng hoặc phát ra nhiệt độ/mùi vị quá mạnh vẫn bị Cổ trinh sát phát hiện `[Dòng 20283]`.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) kích hoạt tàng hình; duy trì tiêu hao 0.5 thành thiển hồng mỗi 10 hơi thở.
* **8. Tác dụng phụ / Tệ đoan:** Tiêu hao nhiều chân nguyên; nếu bị đánh trúng hoặc phát ra nhiệt độ, mùi vị hay âm thanh quá mạnh vẫn bị các cổ trinh sát (Xà Tín, Thuận Phong Nhĩ, Thú Ngữ) phát hiện [Dòng 20283]
* **9. Loại thức ăn:** Nước suối và vảy cá tươi `[Dòng 19593]`.
* **10. Khẩu phần & Tần suất ăn:** Nước suối và vảy cá tươi định kỳ
* **11. Giá thị trường:** Tiêu tốn hàng trăm nguyên thạch để dung hợp `[Dòng 19265]`.
* **12. Mô tả triết lý:** Vảy cá tàng hình tan vào làn nước; kẻ vô hình trên chiến trường nắm quyền phán xét sinh tử.

---

### <a id="gu_r2_19-tam-bộ-phương-thảo"></a>70. Tam Bộ Phương Thảo (三步芳草蛊) `[Dòng 21333, 21335, 24119, 25177]` (`GU_R2_19`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 21333, 21335, 24119, 25177]`

* **1. Tên gọi:** Tam Bộ Phương Thảo (三步芳草蛊) `[Dòng 21333, 21335, 24119, 25177]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Thảo cổ dạng mầm hoa ba cánh tỏa hương thơm ngát
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh dưới hai lòng bàn chân, khi bước đi tỏa ra mùi thơm thảo mộc nhàn nhạt và nâng bước chân lướt nhanh.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Mọc ra hoa cỏ thơm ngát dưới gót chân, mỗi lần bước đi 3 bước lại tăng vọt tốc độ chạy bôn tẩu' [Dòng 21333, 21335] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.8 thành chân nguyên sơ giai (thiển hồng) cho mỗi 3 bước nhảy vọt tăng tốc.
* **8. Tác dụng phụ / Tệ đoan:** Để lại mùi hương thơm thoang thoảng theo từng bước chân, có thể bị Cổ trinh sát khứu giác lần theo dấu vết.
* **9. Loại thức ăn:** Đất ẩm và giọt sương mai `[Dòng 21337]`.
* **10. Khẩu phần & Tần suất ăn:** Đất ẩm và giọt sương mai định kỳ
* **11. Giá thị trường:** Đổi bằng chiến công diệt thú.
* **12. Mô tả triết lý:** Ba bước nhẹ tựa khói sương, tiến thoái tự do giữa trùng vây hiểm nghèo.

---

### <a id="gu_r2_20-u-ảnh-tùy-hành-cổ"></a>71. U Ảnh Tùy Hành Cổ (幽影随行蛊) `[Dòng 11146, 11221, 11237]` (`GU_R2_20`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 11146, 11221, 11237]`

* **1. Tên gọi:** U Ảnh Tùy Hành Cổ (幽影随行蛊) `[Dòng 11146, 11221, 11237]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng dạng bóng ma mờ ảo đen tuyền không có hình thù cố định
* **5. Thay đổi ngoại hình khi ký túc:** Hòa tan thân thể cổ sư vào bóng râm, bóng cây hoặc bóng của kẻ địch
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Cho phép cổ sư hòa thân thể vào bóng râm, bóng cây hoặc bóng của kẻ địch để di chuyển cực nhanh và tập kích bất ngờ' [Dòng 11146, 11221] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) chìm vào bóng tối; duy trì tiêu hao 0.5 thành thiển hồng mỗi 10 hơi thở.
* **8. Tác dụng phụ / Tệ đoan:** Bị khắc chế triệt để bởi các cổ trùng phát quang như Loang Loáng Cổ (ánh sáng chói lòa xua tan bóng tối làm lộ hình)
* **9. Loại thức ăn:** Bóng râm của đá lạnh hoặc bột tro than đen mịn.
* **10. Khẩu phần & Tần suất ăn:** Hút tinh khí bóng tối trong hang sâu, 5 ngày một lần.
* **11. Giá thị trường:** Ma đạo cổ trùng.
* **12. Mô tả triết lý:** Ẩn mình trong bóng tối, bước đi cùng hư vô; sát thủ nguy hiểm nhất là kẻ không thấy hình bóng.

---

### <a id="gu_r2_21-du-cương-cổ"></a>72. Du Cương Cổ (游僵蛊) `[Dòng 19891, 20176, 22165, 32361]` (`GU_R2_21`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 19891, 20176, 22165, 32361]`

* **1. Tên gọi:** Du Cương Cổ (游僵蛊) `[Dòng 19891, 20176, 22165, 32361]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng mang tử khí màu xám tro hình thây ma thu nhỏ [Dòng 19891, 32361]
* **5. Thay đổi ngoại hình khi ký túc:** Biến da thịt cổ sư thành màu xám xanh vô cảm, móng tay và răng nanh dài ra, mất cảm giác đau đớn, cơ bắp căng cứng như xác chết cương thi [Dòng 19891]
* **6. Công năng cụ thể:** Cổ Nhị chuyển trong hệ kinh điển Cương Thi Cổ (Nhị chuyển Du Cương, Tam chuyển Mao Cương, Tứ chuyển Khiêu Cương, Ngũ chuyển Phi Cương) `[Dòng 32361]`. Biến thân thể Cổ sư thành Du Cương: da thịt xám xanh vô cảm, mất cảm giác đau đớn, tăng mạnh sức mạnh và độ trâu bò `[Dòng 19891]`. Nhược điểm: máu bị đông đặc, phải dùng phối hợp với Huyết Khí Cổ để tránh bị ăn mòn thành thây ma thật sự `[Dòng 20176]`.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) hóa thân thể thành cương thi máu lạnh trong nửa canh giờ [Dòng 19891].
* **8. Tác dụng phụ / Tệ đoan:** Máu bị đông đặc, cơ thể dần bị tử khí ăn mòn biến thành thây ma thật sự nếu không phối hợp cùng Huyết Khí Cổ để thông huyết [Dòng 20176]
* **9. Loại thức ăn:** Máu tươi hoặc xác chết `[Dòng 20176]`.
* **10. Khẩu phần & Tần suất ăn:** Máu tươi hoặc xác chết dã thú định kỳ
* **11. Giá thị trường:** Phổ biến trong ma đạo và thể tu.
* **12. Mô tả triết lý:** Triết lý ma đạo về cái giá của sức mạnh: Đổi lấy da đồng thịt sắt và sự vô cảm trước đau đớn bằng chính sinh cơ huyết mạch của con người [Dòng 20176, 32361]

---

### <a id="gu_r2_22-băng-nhận-cổ"></a>73. Băng Nhận Cổ (冰刃蛊) `[Dòng 22740, 23027, 23079, 27679]` (`GU_R2_22`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 22740, 23027, 23079, 27679]`

* **1. Tên gọi:** Băng Nhận Cổ (冰刃蛊) `[Dòng 22740, 23027, 23079, 27679]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Cực phẩm cận chiến Nhị chuyển (Độc quyền Bạch gia)
* **4. Hình thái:** Khối băng sắc lạnh hình lưỡi đao bén ngót [Dòng 23027]
* **5. Thay đổi ngoại hình khi ký túc:** Ngưng tụ trong lòng bàn tay thành thanh đao băng sắc lạnh dài bén ngót, hơi lạnh tỏa ra quanh bàn tay [Dòng 23027]
* **6. Công năng cụ thể:** Tạo đao băng cận chiến chém sắt như chém bùn; khi đao bị mẻ rót thêm chân nguyên để lập tức phục hồi độ bén hoặc phóng đao băng từ xa [Dòng 23027, 27679]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) / phát phóng đao băng sắc lạnh cự ly 15m.
* **8. Tác dụng phụ / Tệ đoan:** Khí lạnh thấu xương lan tỏa vào lòng bàn tay; nếu kích hoạt liên tục trong thời tiết giá rét dễ làm tê cứng ngón tay.
* **9. Loại thức ăn:** Nước đá tuyết tinh khiết `[Dòng 23079]`.
* **10. Khẩu phần & Tần suất ăn:** Ăn nước đá tuyết tinh khiết định kỳ [Dòng 23079]
* **11. Giá thị trường:** Cực phẩm cận chiến Nhị chuyển.
* **12. Mô tả triết lý:** Lưỡi đao băng hàn buốt giá, chém đứt huyết nhục đóng băng sinh mệnh đối phương.

---

### <a id="gu_r2_23-băng-trùy-cổ"></a>74. Băng Trùy Cổ (冰锥蛊) `[Dòng 22839, 27711, 32019]` (`GU_R2_23`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 22839, 27711, 32019]`

* **1. Tên gọi:** Băng Trùy Cổ (冰锥蛊) `[Dòng 22839, 27711, 32019]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng dạng cọc băng nhọn hoắt trong suốt
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong ống tay áo, ngưng tụ chùy băng nhọn hoắt khi giơ tay.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Phóng ra hàng loạt cọc đinh băng nhọn hoắt như mưa tên tầm xa 20m găm xuyên giáp đối thủ' [Dòng 22839, 27711] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.2 thành chân nguyên sơ giai (thiển hồng) phóng ra một mũi chùy băng sắc nhọn xuyên phá giáp trụ.
* **8. Tác dụng phụ / Tệ đoan:** Tốc độ bay chậm hơn nguyệt nhận, dễ bị đối phương có Cổ di động nhanh né tránh.
* **9. Loại thức ăn:** Khối băng đá `[Dòng 22839]`.
* **10. Khẩu phần & Tần suất ăn:** Khối băng đá định kỳ
* **11. Giá thị trường:** 400 – 500 nguyên thạch.
* **12. Mô tả triết lý:** Mũi chùy nhọn hoắt phá tan phòng ngự; độ cứng của băng tuyết là sức mạnh hủy diệt.

---

### <a id="gu_r2_24-thủy-tráo-cổ"></a>75. Thủy Tráo Cổ (水罩蛊) `[Dòng 22081, 22091, 22879]` (`GU_R2_24`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 22081, 22091, 22879]`

* **1. Tên gọi:** Thủy Tráo Cổ (水罩蛊) `[Dòng 22081, 22091, 22879]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng dạng bọt nước hình cầu lơ lửng đàn hồi
* **5. Thay đổi ngoại hình khi ký túc:** Tạo một quả cầu màng nước trong suốt bao bọc quanh thân thể cổ sư
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Tạo ra một màn chắn nước hình cầu bao bọc quanh thân thể cổ sư, có độ đàn hồi và phân tán lực chấn động cực tốt để hóa giải đòn đánh' [Dòng 22081, 22091] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) ngưng tụ màng nước tròn bao bọc toàn thân chống đỡ đòn đánh [Dòng 22081].
* **8. Tác dụng phụ / Tệ đoan:** Bong bóng nước dễ bị các đòn tấn công Lôi đạo dẫn điện truyền thẳng vào trong làm giật tê liệt cổ sư.
* **9. Loại thức ăn:** Nước suối ngọt tinh khiết.
* **10. Khẩu phần & Tần suất ăn:** Uống một ngụm nước suối trong ngọt lành, 5 ngày một bữa.
* **11. Giá thị trường:** Bạch Ngưng Băng và các Cổ sư tinh anh Bạch gia trại sử dụng phòng thân.
* **12. Mô tả triết lý:** Màn nước xoay vần bao bọc toàn thân, nhu hòa hóa giải vạn cân búa tạ.

---

### <a id="gu_r2_25-thủy-toản-cổ"></a>76. Thủy Toản Cổ (水钻蛊) `[Dòng 19881, 19907]` (`GU_R2_25`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 19881, 19907]`

* **1. Tên gọi:** Thủy Toản Cổ (水钻蛊) `[Dòng 19881, 19907]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng xoắn ốc ngưng tụ dòng nước thành mũi khoan xoáy
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh ở ngón tay trỏ hoặc lòng bàn tay, xoay tít luồng nước thành mũi khoan.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Ngưng tụ dòng nước thành mũi khoan xoáy sắc bén bao bọc nắm đấm hoặc ngón tay tạo lực xuyên phá xoáy cực mạnh để khoan thủng giáp hộ thân' [Dòng 19881, 19907] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) tạo mũi khoan nước xoáy xuyên phá hộ giáp dày.
* **8. Tác dụng phụ / Tệ đoan:** Phản lực xoáy mạnh truyền vào cổ tay đòi hỏi cổ sư phải gồng vững cơ bắp để không bị trật khớp.
* **9. Loại thức ăn:** Cát ngọc dưới đáy sông suối.
* **10. Khẩu phần & Tần suất ăn:** Uống nước ngầm suối lạnh, 5 ngày một lần.
* **11. Giá thị trường:** Cổ sư Bạch gia trại sử dụng trong các trận giáp lá cà tại lôi đài và chiến trường thú triều.
* **12. Mô tả triết lý:** Nước chảy siết thành mũi khoan xoáy thủng đá tảng; tập trung toàn lực vào một điểm duy nhất.

---

### <a id="gu_r2_26-tịnh-thủy-cổ"></a>77. Tịnh Thủy Cổ (净水蛊) `[Dòng 7160, 13735, 17305, 25573]` (`GU_R2_26`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 7160, 13735, 17305, 25573]`

* **1. Tên gọi:** Tịnh Thủy Cổ (净水蛊) `[Dòng 7160, 13735, 17305, 25573]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Giọt nước tinh khiết trong suốt không tì vết phát ánh thanh quang
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trôi nổi trong không khiếu, thanh tẩy các tạp chất và độc tố trong chân nguyên hoặc thân thể.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Sinh ra dòng nước tinh khiết có khả năng tẩy rửa triệt để cặn bã, độc tố trong không khiếu, thanh tẩy dị chủng chân nguyên hoặc rửa sạch bụi đá Thạch Khiếu Cổ' [Dòng 13735, 25573] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) thanh lọc độc tố xâm nhập hoặc rửa sạch chướng khí bám dính.
* **8. Tác dụng phụ / Tệ đoan:** Chỉ giải được các loại độc tố Thủy đạo và độc tính thô sơ, bất lực trước độc dược huyết đạo hoặc cổ độc chuyên sâu.
* **9. Loại thức ăn:** Nước suối tinh khiết hoặc giọt sương.
* **10. Khẩu phần & Tần suất ăn:** Uống sương mai đọng trên lá sen, 7 ngày một lần.
* **11. Giá thị trường:** Cổ sư tinh anh Bạch gia trại sử dụng để vây bắt hoang dã cổ trùng bay ra từ xác Lôi Quan Đầu Lang.
* **12. Mô tả triết lý:** Nước trong thanh lọc vạn vật, giữ gìn khiếu hải thanh tịnh để tu hành thông suốt.

---

### <a id="gu_r2_27-thủy-lung-cổ"></a>78. Thủy Lung Cổ (水笼蛊) `[Dòng 27905, 27907]` (`GU_R2_27`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 27905, 27907]`

* **1. Tên gọi:** Thủy Lung Cổ (水笼蛊) `[Dòng 27905, 27907]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Bọt nước lớn có kết cấu mắt lưới giam cầm mục tiêu
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong ống tay áo, phóng ra lồng nước giam cầm kẻ địch khi thúc giục.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Thủy lung cổ, cho ta tráo! Cổ sư phun ra một ngụm nước, bọt nước lập tức phình to thành một quả cầu nước đường kính hơn 2 mét bao bọc lấy mục tiêu giam cầm bên trong' [Dòng 27905, 27907] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 2 thành chân nguyên sơ giai (thiển hồng) ngưng tụ lồng nước giam giữ đối phương trong 10 nhịp thở.
* **8. Tác dụng phụ / Tệ đoan:** Nếu đối phương có sức mạnh lực đạo cực lớn hoặc dùng hỏa diễm cực mạnh có thể phá vỡ lồng nước thoát ra.
* **9. Loại thức ăn:** Nước suối tinh khiết hoặc giọt sương.
* **10. Khẩu phần & Tần suất ăn:** Uống nước suối lạnh có lẫn bọt rong rêu, 5 ngày một bữa.
* **11. Giá thị trường:** Cổ sư tinh anh Bạch gia trại sử dụng để vây bắt hoang dã cổ trùng bay ra từ xác Lôi Quan Đầu Lang.
* **12. Mô tả triết lý:** Giam cầm kẻ địch trong làn nước xiết, biến dòng nước dịu dàng thành ngục tù kiên cố.

---

### <a id="gu_r2_28-thủy-đồn-cổ"></a>79. Thủy Đồn Cổ (水豚蛊) `[Dòng 19790]` (`GU_R2_28`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 19790]`

* **1. Tên gọi:** Thủy Đồn Cổ (水豚蛊) `[Dòng 19790]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng hình cá heo nước nhỏ trơn nhẵn
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh bám quanh thắt lưng, khi xuống nước giúp cơ thể lướt đi nhanh như cá heo nước.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Bạch gia Bạch Trọng Thủy, nhị chuyển cao giai cường giả, có được thủy đồn cổ... Cung cấp năng lực thủy đạo đặc thù kết hợp khả năng chịu đòn và bơi lặn linh hoạt dưới nước' [Dòng 19790] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.8 thành chân nguyên sơ giai (thiển hồng) mỗi nửa canh giờ bơi lội tốc độ cao dưới lòng nước.
* **8. Tác dụng phụ / Tệ đoan:** Trên cạn hoàn toàn vô dụng, chỉ phát huy hiệu năng tối đa khi ngâm mình trong môi trường nước.
* **9. Loại thức ăn:** Thủy thảo và cá nhỏ tươi sống.
* **10. Khẩu phần & Tần suất ăn:** Ăn một con cá nhỏ tươi sống dưới lòng suối, 5 ngày một bữa.
* **11. Giá thị trường:** Cổ bản mệnh / chiến đấu của Bạch Trọng Thủy - nữ cổ sư Nhị chuyển cao giai nổi danh Bạch gia trại.
* **12. Mô tả triết lý:** Như cá gặp nước, thuận theo hoàn cảnh mà vẫy vùng tự tại.

---

### <a id="gu_r2_29-ái-sinh-ly"></a>80. Ái Sinh Ly (爱生离) `[Dòng 11188, 11202, 11204]` (`GU_R2_29`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 11188, 11202, 11204]`

* **1. Tên gọi:** Ái Sinh Ly (爱生离) `[Dòng 11188, 11202, 11204]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Quý hiếm / Đệ nhất độc cổ Nhị chuyển
* **4. Hình thái:** Độc cổ tà dị nửa thân hoa cỏ xanh mướt nửa thân độc trùng đen kịt rỉ máu đen [Dòng 11188, 11204]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong tâm khảm hoặc ngực áo, không làm biến đổi thể hình bên ngoài.
* **6. Công năng cụ thể:** Được mệnh danh 'Đệ nhất độc cổ Nhị chuyển'. Khi trúng độc, máu đen chảy ròng ròng, tử khí nhiễm toàn thân, lục phủ ngũ tạng mục nát nhanh chóng không thuốc nào chữa nổi nếu không giải kịp thời [Dòng 11188, 11202]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) cắt đứt liên kết tình cảm hoặc giam cầm cảm xúc.
* **8. Tác dụng phụ / Tệ đoan:** Kịch độc tàn khốc, nếu sơ sẩy trong quá trình nuôi hoặc hợp luyện rất dễ bị độc tố phản phệ thối rữa lục phủ ngũ tạng [Dòng 11204]
* **9. Loại thức ăn:** Độc vật `[Dòng 11204]`.
* **10. Khẩu phần & Tần suất ăn:** Hút cảm xúc bi thương hoặc cánh hoa hồng rụng, 7 ngày một lần.
* **11. Giá thị trường:** Độc cổ khét tiếng của ma đầu Vương Đại.
* **12. Mô tả triết lý:** Yêu hận tình thù chia lìa trong nháy mắt; đạo vô tình mới là con đường bước lên đỉnh cao.

---

### <a id="gu_r2_30-thanh-đằng-cổ"></a>81. Thanh Đằng Cổ (青藤蛊) `[Dòng 15966, 20154, 22772, 23069]` (`GU_R2_30`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 15966, 20154, 22772, 23069]`

* **1. Tên gọi:** Thanh Đằng Cổ (青藤蛊) `[Dòng 15966, 20154, 22772, 23069]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Dây leo mây xanh biếc dài và dai dẳng như roi da
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh quấn quanh cánh tay như một sợi dây leo xanh biếc.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Phun ra một dây mây xanh biếc dài 10m từ lòng bàn tay, quất mạnh như roi thép hoặc quấn chặt trói gô đối thủ' [Dòng 15966, 23069] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) quất ra một ngọn roi mây dài 10m quấn bắt hoặc quất gãy cọc gỗ.
* **8. Tác dụng phụ / Tệ đoan:** Sợ hỏa diễm thiêu đốt; nếu gặp Cổ hỏa đạo dây mây dễ bị cháy rụi và phản phệ cổ sư.
* **9. Loại thức ăn:** Nước và ánh sáng mặt trời `[Dòng 15966]`.
* **10. Khẩu phần & Tần suất ăn:** Nước và ánh sáng mặt trời định kỳ
* **11. Giá thị trường:** 400 – 500 nguyên thạch.
* **12. Mô tả triết lý:** Mềm dẻo mà bền bỉ, dây leo xanh quấn chặt cổ họng con mồi trong im lặng.

---

### <a id="gu_r2_31-tùng-châm-cổ"></a>82. Tùng Châm Cổ (松针蛊) `[Dòng 22875, 22903, 23179]` (`GU_R2_31`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 22875, 22903, 23179]`

* **1. Tên gọi:** Tùng Châm Cổ (松针蛊) `[Dòng 22875, 22903, 23179]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng hình chùm kim lá thông xanh biếc sắc nhọn
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh ở hai mu bàn tay, khi vung tay bắn ra mưa kim thông.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Bắn ra một cơn mưa kim lá thông xanh biếc sắc bén như mưa tên găm vào mục tiêu' [Dòng 22875, 22903] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.2 thành chân nguyên sơ giai (thiển hồng) bắn ra cơn mưa kim lá thông phủ kín phạm vi 15 bước.
* **8. Tác dụng phụ / Tệ đoan:** Sát thương phân tán trên diện rộng, khó tập trung đâm thủng các loại trọng giáp dầy.
* **9. Loại thức ăn:** Nhựa cây thông `[Dòng 23179]`.
* **10. Khẩu phần & Tần suất ăn:** Nhựa cây thông tươi định kỳ
* **11. Giá thị trường:** Cổ Mộc đạo viễn trình.
* **12. Mô tả triết lý:** Muôn ngàn mũi kim cùng phóng, lấy số lượng áp đảo chất lượng quét sạch bầy thú hoang.

---

### <a id="gu_r2_32-huyết-khí-cổ"></a>83. Huyết Khí Cổ (血气蛊) `[Dòng 20176, 25781, 25815]` (`GU_R2_32`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 20176, 25781, 25815]`

* **1. Tên gọi:** Huyết Khí Cổ (血气蛊) `[Dòng 20176, 25781, 25815]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng màu đỏ tươi như giọt máu sống động
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong mạch máu cổ sư, kích thích huyết khí dâng trào tăng cường uy lực chiêu thức.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Kích thích khí huyết lưu thông, là cặp bài trùng phối hợp hóa giải tác dụng phụ đông máu của Du Cương Cổ' [Dòng 20176] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) kích phát huyết khí trong 10 nhịp thở.
* **8. Tác dụng phụ / Tệ đoan:** Dùng xong cổ sư cảm thấy tim đập thình thịch, khí huyết hao hụt nhẹ cần bổ sung canh thuốc bổ máu.
* **9. Loại thức ăn:** Máu tươi động vật `[Dòng 25815]`.
* **10. Khẩu phần & Tần suất ăn:** Máu tươi động vật định kỳ
* **11. Giá thị trường:** Cổ Huyết đạo phàm giai.
* **12. Mô tả triết lý:** Huyết mạch sôi sục thúc giục dũng khí; máu của bản thân là chất đốt mạnh mẽ nhất.

---

### <a id="gu_r2_33-song-khiếu-hỏa-lô-cổ"></a>84. Song Khiếu Hỏa Lô Cổ (双窍火炉蛊) `[Dòng 19501]` (`GU_R2_33`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 19501]`

* **1. Tên gọi:** Song Khiếu Hỏa Lô Cổ (双窍火炉蛊) `[Dòng 19501]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Hình dạng lò lửa nhỏ hai lỗ thông khí, luôn phát nhiệt ấm nóng
* **5. Thay đổi ngoại hình khi ký túc:** Ẩn trong không khiếu, tỏa nhiệt độ ấm áp ra khắp cơ thể qua lỗ chân lông
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Hỏa lô cổ là nhị chuyển cổ trùng, chất chứa hỏa khí, dùng cho tiến công. Chống lạnh chính là một cái phụ tác dụng thôi.' [Dòng 19501, 19503] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) phun ra hai luồng lửa ngùn ngụt từ hai lỗ lò thiêu đốt mục tiêu.
* **8. Tác dụng phụ / Tệ đoan:** Nhiệt độ tỏa ra cực lớn xung quanh khiến cổ sư nóng nực rát mặt nếu không có Cổ chịu nhiệt hỗ trợ.
* **9. Loại thức ăn:** Than đỏ / Than đá `[Dòng 19501]`.
* **10. Khẩu phần & Tần suất ăn:** Ăn than đỏ hoặc than đá định kỳ
* **11. Giá thị trường:** Cổ chuyên dụng luyện đạo.
* **12. Mô tả triết lý:** Lửa song khiếu bùng cháy dữ dội, thiêu rụi mọi chướng ngại cản đường.

---

### <a id="gu_r2_34-tạc-lôi-cổ"></a>85. Tạc Lôi Cổ (炸雷蛊) `[Dòng 24529, 24573, 24611]` (`GU_R2_34`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 24529, 24573, 24611]`

* **1. Tên gọi:** Tạc Lôi Cổ (炸雷蛊) `[Dòng 24529, 24573, 24611]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Viên cầu điện quang màu xanh lam nổ tanh tách
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong lòng bàn tay, ném ra cầu sét khi phát động.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Bắn ra viên cầu sét nổ tung như lựu đạn, gây sát thương diện rộng và làm tê liệt kẻ địch' [Dòng 24529, 24573] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) ngưng tụ ném ra một quả cầu lôi điện phát nổ.
* **8. Tác dụng phụ / Tệ đoan:** Tiếng nổ đinh tai nhức óc dễ làm chấn động màng nhĩ chính cổ sư nếu nổ ở cự ly quá gần.
* **9. Loại thức ăn:** Quặng đá nhiễm lôi điện hoặc tia sét thu thập trong mùa mưa bão.
* **10. Khẩu phần & Tần suất ăn:** Hút tia điện từ đá tích điện, 10 ngày một lần.
* **11. Giá thị trường:** 600 nguyên thạch.
* **12. Mô tả triết lý:** Sấm sét nổ vang đất trời, sức mạnh hủy diệt làm kinh hồn bạt vía kẻ địch.

---

### <a id="gu_r2_35-lôi-khiếu-cổ"></a>86. Lôi Khiếu Cổ (雷窍蛊) `[Dòng 24611, 24679]` (`GU_R2_35`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 24611, 24679]`

* **1. Tên gọi:** Lôi Khiếu Cổ (雷窍蛊) `[Dòng 24611, 24679]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng hình bọng chứa tia chớp tích điện
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong không khiếu, thỉnh thoảng có tia điện nhỏ lóe ra nơi đồng tử mắt
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Dựa vào âm ba giết địch... rít gào hung mãnh hướng bốn phía đánh ra, chấn động không khí hình thành vô hình đẩy mạnh lực lượng' [Dòng 24611, 24679] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) tích trữ điện năng trong các huyệt khiếu cơ thể.
* **8. Tác dụng phụ / Tệ đoan:** Nguy hiểm cực độ, nếu không biết kiểm soát và điều hòa sấm sét có nguy cơ nổ tung không khiếu
* **9. Loại thức ăn:** Sấm sét / Tia điện `[Dòng 24679]`.
* **10. Khẩu phần & Tần suất ăn:** Hút sấm sét hoặc tia điện định kỳ
* **11. Giá thị trường:** Nguy hiểm, dễ nổ không khiếu nếu không biết kiểm soát.
* **12. Mô tả triết lý:** Chứa sấm sét trong thân mình, đi trên đầu sóng ngọn gió mạo hiểm cầu phú quý.

---

### <a id="gu_r2_36-hủ-huyết-thảo-cổ"></a>87. Hủ Huyết Thảo Cổ (腐血草蛊) `[Dòng 14284, 14288, 14294]` (`GU_R2_36`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 14284, 14288, 14294]`

* **1. Tên gọi:** Hủ Huyết Thảo Cổ (腐血草蛊) `[Dòng 14284, 14288, 14294]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Thảo cổ dạng mầm dây leo tím rỉ độc dịch phân hủy huyết nhục [Dòng 14284]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh dưới dạng ấn ký dây leo tím mờ nhạt trên móng tay ngón út cổ sư [Dòng 14284]
* **6. Công năng cụ thể:** Tiêu hao Xích Thiết chân nguyên kích hoạt, từ móng tay sinh trưởng ra các sợi gai đâm mảnh sắc luồn vào nội tạng mục tiêu để phân hủy và hút cạn huyết dịch làm thối rữa con mồi [Dòng 14284, 14288]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) khi kích hoạt tạo bẫy máu thối.
* **8. Tác dụng phụ / Tệ đoan:** Phát ra mùi máu thối nồng nặc dễ thu hút dã thú săn mồi xung quanh kéo đến.
* **9. Loại thức ăn:** Huyết nhục thối rữa của dã thú.
* **10. Khẩu phần & Tần suất ăn:** Huyết nhục thối rữa của dã thú định kỳ
* **11. Giá thị trường:** Nữ cổ sư Hoa Hân thuộc tiểu tổ của Giác Tam sử dụng khi thanh trừng lợn rừng vương.
* **12. Mô tả triết lý:** Máu thối nuôi cỏ độc, cái chết của sinh linh này là dinh dưỡng cho sinh linh khác.

---

### <a id="gu_r2_37-xà-tín-cổ"></a>88. Xà Tín Cổ (蛇信蛊) `[Dòng 14135, 20283, 21467]` (`GU_R2_37`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 14135, 20283, 21467]`

* **1. Tên gọi:** Xà Tín Cổ (蛇信蛊) `[Dòng 14135, 20283, 21467]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng hình chiếc lưỡi rắn chẻ đôi màu đỏ thẫm [Dòng 14135]
* **5. Thay đổi ngoại hình khi ký túc:** Khiến lưỡi cổ sư biến thành chiếc lưỡi rắn chẻ đôi thò thụt để cảm nhận nhiệt độ hồng ngoại [Dòng 14135]
* **6. Công năng cụ thể:** Khiến lưỡi Cổ sư có khả năng thụ cảm nhiệt lượng như lưỡi rắn, nhìn thấu kẻ địch nấp sau bụi cây hoặc trong bóng tối thông qua thân nhiệt `[Dòng 14135]`. Nhược điểm: tầm trinh sát ngắn, dễ bị lửa hoặc môi trường quá nóng gây nhiễu `[Dòng 14135]`.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.5 thành chân nguyên sơ giai (thiển hồng) duy trì lưỡi rắn đánh hơi nhiệt lượng trong nửa canh giờ.
* **8. Tác dụng phụ / Tệ đoan:** Tầm trinh sát ngắn, dễ bị ngọn lửa hoặc môi trường nhiệt độ quá cao gây nhiễu loạn thụ cảm [Dòng 14135]
* **9. Loại thức ăn:** Lưỡi ếch tươi `[Dòng 14135]`.
* **10. Khẩu phần & Tần suất ăn:** Ăn lưỡi ếch tươi sống định kỳ [Dòng 14135]
* **11. Giá thị trường:** Trinh sát phổ biến của trinh sát viên Nhị chuyển (Xích Thiệt dùng).
* **12. Mô tả triết lý:** Lưỡi rắn bắt gió dò nhiệt độ, nhìn thấu kẻ địch đang ẩn nấp sau tảng đá dày.

---

### <a id="gu_r2_38-hùng-hào-cổ"></a>89. Hùng Hào Cổ (熊嚎蛊) `[Dòng 19153, 20078, 20112]` (`GU_R2_38`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 19153, 20078, 20112]`

* **1. Tên gọi:** Hùng Hào Cổ (熊嚎蛊) `[Dòng 19153, 20078, 20112]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng hình cổ họng gấu phát ra sóng âm gầm thét
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh ở vùng thanh quản cổ họng cổ sư, khi gầm lên phát ra tiếng gầm của gấu chúa.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Phát ra tiếng gầm của loài gấu khổng lồ, tạo thành sóng âm chấn động màng nhĩ làm choáng váng kẻ địch trong phạm vi gần' [Dòng 20078, 20112] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) phát ra một tiếng gầm sóng âm làm điếc tai và choáng váng mục tiêu.
* **8. Tác dụng phụ / Tệ đoan:** Gầm nhiều lần trong ngày sẽ làm rát cổ họng và khản giọng tạm thời.
* **9. Loại thức ăn:** Mật gấu hoặc cổ họng dã thú tươi sống băm nhỏ.
* **10. Khẩu phần & Tần suất ăn:** Nuốt vài giọt mật gấu đắng, 7 ngày một bữa.
* **11. Giá thị trường:** Cổ âm đạo Nhị chuyển.
* **12. Mô tả triết lý:** Tiếng gầm chấn nhiếp muôn thú, dùng âm thanh khuất phục ý chí đối phương.

---

### <a id="gu_r2_39-ảnh-thương-cổ"></a>90. Ảnh Thương Cổ (影伤蛊) `[Dòng 19931, 19933, 22155, 22251]` (`GU_R2_39`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 19931, 19933, 22155, 22251]`

* **1. Tên gọi:** Ảnh Thương Cổ (影伤蛊) `[Dòng 19931, 19933, 22155, 22251]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng dạng sợi chỉ đen liên kết bóng ma của hai mục tiêu
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong bóng dưới chân cổ sư, bắn ra sợi chỉ đen liên kết bóng đối phương.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Nối bóng của cổ sư với bóng của đối thủ, chia sẻ sát thương phải chịu tương ứng sang mục tiêu' [Dòng 19931, 19933] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) trói bóng đối thủ vào bóng mình để truyền dẫn sát thương.
* **8. Tác dụng phụ / Tệ đoan:** Sát thương truyền dẫn là hai chiều; nếu đối phương liều chết tự đả thương mình thì cổ sư cũng phải gánh chịu một phần tổn thương tương ứng.
* **9. Loại thức ăn:** Bóng tối trong hốc đá hoặc tro đen của lá cây cháy dở.
* **10. Khẩu phần & Tần suất ăn:** Hút bóng tối lạnh lẽo trong kẽ đá, 7 ngày một lần.
* **11. Giá thị trường:** Ma đạo / Cổ chiến thuật kỳ dị.
* **12. Mô tả triết lý:** Bóng liền với hình, tổn thương truyền qua bóng tối; ma đạo thủ đoạn quỷ quyệt khôn lường.

---

### <a id="gu_r2_40-cường-thủ-cổ"></a>91. Cường Thủ Cổ (强取蛊) `[Dòng 21157, 21197, 21213]` (`GU_R2_40`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 21157, 21197, 21213]`

* **1. Tên gọi:** Cường Thủ Cổ (强取蛊) `[Dòng 21157, 21197, 21213]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng hóa thành hư ảnh bàn tay vô hình chụp bắt
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trong lòng bàn tay, ngưng tụ hư ảnh bàn tay chộp đoạt khi vươn ra.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Bắn ra bàn tay vô hình cưỡng ép chụp bắt Cổ trùng trong không khiếu hoặc trên người đối phương nếu đối phương suy yếu' [Dòng 21157, 21197] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1.5 thành chân nguyên sơ giai (thiển hồng) ngưng tụ bàn tay vô hình chộp đoạt Cổ trùng của đối thủ.
* **8. Tác dụng phụ / Tệ đoan:** Tỷ lệ thất bại rất cao nếu đối phương còn tỉnh táo, đủ chân nguyên và quyết liệt kháng cự
* **9. Loại thức ăn:** Bột nguyên thạch vụn hoặc mẩu kim loại sáng bóng.
* **10. Khẩu phần & Tần suất ăn:** Ăn một nhúm bột nguyên thạch vụn, 7 ngày một bữa.
* **11. Giá thị trường:** Cực phẩm truy bắt đạo tặc.
* **12. Mô tả triết lý:** Cường thủ hào đoạt, cướp đoạt tài nguyên của kẻ yếu là bản chất tàn nhẫn của thế giới Cổ sư.

---

### <a id="gu_r2_41-phiên-nhiên-cổ"></a>92. Phiên Nhiên Cổ (幡然蛊) `[Dòng 17581, 17583, 17593]` (`GU_R2_41`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 17581, 17583, 17593]`

* **1. Tên gọi:** Phiên Nhiên Cổ (幡然蛊) `[Dòng 17581, 17583, 17593]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Hình dạng như phiến đá dẹp, mọc cành lá bao bọc chặt Cổ trùng hoặc nguyên thạch, triệt tiêu toàn bộ khí tức dao động để tránh bị trinh sát phát hiện
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh bám vào bảo vật hoặc túi trữ vật, biến hình thành một phiến đá phủ rêu khô.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Mọc cành lá bao bọc chặt Cổ trùng hoặc nguyên thạch, triệt tiêu toàn bộ khí tức dao động để tránh bị trinh sát phát hiện' [Dòng 17581, 17583] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) bao bọc ngụy trang một món đồ vật hoàn toàn thành khối đá vô tri.
* **8. Tác dụng phụ / Tệ đoan:** Không thể ngụy trang sinh vật sống có hơi thở, chỉ dùng được cho cổ trùng hoặc đồ vật tĩnh.
* **9. Loại thức ăn:** Bụi rêu xanh bám trên phiến đá lâu năm.
* **10. Khẩu phần & Tần suất ăn:** Gặm một nhúm rêu đá khô, 10 ngày một lần.
* **11. Giá thị trường:** Cổ chuyên dụng che giấu bảo vật.
* **12. Mô tả triết lý:** Ngọc giấu trong đá, bảo vật ẩn mình dưới lớp rêu; giấu mình chờ thời là thượng sách.

---

### <a id="gu_r2_42-địa-tàng-hoa-cổ"></a>93. Địa Tàng Hoa Cổ (地藏花蛊) `[Dòng 9359, 9363, 12102, 20454]` (`GU_R2_42`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 9359, 9363, 12102, 20454]`

* **1. Tên gọi:** Địa Tàng Hoa Cổ (地藏花蛊) `[Dòng 9359, 9363, 12102, 20454]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu hao phẩm
* **4. Hình thái:** Hoa sen kết hợp bắp cải màu vàng đất vùi sâu dưới đất [Dòng 9363]
* **5. Thay đổi ngoại hình khi ký túc:** Chôn dưới lòng đất, nở hoa ngậm bảo vật phong ấn trong bùn sâu.
* **6. Công năng cụ thể:** Vùi sâu dưới đất để bảo quản Cổ trùng khác trong trạng thái ngủ say hàng chục năm mà không bị chết đói [Dòng 9363, 9375]
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) khép cánh hoa phong ấn vật phẩm và rút lui xuống lòng đất sâu.
* **8. Tác dụng phụ / Tệ đoan:** Cổ tiêu hao một lần; sau khi hoa nở để lấy cổ trùng cất giấu ra ngoài thì hoa lập tức khô héo chết đi [Dòng 9389]
* **9. Loại thức ăn:** Hút địa khí và chất dinh dưỡng của đất `[Dòng 9363]`.
* **10. Khẩu phần & Tần suất ăn:** Hút địa khí và chất dinh dưỡng của đất
* **11. Giá thị trường:** Cổ trữ vật bí mật một lần.
* **12. Mô tả triết lý:** Địa tàng hoa cất giữ cơ duyên cho hậu nhân, lưu lại truyền thừa giữa chốn hồng trần.

---

### <a id="gu_r2_43-lại-thổ-cáp-mô"></a>94. Lại Thổ Cáp Mô (癞土蛤蟆) `[Dòng 5615, 5692, 5986, 6000]` (`GU_R2_43`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 5615, 5692, 5986, 6000]`

* **1. Tên gọi:** Lại Thổ Cáp Mô (癞土蛤蟆) `[Dòng 5615, 5692, 5986, 6000]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cóc bùn sần sùi màu vàng xám, da nổi nhiều nốt sần, miệng rộng há nuốt đất bùn [Dòng 5615, 6000]
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trôi nổi trong không khiếu hoặc ngậm trong miệng cổ sư, thân mình bọc lớp đất bùn sần sùi.
* **6. Công năng cụ thể:** Cóc bùn có khả năng hút bùn đất, nuốt chửng đất đá hoặc phun bùn làm mù mắt kẻ địch `[Dòng 5986]`. Là chủ cổ hợp luyện thành Bảo Khí Hoàng Đồng Thiềm (Tứ chuyển) `[Dòng 6000]`.
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) há to miệng phun ra bãi bùn lầy dính chặt chân đối phương hoặc hấp thụ đòn đánh Thổ đạo.
* **8. Tác dụng phụ / Tệ đoan:** Kén chọn thức ăn; khó nuôi ở những nơi không có bùn vàng (như Thanh Mao Sơn toàn thanh thổ rất khó kiếm hoàng nê) [Dòng 6014]
* **9. Loại thức ăn:** Bùn vàng (hoàng nê), mỗi bữa ăn 1 cân bùn vàng sạch `[Dòng 6000]`.
* **10. Khẩu phần & Tần suất ăn:** Mỗi bữa dùng ăn đúng 1 cân bùn vàng sạch (hoàng nê), bùn vàng càng phì nhiêu càng tốt [Dòng 6000]
* **11. Giá thị trường:** 500 nguyên thạch tại chợ phiên thương đội [Dòng 5986, 6000]
* **12. Mô tả triết lý:** Cóc đất tuy xấu xí lấm lem nhưng vững chãi, mượn bùn đất bảo vệ thân mình.

---

### <a id="gu_r2_44-minh-lộ-điệp"></a>95. Minh Lộ Điệp (鸣路蝶) `[Dòng 8276, 8278]` (`GU_R2_44`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 8276, 8278]`

* **1. Tên gọi:** Minh Lộ Điệp (鸣路蝶) `[Dòng 8276, 8278]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Bướm phát quang có tiếng kêu lảnh lót
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh đậu trên bờ vai hoặc trong tay áo, khi bay phát ra ánh huỳnh quang và tiếng kêu lảnh lót dẫn đường.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Truy tung cổ trùng minh lộ điệp, phát ra hồn hương vô sắc vô vị lưu lại trên cổ trùng; minh lộ điệp lần theo hương để tìm kiếm tộc nhân, nhưng cổ trùng chết thì hồn hương tan' [Dòng 8276, 8278] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.8 thành chân nguyên sơ giai (thiển hồng) bay lượn dẫn lối trong phạm vi 1 dặm.
* **8. Tác dụng phụ / Tệ đoan:** Tiếng kêu lảnh lót và ánh sáng phát ra dễ làm kinh động thú dữ trong rừng đêm.
* **9. Loại thức ăn:** Phấn hoa thơm hoặc hương liệu đặc biệt.
* **10. Khẩu phần & Tần suất ăn:** Hút mật hoa rừng thơm phức hoặc giọt nước đường loãng, 5 ngày một bữa.
* **11. Giá thị trường:** Cổ Phú và hộ vệ Cổ gia sử dụng để lần theo dấu vết Hồn hương trên người Giang Nha và Phương Nguyên khi điều tra án mạng Cổ Kim Sinh.
* **12. Mô tả triết lý:** Bướm bay dẫn lối xuyên qua màn sương mù, tìm kiếm con đường sống giữa muôn trùng bế tắc.

---

### <a id="gu_r2_45-thú-ngữ-cổ"></a>96. Thú Ngữ Cổ (兽语蛊) `[Dòng 20283]` (`GU_R2_45`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 20283]`

* **1. Tên gọi:** Thú Ngữ Cổ (兽语蛊) `[Dòng 20283]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng nhỏ hỗ trợ phiên dịch và giao tiếp tiếng muông thú
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh ở vùng tai hoặc thanh quản, hỗ trợ phiên dịch và mô phỏng tiếng kêu muông thú.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Thú ngữ cổ, có thể làm cho cổ sư theo cùng dã thú đối thoại trung được đến tin tức' [Dòng 20283] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.5 thành chân nguyên sơ giai (thiển hồng) giao tiếp hoặc lắng nghe tiếng muông thú trong nửa canh giờ.
* **8. Tác dụng phụ / Tệ đoan:** Chỉ hiểu được cảm xúc và ý định cơ bản của dã thú bậc thấp, không thể ra lệnh ép buộc nếu không có Cổ nô dịch đi kèm.
* **9. Loại thức ăn:** Mẩu lưỡi của chim rừng hoặc thú hoang phơi khô.
* **10. Khẩu phần & Tần suất ăn:** Gặm một mẩu thịt lưỡi chim khô, 10 ngày một lần.
* **11. Giá thị trường:** Liệt kê trong danh sách cổ trùng trinh sát đặc thù có khả năng phá vỡ ngụy trang của Ẩn Lân Cổ.
* **12. Mô tả triết lý:** Hiểu được tiếng thú để tránh hiểm họa rừng sâu, biết người biết ta trăm trận trăm thắng.

---

### <a id="gu_r2_46-thuận-phong-nhĩ-cổ"></a>97. Thuận Phong Nhĩ Cổ (顺风耳蛊) `[Dòng 20283]` (`GU_R2_46`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 20283]`

* **1. Tên gọi:** Thuận Phong Nhĩ Cổ (顺风耳蛊) `[Dòng 20283]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng dạng vành tai nhỏ cộng sinh trên tai cổ sư
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh cộng sinh trực tiếp ở vành tai cổ sư, khiến vành tai hơi nhọn và dài ra
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Thuận phong nhĩ cổ, có thể sử cổ sư thính giác năng lực trở nên cực kỳ linh mẫn' [Dòng 20283] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 1 thành chân nguyên sơ giai (thiển hồng) khuếch đại thính giác lắng nghe động tĩnh trong phạm vi 300 bước suốt nửa canh giờ.
* **8. Tác dụng phụ / Tệ đoan:** Nếu kẻ địch bất ngờ gầm thét bằng sóng âm cực mạnh (như Hùng Hào Cổ) sẽ khiến cổ sư bị đâm thủng màng nhĩ chảy máu và choáng váng nặng.
* **9. Loại thức ăn:** Gió lộng trên đỉnh núi cao hoặc tiếng suối reo trong trẻo.
* **10. Khẩu phần & Tần suất ăn:** Hứng gió đầu ghềnh đá trong 1 khắc, 7 ngày một lần.
* **11. Giá thị trường:** Cổ trinh sát thính giác dã ngoại cao cấp đối kháng ẩn nặc.
* **12. Mô tả triết lý:** Gió thổi qua tai lắng nghe vạn dặm, phòng ngừa bất trắc từ khi biến cố chưa kịp manh nha.

---

### <a id="gu_r2_47-trực-giác-cổ"></a>98. Trực Giác Cổ (直觉蛊) `[Dòng 29101, 29467, 29643]` (`GU_R2_47`)
> **Mốc dòng trích dẫn nguyên tác:** `[Dòng 29101, 29467, 29643]`

* **1. Tên gọi:** Trực Giác Cổ (直觉蛊) `[Dòng 29101, 29467, 29643]`
* **2. Phẩm cấp:** Nhị Chuyển (Rank 2)
* **3. Độ quý hiếm:** Phổ thông / Tiêu chuẩn
* **4. Hình thái:** Cổ trùng vô hình dạng đốm linh quang trong tâm trí
* **5. Thay đổi ngoại hình khi ký túc:** Ký sinh trôi nổi sâu trong tâm thần linh hải, không bám lên da thịt.
* **6. Công năng cụ thể:** Trích đoạn nguyên tác: 'Tiêu hao chân nguyên kích thích tăng phúc trực giác cảm ứng của bản thân trong khoảnh khắc, phát hiện manh mối ẩn giấu mà mắt thường bỏ sót' [Dòng 29101, 29643] (không chắc)
* **7. Cách tiêu hao chân nguyên:** Tiêu hao cơ sở: 0.8 thành chân nguyên sơ giai (thiển hồng) mỗi lần kích phát trực giác định hướng phương vị nguy nan hoặc cơ duyên.
* **8. Tác dụng phụ / Tệ đoan:** Thế công vô hình, trực giác chỉ có tính định hướng chứ không thể thay thế chứng cứ rõ ràng và đôi lúc vẫn bị phán đoán sai lầm
* **9. Loại thức ăn:** Hạt sương mai đọng trên cỏ linh chi hoặc một mẩu nguyên thạch nhỏ.
* **10. Khẩu phần & Tần suất ăn:** Hút linh khí từ mẩu nguyên thạch nhỏ, 10 ngày một lần.
* **11. Giá thị trường:** Cổ chuyên dụng điều tra phá án độc môn.
* **12. Mô tả triết lý:** Linh cảm sắc bén mách bảo hung cát, tin vào trực giác của chính mình để thoát hiểm trong gang tấc.

---
