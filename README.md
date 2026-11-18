# CỔ CHÂN NHÂN: THIÊN ĐẠO VÔ TÌNH (ROLEPLAY ENGINE)

Dự án game nhập vai phiêu lưu văn bản (Interactive Fiction / Text RPG) lấy bối cảnh thế giới tu chân của nguyên tác tiểu thuyết **Cổ Chân Nhân** (Gu Daoist Master / Reverend Insanity). 

Game được xây dựng theo kiến trúc **Hybrid RPG Engine**: Kết hợp giữa **Code Deterministic (Python/JS)** xử lý trạng thái cứng, xúc xắc, lịch trình NPC và **Large Language Model (Gemini API)** đóng vai trò Quản trò tối cao (Game Master - GM) dẫn dắt mạch truyện biến hóa theo từng hành động của người chơi.

---

## MỤC LỤC
1. [Phạm Vi Màn Khởi Đầu (Thanh Mao Sơn)](#1-phạm-vi-màn-khởi-đầu-thanh-mao-sơn)
2. [Cơ Sở Dữ Liệu Module Hóa (Modular Database)](#2-cơ-sở-dữ-liệu-module-hóa-modular-database)
3. [Hệ Thống Độ Thiện Cảm & Hành Vi Đặc Thù Theo Từng NPC](#3-hệ-thống-độ-thiện-cảm--hành-vi-đặc-thù-theo-từng-npc)
4. [Lịch Trình Sinh Hoạt & Ma Trận Xuất Hiện Đưa Vào Database](#4-lịch-trình-sinh-hoạt--ma-trận-xuất-hiện-đưa-vào-database)
5. [Bản Đồ Phân Vùng & Cơ Chế "Chunk Loading"](#5-bản-đồ-phân-vùng--cơ-chế-chunk-loading)
6. [Mô Phỏng Thế Giới Sống (Living World Engine)](#6-mô-phỏng-thế-giới-sống-living-world-engine)
7. [Ma Trận Tác Động 2 Chiều Của Hành Động Nhân Vật](#7-ma-trận-tác-động-2-chiều-của-hành-động-nhân-vật)
8. [Cơ Chế Phán Định Xúc Xắc d100: Đối Kháng Biên Độ Δ](#8-cơ-chế-phán-định-xúc-xắc-d100-đối-kháng-biên-độ-δ)
9. [Cơ Chế Tính Điểm Lượt Chơi (Run Scoring System)](#9-cơ-chế-tính-điểm-lượt-chơi-run-scoring-system)
10. [Cấu Trúc Thư Mục Kỹ Thuật Dự Kiến](#10-cấu-trúc-thư-mục-kỹ-thuật-dự-kiến)

---

## 1. PHẠM VI MÀN KHỞI ĐẦU (THANH MAO SƠN)

* **Không gian hoạt động:** Thanh Mao Sơn (Nam Cương), xoay quanh cục diện Tam Đại Gia Tộc:
  * **Cổ Nguyệt Sơn Trại:** Nguyệt đạo, Mộc đạo; gia tộc coi trọng huyết thống, nội bộ chia rẽ bè phái.
  * **Bạch Gia Trại:** Băng đạo, Thủy đạo; lạnh lùng, hiếu chiến, sở hữu quái kiệt Bạch Ngưng Băng.
  * **Hùng Gia Trại:** Lực đạo, Thổ đạo; chuộng cơ bắp, thô bạo, trục lợi từ xung đột của hai trại kia.
* **Thời gian hoạt động:** Từ **Mùa Xuân Năm 1 (Khai Khiếu Đại Điển)** đến **Mùa Xuân Năm 3 (Đại biến Thanh Mao Sơn)**.
* **Cảnh giới giới hạn:**
  * Người chơi: Khởi đầu từ Phàm nhân $\rightarrow$ Nhất chuyển $\rightarrow$ Nhị chuyển $\rightarrow$ Cực hạn đạt Tam chuyển.
  * Bản địa: Đệ tử/Cổ sư thông thường (1-2 chuyển), Gia lão (3 chuyển), Tộc trưởng (4 chuyển), Trùm cuối Năm 3 (5 chuyển). Không có Cổ Tiên giáng lâm.

---

## 2. CƠ SỞ DỮ LIỆU MODULE HÓA (MODULAR DATABASE)

Tách biệt toàn bộ dữ liệu thành các tệp JSON có cấu trúc chuẩn để hệ thống dễ dàng truy xuất, bổ sung và cập nhật:

### A. Cấu Trúc Cơ Sở Dữ Liệu Cổ Trùng (`gu_database.json`)
Cơ sở dữ liệu định nghĩa cấu trúc chuẩn để người phát triển tự tìm hiểu và nạp thêm Cổ trùng theo nguyên tác. Không giới hạn cứng số lượng:
* **Mã Cổ Trùng (`id`):** Định danh duy nhất (Vd: `GU-001`, `GU-057`, `GU-081`...).
* **Tên Cổ Trùng (`name`):** Tên Hán Việt theo nguyên tác.
* **Số Chuyển (`rank`):** 
  * Phàm Cổ: 1 Chuyển đến 5 Chuyển.
  * Tiên Cổ: 6 Chuyển đến 9 Chuyển.
* **Lưu Phái (`path`):** Nguyệt đạo, Lực đạo, Thổ đạo, Mộc đạo, Băng đạo, Viêm đạo, Lôi đạo, Biến hóa đạo, Trí đạo, Huyết đạo, Thời đạo...
* **Phân Loại Chức Năng (`category`):** Công kích, Phòng ngự, Di động, Trị liệu, Trinh sát, Tích trữ, Phụ trợ...
* **Chức Năng & Hao Phí (`functions`):** Miêu tả hiệu quả thực tế và lượng chân nguyên tiêu hao theo từng tiểu cảnh giới (Sơ, Trung, Cao, Đỉnh).
* **Quy Tắc Nuôi & Thức Ăn (`feeding`):** Loại thức ăn, chu kỳ cho ăn (ngày), hậu quả khi bị bỏ đói (ngủ đông, phản phệ, chết).
* **Các Cách Có Được (`acquisition`):** Bắt hoang dã, Phương công thức hợp luyện (Refinement Recipe), Mua bán / Đấu giá, Thừa kế truyền thừa.

---

## 3. HỆ THỐNG ĐỘ THIỆN CẢM & HÀNH VI ĐẶC THÙ THEO TỪNG NPC

Độ thiện cảm không chỉ là một con số vô hồn mà được ánh xạ trực tiếp thành **hành vi ứng xử đặc thù của từng nhân vật được lưu trong Database (`npcs.json`)**:

### A. Cấu Trúc Trường Thiện Cảm Trong Hồ Sơ NPC
Vì mỗi nhân vật có tính cách, dã tâm và thế giới quan khác nhau, cùng một mốc thiện cảm họ sẽ có cách đối xử hoàn toàn khác nhau:

```json
{
  "id": "NPC_PHUONG_NGUYEN",
  "name": "Cổ Nguyệt Phương Nguyên",
  "base_favor": 0,
  "favor_behaviors": {
    "hostile": {
      "threshold": -30,
      "attitude": "Coi như kẻ ngáng đường",
      "behavior": "Lạnh lùng tính kế trừ khử khi có cơ hội sinh lời, không bao giờ lộ sát khí trước mặt."
    },
    "neutral": {
      "threshold": 0,
      "attitude": "Người qua đường / Công cụ tiềm năng",
      "behavior": "Sòng phẳng, chỉ trao đổi khi có lợi ích ngang giá, không xen vào chuyện của người khác."
    },
    "favorable": {
      "threshold": 40,
      "attitude": "Đối tác hợp tác đáng tin cậy",
      "behavior": "Sẵn sàng chia phần lợi ích rõ ràng, chia sẻ một số thông tin tình báo có lợi cho cả hai."
    },
    "close_ally": {
      "threshold": 80,
      "attitude": "Đồng minh chiến lược hiếm hoi",
      "behavior": "Tuyệt đối không có chuyện tình cảm mù quáng, nhưng sẽ ưu tiên phối hợp tác chiến, cảnh báo nguy hiểm trước mắt."
    }
  }
}
```

* **So sánh ví dụ:** 
  * Cùng đạt mốc thiện cảm cao ($+80$): **Phương Chính** sẽ ngưỡng mộ, tôn sùng, chia sẻ tâm tư thầm kín; còn **Phương Nguyên** chỉ coi là đồng minh chiến lược có giá trị lợi ích lớn; **Bạch Ngưng Băng** sẽ xem là đối thủ thú vị nhất đáng để dốc toàn lực quyết đấu một trận sinh tử!

---

## 4. LỊCH TRÌNH SINH HOẠT & MA TRẬN XUẤT HIỆN ĐƯA VÀO DATABASE

Toàn bộ lịch trình sinh hoạt và xác suất xuất hiện của NPC được lưu trực tiếp vào cơ sở dữ liệu (`npc_schedules.json`) để dễ dàng theo dõi, cân bằng và tinh chỉnh:

### A. Schema Lịch Trình Sinh Hoạt
```json
{
  "NPC_ID": "NPC_PHUONG_CHINH",
  "default_schedule": {
    "TIME_SLOT_MORNING":   { "loc_hoc_duong": 0.95, "loc_dien_vo_truong": 0.05 },
    "TIME_SLOT_AFTERNOON": { "loc_dien_vo_truong": 0.70, "loc_khu_cho": 0.20, "loc_hoc_duong": 0.10 },
    "TIME_SLOT_EVENING":   { "loc_nha_o_gia_dinh": 0.85, "loc_tuu_quan": 0.15 },
    "TIME_SLOT_NIGHT":     { "loc_nha_o_gia_dinh": 1.00 }
  },
  "event_overrides": {
    "EVENT_WOLF_TIDE_ACTIVE": {
      "TIME_SLOT_ALL":     { "loc_tuong_thanh": 0.70, "loc_tram_cuu_thuong": 0.25, "loc_nha_o_gia_dinh": 0.05 }
    }
  }
}
```
* **Lợi ích:** Code Backend chỉ cần đọc file JSON này, chạy xúc xắc ngẫu nhiên xác định vị trí NPC trước khi gọi AI. Có thể thay đổi thói quen của bất kỳ ai mà không cần sửa code logic.

---

## 5. BẢN ĐỒ PHÂN VÙNG & CƠ CHẾ "CHUNK LOADING"

Lấy cảm hứng từ cơ chế nạp thế giới của *Minecraft*:
* Thế giới phân cấp thành các **Chunk (Khu vực cục bộ)**:
  * Trong trại: *Học Đường, Diễn Võ Trường, Khu Chợ / Sòng Đổ Thạch, Tửu Quán, Khu Nhà Ở, Nội Vụ Đường, Hình Đường, Từ Đường*.
  * Ngoài trại: *Rừng Trúc Bích Ngọc, Bãi Săn Lợn Rừng, Vách Núi Động Hoa Tửu, Thung Lũng Lang Triều, Huyết Hồ Ngầm*.
* **Cơ chế Nạp:** Chỉ khi người chơi bước chân vào Chunk nào, Backend mới nạp thông tin Chunk đó (mô tả cảnh trí, NPC có mặt, vật phẩm tại chỗ) vào prompt.
* **Tiết kiệm Token:** Giảm hơn **90% chi phí API**, loại bỏ tình trạng AI bị ảo giác hoặc lơ là thông tin do đọc prompt quá dài.

---

## 6. MÔ PHỎNG THẾ GIỚI SỐNG (LIVING WORLD ENGINE)

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

## 7. MA TRẬN TÁC ĐỘNG 2 CHIỀU CỦA HÀNH ĐỘNG NHÂN VẬT

Dùng để **tính toán mức độ ảnh hưởng của bất kỳ hành động nào** từ người chơi lên thế giới và quyết định việc có chỉnh sửa hay bẻ nhánh tuyến vận mệnh cố định hay không:

### A. Hai Trục Tính Toán
1. **Trục 1: Mức Độ Bại Lộ / Lan Truyền Thông Tin (Visibility - $V$):**
   * *Tier 0:* Tuyệt mật (chỉ người chơi biết, không nhân chứng, đã xóa dấu vết).
   * *Tier 1:* Số ít người biết (1-3 nhân chứng, tin đồn ngầm trong nội bộ).
   * *Tier 2:* Cục bộ biết (Toàn thể sơn trại/gia tộc điều tra công khai).
   * *Tier 3:* Khu vực biết (Thương đội đồn đại khắp Nam Cương).
   * *Tier 4:* Thiên hạ chấn động (Cổ Tiên dòm ngó, thế lực lớn can thiệp).
2. **Trục 2: Sức Nặng Thực Tế Lên Vận Mệnh (Structural Weight - $W$):**
   * Từ việc nhỏ nhặt không làm thay đổi cục diện (săn lợn, mua bán đồ vặt) đến việc phá vỡ các then chốt lịch sử (cứu/giết nhân vật định mệnh, cướp đoạt truyền thừa then chốt).

### B. Cơ Chế Chỉnh Sửa Tuyến Vận Mệnh Cố Định
* **Không ảnh hưởng vĩ mô:** Khi $W$ thấp (hoặc $V=0$ và không chạm vào điểm neo lịch sử), tuyến vận mệnh chính của thế giới giữ nguyên quỹ đạo.
* **Chỉnh sửa / Bẻ nhánh vận mệnh:** Khi hành động chạm vào các điều kiện tiên quyết (Preconditions) của sự kiện lớn, hệ thống kích hoạt rẽ nhánh (Timeline Divergence), thay đổi các sự kiện tiếp theo trong tương lai.
* **Kíp Nổ Hẹn Giờ (Silent Fuse):** Những hành động $V=0$ nhưng $W$ cực cao (hành động bí mật động trời) sẽ âm thầm cài đặt cờ biến cố ngầm, đến đúng ngày giờ quy định mới bùng nổ cú "Twist" làm thay đổi toàn bộ kết cục.

---

## 8. CƠ CHẾ PHÁN ĐỊNH XÚC XẮC d100: ĐỐI KHÁNG BIÊN ĐỘ Δ

Sử dụng **Mô hình Đối Kháng Biên Độ $\Delta$ (Delta System)** trực quan, công bằng và kịch tính:

1. **Bước 1 - AI Định Giá Thách Thức:** Dựa vào bối cảnh, thực lực đối phương và địa hình, AI thiết lập mục tiêu: **`Target` ($1 \rightarrow 100$)**.
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

## 9. CƠ CHẾ TÍNH ĐIỂM LƯỢT CHƠI (RUN SCORING SYSTEM)

Thay vì tạo các cơ chế tăng độ khó gượng ép theo cấp bậc, game vận hành theo **Hệ Thống Đánh Giá & Tính Điểm Phiên Chơi**:

* **Mục tiêu:** Đánh giá tổng kết "Cuộc đời của một Cổ sư" sau khi kết thúc lượt chơi (sống sót trốn thoát, chết, hoặc đạt đến đại biến).
* **Quy tắc Tính Điểm:**
  * **Lối chơi trốn tránh / Thoát sớm:** Điểm đánh giá sẽ **rất thấp** (chỉ đạt danh hiệu "Kẻ hèn nhát sống sót", điểm thành tựu tối thiểu).
  * **Cộng điểm cao cho:**
    * Vượt qua các tình huống hiểm nghèo và nghịch cảnh.
    * Thu thập, nuôi dưỡng và hợp luyện được nhiều Cổ trùng quý hiếm.
    * Giải quyết các mâu thuẫn lớn, thao túng hoặc thay đổi cục diện gia tộc.
    * Khám phá ra các bí mật ẩn sâu (Động Hoa Tửu, Huyết Hồ Nhất Đại...).
    * Đạt cảnh giới cao trong thời gian ngắn và mưu kế tiêu diệt kẻ thù vượt cấp.
* **Bảng Đánh Giá Cuối Run:** Xếp hạng từ Hạng C, B, A đến S, SS (Ma đầu kinh thế / Nhân vật truyền kỳ).

---

## 10. CẤU TRÚC THƯ MỤC KỸ THUẬT DỰ KIẾN

```text
CoChanNhanRolePlay/
├── .env                       # API Key (GEMINI_API_KEY) & Cấu hình máy chủ
├── .gitignore                  # Bỏ qua file nhạy cảm và cache
├── README.md                  # Tài liệu thiết kế & Yêu cầu kỹ thuật toàn diện
├── run.bat                    # Script khởi chạy nhanh trên Windows
├── server.py                  # Proxy Server (Python) xử lý logic, xúc xắc & gọi API
├── database/                  # Cơ sở dữ liệu JSON chuẩn hóa
│   ├── gu_database.json       # Danh mục Cổ trùng (Schema chuẩn, nạp dần dữ liệu)
│   ├── npcs.json              # Hồ sơ NPC kèm bảng hành vi theo độ thiện cảm
│   ├── world_map.json         # Danh sách Chunks tại Thanh Mao Sơn
│   ├── npc_schedules.json     # Thời gian biểu & Ma trận xác suất xuất hiện theo giờ
│   └── timeline.json          # Tuyến sự kiện cố định & Cơ chế rẽ nhánh
├── prompts/                   # Hệ thống System Instructions
│   ├── core_engine.md         # Giao thức bảo toàn quyền người chơi & luật GM
│   └── modules/               # Các mảnh prompt nạp động theo Chunk
└── public/                    # Frontend Giao diện Web
    ├── index.html             # Khung giao diện chính (Chat, HUD, Dice)
    ├── app.js                 # Xử lý tương tác, socket, hiển thị xúc xắc
    └── styles.css             # Giao diện phong cách Hắc Ám Tiên Hiệp
```
