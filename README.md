# CỔ CHÂN NHÂN: THIÊN ĐẠO VÔ TÌNH (ROLEPLAY ENGINE)

Tài liệu thiết kế kỹ thuật và kiến trúc lõi cho tựa game nhập vai phiêu lưu văn bản (Interactive Fiction / Text RPG) dựa trên nguyên tác tiểu thuyết **Cổ Chân Nhân** (Gu Daoist Master / Reverend Insanity).

Game vận hành theo mô hình **Hybrid RPG Engine**: Phân định rõ ràng trách nhiệm giữa **Cơ Sở Dữ Liệu (JSON)**, **Trí Tuệ Nhân Tạo (LLM Prompt)** và **Mã Nguồn Logic Thuần (Deterministic Code)**.

---

## BẢN ĐỒ PHÂN CHIA TRÁCH NHIỆM HỆ THỐNG (SEPARATION OF CONCERNS)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       1. CƠ SỞ DỮ LIỆU (JSON DATABASE)                      │
│ - gu_database.json    : Kho Cổ trùng, số chuyển, công năng, thức ăn, hợp luyện. │
│ - npcs.json           : Hồ sơ NPC, tính cách, điểm yếu, phản ứng theo thiện cảm.│
│ - npc_schedules.json  : Lịch trình sinh hoạt & ma trận xuất hiện theo canh giờ.│
│ - world_map.json      : Danh sách Chunks bản đồ, đặc điểm địa lý, tài nguyên.  │
│ - timeline.json       : Tuyến sự kiện cố định, điều kiện kích hoạt & rẽ nhánh. │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             2. MÃ NGUỒN LOGIC THUẦN (DETERMINISTIC CODE - PYTHON/JS)         │
│ - Gieo xúc xắc thật: random.randint(1, 100), tính toán biên độ Delta.        │
│ - Bộ nạp Chunk động (Chunk Loader): Chỉ nạp ngữ cảnh vùng người chơi đứng.  │
│ - Quản lý Đồng hồ thế giới (World Tick) & Bắt kịp thời gian (Lazy Catch-up).│
│ - Tính toán chỉ số: Trừ Chân nguyên hải %, cập nhật Danh tiếng, Khí vận.   │
│ - Hệ thống tính điểm tổng kết phiên chơi (Run Scoring System).               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 3. QUẢN TRÒ TỐI CAO (LLM PROMPT / GEMINI API)                │
│ - Giao thức bảo toàn quyền điều khiển: Không nói/hành động thay người chơi.  │
│ - Thẩm định ngữ cảnh & chất lượng lời thoại ➔ Định giá Target (1 - 100).    │
│ - Dẫn dắt cốt truyện & miêu tả kết quả dựa trên Biên độ Delta (-99 đến +99).│
│ - Đóng vai NPC với khẩu khí chuẩn nguyên tác theo mốc Thiện cảm & Danh tiếng.│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## PHẦN I: CƠ SỞ DỮ LIỆU (DATABASE SPECS - JSON)
*Tất cả thông số tĩnh và dữ liệu cấu hình được lưu tại thư mục `database/` để dễ dàng tra cứu, bổ sung và tinh chỉnh mà không cần sửa code.*

### 1. Cơ Sở Dữ Liệu Cổ Trùng (`database/gu_database.json`)
Cấu trúc mở để người phát triển tự do tra cứu và nạp thêm Cổ trùng theo nguyên tác:
```json
{
  "id": "GU-001",
  "name": "Nguyệt Quang Cổ",
  "rank": 1,
  "type": "Phàm Cổ",
  "path": "Nguyệt đạo",
  "category": "Công kích tầm xa",
  "functions": {
    "description": "Bắn ra một đạo nguyệt nhận màu lam nhạt, tầm xa 10m.",
    "cost_per_rank": { "so_giai": "10%", "trung_giai": "7%", "cao_giai": "5%", "dinh_phong": "3%" }
  },
  "feeding": {
    "food_type": "Cánh hoa Lan Trăng",
    "cycle_days": 10,
    "starvation_penalty": "Héo hon, mờ dần, sau 20 ngày sẽ chết"
  },
  "acquisition": {
    "nature_hunt": "Vách núi trăng rọi tại Thanh Mao Sơn",
    "refinement_recipe": null,
    "trade_value": 150
  }
}
```

### 2. Hồ Sơ NPC & Hành Vi Theo Thiện Cảm (`database/npcs.json`)
Lưu trữ thông tin nhân vật kèm theo **cách cư xử đặc thù của từng người tương ứng với từng mốc thiện cảm**:
```json
{
  "id": "NPC_PHUONG_NGUYEN",
  "name": "Cổ Nguyệt Phương Nguyên",
  "faction": "Cổ Nguyệt Gia Tộc",
  "cultivation": "Nhất chuyển Đỉnh phong",
  "paths": ["Lực đạo", "Thời đạo"],
  "personality": "Lạnh lùng, thực dụng tối thượng, vô cảm trước đạo đức thông thường.",
  "weaknesses": "Tư chất ban đầu thấp (Bính đẳng), phụ thuộc nặng vào tài nguyên.",
  "favor_behaviors": {
    "hostile": {
      "max_threshold": -30,
      "behavior": "Lạnh lùng lập mưu thủ tiêu đoạt tài sản khi có cơ hội sinh lời, không để lộ sát khí trước mặt."
    },
    "neutral": {
      "min_threshold": -29,
      "max_threshold": 30,
      "behavior": "Sòng phẳng, chỉ trao đổi khi đôi bên cùng có lợi, không can thiệp vào chuyện sống chết của người khác."
    },
    "favorable": {
      "min_threshold": 31,
      "max_threshold": 70,
      "behavior": "Coi là đối tác đáng tin cậy, sẵn sàng chia chác lợi nhuận sòng phẳng, cung cấp cảnh báo nguy hiểm nếu không tốn kém."
    },
    "close_ally": {
      "min_threshold": 71,
      "behavior": "Đồng minh chiến lược hiếm hoi, ưu tiên phối hợp tác chiến, nhưng tuyệt đối không hy sinh tính mạng vì đối phương."
    }
  }
}
```

### 3. Lịch Trình Sinh Hoạt & Ma Trận Xuất Hiện (`database/npc_schedules.json`)
Xác suất xuất hiện của NPC theo 5 canh giờ và cơ chế ghi đè sự kiện:
```json
{
  "NPC_PHUONG_CHINH": {
    "schedules": {
      "MORNING":   { "loc_hoc_duong": 0.95, "loc_dien_vo_truong": 0.05 },
      "AFTERNOON": { "loc_dien_vo_truong": 0.70, "loc_khu_cho": 0.20, "loc_hoc_duong": 0.10 },
      "EVENING":   { "loc_nha_o": 0.85, "loc_tuu_quan": 0.15 },
      "NIGHT":     { "loc_nha_o": 1.00 }
    },
    "event_overrides": {
      "EVENT_WOLF_TIDE": {
        "ALL_DAY": { "loc_tuong_thanh": 0.75, "loc_tram_cuu_thuong": 0.25 }
      }
    }
  }
}
```

### 4. Bản Đồ Phân Vùng Chunks (`database/world_map.json`)
Danh sách các Chunk tại Thanh Mao Sơn kèm tài nguyên và NPC cố định.

### 5. Tuyến Sự Kiện Thế Giới & Kíp Nổ Ngầm (`database/timeline.json`)
Danh sách mốc sự kiện cố định 3 năm tại Thanh Mao Sơn và cờ kích hoạt rẽ nhánh.

---

## PHẦN II: QUY TẮC ĐỊNH GIÁ & DẪN TRUYỆN DÀNH CHO LLM (AI GM PROMPT)
*Quy chuẩn dành cho LLM đóng vai trò Quản trò, thẩm định tình huống và miêu tả kết quả.*

### 1. Giao Thức Bảo Toàn Quyền Người Chơi (Absolute Player Agency)
* AI **tuyệt đối không** tự ý viết lời thoại, suy nghĩ, cảm xúc, hoặc quyết định hành động thay cho nhân vật người chơi (PC).
* Mỗi lượt, AI chỉ miêu tả bối cảnh, phản ứng của NPC/môi trường, và dừng lại chờ người chơi ra lệnh.

### 2. Quy Tắc Thẩm Định & Định Giá Ngưỡng Thách Thức (`Target: 1 - 100`)
Trước mỗi hành động mạo hiểm (chiến đấu, luyện Cổ, đổ thạch, đàm phán, tống tiền, lừa gạt), AI tự thẩm định bối cảnh để chốt một con số mục tiêu:

$$\text{Target} = \text{Độ Khó Nền NPC} \pm \text{Chênh Lệch Cảnh Giới} \pm \text{Chất Lượng Lời Nói / Mưu Kế} \pm \text{Ảnh Hưởng Khí Vận}$$

* **Thẩm định Chiến đấu:** So sánh tương quan cảnh giới, Cổ trùng khắc chế, vị trí địa hình.
* **Thẩm định Đấu trí / Tống tiền / Thao túng tâm lý:**
  * *Lời lẽ thô bạo, đe dọa khi mình yếu thế:* Phán định hành vi tự sát $\rightarrow$ Đẩy **`Target = 95 - 100`**.
  * *Lời lẽ khéo léo, nắm đúng điểm yếu tâm lý của NPC trong database:* Giảm **`-15 đến -25 điểm Target`**.
  * *Khí vận người chơi đang đỏ (Hồng Nhuận/Kim Quang):* Giảm thêm **`-10 đến -15 điểm Target`**.
  * *Khí vận người chơi đang đen (Hắc Ám/Ám Đạm):* Tăng thêm **`+10 đến +20 điểm Target`**.

### 3. Quy Tắc Dẫn Truyện Theo Biên Độ $\Delta$ ($-99 \rightarrow +99$)
Sau khi nhận kết quả $\Delta = \text{Player Roll} - \text{Target}$ từ code, AI miêu tả diễn biến theo đúng 7 thang đo:

| Khoảng Biên Độ $\Delta$ | Trạng Thái Phán Quyết | Văn Phong Miêu Tả Của AI GM |
| :---: | :---: | :--- |
| **$+50 \rightarrow +99$** | **Nghiền Ép Tuyệt Đối** | Miêu sát, hoàn hảo không tì vết, đối phương không kịp phản ứng, thu hoạch tối đa. |
| **$+15 \rightarrow +49$** | **Thắng Lợi Áp Đảo** | Thắng lợi rõ ràng, áp đảo đối thủ, tiêu hao rất ít chân nguyên/tài nguyên. |
| **$+1 \rightarrow +14$** | **Thắng Hiểm / Trả Giá** | Thắng sít sao nhưng phải trả giá: bị thương nhẹ, cạn chân nguyên hoặc sứt mẻ Cổ. |
| **$0$** | **Thế Trận Cân Bằng** | Hai bên bất phân thắng bại, bật lùi thăm dò, chuyển sang thế giằng co. |
| **$-14 \rightarrow -1$** | **Thất Bại Kiểm Soát** | Đòn đánh/lời nói bị chặn đứng, mất thế chủ động nhưng kịp thời rút lui an toàn. |
| **$-49 \rightarrow -15$** | **Thảm Bại / Trọng Thương** | Bị phản đòn nặng nề, rạn nứt Khiếu bích, Cổ trùng bị thương, bị NPC đe dọa sát hại. |
| **$-50 \rightarrow -99$** | **Tuyệt Cảnh Sinh Tử** | Rơi vào cửa tử! Bị cao thủ đập nát lục phủ ngũ tạng, cận kề cái chết nếu không có bài tẩy. |

---

## PHẦN III: CÁC HÀM CƠ CHẾ THUẦN (DETERMINISTIC CODE ENGINE)
*Logic nghiệp vụ được viết bằng Python (Backend) và Javascript (Frontend), hoạt động độc lập không phụ thuộc vào LLM.*

### 1. Hệ Quy Chiếu 100 & Chỉ Số Nhân Vật
Toàn bộ hệ thống vận hành trên cùng một hệ quy chiếu toán học đồng nhất:

* **Tư Chất Không Khiếu ($1\% - 100\%$):**
  * Gieo ngẫu nhiên $d100$ tại Lễ Khai Khiếu một lần duy nhất:
    * `$1 - 39$`: Vô Khiếu / Liệt Khiếu (Phế vật / Phàm nhân).
    * `$40 - 59$`: Đinh Đẳng ($40\% - 59\%$ Chân nguyên hải).
    * `$60 - 69$`: Bính Đẳng ($60\% - 69\%$ Chân nguyên hải - mức khởi đầu Phương Nguyên).
    * `$70 - 79$`: Ất Đẳng ($70\% - 79\%$ Chân nguyên hải).
    * `$80 - 99$`: Giáp Đẳng ($80\% - 99\%$ Chân nguyên hải - mức Phương Chính).
    * `$100$`: Thập Tuyệt Thể ($100\%$ Chân nguyên hải - cơ chế tự bạo đếm ngược).
* **Thuộc Tính Danh Tiếng ($-100 \rightarrow +100$):**
  * Âm ($-100 \rightarrow -1$): Thiên về Ma Đạo (tàn nhẫn, phản tộc, khét tiếng).
  * Dương ($+1 \rightarrow +100$): Thiên về Chính Đạo (trọng gia quy, bảo vệ danh dự, công đức).
  * Code dùng chỉ số này kết hợp với `faction` của NPC để điều chỉnh giá buôn bán và thái độ tiếp đón.
* **Thuộc Tính Khí Vận ($-100 \rightarrow +100$):**
  * `$-100 \to -60$`: **Hắc Ám Sát Vận** (Họa vô đơn chí, nổ lò, quái thú biến dị).
  * `$-59 \to -20$`: **Ám Đạm Suy Vận** (Vận xui đeo bám, đổ thạch toàn đá rác).
  * `$-19 \to +19$`: **Bạch Sắc Phàm Vận** (Vận số bình thường của người phàm).
  * `$+20 \to +59$`: **Hồng Nhuận Cát Vận** (Gặp may mắn, đi săn gặp mồi ngon, mua hời).
  * `$+60 \to +100$`: **Kim Quang Phúc Vận** (Đại phúc duyên, kỳ ngộ hoang dã, gặp nguy hóa an).

### 2. Hàm Gieo Xúc Xắc Thật & Tính Biên Độ $\Delta$
Code đảm bảo tính khách quan tuyệt đối, không để AI tự bịa số:
```python
import random

def resolve_action(target_dc: int) -> dict:
    player_roll = random.randint(1, 100)
    delta = player_roll - target_dc
    return {
        "target": target_dc,
        "player_roll": player_roll,
        "delta": delta,
        "result_tier": get_result_tier(delta)
    }
```

### 3. Đồng Hồ Thế Giới (World Tick) & Bắt Kịp Khi Nạp Vùng (Lazy Catch-Up)
* Mỗi hành vi của người chơi cộng dồn thời gian thế giới.
* Khi người chơi bước vào một Chunk mới, hàm `catch_up_chunk_state(chunk_id, current_world_time)` tự động so sánh thời gian trôi qua để cập nhật trạng thái địa điểm mà không cần tốn token mô phỏng liên tục.

### 4. Ma Trận Tác Động 2 Chiều: Độ Bại Lộ ($V$) vs Sức Nặng ($W$)
* Hàm đánh giá xem hành động vừa thực hiện có thỏa mãn điều kiện rẽ nhánh trong `timeline.json` hay không.
* Nếu $V=0$ nhưng $W$ cao $\rightarrow$ Code cài đặt **Cờ Kíp Nổ Hẹn Giờ (Silent Fuse)** vào bộ nhớ ngầm.

### 5. Hệ Thống Tính Điểm Lượt Chơi (Run Scoring System)
* Tổng kết điểm sau khi kết thúc một cuộc đời Cổ sư:
  * Lối chơi chỉ lo trốn chạy, né tránh thử thách $\rightarrow$ Điểm tổng kết rất thấp.
  * Cộng điểm lớn cho: Vượt qua tử cảnh, cảnh giới đạt được, Cổ trùng quý hiếm thu thập, các mưu kế thao túng cục diện và bí mật khám phá được.

---

## CẤU TRÚC THƯ MỤC DỰ ÁN

```text
CoChanNhanRolePlay/
├── .env                       # Cấu hình API Key (GEMINI_API_KEY)
├── .gitignore                  # Loại trừ file nhạy cảm và cache
├── README.md                  # Bản đặc tả kỹ thuật và phân chia trách nhiệm
├── run.bat                    # Script khởi chạy nhanh trên Windows
├── server.py                  # Proxy Server (Python) xử lý logic, xúc xắc & gọi API
├── database/                  # [PHẦN I: JSON DATABASE]
│   ├── gu_database.json       # Kho Cổ trùng & quy tắc nuôi, hợp luyện
│   ├── npcs.json              # Hồ sơ NPC kèm bảng ứng xử theo độ thiện cảm
│   ├── world_map.json         # Danh sách Chunks tại Thanh Mao Sơn
│   ├── npc_schedules.json     # Thời gian biểu & Ma trận xuất hiện theo giờ
│   └── timeline.json          # Tuyến sự kiện cố định & Cơ chế rẽ nhánh
├── prompts/                   # [PHẦN II: LLM INSTRUCTIONS]
│   ├── system_prompt.md       # Quản trò tối cao, thẩm định Target & miêu tả Delta
│   └── modules/               # Các mảnh prompt ngữ cảnh nạp động theo Chunk
└── public/                    # [PHẦN III: CLIENT / UI]
    ├── index.html             # Khung giao diện chính (Chat, HUD, Dice)
    ├── app.js                 # Xử lý tương tác, hiệu ứng lắc xúc xắc d100
    └── styles.css             # Giao diện phong cách Hắc Ám Tiên Hiệp
```
