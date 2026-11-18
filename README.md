# CỔ CHÂN NHÂN: THIÊN ĐẠO VÔ TÌNH (ROLEPLAY ENGINE)

Tài liệu thiết kế kiến trúc lõi cho tựa game nhập vai phiêu lưu văn bản (Interactive Fiction / Text RPG) dựa trên nguyên tác **Cổ Chân Nhân**.

Game vận hành theo mô hình **Hybrid RPG Engine**: Phân định rõ ràng trách nhiệm giữa **Cơ Sở Dữ Liệu (JSON)**, **Trí Tuệ Nhân Tạo (LLM)** và **Mã Nguồn Logic Thuần (Deterministic Code)**.

---

## BẢN ĐỒ PHÂN CHIA TRÁCH NHIỆM HỆ THỐNG

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       1. CƠ SỞ DỮ LIỆU (JSON DATABASE)                      │
│ - gu_database.json       : Kho Cổ trùng, số chuyển, công năng, thức ăn...   │
│ - npcs.json              : Hồ sơ NPC, tính cách, phản ứng theo thiện cảm.   │
│ - npc_schedules.json     : Lịch trình sinh hoạt & xác suất xuất hiện.       │
│ - world_map.json         : Danh sách Chunks bản đồ, tài nguyên, địa lý.     │
│ - timeline.json          : Tuyến sự kiện cố định, điều kiện kích hoạt rẽ nhánh.│
│ - attributes_config.json : Các mốc Tư Chất, Danh Tiếng, Khí Vận.            │
│ - player_state.json      : Trạng thái hiện tại của người chơi.              │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             2. MÃ NGUỒN LOGIC THUẦN (DETERMINISTIC CODE - PYTHON/JS)         │
│ - Gieo xúc xắc thật: random.randint(1, 100), tính delta = roll - target.    │
│ - Tính toán trực tiếp thuộc tính: điểm_mới = max(min, min(max, cũ + biến_đổi))│
│ - Bộ nạp Chunk động (Chunk Loader): Nạp ngữ cảnh nơi người chơi đứng.       │
│ - Đồng hồ thế giới (World Tick) & Bắt kịp thời gian (Lazy Catch-up).        │
│ - Hệ thống tính điểm tổng kết phiên chơi (Run Scoring System).               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 3. QUẢN TRÒ TỐI CAO (LLM PROMPT / GEMINI API)                │
│ - Tuyệt đối không chiếm quyền: Không tự ý nói/hành động thay người chơi.     │
│ - Tự do tư duy & đánh giá bối cảnh ➔ Đưa ra Target thử thách (1 - 100).     │
│ - Miêu tả diễn biến câu chuyện bám sát kết quả bậc Delta.                    │
│ - Tự phân tích nhân quả & chủ động gọi hàm cập nhật trạng thái khi cần.      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## PHẦN I: CƠ SỞ DỮ LIỆU (DATABASE SPECS - JSON)
*Lưu trữ toàn bộ thông số, cấu hình và trạng thái của game dưới dạng JSON để dễ dàng mở rộng và tinh chỉnh.*

1. **`database/gu_database.json` (Kho Cổ Trùng):**
   * Định danh: Mã Cổ, Tên, Số chuyển ($1-5$ Phàm, $6-9$ Tiên), Lưu phái, Phân loại chức năng.
   * Quy tắc: Công năng & hao phí chân nguyên, thức ăn & chu kỳ cho ăn, cách thu hoạch/hợp luyện.
2. **`database/npcs.json` (Hồ Sơ Nhân Vật & Thiện Cảm):**
   * Thông tin NPC: Tên, thế lực, cảnh giới, lưu phái, tính cách, điểm yếu.
   * Cách đối xử theo thiện cảm: Từng nhân vật có cách thể hiện thái độ riêng biệt tương ứng với từng mức độ thiện cảm (thù địch, trung lập, thân thiện, đồng minh chí cốt).
3. **`database/npc_schedules.json` (Lịch Trình & Tỉ Lệ Xuất Hiện):**
   * Bảng xác suất xuất hiện tại các địa điểm theo từng khung giờ trong ngày.
   * Điều kiện ghi đè (override) khi có sự kiện đặc biệt (ví dụ: Lang triều bùng phát).
4. **`database/world_map.json` (Bản Đồ Phân Vùng Chunks):**
   * Danh sách các địa điểm (Chunks) tại Thanh Mao Sơn và đặc điểm môi trường.
5. **`database/timeline.json` (Tuyến Sự Kiện Thế Giới):**
   * Dòng thời gian các sự kiện cố định và các điều kiện rẽ nhánh lịch sử.
6. **`database/attributes_config.json` (Bảng Mốc Thuộc Tính):**
   * Mốc quy đổi Tư Chất ($1\% - 100\%$ sang Vô khiếu, Đinh, Bính, Ất, Giáp, Thập Tuyệt).
   * Mốc Danh Tiếng ($-100$ Ma Đạo $\leftrightarrow +100$ Chính Đạo).
   * Mốc Khí Vận ($-100$ Hắc Ám $\leftrightarrow +100$ Kim Quang).
7. **`database/player_state.json` (Trạng Thái Người Chơi):**
   * Lưu trữ các chỉ số hiện tại: Tư chất, chân nguyên %, máu, danh tiếng, khí vận, vị trí, túi đồ, Cổ sở hữu.

---

## PHẦN II: NGUYÊN TẮC QUẢN TRÒ DÀNH CHO LLM (AI GM RULES)
*Các hướng dẫn mang tính tổng quát để LLM tự do tư duy, đánh giá ngữ cảnh và sáng tạo lời dẫn truyện.*

### 1. Nguyên Tắc Tối Cao: Bảo Toàn Quyền Người Chơi
* AI quản lý thế giới, NPC, môi trường và hậu quả khách quan.
* **Tuyệt đối không nói, suy nghĩ hay hành động thay cho nhân vật người chơi (PC).** Luôn dừng lại ở thời điểm cần người chơi đưa ra quyết định.

### 2. Tư Duy Đánh Giá & Định Giá Ngưỡng Thách Thức (`Target: 1 - 100`)
AI được toàn quyền suy nghĩ và đánh giá tổng thể tình huống để đưa ra một con số thử thách hợp lý ($1 \rightarrow 100$):
* **Tương quan thực lực:** Chênh lệch cảnh giới, Cổ trùng sở hữu, lợi thế địa hình.
* **Tính hợp lý & Khéo léo:** Lời lẽ người chơi nói ra có thuyết phục không? Kế hoạch có chặt chẽ hay liều lĩnh tự sát? Nắm đúng thóp đối phương hay đe dọa mù quáng?
* **Yếu tố Khí vận & Danh tiếng:** Cân nhắc xem khí vận hiện tại của người chơi có tạo ra may mắn hay xui xẻo bất ngờ nào cho tình huống đó không.
* $\rightarrow$ **AI chốt một con số `Target`:** Dễ thì $20 - 40$, trung bình $50 - 60$, khó $70 - 80$, thập tử nhất sinh / nghịch thiên thì $90 - 100$.

### 3. Bậc Kết Quả Của Biên Độ $\Delta$
Sau khi nhận kết quả $\Delta = \text{Player Roll} - \text{Target}$ từ code, AI tự do miêu tả diễn biến câu chuyện bám sát các bậc kết quả:

| Khoảng Biên Độ $\Delta$ | Kết Quả Phán Quyết |
| :---: | :--- |
| **$+50 \rightarrow +99$** | **Thành công vượt trội** |
| **$+15 \rightarrow +49$** | **Thành công trong dự kiến** |
| **$0 \rightarrow +14$**   | **Thành công suýt soát** |
| **$-14 \rightarrow -1$**  | **Thất bại suýt soát** |
| **$-49 \rightarrow -15$** | **Thất bại nặng** |
| **$-99 \rightarrow -50$** | **Thảm bại** |

### 4. Chỉ Dẫn AI Tự Phán Đoán Gọi Hàm (Autonomous Function Calling Prompt)
Đoạn prompt chỉ thị dành riêng cho AI tự động phân tích nhân quả và chủ động phát lệnh gọi hàm:

> *"Trong vai trò Quản trò, hãy liên tục phân tích hành vi và diễn biến thực tế của người chơi. Bất cứ khi nào nhận thấy tình huống dẫn đến sự thay đổi khách quan về trạng thái nhân vật (như chân nguyên tiêu hao, tài sản dịch chuyển, thương tích, hay hành vi làm thay đổi bản chất danh tiếng và khí vận), bạn hãy tự mình đánh giá mức độ biến động hợp lý và chủ động phát lệnh gọi các hàm tương ứng để cập nhật hệ thống theo đúng luật nhân quả của thế giới."*

---

## PHẦN III: CÁC HÀM CƠ CHẾ THUẦN (DETERMINISTIC CODE ENGINE)
*Logic nghiệp vụ thuần túy bằng Python/JS: Đơn giản, trực tiếp, lấy giá trị cũ cộng biến đổi và kẹp biên độ.*

### 1. Các Hàm Cập Nhật Chỉ Số Nhân Vật (Trực Tiếp & Tinh Gọn)
Các hàm cập nhật chỉ số trực tiếp lấy giá trị cũ cộng biến đổi và giới hạn trong phạm vi chuẩn:

```python
# Cập nhật Danh tiếng (Kẹp trong khoảng -100 đến +100)
def update_reputation(current_val: int, delta: int) -> int:
    return max(-100, min(100, current_val + delta))

# Cập nhật Khí vận (Kẹp trong khoảng -100 đến +100)
def update_luck(current_val: int, delta: int) -> int:
    return max(-100, min(100, current_val + delta))

# Cập nhật Chân nguyên hải (Kẹp trong khoảng 0% đến 100%)
def update_primeval_sea(current_val: int, delta: int) -> int:
    return max(0, min(100, current_val + delta))
```

### 2. Hàm Gieo Xúc Xắc Thật & Tính Biên Độ $\Delta$
Code đảm bảo tính ngẫu nhiên khách quan:
```python
import random

def roll_dice(target: int) -> dict:
    player_roll = random.randint(1, 100)
    delta = player_roll - target
    return {
        "target": target,
        "player_roll": player_roll,
        "delta": delta
    }
```

### 3. Đồng Hồ Thế Giới & Cơ Chế Bắt Kịp Khi Nạp Vùng (Lazy Catch-Up)
* Thời gian cộng dồn theo từng hành vi.
* Khi nạp Chunk mới, hàm tự so sánh khoảng cách thời gian để cập nhật trạng thái sự kiện tương ứng.

### 4. Bộ Lọc Ngữ Cảnh Chunk Động (Chunk Loader)
Chỉ nạp thông tin địa điểm người chơi đang đứng và danh sách NPC thực tế có mặt (roll từ `npc_schedules.json`) vào prompt của LLM để tối ưu token.

### 5. Hệ Thống Tính Điểm Lượt Chơi (Run Scoring System)
Tính điểm đánh giá tổng kết sau mỗi phiên chơi: Điểm cao cho người đối đầu rủi ro, mưu trí đạt thành tựu; điểm thấp cho lối chơi chỉ biết trốn tránh.

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
