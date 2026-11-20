# DỰ TÍNH NHÂN VẬT & THIẾT KẾ CƠ SỞ DỮ LIỆU NPC
## CỐT TRUYỆN NĂM THỨ NHẤT — CỔ NGUYỆT SƠN TRẠI & PHỤ CẬN
> **Căn cứ nguồn nguyên tác:** `quyen1.md` (Dòng 1 $\longrightarrow$ Dòng 13146).  
> **Mục tiêu:** Định hình toàn bộ hệ thống nhân vật cho bản thử nghiệm (Prototype) game tương tác Năm Thứ Nhất.  
> **Nguyên tắc:** Bám sát tuyệt đối sự kiện nguyên tác, tối giản cấu trúc dữ liệu, không vẽ vời tiểu sử dư thừa cho nhân vật phụ.

---

## MỤC LỤC
1. [I. TỔNG QUAN PHÂN TẦNG NHÂN VẬT SƠN TRẠI](#i-tổng-quan-phân-tầng-nhân-vật-sơn-trại)
2. [II. HỆ THỐNG GIA LÃO & LÃNH ĐẠO (TỨ CHUYỂN & TAM CHUYỂN)](#ii-hệ-thống-gia-lão--lãnh-đạo-tứ-chuyển--tam-chuyển)
   - [1. Tộc Trưởng Cổ Nguyệt Bác](#1-tộc-trưởng-cổ-nguyệt-bác-tứ-chuyển-sơ-giai)
   - [2. Tầng 1: 5 Gia Lão Cốt Cán](#2-tầng-1-5-gia-lão-cốt-cán-tương-tác-trực-tiếp)
   - [3. Tầng 2: Khối Hội Đồng Gia Lão Vô Danh](#3-tầng-2-khối-hội-đồng-gia-lão-vô-danh-15--18-vị)
3. [III. HỌC VIÊN CÙNG KHÓA HỌC ĐƯỜNG (57 ĐỆ TỬ THỨC TỈNH KHÔNG KHIẾU)](#iii-học-viên-cùng-khóa-học-đường-57-đệ-tử-thức-tỉnh-không-khiếu)
   - [1. NPC Kình Địch: Cổ Nguyệt Phương Nguyên](#1-npc-kình-địch-bạn-học-cổ-nguyệt-phương-nguyên)
   - [2. NPC Thiên Tài: Cổ Nguyệt Phương Chính](#2-npc-thiên-tài-cổ-nguyệt-phương-chính)
   - [3. Nhóm Thiếu Gia Cốt Cán (Ất đẳng)](#3-nhóm-thiếu-gia-cốt-cán-ất-đẳng)
   - [4. Khối Học Viên Phổ Thông (Bính đẳng & Đinh đẳng)](#4-khối-học-viên-phổ-thông-bính-đẳng--đinh-đẳng)
4. [IV. CỔ SƯ TIỀN BỐI & THIÊN TÀI GIA TỘC (NHỊ CHUYỂN - HIẾM GẶP)](#iv-cổ-sư-tiền-bối--thiên-tài-gia-tộc-nhị-chuyển---hiếm-gặp)
5. [V. NHÓM NGOẠI LAI & PHÀM NHÂN](#v-nhóm-ngoại-lai--phàm-nhân)

---

## I. TỔNG QUAN PHÂN TẦNG NHÂN VẬT SƠN TRẠI
*(Trọng tâm là học sinh Năm 1 tại Học đường; các Cổ sư Nhị chuyển tiền bối là lực lượng dã ngoại, chỉ xuất hiện như các nhân vật đặc biệt trong các sự kiện hiếm hoi).*

```
                  +----------------------------------------------+
                  |         TỘC TRƯỞNG (Tứ chuyển sơ giai)       |
                  |               Cổ Nguyệt Bác                  |
                  +----------------------+-----------------------+
                                         |
                  +----------------------+-----------------------+
                  |         HỘI ĐỒNG GIA LÃO (Tam chuyển)        |
                  |  [5 Cốt cán tương tác] + [15-18 Vị Hội đồng] |
                  +----------------------+-----------------------+
                                         |
        +--------------------------------+--------------------------------+
        |                                                                 |
+-------+-----------------------------+         +-------------------------+--------------------+
| CỔ SƯ TIỀN BỐI & THIÊN TÀI (2C)     |         |   HỌC ĐƯỜNG NĂM 1 (57 Đệ tử Nhất chuyển)     |
| (Nhân vật đặc biệt / Hiếm gặp)      |         | Phương Nguyên, Phương Chính, Mạc Bắc,        |
| Thanh Thư, Xích Sơn, Mạc Nhan...    |         | Xích Thành, Kim Châu, Cổ Nguyệt Bằng...      |
+-------------------------------------+         +-------------------------+--------------------+
                                                                          |
                                                +-------------------------+--------------------+
                                                |        PHÀM NHÂN & GIA NÔ (Không có Cổ)      |
                                                | Cữu phụ, cữu mẫu, Thẩm Thúy, gia nô,         |
                                                | tiểu nhị quán trọ, nông phu chân núi        |
                                                +----------------------------------------------+
```

---

## II. HỆ THỐNG GIA LÃO & LÃNH ĐẠO (TỨ CHUYỂN & TAM CHUYỂN)

### 1. Tộc Trưởng: Cổ Nguyệt Bác (Tứ chuyển sơ giai)
* **Thân phận:** Người đứng đầu Cổ Nguyệt nhất tộc, quyền lực tối cao (`[Dòng 75]`).
* **Tính cách / Cơ chế chính trị:** Thâm sâu, thủ đoạn chính trị thuần thục (`[Dòng 13101]`). Cố gắng duy trì thế cân bằng quyền lực bằng cách nâng đỡ các nhân tố mới để kiềm chế hai đại phe phái Xích mạch và Mạc mạch.
* **Hành vi trong Năm 1:**
  * Thu dưỡng Cổ Nguyệt Phương Chính làm đệ tử đích truyền, bí mật cấp tài nguyên và trao tặng **Ngọc Bì Cổ** nhằm đào tạo hạt giống chống lại Bạch Ngưng Băng của Bạch gia trại (`[Dòng 8171, 12238]`).
  * Chủ trì khảo hạch cuối năm, trao thưởng 100 khối nguyên thạch và giăng bẫy chọn tiểu tổ ép Phương Nguyên lộ thế lực chống lưng (`[Dòng 13063]`).

---

### 2. Tầng 1: 5 Gia Lão Cốt Cán (Tương tác trực tiếp)
Năm vị Gia lão Tam chuyển này chịu trách nhiệm vận hành các hệ sinh thái gameplay chính trong Năm 1:

| Tên / Chức vị | Phẩm giai | Phe phái | Tính năng Gameplay đảm nhiệm | Căn cứ nguyên tác |
| :--- | :---: | :--- | :--- | :--- |
| **Học Đường Gia Lão** | Tam chuyển | Trung lập (ngả về Tộc trưởng) | **NPC Đào tạo & Quản lý thi cử:** Dạy pháp minh tưởng, phát trợ cấp 3 nguyên thạch/tuần, tổ chức chọn Cổ bản mệnh, làm trọng tài khảo hạch bắn bia thảo nhân và lôi đài Niên Mạt Khảo Hạch; sơ cứu vết thương. | `[Dòng 467, 1090, 3806, 12132, 13001]` |
| **Cổ Nguyệt Xích Luyện** | Tam chuyển | Đứng đầu **Xích Mạch** | **NPC Thế lực 1 (Phe Xích):** Tóc đỏ, tính nóng nảy; bảo bọc và gian lận tiếp sức cho cháu nội Xích Thành; tuyển mộ các học sinh có tiềm năng hoặc xuất thân Xích chi để mở rộng vây cánh. | `[Dòng 565, 982, 12162, 13071]` |
| **Cổ Nguyệt Mạc Trần** | Tam chuyển | Đứng đầu **Mạc Mạch** | **NPC Thế lực 2 (Phe Mạc):** Mưu mô, đối địch truyền đời với Xích Luyện; nắm giữ huyết mạch kinh tế, điền trang, tiệm trọ trong trại; chống lưng cho cháu nội Mạc Bắc. | `[Dòng 601, 984, 13071, 19100]` |
| **Hình Đường Gia Lão** | Tam chuyển | Phe Pháp luật / Trừng phạt | **NPC Tư pháp & Điều tra ngầm:** Thiết diện vô tư, lãnh đạm. Xuất hiện tại Mùa Hạ khi thương đội Cổ Kim Sinh bị ám hại; phái cổ sư ngầm giám sát, điều tra học viên có hành tung mờ ám ngoài trại. | `[Dòng 9650, 13093]` |
| **Cổ Nguyệt Dược Cơ** | Tam chuyển | Đứng đầu **Dược Đường** | **NPC Y tế & Hồi phục:** Nắm giữ độc quyền y sư trị liệu và dược thảo toàn trại; bà nội của Cổ Nguyệt Dược Nhạc; nơi học viên đổi điểm cống hiến/nguyên thạch lấy thuốc men hồi máu. | `[Dòng 17317, 25357]` |

---

### 3. Tầng 2: Khối Hội Đồng Gia Lão Vô Danh (15 – 18 vị)
* **Nguyên tắc thiết kế:** Không đặt tên riêng, không viết cốt truyện cá nhân. Toàn bộ hành vi được gộp thành thực thể **Hội Đồng Gia Tộc (Clan Council)** theo đúng miêu tả nguyên tác: *"ngồi như pho tượng"*, *"mắt xem mũi, mũi xem tâm"*.
* **Phân bổ cấu trúc ghế Hội đồng (Dùng cho cơ chế bỏ phiếu / danh vọng):**
  * Ghế thuộc phe Tộc Trưởng: **6 ghế**.
  * Ghế thuộc phe Xích Mạch: **5 ghế**.
  * Ghế thuộc phe Mạc Mạch: **5 ghế**.
  * Ghế Trung lập / Lão tướng chiến đấu (như Khương Tiêm, Xích Chung...): **4 ghế**.
* **Cơ chế vận hành trong Gameplay Năm 1:**
  1. **Ban Giám Khảo Khảo Hạch:** Đánh giá điểm tu vi và phong cách chiến đấu lôi đài của người chơi tại kỳ thi cuối năm (`[Dòng 12160, 13049]`).
  2. **Chỉ số Danh Vọng Phe Phái (Faction Reputation):** Hành động của người chơi trong năm (kết thân với Mạc Bắc, theo hầu Xích Thành, trung thành với tộc trưởng, hoặc hành xử độc lập như Phương Nguyên) sẽ làm thay đổi độ thiện cảm của từng nhóm ghế trong Hội đồng.
  3. **Lời mời Tiểu tổ cuối kỳ:** Ở cuối đợt khảo hạch (`[Dòng 13063]`), tùy thuộc vào chỉ số thiện cảm này, các tiểu tổ trực thuộc các gia lão sẽ đưa ra lời mời gia nhập tương ứng.

---

## III. HỌC VIÊN CÙNG KHÓA HỌC ĐƯỜNG (57 ĐỆ TỬ THỨC TỈNH KHÔNG KHIẾU)

* **Số liệu Khai Khiếu Đại Điển (`[Dòng 906, 3224]`):**
  * Toàn tộc có **hơn 100 thiếu niên 15 tuổi** tham gia lội Chân nguyên hải.
  * Hơn **40 thiếu niên thất bại** (không gọi được Hi Vọng Cổ, không có khiếu vị), bị bóp chết hy vọng tu hành, giáng xuống làm phàm nhân tầng đáy (như Cổ Nguyệt Trần Bác `[Dòng 521]`). Tỷ lệ này đúng với tỷ lệ gia tộc 6/10 có tư chất (`[Dòng 529]`).
  * **Đúng 57 đệ tử thức tỉnh thành công không khiếu** và hợp thành sĩ số lớp học đường Năm Thứ Nhất (`[Dòng 998, 3224, 12130]`).
* **Phân bổ lựa chọn Cổ Trùng Bản Mệnh (`[Dòng 3224, 3244]`):**
  * **35 học viên:** Đủ điều kiện và tư chất chọn luyện **Nguyệt Quang Cổ** (Cổ công kích tầm xa trấn tộc).
  * **22 học viên:** Tư chất Đinh đẳng yếu kém, không đủ chân nguyên nuôi dưỡng Nguyệt Quang Cổ, phải chọn các Cổ phụ trợ / hậu cần (như Ôn Ti Chu dệt vải `[Dòng 12281]`) và phải đứng ngoài sân nhìn 35 bạn cùng lớp tập bắn Nguyệt Nhận.

---

### 1. NPC Kình Địch / Bạn Học: Cổ Nguyệt Phương Nguyên
* **Tư chất:** Bính đẳng (44% chân nguyên Thanh Đồng).
* **Bản mệnh Cổ:** Nguyệt Quang Cổ.
* **Cổ trùng bí mật nắm giữ (Năm 1):** Tửu Trùng (Mùa Xuân), Bạch Thỉ Cổ (Mùa Thu - đạt 1 trư chi lực). *(Lưu ý: Mùa Hạ đổ thạch trúng Lại Thổ Cáp Mô Nhị chuyển bán lấy 500 nguyên thạch; sang Năm 2 mới mua Hắc Thỉ Cổ từ thương đội).*
* **Tính cách / Profile:** Trùng sinh ma đạo 500 năm, tàn nhẫn, cực kỳ lý trí, không thể lay chuyển bằng tình cảm, sẵn sàng ra tay độc thủ.
* **Hành vi cố định trong Năm 1:**
  * Luôn đoạt hạng nhất luyện hóa Cổ bản mệnh đầu tiên (15 nguyên thạch).
  * Chặn cổng học đường tống tiền 1 nguyên thạch/người mỗi tuần. Người chơi đối mặt lựa chọn: *Chống cự (bị đấm) / Nộp tiền bảo an / Lén tránh mặt*.
  * Đi săn bí mật ngoài trại, hạ sát Cổ Kim Sinh diệt khẩu.
  * Chung kết Niên Mạt Khảo Hạch: Đánh gục Phương Chính, đấm nát Ngọc Bì Cổ đoạt Quán quân.

### 2. NPC Thiên Tài: Cổ Nguyệt Phương Chính
* **Tư chất:** Giáp đẳng (99% chân nguyên).
* **Bản mệnh Cổ:** Nguyệt Quang Cổ. Cổ phụ trợ: **Ngọc Bì Cổ** (do Tộc trưởng ban thưởng).
* **Tu vi cuối năm:** **Nhị chuyển sơ giai** (người duy nhất lên Nhị chuyển trong khóa).
* **Tính cách:** Tự ti dưới cái bóng của anh trai, khao khát được công nhận, ngây thơ, phụ thuộc vào chỉ bảo của Tộc trưởng.
* **Hành vi:** Luôn bị Phương Nguyên trấn áp tâm lý; lọt vào chung kết lôi đài và bị đánh chấn thương sọ não.

### 3. Nhóm Thiếu Gia Cốt Cán (Ất đẳng)
* **Cổ Nguyệt Mạc Bắc (Mạc Mạch):**
  * *Tư chất:* Ất đẳng (66%). Dáng người mặt ngựa, thô bạo, kiêu ngạo.
  * *Tu vi cuối năm:* Nhất chuyển đỉnh phong.
  * *Hành vi:* Đem gia nô đến đánh Phương Nguyên nhưng thất bại; đối thủ kình địch của Xích Thành.
* **Cổ Nguyệt Xích Thành (Xích Mạch):**
  * *Tư chất:* Bính đẳng giả danh Ất đẳng (nhờ ông nội Xích Luyện rửa chân nguyên). Vóc dáng lùn nhỏ, đố kỵ.
  * *Tu vi cuối năm:* Nhất chuyển đỉnh phong.
  * *Hành vi:* Thường xuyên bị Phương Nguyên đè đầu cướp đá; ganh đua từng điểm với Mạc Bắc.

### 4. Khối Học Viên Phổ Thông (53 học viên còn lại trong lớp)
* **Nhân vật tiêu biểu có tên:**
  * **Cổ Nguyệt Kim Châu:** Nữ đệ tử, tư chất Bính đẳng, tu vi Nhất chuyển trung giai (`[Dòng 12138]`).
  * **Cổ Nguyệt Bằng:** Nam đệ tử, tư chất Đinh đẳng, tu vi Nhất chuyển sơ giai (`[Dòng 12142]`).
* **Phân bổ nội bộ:**
  * Khoảng **25 học viên Bính đẳng:** Tu vi trung bình từ Nhất chuyển trung giai đến cao giai. Là đối tượng chính bị Phương Nguyên trấn lột hàng tuần.
  * Khoảng **28 học viên Đinh đẳng:** Tu vi chỉ đạt Nhất chuyển sơ giai đến trung giai, chật vật nuôi Cổ trùng, tương lai chủ yếu làm hậu cần hoặc bộc dịch gia tộc.

---

## IV. NHÓM NGOẠI LAI & PHÀM NHÂN

1. **Thương Đội Cổ Gia (Mùa Hạ):**
   * **Cổ Phú:** Đệ nhất thủ lĩnh thương đội (Tam chuyển cao giai), sắc sảo, gây sức ép ngoại giao lên Tộc trưởng Cổ Nguyệt Bác.
   * **Cổ Kim Sinh:** Nhị thiếu gia thương đội (Nhất chuyển đỉnh phong), hống hách gian manh nhưng bị Phương Nguyên gài bẫy mua bán bí mật Động Hoa Tửu (Lưu Ảnh Thạch Bích) rồi giết diệt khẩu tại sườn núi.
2. **Ma Đạo Ngoại Lai (Mùa Đông):**
   * **Vương Đại:** Ma đạo cổ sư, mang cổ độc Ái Sinh Ly lẻn vào trại báo thù gia tộc họ Vương; bị Phương Nguyên phản sát.
3. **Phàm Nhân Nội Trại:**
   * **Cổ Nguyệt Đống Thổ & Cữu Mẫu:** Cậu mợ nuôi nấng anh em Phương Nguyên, tham lam, chiếm đoạt khách sạn di sản cha mẹ để lại, ghẻ lạnh Phương Nguyên và nịnh bợ Phương Chính.
   * **Thẩm Thúy:** Nha hoàn phàm nhân từng hầu hạ Phương Nguyên, thấy hắn Bính đẳng liền quay sang nịnh bợ hầu hạ Phương Chính để mong thoát nô tịch.
   * **Vương Nhị, Thợ Săn, Tiểu Nhị:** Tầng lớp lao động tay chân, phục vụ Cổ sư trong trại và các quán xá.
4. **Phàm Nhân Chân Núi:**
   * Hàng ngàn nông phu canh tác ruộng bậc thang và thợ săn thú hoang tại hơn chục thôn trang chịu sự bảo hộ của Cổ Nguyệt Sơn Trại.
