# CỔ CHÂN NHÂN: THIÊN ĐẠO VÔ TÌNH (ROLEPLAY ENGINE)

Tài liệu thiết kế kỹ thuật và kiến trúc lõi cho tựa game nhập vai phiêu lưu văn bản (Interactive Fiction / Text RPG) dựa trên nguyên tác tiểu thuyết **Cổ Chân Nhân** (Gu Daoist Master / Reverend Insanity).

Game vận hành theo mô hình **Hybrid RPG Engine**: Phân định rõ ràng trách nhiệm giữa **Cơ Sở Dữ Liệu (JSON)**, **Trí Tuệ Nhân Tạo (LLM Prompt & Tool Calling)** và **Mã Nguồn Logic Thuần (Deterministic Code)**.

---

## BẢN ĐỒ PHÂN CHIA TRÁCH NHIỆM HỆ THỐNG (SEPARATION OF CONCERNS)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       1. CƠ SỞ DỮ LIỆU (JSON DATABASE)                      │
│ - gu_database.json       : Kho Cổ trùng, số chuyển, công năng, thức ăn...   │
│ - npcs.json              : Hồ sơ NPC, tính cách, phản ứng theo thiện cảm.   │
│ - npc_schedules.json     : Lịch trình sinh hoạt & xác suất xuất hiện theo giờ.│
│ - world_map.json         : Danh sách Chunks bản đồ, tài nguyên, địa lý.     │
│ - timeline.json          : Tuyến sự kiện cố định, điều kiện kích hoạt rẽ nhánh.│
│ - attributes_config.json : Bảng cấu hình các mốc Tư Chất, Danh Tiếng, Khí Vận.│
│ - player_state.json      : Trạng thái hiện tại của PC (Tư chất, HP, Cổ, v.v.)│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             2. MÃ NGUỒN LOGIC THUẦN (DETERMINISTIC CODE - PYTHON/JS)         │
│ - Gieo xúc xắc thật: random.randint(1, 100), tính toán biên độ Delta.        │
│ - Bộ hàm quản lý thuộc tính (Aptitude, Reputation, Luck Calculators).        │
│ - Bộ nạp Chunk động (Chunk Loader): Chỉ nạp vị trí người chơi đang đứng.    │
│ - Quản lý Đồng hồ thế giới (World Tick) & Bắt kịp thời gian (Lazy Catch-up).│
│ - Hệ thống tính điểm tổng kết phiên chơi (Run Scoring System).               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 3. QUẢN TRÒ TỐI CAO (LLM PROMPT / GEMINI API)                │
│ - Giao thức bảo toàn quyền điều khiển: Không nói/hành động thay người chơi.  │
│ - Thẩm định ngữ cảnh & chất lượng lời thoại ➔ Định giá Target (1 - 100).    │
│ - Dẫn dắt cốt truyện & miêu tả kết quả dựa trên Biên độ Delta (-99 đến +99).│
│ - Gọi các hàm Tool/Function Calling khi cần biến động Danh Tiếng, Khí Vận.   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## PHẦN I: CƠ SỞ DỮ LIỆU (DATABASE SPECS - JSON)
*Tất cả thông số tĩnh, cấu hình mốc thuộc tính và trạng thái thực thể được lưu tại thư mục `database/`.*

### 1. Cấu Hình Thuộc Tính Cốt Lõi (`database/attributes_config.json`)
Lưu toàn bộ bảng mốc, tên gọi và hệ số tác động của **Tư Chất**, **Danh Tiếng**, và **Khí Vận** để dễ dàng tinh chỉnh cân bằng:
```json
{
  "aptitude_ranks": [
    { "min_pct": 1, "max_pct": 39, "rank_name": "Vô Khiếu / Liệt Khiếu", "tier": "Phế phẩm", "sea_capacity": "0%" },
    { "min_pct": 40, "max_pct": 59, "rank_name": "Đinh Đẳng", "tier": "Hạ đẳng", "sea_capacity": "40% - 59%" },
    { "min_pct": 60, "max_pct": 69, "rank_name": "Bính Đẳng", "tier": "Trung đẳng", "sea_capacity": "60% - 69%" },
    { "min_pct": 70, "max_pct": 79, "rank_name": "Ất Đẳng", "tier": "Thượng đẳng", "sea_capacity": "70% - 79%" },
    { "min_pct": 80, "max_pct": 99, "rank_name": "Giáp Đẳng", "tier": "Cực phẩm", "sea_capacity": "80% - 99%" },
    { "min_pct": 100, "max_pct": 100, "rank_name": "Thập Tuyệt Thể", "tier": "Nghịch thiên", "sea_capacity": "100%", "has_overheat": true }
  ],
  "reputation_tiers": [
    { "min_score": -100, "max_score": -60, "tier_name": "Ma Đầu Khét Tiếng", "clan_attitude": "Truy nã / Thù địch", "black_market_discount": 0.20 },
    { "min_score": -59, "max_score": -20, "tier_name": "Hành Vi Đáng Ngờ", "clan_attitude": "Đề phòng / Giám sát", "black_market_discount": 0.05 },
    { "min_score": -19, "max_score": 19, "tier_name": "Vô Danh / Trung Lập", "clan_attitude": "Bình thường", "black_market_discount": 0.0 },
    { "min_score": 20, "max_score": 59, "tier_name": "Đệ Tử Gương Mẫu", "clan_attitude": "Khen ngợi / Trợ cấp tốt", "clan_store_discount": 0.05 },
    { "min_score": 60, "max_score": 100, "tier_name": "Chính Đạo Quang Minh", "clan_attitude": "Tín nhiệm tuyệt đối", "clan_store_discount": 0.15 }
  ],
  "luck_tiers": [
    { "min_score": -100, "max_score": -60, "tier_name": "Hắc Ám Sát Vận", "target_dc_modifier": 15, "event_risk": "Cực cao" },
    { "min_score": -59, "max_score": -20, "tier_name": "Ám Đạm Suy Vận", "target_dc_modifier": 5, "event_risk": "Cao" },
    { "min_score": -19, "max_score": 19, "tier_name": "Bạch Sắc Phàm Vận", "target_dc_modifier": 0, "event_risk": "Bình thường" },
    { "min_score": 20, "max_score": 59, "tier_name": "Hồng Nhuận Cát Vận", "target_dc_modifier": -10, "event_risk": "Thấp" },
    { "min_score": 60, "max_score": 100, "tier_name": "Kim Quang Phúc Vận", "target_dc_modifier": -20, "event_risk": "Kỳ ngộ" }
  ]
}
```

### 2. Trạng Thái Nhân Vật Người Chơi (`database/player_state.json`)
Lưu trữ trạng thái thực tế của nhân vật trong phiên chơi hiện tại:
```json
{
  "name": "Người Chơi",
  "aptitude_score": 44,
  "aptitude_rank": "Bính Đẳng",
  "primeval_sea_pct": 100,
  "reputation": 0,
  "luck": 15,
  "cultivation": "Nhất chuyển Sơ giai",
  "current_chunk": "loc_hoc_duong",
  "inventory_gu": ["GU-001"],
  "primeval_stones": 15
}
```

### 3. Kho Cổ Trùng (`database/gu_database.json`)
Cấu trúc chuẩn hóa: Mã Cổ, Tên, Chuyển (1-5 Phàm, 6-9 Tiên), Lưu phái, Chức năng & Hao phí, Thức ăn & Chu kỳ đói, Phương thức thu hoạch/hợp luyện.

### 4. Hồ Sơ NPC & Hành Vi Theo Thiện Cảm (`database/npcs.json`)
Lưu danh sách nhân vật kèm bảng hành vi ứng xử tương ứng với các mốc thiện cảm riêng biệt của từng người.

### 5. Lịch Trình Sinh Hoạt & Ma Trận Xuất Hiện (`database/npc_schedules.json`)
Bảng xác suất hiện diện của NPC theo 5 canh giờ và cơ chế ghi đè khi bùng phát sự kiện lớn.

### 6. Bản Đồ Phân Vùng Chunks (`database/world_map.json`)
Bản đồ phân cấp các địa điểm tại Thanh Mao Sơn.

### 7. Tuyến Sự Kiện Thế Giới & Rẽ Nhánh (`database/timeline.json`)
Dòng thời gian 3 năm và danh sách các điều kiện kích hoạt nhánh thay thế.

---

## PHẦN II: QUY TẮC ĐỊNH GIÁ & DẪN TRUYỆN DÀNH CHO LLM (AI GM PROMPT)
*Chỉ dẫn dành cho LLM để làm Quản trò, thẩm định bối cảnh và phối hợp gọi hàm tính toán.*

### 1. Giao Thức Bảo Toàn Quyền Người Chơi (Absolute Player Agency)
* AI không bao giờ tự ý nói, hành động, suy nghĩ hay quyết định thay nhân vật người chơi (PC).
* Kết thúc mỗi lượt dẫn truyện, AI dừng lại ở thời khắc cần ra quyết định và chờ câu lệnh tiếp theo của người chơi.

### 2. Quy Tắc Thẩm Định Ngữ Cảnh & Định Giá `Target` ($1 \rightarrow 100$)
Trước mỗi hành vi mạo hiểm, giao tranh hoặc tương tác tâm lý/tống tiền/lừa gạt, AI tự thẩm định bối cảnh:
$$\text{Target} = \text{Độ Khó Nền NPC} \pm \text{Tương Quan Cảnh Giới} \pm \text{Chất Lượng Lời Lẽ / Mưu Kế} + \text{Modifier Khí Vận}$$

* **Tương tác tâm lý / Tống tiền:**
  * Lời lẽ thô bạo, đe dọa khi mình yếu thế $\rightarrow$ AI đẩy `Target = 95 - 100`.
  * Lời lẽ bóng gió khéo léo, nắm đúng thóp điểm yếu trong database của NPC $\rightarrow$ AI giảm `-15 đến -25 điểm Target`.
  * AI kết hợp thêm chỉ số `target_dc_modifier` từ bảng Khí Vận do hàm code cung cấp.

### 3. Quy Tắc Miêu Tả Diễn Biến Theo Biên Độ $\Delta$ ($-99 \rightarrow +99$)
AI nhận kết quả $\Delta = \text{Player Roll} - \text{Target}$ và bắt buộc dẫn truyện theo 7 bậc chuẩn mực:
* $\Delta \ge +50$: Nghiền ép tuyệt đối, miêu sát, đoạt trọn vẹn tài nguyên.
* $+15 \le \Delta < +50$: Thắng lợi áp đảo, an toàn.
* $+1 \le \Delta < +15$: Thắng hiểm, trả giá (bị thương tích nhẹ, cạn chân nguyên).
* $\Delta = 0$: Thế trận cân bằng, giằng co thăm dò.
* $-14 \le \Delta \le -1$: Thất bại kiểm soát, mất thế chủ động nhưng rút lui kịp thời.
* $-49 \le \Delta \le -15$: Thảm bại, bị thương nặng, Cổ bị nứt, nguy cơ bị trả thù.
* $\Delta \le -50$: Tuyệt cảnh sinh tử! Rơi vào cửa tử, cận kề cái chết nếu không có bài tẩy.

### 4. Gọi Hàm Cập Nhật Trạng Thái (Tool / Function Calling)
Khi diễn biến câu chuyện dẫn đến thay đổi nhân quả, AI gửi yêu cầu gọi các hàm nghiệp vụ:
* Người chơi làm việc quang minh chính đại $\rightarrow$ Yêu cầu gọi `update_reputation(+10)`.
* Người chơi làm việc tàn độc, tống tiền, ám hại $\rightarrow$ Yêu cầu gọi `update_reputation(-15)`.
* Người chơi cướp đoạt cơ duyên đại vận hoặc phạm thiên nộ $\rightarrow$ Yêu cầu gọi `update_luck(-20)`.

---

## PHẦN III: CÁC HÀM CƠ CHẾ THUẦN (DETERMINISTIC CODE ENGINE)
*Logic nghiệp vụ viết bằng Python/JS xử lý tính toán số liệu chính xác và phục vụ cho LLM.*

### 1. Bộ Hàm Tính Toán & Quản Lý Thuộc Tính Nhân Vật

#### A. Hàm Khai Khiếu (Aperture Calculator)
Chuyển đổi số roll $d100$ thành bậc tư chất và dung lượng Chân nguyên hải:
```python
def calculate_aptitude(roll_d100: int, config: list) -> dict:
    roll_d100 = max(1, min(100, roll_d100))
    for rank in config:
        if rank["min_pct"] <= roll_d100 <= rank["max_pct"]:
            return {
                "aptitude_score": roll_d100,
                "rank_name": rank["rank_name"],
                "tier": rank["tier"],
                "sea_capacity": rank["sea_capacity"]
            }
```

#### B. Hàm Cập Nhật Danh Tiếng & Khí Vận (Kẹp khoảng chuẩn $-100 \rightarrow +100$)
```python
def modify_reputation(current_rep: int, delta: int) -> int:
    new_rep = current_rep + delta
    return max(-100, min(100, new_rep))

def modify_luck(current_luck: int, delta: int) -> int:
    new_luck = current_luck + delta
    return max(-100, min(100, new_luck))

def get_luck_modifier(current_luck: int, luck_tiers: list) -> int:
    for tier in luck_tiers:
        if tier["min_score"] <= current_luck <= tier["max_score"]:
            return tier["target_dc_modifier"]
    return 0
```

### 2. Hàm Gieo Xúc Xắc Thật & Tính Toán Biên Độ $\Delta$
```python
import random

def resolve_opposed_roll(target_dc: int) -> dict:
    player_roll = random.randint(1, 100)
    delta = player_roll - target_dc
    return {
        "target": target_dc,
        "player_roll": player_roll,
        "delta": delta,
        "tier": categorize_delta(delta)
    }
```

### 3. Đồng Hồ Thế Giới & Cơ Chế Bắt Kịp Khi Nạp Vùng (Lazy Catch-Up)
Tự động tính toán khoảng thời gian trôi qua giữa hai lần viếng thăm để cập nhật sự kiện tại Chunk mới nạp mà không tốn token mô phỏng nền.

### 4. Bộ Nạp Chunk Động (Spatial Context Filter)
Chỉ tiêm dữ liệu của Chunk hiện tại cùng danh sách NPC thực tế có mặt (dựa vào `npc_schedules.json`) vào prompt của LLM.

### 5. Hệ Thống Tính Điểm Lượt Chơi (Run Scoring System)
Đánh giá xếp hạng cuộc đời Cổ sư sau mỗi phiên chơi: Trừ điểm lối chơi hèn nhát chỉ lo trốn chạy; cộng điểm lớn cho mưu trí, vượt cấp chiến thắng và khám phá bí cảnh.

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
│   ├── attributes_config.json # Bảng cấu hình mốc Tư Chất, Danh Tiếng, Khí Vận
│   ├── player_state.json      # Trạng thái hiện tại của PC (Chỉ số, Túi đồ, Cổ)
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
