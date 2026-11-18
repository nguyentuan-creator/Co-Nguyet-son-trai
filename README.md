# CỔ CHÂN NHÂN: THIÊN ĐẠO VÔ TÌNH (ROLEPLAY ENGINE)

Dự án game nhập vai phiêu lưu văn bản (Interactive Fiction / Text RPG) lấy bối cảnh thế giới tu chân tàn khốc của nguyên tác tiểu thuyết **Cổ Chân Nhân** (Gu Daoist Master / Reverend Insanity). 

Game được xây dựng theo kiến trúc **Hybrid RPG Engine**: Kết hợp giữa **Code Deterministic (Python/JS)** xử lý trạng thái cứng, xúc xắc, lịch trình NPC và **Large Language Model (Gemini API)** đóng vai trò Quản trò tối cao (Game Master - GM) dẫn dắt mạch truyện biến hóa theo từng hành vi của người chơi.

---

## MỤC LỤC
1. [Tầm Nhìn & Phạm Vi Giai Đoạn 1 (Thanh Mao Sơn)](#1-tầm-nhìn--phạm-vi-giai-đoạn-1-thanh-mao-sơn)
2. [Cơ Sở Dữ Liệu Module Hóa (Modular Database)](#2-cơ-sở-dữ-liệu-module-hóa-modular-database)
3. [Bản Đồ Phân Vùng & Cơ Chế "Chunk Loading"](#3-bản-đồ-phân-vùng--cơ-chế-chunk-loading)
4. [Mô Phỏng Thế Giới Sống (Living World Engine)](#4-mô-phỏng-thế-giới-sống-living-world-engine)
5. [Ma Trận Tác Động 2 Chiều: Độ Bại Lộ vs Sức Nặng Bản Thể](#5-ma-trận-tác-động-2-chiều-độ-bại-lộ-vs-sức-nặng-bản-thể)
6. [Lịch Trình Sinh Hoạt & Ma Trận Xuất Hiện NPC](#6-lịch-trình-sinh-hoạt--ma-trận-xuất-hiện-npc)
7. [Cơ Chế Phán Định Xúc Xắc d100: Đối Kháng Biên Độ Δ](#7-cơ-chế-phán-định-xúc-xắc-d100-đối-kháng-biên-độ-δ)
8. [Bước Nhảy Vọt Độ Khó Tại Mốc Tam Chuyển & Đại Đào Tẩu](#8-bước-nhảy-vọt-độ-khó-tại-mốc-tam-chuyển--đại-đào-tẩu)
9. [Cấu Trúc Thư Mục Kỹ Thuật Dự Kiến](#9-cấu-trúc-thư-mục-kỹ-thuật-dự-kiến)

---

## 1. TẦM NHÌN & PHẠM VI GIAI ĐOẠN 1 (THANH MAO SƠN)

Triết lý thiết kế: **"Mật độ nội dung cao hơn Quy mô bản đồ" (High Density over Wide Scale)**. Thay vì làm dàn trải cả Ngũ Vực, Giai đoạn 1 tập trung toàn bộ tài nguyên để xây dựng **Thanh Mao Sơn** thành một hộp cát sinh tồn (Living Sandbox) cực kỳ chi tiết, nhiều tầng lớp xã hội và tự do phát triển lối chơi.

* **Bối cảnh không gian:** Thanh Mao Sơn (Nam Cương) với thế chân vạc của Tam Đại Gia Tộc:
  * **Cổ Nguyệt Sơn Trại:** Chuyên Nguyệt đạo, Mộc đạo; gia tộc quý tộc coi trọng huyết thống, nội bộ chia rẽ bè phái.
  * **Bạch Gia Trại:** Chuyên Băng đạo, Thủy đạo; tàn nhẫn, lạnh lùng, sở hữu quái kiệt Bắc Minh Băng Phách Thể Bạch Ngưng Băng.
  * **Hùng Gia Trại:** Chuyên Lực đạo, Thổ đạo; hiếu chiến, chuộng cơ bắp, mưu mô châm ngòi chiến tranh giữa hai trại còn lại.
* **Khung thời gian:** Từ **Mùa Xuân Năm 1 (Lễ Khai Khiếu)** đến **Mùa Xuân Năm 3 (Đại biến Thanh Mao Sơn)**.
* **Cực hạn cảnh giới:**
  * Người chơi: Phàm nhân $\rightarrow$ Nhất chuyển $\rightarrow$ Cực hạn đạt **Nhị chuyển Đỉnh phong** (hoặc bứt phá Tam chuyển sớm).
  * Thế lực bản địa: Cổ sư 1–2 chuyển (phổ thông), 3 chuyển (Gia lão), 4 chuyển (Tộc trưởng).
  * Cực hạn tuyệt đối màn 1: 5 chuyển (Cổ Nguyệt Nhất Đại và Thiên Hạc Thượng Nhân). Tuyệt đối không có Cổ Tiên giáng lâm.
* **Điều kiện hoàn thành Màn 1 (Exit Conditions):**
  * **Thành công (Chiến thắng):** Sống sót tẩu thoát thành công khỏi ngọn núi khi thảm họa ập đến (theo thương đội, đi cùng Phương Nguyên, hoặc tự phá vây thành Ma đạo độc hành).
  * **Thất bại (Permadeath):** Chết trong thú triều, bị gia tộc xử tử, bị Phương Nguyên thủ tiêu, hoặc bị đóng băng vĩnh viễn trong trận tuyết bạo Năm 3.

---

## 2. CƠ SỞ DỮ LIỆU MODULE HÓA (MODULAR DATABASE)

Dữ liệu được tổ chức thành các file JSON độc lập để nạp động, tránh nhồi nhét quá tải Context Window của LLM:

### A. Kho Cổ Trùng & Cây Hợp Luyện (Build Diversity)
Bao phủ đầy đủ **8 Lưu Phái Phàm Giai** (Nguyệt, Lực, Thổ, Mộc, Thủy/Băng, Viêm, Lôi, Ám/Trinh sát) với hàng chục con Phàm Cổ ($1-3$ chuyển):
* **Thuộc tính chuẩn hóa:** Mã Cổ (`GU-XXX`), Tên, Số chuyển, Lưu phái, Phân loại (Công/Thủ/Di chuyển/Trị liệu/Trinh sát/Phụ trợ), Công năng & Hao phí Chân nguyên hải theo từng tiểu cảnh giới.
* **Quy tắc sinh tồn:** Loại thức ăn bắt buộc, Chu kỳ ăn (ngày), Hệ quả khi đói (phản phệ, héo úa, chết).
* **Cây Hợp Luyện Đa Nhánh (Refinement Web):** Cổ 1 chuyển có thể rẽ nhiều hướng lên 2 chuyển (Vd: *Nguyệt Quang Cổ* kết hợp với các Cổ khác ra *Nguyệt Mang, Sương Nguyệt, U Nguyệt, Nguyệt Toàn...*).

### B. Hệ Thống Xã Hội 3 Tầng
* **Tầng 1 - Nhân Vật Độc Nhất (Unique NPCs - 25~30 người):** Phương Nguyên, Phương Chính, Mạc Bắc, Xích Thành, Tộc trưởng Cổ Nguyệt Bác, Học Đường Gia Lão, Bạch Ngưng Băng, Thần bộ Thiết Huyết Lãnh, Giả Kim Sinh... Có mục tiêu cá nhân, bài tẩy ẩn giấu và điểm yếu chí mạng.
* **Tầng 2 - Cổ Sư Gia Tộc Bán Thủ Tục (Procedural Gu Masters - 150~200 người):** Có họ tên đàng hoàng (Cổ Nguyệt Nam, Bạch Trạch...), thuộc các tổ đội (Tuần tra, Săn bắn, Trinh sát), mang bộ Cổ ngẫu nhiên theo hệ và tính cách đa dạng.
* **Tầng 3 - Quần Chúng Phàm Nhân (Mortals):** Nông dân, gia nô, thợ săn, tửu bảo dưới chân núi. Cung cấp thực phẩm nuôi Cổ, phục vụ các nhu cầu vật chất và làm bia đỡ đạn khi thú triều tràn về.

---

## 3. BẢN ĐỒ PHÂN VÙNG & CƠ CHẾ "CHUNK LOADING"

Lấy cảm hứng từ cơ chế nạp thế giới của *Minecraft*:
* Thế giới phân cấp thành các **Chunk (Khu vực cục bộ)**:
  * Trong trại: *Học Đường, Diễn Võ Trường, Khu Chợ / Sòng Đổ Thạch, Tửu Quán, Khu Nhà Ở, Nội Vụ Đường, Hình Đường, Từ Đường*.
  * Ngoài trại: *Rừng Trúc Bích Ngọc, Bãi Săn Lợn Rừng, Vách Núi Động Hoa Tửu, Thung Lũng Lang Triều, Huyết Hồ Ngầm*.
* **Cơ chế Nạp:** Chỉ khi người chơi bước chân vào Chunk nào, Backend mới nạp thông tin Chunk đó (mô tả cảnh trí, NPC có mặt, vật phẩm tại chỗ) vào prompt.
* **Tiết kiệm Token:** Giảm hơn **90% chi phí API**, loại bỏ tình trạng AI bị ảo giác hoặc lơ là thông tin do đọc prompt quá dài.

---

## 4. MÔ PHỎNG THẾ GIỚI SỐNG (LIVING WORLD ENGINE)

Thế giới vận hành độc lập, không đứng yên chờ đợi người chơi:

1. **Đồng Hồ Thế Giới & Mạch Truyện Cố Định (World Timeline):**
   * Thời gian nhảy số theo từng hành động của người chơi (nói chuyện: $+15$ phút, bế quan: $+1$ tháng).
   * Các sự kiện nguyên tác (Án mạng Giả Kim Sinh, Lang triều, Thủy tổ thức tỉnh) vẫn sẽ tự động nổ ra đúng ngày giờ nếu người chơi không can thiệp.
2. **Cơ Chế Bắt Kịp Khi Nạp Vùng (Lazy Catch-Up Evaluation):**
   * Các vùng người chơi chưa ghé thăm sẽ ở trạng thái "ngủ đông" (tốn $0$ token). Khi người chơi bước vào, hàm Catch-up sẽ tự tính toán khoảng thời gian trôi qua để cập nhật trạng thái mới nhất (Vd: Bí cảnh Tam Vương tự động mở sau 3 năm).
3. **Sóng Chấn Động Toàn Cầu (Global Ripple Bus):**
   * Các hành động cấp vĩ mô (ở Trung Châu, Thiên Đình hay hủy diệt Giới Bích) sẽ gửi tín hiệu vào bảng cờ toàn cầu. Mọi Chunk khi được nạp đều tự động phản chiếu biến động này.
4. **Dòng Chảy Tin Đồn & Kinh Tế (Rumor Propagation):**
   * Người chơi không cần đến nơi xảy ra biến cố vẫn có thể nghe thấy tin tức qua: Khách đàm tiếu tại Tửu quán, Thương đội vãng lai, Bảng bố cáo gia tộc.
   * Thị trường tự biến động theo tin tức (Vd: Tam Vương mở $\rightarrow$ Giá Cổ trị liệu tại chỗ tăng $+25\%$).

---

## 5. MA TRẬN TÁC ĐỘNG 2 CHIỀU: ĐỘ BẠI LỘ vs SỨC NẶNG BẢN THỂ

Tách bạch giữa **Độ Phổ Biến (Visibility - $V$)** và **Sức Nặng Vận Mệnh (Weight - $W$)**:

* **Góc Bí Mật Kinh Thiên (Thấp $V$ - Cao $W$):** 
  * Những sự kiện cực ít người biết nhưng làm sụp đổ đại cục (Vd: Phương Nguyên trùng sinh, phá cấm chế Huyết Hồ của Nhất Đại, thể chất Bạch Ngưng Băng).
* **Cơ Chế Kíp Nổ Hẹn Giờ (Silent Fuse):**
  * Khi người chơi bí mật tác động vào một then chốt lịch sử, bề ngoài thế giới vẫn trôi qua bình lặng. Đến mốc thời gian quy định, hậu quả ngầm bộc phát tạo thành một cú "Twist" kinh thiên động địa bẻ gãy tuyến truyện cũ.
* **Trí Đạo Suy Toán & Phản Phệ Thiên Ý:**
  * Dù hành động bí mật nhưng nếu sức nặng quá lớn sẽ gây nhiễu loạn thiên cơ, thu hút Cổ sư Trí đạo bấm quẻ điều tra hoặc bị Thiên Ý gieo rắc vận xui ngầm.

---

## 6. LỊCH TRÌNH SINH HOẠT & MA TRẬN XUẤT HIỆN NPC

NPC có cuộc sống và thời gian biểu riêng theo các canh giờ (Sáng, Trưa, Chiều, Tối, Đêm):
* **Xác suất theo địa điểm:**
  * Nhóm thiếu niên mới khai khiếu: Sáng ở Học đường (95%), chiều ở Diễn võ trường (60%), tối về nhà riêng (100%).
  * Phương Nguyên: Hay trốn học, chiều săn lợn ngoài rừng, đêm ra vách núi tìm động Hoa Tửu (80%).
* **Ghi Đè Sự Kiện (Event Overrides):**
  * Khi Lang triều bùng phát, toàn bộ học đường đóng cửa. Thiếu niên và Cổ sư trưởng thành bị cưỡng chế điều động: 70% lên mặt thành canh gác, 25% ở bệnh xá trị thương.
* **Tối ưu Token:** Code Backend tự roll xác suất trước $\rightarrow$ Chỉ gửi đúng danh sách NPC đang thực sự có mặt vào ngữ cảnh AI.

---

## 7. CƠ CHẾ PHÁN ĐỊNH XÚC XẮC d100: ĐỐI KHÁNG BIÊN ĐỘ Δ

Loại bỏ các công thức cộng dồn điểm số rườm rà, sử dụng **Mô hình Đối Kháng Biên Độ $\Delta$ (Delta System)** trực quan và kịch tính:

1. **Bước 1 - AI Định Giá Thách Thức:** Dựa vào bối cảnh, cảnh giới địch và địa hình, AI thiết lập mục tiêu: **`Target` ($1 \rightarrow 100$)**.
2. **Bước 2 - Người Chơi Gieo Xúc Xắc:** Code Backend/Client gieo xúc xắc ngẫu nhiên khách quan: **`Player Roll` ($1 \rightarrow 100$)**.
3. **Bước 3 - Đo Độ Lệch Biên Độ $\Delta$ ($\text{Player Roll} - \text{Target}$):** Biên độ dao động từ **$-99$ đến $+99$**, quyết định trực tiếp mức độ diễn biến:

| Biên Độ $\Delta$ | Trạng Thái Phán Quyết | Diễn Biến Cốt Truyện Trong Game |
| :---: | :---: | :--- |
| **$+50 \rightarrow +99$** | **Nghiền Ép Tuyệt Đối** | Miêu sát, hoàn hảo không tì vết, đoạt trọn vẹn Cổ trùng và tài nguyên. |
| **$+15 \rightarrow +49$** | **Thắng Lợi Áp Đảo** | Thắng áp đảo, hạ gục nhanh chóng, tiêu hao rất ít chân nguyên. |
| **$+1 \rightarrow +14$** | **Thắng Hiểm / Trả Giá** | Thắng sít sao nhưng bị thương tích, cạn kiệt chân nguyên hoặc Cổ bị sứt mẻ. |
| **$0$** | **Thế Trận Cân Bằng** | Bất phân thắng bại, bật lùi thăm dò, chuyển sang thế giằng co. |
| **$-14 \rightarrow -1$** | **Thất Bại Kiểm Soát** | Đòn đánh bị chặn đứng, mất thế chủ động nhưng kịp thời rút lui an toàn. |
| **$-49 \rightarrow -15$** | **Thảm Bại / Trọng Thương** | Bị phản đòn nặng nề, rạn nứt Khiếu bích, Cổ trùng bị thương, buộc tháo chạy. |
| **$-50 \rightarrow -99$** | **Tuyệt Cảnh Sinh Tử** | Rơi vào cửa tử, trúng mai phục chí mạng; cận kề cái chết nếu không có bài tẩy. |

---

## 8. BƯỚC NHẢY VỌT ĐỘ KHÓ TẠI MỐC TAM CHUYỂN & ĐẠI ĐÀO TẨU

Khi người chơi đạt cảnh giới **Tam Chuyển (Bạch Ngân Chân Nguyên)**, độ khó của game tăng vọt theo cấp số nhân:

* **Tư cách Gia Lão & Cạm bẫy chính trị:** Bị ép phải chọn phe (phe Tộc trưởng vs phe Mạc vs phe Xích). Kẻ trung lập sẽ bị cả 3 phe ngấm ngầm bài xích và trừ khử.
* **Gông cùm Mệnh Bài (#058):** Bắt buộc phải nhỏ máu lập Mệnh Bài gửi Từ Đường. Muốn đào tẩu bắt buộc phải có kế hoạch đánh trộm hoặc phá hủy Mệnh Bài trước.
* **Gánh nặng kinh tế khổng lồ:** Cổ 3 chuyển tiêu hao hàng ngàn Nguyên thạch mỗi tháng để nuôi dưỡng. Rời khỏi nguồn cấp dưỡng của gia tộc mà không có kế hoạch kinh tế sẽ khiến Cổ chết đói phản phệ.
* **Chế độ Săn Đuổi (Pursuit Mode):** Khi trốn chạy, người chơi trở thành Ma đạo bị truy sát bởi các tổ Chấp pháp tinh nhuệ, các Gia lão khác và chính Tộc trưởng Tứ chuyển, đồng thời bị hai trại Bạch - Hùng vây sát đoạt Cổ.
* **Hai Nhánh Kết Thúc Màn 1:**
  1. *Thủ thế trong trại:* Trở thành Gia lão quyền lực tham gia trận đại chiến Lang triều và Huyết hồ Năm 3.
  2. *Đại Đào Tẩu:* Phá vỡ Mệnh bài, vượt ngục đào tẩu thành công ra ngoài thế giới hoang dã Nam Cương trước khi sơn trại diệt vong.

---

## 9. CẤU TRÚC THƯ MỤC KỸ THUẬT DỰ KIẾN

```text
CoChanNhanRolePlay/
├── .env                       # API Key (GEMINI_API_KEY) & Cấu hình máy chủ
├── .gitignore                  # Bỏ qua file nhạy cảm và cache
├── README.md                  # Tài liệu thiết kế & Yêu cầu kỹ thuật toàn diện
├── run.bat                    # Script khởi chạy nhanh trên Windows
├── server.py                  # Proxy Server (Python) xử lý logic, xúc xắc & gọi API
├── database/                  # Cơ sở dữ liệu JSON chuẩn hóa
│   ├── gu_database.json       # Danh mục Phàm Cổ & Cây hợp luyện
│   ├── npcs.json              # Hồ sơ NPC Tầng 1 & Generator Tầng 2
│   ├── world_map.json         # Danh sách Chunks tại Thanh Mao Sơn
│   ├── npc_schedules.json     # Thời gian biểu & Ma trận xác suất xuất hiện
│   └── timeline.json          # 30 năm sự kiện thế giới & Kíp nổ ngầm
├── prompts/                   # Hệ thống System Instructions
│   ├── core_engine.md         # Giao thức bảo toàn quyền người chơi & luật GM
│   └── modules/               # Các mảnh prompt nạp động theo Chunk
└── public/                    # Frontend Giao diện Web
    ├── index.html             # Khung giao diện chính (Chat, HUD, Dice)
    ├── app.js                 # Xử lý tương tác, socket, hiển thị xúc xắc
    └── styles.css             # Giao diện phong cách Hắc Ám Tiên Hiệp
```
