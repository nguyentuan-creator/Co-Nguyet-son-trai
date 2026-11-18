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
│ - Miêu tả diễn biến sáng tạo dựa theo các bậc định tính của Delta.           │
│ - Tự đánh giá thời điểm thích hợp để gọi hàm cập nhật thuộc tính/tài nguyên. │
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
*Các hướng dẫn mang tính tổng quát để LLM tự do tư duy, đánh giá ngữ cảnh và sáng tạo lời dẫn truyện mà không bị gò bó công thức.*

### 1. Nguyên Tắc Tối Cao: Bảo Toàn Quyền Người Chơi
* AI quản lý thế giới, NPC, môi trường và hậu quả khách quan.
* **Tuyệt đối không nói, suy nghĩ hay hành động thay cho nhân vật người chơi (PC).** Luôn dừng lại ở thời điểm cần người chơi đưa ra quyết định.

### 2. Tư Duy Đánh Giá & Định Giá Ngưỡng Thách Thức (`Target: 1 - 100`)
Thay vì áp dụng công thức cộng trừ cứng nhắc, AI được toàn quyền **suy nghĩ và đánh giá tổng thể tình huống** để đưa ra một con số thử thách hợp lý ($1 \rightarrow 100$):
* **Tương quan thực lực:** Chênh lệch cảnh giới, Cổ trùng sở hữu, lợi thế địa hình.
* **Tính hợp lý & Khéo léo:** Lời lẽ người chơi nói ra có thuyết phục không? Kế hoạch có chặt chẽ hay liều lĩnh tự sát? Nắm đúng thóp đối phương hay đe dọa mù quáng?
* **Yếu tố Khí vận & Danh tiếng:** Cân nhắc xem khí vận hiện tại của người chơi có tạo ra may mắn hay xui xẻo bất ngờ nào cho tình huống đó không.
* $\rightarrow$ **AI chốt một con số `Target`:** Dễ thì $20 - 40$, trung bình $50 - 60$, khó $70 - 80$, thập tử nhất sinh / nghịch thiên thì $90 - 100$.

### 3. Dẫn Truyện Theo Các Bậc Định Tính Của Biên Độ $\Delta$
Sau khi nhận kết quả $\Delta = \text{Player Roll} - \text{Target}$ từ code, AI **tự do sáng tạo diễn biến** phù hợp với ngữ cảnh cụ thể (chiến đấu, đàm phán, đổ thạch, tẩu thoát...) dựa trên các tầng kết quả tổng quát:

| Khoảng $\Delta$ | Bậc Định Tính | Định Hướng Dẫn Truyện Của AI |
| :---: | :---: | :--- |
| **$+50 \rightarrow +99$** | **Thắng Lợi Mỹ Mãn / Hoàn Hảo** | Đạt được mục tiêu một cách xuất sắc nhất, vượt ngoài mong đợi, không tì vết, đối phương hoàn toàn bị khuất phục hoặc vô hiệu hóa. |
| **$+15 \rightarrow +49$** | **Thắng Lợi Rõ Ràng** | Đạt được ý định một cách an toàn, làm chủ tình thế, tiêu hao tài nguyên ở mức tối thiểu. |
| **$+1 \rightarrow +14$** | **Thành Công Có Trả Giá / Sít Sao** | Đạt được mục đích nhưng phải đánh đổi: bị thương tích, tốn nhiều chân nguyên, sứt mẻ vật phẩm, hoặc để lại sự nghi ngờ. |
| **$0$** | **Bất Phân Thắng Bại / Giằng Co** | Thế trận cân bằng, đôi bên tạm thời lùi lại thăm dò, tình thế chưa ngã ngũ. |
| **$-14 \rightarrow -1$** | **Thất Bại Nhẹ / Bị Cản Trở** | Hành động không thành, kế hoạch bị chệch hướng hoặc bị chặn đứng, nhưng vẫn kịp bảo toàn lực lượng rút lui. |
| **$-49 \rightarrow -15$** | **Thất Bại Nặng / Trọng Thương** | Kế hoạch đổ bể, bị phản đòn đau đớn, chịu tổn thất lớn về thân thể hoặc Cổ trùng, rơi vào thế bị động nguy hiểm. |
| **$-50 \rightarrow -99$** | **Thảm Bại / Nguy Nan Cận Kề** | Họa sát thân! Rơi vào tuyệt cảnh sinh tử, hậu quả khôn lường nếu không có bài tẩy cứu mạng đặc biệt. |

### 4. Tự Đánh Giá Khi Nào Cần Gọi Hàm (Tool / Function Calling)
* AI tự nhận định khi nào hành vi trong cốt truyện đủ sức nặng để làm biến động các thuộc tính và phát lệnh gọi hàm:
  * Khi người chơi có hành vi quang minh chính đại hoặc ma đạo tàn độc $\rightarrow$ Gọi hàm thay đổi **Danh Tiếng**.
  * Khi người chơi làm việc nghịch thiên, cướp đoạt cơ duyên lớn hoặc gặp đại họa $\rightarrow$ Gọi hàm thay đổi **Khí Vận**.
  * Khi người chơi kích hoạt Cổ, mua bán, trị thương $\rightarrow$ Gọi hàm cập nhật **Chân Nguyên, Tiền Tệ, Vật Phẩm**.

---

## PHẦN III: CÁC HÀM CƠ CHẾ THUẦN (DETERMINISTIC CODE ENGINE)
*Logic nghiệp vụ thuần túy bằng Python/JS: Đơn giản, trực tiếp, lấy giá trị cũ cộng biến đổi và kẹp biên độ.*

### 1. Các Hàm Cập Nhật Chỉ Số Nhân Vật (Trực Tiếp & Tinh Gọn)
Không viết rườm rà, các hàm cập nhật chỉ số trực tiếp lấy giá trị cũ cộng biến đổi và giới hạn trong phạm vi chuẩn:

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
