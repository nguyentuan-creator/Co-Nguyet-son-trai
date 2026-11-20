# Cổ Nguyệt Sơn Trại (Cổ Chân Nhân AI Text-RPG)

## 1. Tổng quan & Bối cảnh
- **Tên trò chơi:** Cổ Nguyệt Sơn Trại
- **Địa điểm:** Thanh Mao Sơn — Cổ Nguyệt Sơn Trại và vùng phụ cận trong tác phẩm *Cổ Chân Nhân*.
- **Thời gian bắt đầu:** Sáng hôm sau **Khai Khiếu Đại Điển** (Năm thứ nhất — 15 tuổi; nhân vật chính trong nguyên tác là Phương Nguyên đóng vai trò NPC bạn học/kình địch cùng khóa, không phải nhân vật người chơi).
- **Nội dung:** Người chơi nhập vai thành 1 trong 57 thiếu niên 15 tuổi thành công khai khiếu tại Học đường Cổ Nguyệt Sơn Trại và tự mở ra con đường tu hành của mình.
- **Thời lượng:** 1 năm thời gian trong game (365 ngày, 4 mùa), kết thúc sau **Đại hội Niên Mạt Khảo Hạch** cuối năm (và lời mời phân bổ tiểu tổ).

---

## 2. Lối chơi cốt lõi
- Người chơi tự do viết ra quyết định/hành động của mình, quản trò AI kể tiếp diễn biến dựa trên dữ liệu thực tế và kết quả hệ thống tính toán.
- **Cơ chế tung xúc xắc `d100` (chuẩn hóa theo Độ khó — `targetDC`):**
  - Với hành động có rủi ro, tranh chấp hoặc khả năng thất bại, quản trò AI đánh giá **Độ khó khách quan (`baseDC`: 1–100)** (số càng nhỏ càng dễ, số càng lớn càng khó).
  - Chương trình `dice100` tự động áp dụng điều chỉnh từ `luck` và `fatigue`/`statusEffects` để ra **Ngưỡng cần vượt cuối cùng (`targetDC`: 1–100)**, sau đó tung random `roll` từ 1–100 và trả về chênh lệch `margin = roll - targetDC`:
    - `margin >= 0` (`0` đến `99`, trong đó `0` là thành công suýt soát): **Thành công**.
    - `margin < 0` (`-99` đến `-1`): **Thất bại**.
  - Quản trò AI dựa vào `margin` và cờ biên (1 hoặc 100) để suy diễn mức độ thành công/thất bại và hệ quả lên nhân vật lẫn thế giới.
- **Hành động thường ngày (không tung dice):** Với các hành động không có rủi ro hay xung đột (đi lại trong khu vực an toàn, trò chuyện xã giao, xem túi đồ, mua bán đúng giá niêm yết...), quản trò AI không gọi `dice100` để giữ nhịp truyện mượt và tiết kiệm lượt gọi API.
- **Thế giới cố định bám nguyên tác:** Bản đồ và phân phối tài nguyên là dữ liệu cố định (không random map). Người chơi hoàn toàn có thể tận dụng kiến thức nguyên tác để tìm cơ duyên hoặc đối phó biến cố trước khi có manh mối, miễn là đưa ra kế hoạch hợp lý và vượt qua các rào cản thực tế.
- **Cơ chế Chiến đấu (Combat Loop):**
  - Khi bước vào giao tranh giữa cổ sư hoặc với dã thú nguy hiểm, game chuyển sang **nhịp chiến đấu ngắn (theo hiệp / vài nhịp thở)** thay vì cắt theo canh giờ.
  - Mỗi hiệp, người chơi mô tả tổ hợp chiêu thức/cổ trùng sử dụng; `essenceCalc` trừ chân nguyên trực tiếp cho tất cả cổ trùng/sát chiêu kích hoạt trong hiệp đó, `dice100` phân định kết quả pha giao tranh, sau đó AI mô tả diễn biến hiệp đấu.
  - Khi kết thúc trận đánh, tổng thời gian trận đấu (tính bằng phút) mới cộng vào đồng hồ thế giới và quy đổi mệt mỏi (`fatigue`)/thương tích.

---

## 3. Yêu cầu đối với quản trò AI
- Kể chuyện bằng văn phong lạnh lùng, thực tế, đậm chất mưu lược và tàn khốc của tác phẩm *Cổ Chân Nhân*.
- Chỉ đánh giá **Độ khó khách quan (`baseDC`)** cho hành động cần tung dice (không tự cộng/trừ `luck` để tránh trùng lặp với `dice100`).
- Ước lượng thời gian tiêu tốn hợp lý cho mỗi hành động (tính bằng **phút** hoặc **canh giờ**) rồi trả về trong JSON để chương trình cập nhật đồng hồ thế giới.
- Suy luận tầm ảnh hưởng của hành động (thay đổi chỉ số, vật phẩm, quan hệ, cờ sự kiện, tin đồn, dòng tóm tắt ký ức) và trả về qua Structured Output để code kiểm tra hợp lệ trước khi ghi.
- Tuyệt đối không tự ý nói, suy nghĩ hay quyết định hành động thay cho người chơi.
- Bám sát 100% dữ liệu hiện có của thế giới và nhân vật (không tự bịa ra cổ trùng, nguyên thạch, cổ phương hay thông tin không tồn tại trong database/state).

---

## 4. Các chương trình hỗ trợ AI (Game Engine bằng Code)
- **`dice100`:** Nhận `baseDC` (1–100) từ quản trò AI; tự tính điều chỉnh theo `luck` (`-50` đến `50`: `luck` dương **giảm** `targetDC`, `luck` âm **tăng** `targetDC`, biên độ tối đa khoảng ±10 điểm), cộng thêm phạt từ `fatigue` cao và `statusEffects`; chốt `targetDC` trong `[1, 100]`, tung random `1–100` và trả về `{ roll, targetDC, margin, isCritSuccess (roll === 100), isCritFail (roll === 1) }`.
- **`essenceCalc`:** Quy đổi và tính toán chân nguyên theo đơn vị **"thành"** dựa trên `rank` tiểu cảnh giới (`1–20`) của người dùng và `essenceCost` chuẩn của cổ trùng/sát chiêu (`{ amount, baseRank }`):
  - Kiểm tra có đủ chân nguyên hay không rồi trừ trực tiếp vào `currentEssence`.
  - Hỗ trợ kiểm tra tổng tiêu hao khi kích hoạt nhiều cổ trùng cùng lúc trong 1 hiệp chiến đấu.
- **`timeTick`:** Nhận thời gian hành động (quy về **phút**). Cộng vào `currentTime` (`0–119` phút trong canh giờ hiện tại); mỗi khi vượt qua mốc 120 phút (sang 1 **canh giờ** mới), chạy 1 lát cắt mô phỏng bằng code mà không tốn API:
  - Cập nhật `fatigue`, hồi phục `currentEssence` theo `aptitude`, trừ `hunger` của từng cổ trùng theo `feedingCycleDays`, xử lý tác động mỗi canh giờ của `statusEffects`, cập nhật `spreadRumor`, và kiểm tra `worldEffects` của các sự kiện theo ngày.
  - Kiểm tra **3 nhóm điều kiện ngắt quãng** (nội tại & tài nguyên, môi trường & sự kiện, nghĩa vụ xã hội). Chỉ dừng vòng lặp và gọi AI kể chuyện 1 lần khi bị ngắt hoặc hoàn thành trọn hành động.
- **`updateState`:** Kiểm tra điều kiện hợp lệ (không trừ âm nguyên thạch/chân nguyên, không vượt sức chứa túi đồ, không dùng cổ chưa luyện hóa, không phá hủy Bản Mệnh Cổ khi hợp luyện thất bại) rồi mới ghi thay đổi vào trạng thái nhân vật, NPC, túi đồ, bản đồ, quan hệ, danh vọng phe phái và `worldFlags`. Tự động kích hoạt Game Over nếu `health <= 0` hoặc `apertureStatus === "Crippled"`.
- **`spreadRumor`:** Quản lý bảng `activeRumors` tập trung theo khu vực và thời gian; khi người chơi gặp NPC mới, kiểm tra xem NPC đó đã nằm trong `knownByNpcIds` chưa (nếu chưa thì xét xác suất nghe phong phanh 1 lần rồi lưu kết quả lại để tránh mâu thuẫn giữa các lần gặp). Chỉ khi `spreadLevel >= 70` mới kết tinh thành 1 dòng cố định trong `publicImage.regionRep[].publicBio`.
- **`contextLoader`:** Trước mỗi lượt chỉ nạp dữ liệu địa điểm hiện tại, NPC đang có mặt (chỉ đưa phần `publicImage` ra mặt giao diện, đưa dữ liệu thật vào ngữ cảnh ẩn cho AI nhập vai), sự kiện đang hoạt động, tin đồn liên quan, `memoryLog` nén và `6–10` lượt hội thoại nguyên văn gần nhất để tiết kiệm token.

---

## 5. Giải quyết các bài toán thiết kế cốt lõi

### 5.1. Quy đổi độ khó hành động (`baseDC` → `targetDC`)
Trước khi chốt `baseDC` (1–100), quản trò AI phân tích nhanh 3 lớp điều kiện khách quan:
1. **Tương quan thực lực:** Chênh lệch `rank`, cổ trùng đang sở hữu, lượng `currentEssence` còn lại, chỉ số khí lực (`strength`), thương tích hiện có.
2. **Độ hợp lý của kế hoạch:** Lời nói có thuyết phục không, có nắm đúng điểm yếu đối phương không, có chuẩn bị trước hay làm liều.
3. **Bối cảnh xung quanh:** Địa hình, thời điểm, có người chứng kiến hay không, lợi thế từ danh tiếng (`regionRep`, `factionRep`) hoặc quan hệ với NPC.
4. **Điều chỉnh tự động bởi `dice100` (code xử lý):**
   - `luck` (`-50` đến `50`): điều chỉnh `targetDC` theo công thức `round(-luck / 5)` (tối đa giảm 10 khi `luck = +50`, tăng 10 khi `luck = -50`).
   - `fatigue` cao (ví dụ `> 70`) và `statusEffects`: cộng thêm `dcPenalty` vào `targetDC`.
- **Khung tham chiếu `baseDC`:**
  - Rất dễ: `10–25`
  - Dễ: `26–45`
  - Trung bình: `46–65`
  - Khó: `66–80`
  - Cực khó: `81–95`
  - Gần như bất khả thi: `96–100`
- **Quy tắc biên:** Tung được `100` luôn có cơ hội tạo kỳ tích suýt soát ngay cả ở việc cực khó; tung ra `1` luôn phát sinh biến cố bất lợi dù việc rất dễ.

### 5.2. Tác động của người chơi lên thế giới (tiết kiệm token)
- **Với NPC (Tin đồn & Lan truyền):**
  - Khi người chơi làm việc đáng chú ý (bị NPC chứng kiến, hoặc làm 1 mình nhưng thất bại trong việc che giấu), hệ thống tạo 1 bản ghi trong bảng `activeRumors` kèm `originLocationId`, `regionName`, `spreadLevel`, `truthNote` và `involvedIds`.
  - Không cập nhật hàng loạt vào hồ sơ toàn bộ NPC trong lượt đó. Tin đồn tự tăng/giảm `spreadLevel` theo ngày trong `timeTick`. Khi người chơi gặp NPC cùng khu vực/phe phái, `spreadRumor` xét 1 lần và ghi nhận vào `knownByNpcIds` trước khi nạp vào ngữ cảnh (tin đồn truyền xa có thể sai lệch chi tiết so với `truthNote`).
  - Khi tin đồn đủ lớn (`spreadLevel >= 70`), hệ thống mới ghi nhận thành sự tích lâu dài vào `publicImage.regionRep[].publicBio`.
- **Với mạch truyện (`worldFlags` & `worldEffects`):**
  - Không viết lại kịch bản dài; dùng danh sách cờ trạng thái `worldFlags` và trạng thái sống/chết/thái độ của NPC cốt cán.
  - Các mốc trong bảng `Sự kiện trong năm` có thể đính kèm `worldEffects` tự động (ví dụ: đến ngày X nếu người chơi chưa lấy Tửu Trùng ở Động Hoa Tửu thì code tự đánh dấu `isTaken = true, takenBy = "npc_phuong_nguyen"`).

### 5.3. Nén ký ức xuyên suốt 1 năm (`memoryLog`)
- Chỉ gửi nguyên văn **6–10 lượt hội thoại gần nhất** cho AI.
- **Cách nén không tốn thêm API:** Ở mỗi lượt có sự kiện quan trọng (gặp nhân vật mới, kết thù, giao dịch lớn, phát hiện bí mật, đột phá, thay đổi cốt truyện), AI tự đính kèm trường tùy chọn `memorySummary` (1–2 câu ngắn) ngay trong JSON đầu ra của lượt đó để `updateState` thêm vào `memoryLog`.
- Khi `memoryLog` vượt quá ngưỡng (ví dụ > 60 dòng), `contextLoader` chỉ ưu tiên nạp các dòng liên quan đến NPC/địa điểm hiện tại cùng bản tóm tắt theo mùa (Xuân/Hạ/Thu/Đông).

### 5.4. Quản lý thời gian & 3 nhóm điều kiện ngắt quãng (`timeTick`)
- Đơn vị nhỏ nhất để ghi nhận là **phút** (`currentTime: 0–119`), đơn vị mô phỏng là **1 canh giờ = 120 phút** (1 ngày = 12 canh giờ).
- Khi hành động kéo dài nhiều canh giờ/ngày (bế quan, đi săn, đi đường), `timeTick` tự chạy vòng lặp qua từng canh giờ bằng code và chỉ ngắt để gọi AI khi chạm 1 trong 3 nhóm điều kiện:
  - **Nhóm 1 — Nội tại & Tài nguyên:** `fatigue >= 90` (kiệt sức), `hunger <= 20%` ở bất kỳ cổ trùng nào, cạn tiền/vật tư duy trì sinh hoạt, `statusEffects` khiến `health` tụt xuống ngưỡng nguy hiểm (`<= 30%`), hoặc `cultivationProgress >= 100%` cần người chơi quyết định đột phá.
  - **Nhóm 2 — Môi trường & Sự kiện thế giới:** Chạm mốc `timelineEvent` trong ngày, hoặc đang ở địa điểm có `dangerLevel > 0` và tung dice biến cố môi trường/dã thú/người lạ trúng ngưỡng xảy ra (nơi an toàn có `dangerLevel = 0` như ký túc xá/phòng riêng không tung dice sự cố ngẫu nhiên).
  - **Nhóm 3 — Nghĩa vụ xã hội & Gia tộc:** Đối chiếu trực tiếp với bảng `obligations` (lịch học đường, điểm danh, khảo hạch, nhiệm vụ gia tộc). Nếu tự ý vắng mặt vượt ngưỡng cho phép mà chưa xin phép hoặc mất tích nhiều ngày sẽ kích hoạt người đi tìm, trừ `clanContribution` / `factionRep`, bị phạt hoặc sinh tin đồn khả nghi.

### 5.5. Các công thức định lượng chuẩn (cho `essenceCalc` & `timeTick`)
- **Quy ước cảnh giới:**
  - **Nhân vật (Người chơi & NPC phàm giới):** `rank` tính theo **tiểu cảnh giới** (`0` = phàm nhân; `1–4` = Nhất chuyển sơ/trung/cao/đỉnh; `5–8` = Nhị chuyển sơ/trung/cao/đỉnh; ...; `17–20` = Ngũ chuyển; `21–24` = 6–9 chuyển tiên giới). Đổi sang số chuyển ở phàm giới: `tier = ceil(rank / 4)`.
  - **Cổ trùng, cổ phương, sát chiêu:** `rank` tính theo **số chuyển (`1–9`)**; riêng `essenceCost` ghi rõ `{ amount, baseRank }` trong đó `baseRank` là **tiểu cảnh giới chuẩn (`1–20`)** (ví dụ: `baseRank = 1` là Thanh Đồng sơ giai, `baseRank = 5` là Xích Thiết sơ giai, `baseRank = 9` là Bạch Ngân sơ giai).
- **Quy đổi chân nguyên trong `essenceCalc`:**
  - Chênh lệch cùng đại cảnh giới (cùng số chuyển): mỗi 1 tiểu cảnh giới cao hơn giúp giảm 15% lượng thành tiêu hao (tối thiểu nhân hệ số `0.55`), mỗi 1 tiểu cảnh giới thấp hơn tăng 25% lượng thành tiêu hao.
  - Chênh lệch vượt đại cảnh giới (khác số chuyển): cao hơn 1 chuyển giảm mạnh tiêu hao (hệ số `× 0.25` mỗi chuyển), thấp hơn 1 chuyển tăng vọt tiêu hao (hệ số `× 4` mỗi chuyển) và dễ gây phản phệ nếu vượt quá 1 chuyển.
- **Hồi phục chân nguyên mỗi canh giờ (nghỉ ngơi / không chiến đấu):**
  - Hồi tự nhiên: `(aptitude / 10) × 0.08` thành/canh giờ (khoảng 12–13 canh giờ đầy lại từ 0; tư chất càng cao hồi càng nhanh theo đúng nguyên tác).
  - Hấp thu nguyên thạch trực tiếp: mỗi 1 nguyên thạch tiêu thụ trong 1 canh giờ hồi thêm khoảng `1.5–2.0` thành chân nguyên (tùy cảnh giới).
- **Tiến độ tu luyện (`cultivationProgress`) & Đột phá:**
  - Ôn dưỡng không khiếu tiêu hao chân nguyên để tăng `cultivationProgress` (tư chất càng cao hoặc có phụ trợ như Tửu Trùng thì tăng càng nhanh).
  - Khi đạt `100%`: người chơi có thể chọn **Đột phá** (tung `dice100`; đột phá tiểu cảnh giới độ khó trung bình, đột phá đại cảnh giới từ đỉnh phong lên chuyển tiếp theo độ khó cao và đòi hỏi tích lũy/nguyên thạch; thất bại giảm một phần `cultivationProgress` và có thể gây chấn thương nhẹ không khiếu).
- **Độ mệt mỏi (`fatigue`):**
  - Hoạt động bình thường: `+3` đến `+5`/canh giờ; đi đường/săn bắn/tu luyện cường độ cao: `+8` đến `+12`/canh giờ; chiến đấu căng thẳng: `+10` đến `+20`/trận.
  - Ngủ nghỉ ở nơi an toàn: `-15` đến `-20`/canh giờ.
  - Mức phạt: `fatigue >= 70` cộng `+10` vào `targetDC`; `fatigue >= 90` cộng `+25` vào `targetDC` và tự động ngắt `timeTick`.
- **Độ đói cổ trùng (`hunger`):**
  - Giảm mỗi canh giờ: `100 / (feedingCycleDays × 12)` %.
  - Ngưỡng cảnh báo ngắt `timeTick`: `hunger <= 20%`. Xuống `0%` cổ trùng chết đói (nếu là Bản Mệnh Cổ thì gây phản phệ nặng, tổn hại/phế không khiếu).
  - Cho ăn 1 suất thức ăn chuẩn (`food`) hồi lại `100%` (hoặc theo tỷ lệ nếu ăn thiếu).

### 5.6. Luật Bản Mệnh Cổ & Luyện hóa Cổ trùng
- **Bản Mệnh Cổ (`isVital: true`):**
  - Khoảng 7 ngày sau Khai Khiếu Đại Điển, học viên vào Cổ Thất chọn 1 con Cổ Nhất chuyển làm Bản Mệnh Cổ (Nguyệt Quang Cổ, Đồng Bì Cổ, Hoa Thỉ Cổ, Sinh Tức Thảo...).
  - **Đặc quyền bất tử khi hợp luyện:** Khi hợp luyện nâng cấp thất bại, cổ phụ liệu và vật liệu bị hủy, nhưng **Bản Mệnh Cổ tuyệt đối không chết**, tối đa chỉ rơi vào trạng thái trọng thương/suy yếu cần dưỡng lại.
  - **Cảnh báo sinh mệnh:** Có thể rung động cảnh báo sớm khi gặp nguy hiểm sinh tử cận kề.
  - **Rủi ro đồng quy:** Nếu Bản Mệnh Cổ bị tiêu diệt hoàn toàn trong chiến đấu hoặc chết đói, cổ sư chịu phản phệ cực nặng (tụt mạnh `health`, `apertureStatus` chuyển sang `Damaged` hoặc `Crippled`).
- **Luyện hóa cổ mới:** Cổ hoang dã hoặc cổ mới mua cần trải qua quá trình luyện hóa bằng chân nguyên (`isRefined: true`) mới sử dụng được.

---

## 6. Kết nối Google AI Studio (Gemini API), Tối ưu chi phí & Định hướng Kỹ thuật
- **BYOK (Bring Your Own Key):** Người chơi dán trực tiếp API key từ Google AI Studio vào giao diện game (lưu cục bộ trên trình duyệt/máy, chỉ gọi thẳng tới API Google).
- **Tùy chọn Model:** Mặc định bản **Gemini Flash** (nhanh, rẻ), cho phép đổi sang **Gemini Pro** nếu muốn văn phong sâu hơn; kèm nút kiểm tra kết nối và bộ đếm ước lượng token mỗi lượt.
- **Structured Output & Tối ưu số lượt gọi:**
  - Dùng Structured Output (JSON Schema) / Function Calling tách riêng phần dữ liệu (`needDice`, `baseDC`, `durationMinutes`, `usedGuIds`, `stateUpdates`, `memorySummary`) khỏi phần văn bản kể chuyện.
  - Hành động thường ngày: **1 lần gọi API**.
  - Hành động có tung dice hoặc chiến đấu: tối đa **2 bước** (Bước 1 xuất JSON rất ngắn để code chạy `dice100`/`essenceCalc`/`timeTick`; Bước 2 kể chuyện theo kết quả đã chốt).
- **Context Caching:** Tách cố định phần System Prompt (luật thế giới, văn phong *Cổ Chân Nhân*, quy tắc chống phá game) khỏi ngữ cảnh động (`contextLoader`) để tận dụng Context Caching của Gemini.
- **An toàn khi lỗi mạng / Rate Limit (429):** Ghi state theo kiểu transaction (chỉ lưu khi lượt hoàn tất); lỗi giữa chừng không trừ oan chân nguyên hay thời gian, cho phép thử lại lượt hoặc đổi model/API key ngay lập tức.
- **Định hướng nền tảng & Giao diện (dự kiến cho giai đoạn lập trình):**
  - **Web App chạy cục bộ trên trình duyệt** (HTML/TS/React + Vite, không cần server backend phức tạp; dữ liệu tĩnh nằm trong thư mục `database/*.json`, file save lưu cục bộ ở `localStorage`/`IndexedDB` kèm xuất/nhập `.json`).
  - **Bố cục UI cơ bản:** Khung truyện & nhập lệnh ở trung tâm; bảng trạng thái nhanh (HP, Chân nguyên, Mệt mỏi, Khí lực, Nguyên thạch, Ngày/Canh giờ); các tab phụ cho Túi đồ, Cổ trùng (kèm thanh `hunger`), Bản đồ 2D theo tầng `Z`, Nhân vật/Quan hệ và Nhật ký ký ức.

---

## 7. Giới hạn của người chơi & Safeguard
- Không thể tự quyết định kết quả hành động (tự tuyên bố đánh thắng, thuyết phục thành công) hoặc tự điều khiển lời nói, hành động của NPC thay quản trò AI.
- Không thể tự tạo ra cổ trùng, nguyên thạch, cổ phương, sát chiêu hay tài sản không có trong dữ liệu nhân vật (nếu người chơi cố tình nhập lệnh "ăn gian", AI từ chối thực thi theo logic thế giới thực tế trong game).
- Không thể thực hiện hành động trái quy luật thế giới *Cổ Chân Nhân* (phàm nhân chống lại cổ sư, thúc giục cổ khi cạn chân nguyên, vượt giới hạn không khiếu...).
- Không thể nhìn thấy thông tin thật (`rank`, `aptitude`, `currentEssence`, `bio`) của NPC đang che giấu; giao diện chỉ hiển thị phần `publicImage` trừ khi dùng thủ đoạn trinh sát hoặc điều tra thành công.

---

## 8. Điều kiện kết thúc trò chơi
- **Hoàn thành 1 năm:** Vượt qua **Đại hội Niên Mạt Khảo Hạch** cuối năm (vòng đo tu vi + lôi đài đối kháng + lời mời tiểu tổ theo `factionRep`), hệ thống tổng kết chặng đường tu hành (cảnh giới, cổ trùng, khí lực, danh tiếng, dấu ấn tại Cổ Nguyệt Sơn Trại).
- **Kết thúc sớm (Thất bại):** Nhân vật tử vong (`health <= 0`), bị phế không khiếu (`apertureStatus === "Crippled"`), hoặc phạm trọng tội bị Hình Đường/gia tộc xử tử.

---

## 9. Khởi tạo nhân vật & Lưu tiến trình
- **Khởi tạo đầu game:** Người chơi tạo nhân vật trong phạm vi cho phép: tên, tuổi cố định **15** (khóa Khai Khiếu Năm 1), ngoại hình, xuất thân trong Cổ Nguyệt Sơn Trại, tư chất **`20–79%`** (Đinh/Bính/Ất đẳng, không vượt Giáp đẳng của Phương Chính), khí vận **`-50` đến `50`**, tiểu sử ban đầu — rồi bước vào sáng hôm sau Khai Khiếu Đại Điển.
- **Lưu tiến trình (1 slot duy nhất — Ironman):** Chỉ dùng 1 slot lưu duy nhất (JSON cục bộ), tự động lưu ngay sau mỗi lượt / mỗi lần tung dice để mọi lựa chọn đều có sức nặng thật; chỉ có thể chơi tiếp hoặc xóa để chơi lại từ đầu (hỗ trợ xuất/nhập file `.json` để sao lưu sang máy khác).

---

## 10. Thiết kế dữ liệu chuẩn hóa (Database & Save Schema)

> **Quy ước chung:** Mọi thực thể dùng khóa định danh riêng (`guId`, `npcId`, `itemId`, `locationId`, `recipeId`, `moveId`, `eventId`, `rumorId`), trường tên thống nhất là `name`, trường cảnh giới thống nhất là `rank`, trường vị trí thống nhất là `locationId`, và đơn vị thời gian được gắn rõ ngay trong tên trường (`Minutes`, `Shichen`, `Days`).

### 10.1. Dữ liệu Người chơi (`player`)
- `name`: Tên nhân vật
- `age`: `15` (bắt đầu Năm 1; tăng lên `16` khi qua mốc năm)
- `rank`: `1–8` (tiểu cảnh giới; trong Năm 1 phổ biến `1–4`, mở trần tới `8` nếu có cơ duyên lớn)
- `aptitude`: `20–79` (%, tối đa chứa `aptitude / 10` thành chân nguyên, vd `44%` = `4.4` thành)
- `currentEssence`: `0` đến `aptitude / 10` (đơn vị "thành")
- `apertureStatus`: `Normal / Damaged / Crippled` (trạng thái không khiếu; `Crippled` = kết thúc sớm)
- `cultivationProgress`: `0–100` (% tiến độ ôn dưỡng không khiếu lên `rank` kế tiếp)
- `strength`: Chỉ số khí lực / thể chất tính theo đơn vị **trư lực** (mặc định người thường `0.2`, có thể tăng vĩnh viễn nhờ Bạch Thỉ Cổ / Hắc Thỉ Cổ...)
- `health`: `0–100` (%, tử vong khi `<= 0`)
- `fatigue`: `0–100` (`0` sung sức, `100` kiệt sức)
- `*statusEffects`: Danh sách trạng thái cơ thể đang chịu:
  - `effectId`: Mã trạng thái
  - `name`: Tên (Trúng độc, Trọng thương, Đói khát, Suy yếu...)
  - `severity`: `Mild / Moderate / Severe`
  - `hpDeltaPerShichen`: Mức thay đổi `health` mỗi canh giờ
  - `fatigueDeltaPerShichen`: Mức thay đổi `fatigue` mỗi canh giờ
  - `dcPenalty`: Điểm phạt cộng thêm vào `targetDC`
  - `durationShichen`: Số canh giờ còn lại (`-1` nếu chỉ hết khi được chữa trị)
  - `cureCondition`: Điều kiện hóa giải (dùng cổ trị liệu, thuốc giải, nghỉ ngơi...)
- `luck`: `-50` đến `50`
- `locationId`: Mã địa điểm hiện tại
- `clanContribution`: Điểm cống hiến gia tộc
- `factionRep`: Thiện cảm với 4 khối ghế Hội Đồng Gia Lão (`-100` đến `100`):
  - `clanLeader`: Phe Tộc Trưởng (6 ghế)
  - `chiFaction`: Phe Xích Mạch (5 ghế)
  - `moFaction`: Phe Mạc Mạch (5 ghế)
  - `neutral`: Phe Trung Lập (4 ghế)
- `bio`: Tiểu sử thật
- `knowledge`:
  - `*paths`: `{ path, mastery: Ordinary / Master / Grandmaster / Great Grandmaster / Supreme Grandmaster }`
  - `*recipes`: `{ recipeId, completeness: 0–100 }`
  - `*killerMoves`: `{ moveId, proficiency: 0–100 }`
- `*ownedGu`: Danh sách cổ trùng đang giữ:
  - `guId`: Mã cổ trùng (nối sang bảng Cổ trùng)
  - `isVital`: `true / false` (Bản Mệnh Cổ)
  - `isRefined`: `true / false` (đã luyện hóa hay chưa)
  - `condition`: `Healthy / Injured` (Bản Mệnh Cổ bị trọng thương khi hợp luyện thất bại)
  - `hunger`: `0–100` (%, chết đói khi về `0`)
- `inventory`:
  - `capacity`: Sức chứa tối đa
  - `primevalStones`: Số nguyên thạch
  - `*items`: `{ itemId, quantity }`
- `*relationships`: (chỉ tạo khi có tương tác/ân oán đáng kể với NPC để tiết kiệm token)
  - `npcId`: Mã NPC
  - `attitude`: `-100` đến `100` (thù hận – trung lập – tin cậy)
  - `privateNote`: 1 dòng ngắn gộp ân oán riêng và bí mật NPC biết về người chơi
- `publicImage`:
  - `appearance`: Mô tả ngoại hình
  - `apparentRank`: `1–8` (cảnh giới biểu hiện bên ngoài)
  - `apparentAptitude`: `20–100` (tư chất biểu hiện bên ngoài)
  - `*regionRep`: `{ regionTier: Clan / Province / Region / Realm, regionName, publicBio, rep: 0–100 }`

### 10.2. Dữ liệu NPC Phàm giới (`npcs`)
- `npcId`: Mã định danh NPC
- `name`: Tên
- `age`: Tuổi
- `rank`: `0–20` (tiểu cảnh giới: `0` phàm nhân → `20` Ngũ chuyển đỉnh phong)
- `aptitude`: `0–100` (%, `0` với phàm nhân; ẩn khỏi giao diện người chơi)
- `currentEssence`: `0` đến `aptitude / 10` (dùng khi giao đấu)
- `strength`: Chỉ số khí lực (đơn vị trư lực)
- `health`: `0–100` (`0` ⇔ `status = Dead`)
- `status`: `Alive / Missing / Dead`
- `*statusEffects`: (cùng cấu trúc với người chơi, dùng khi đang bị thương/trúng độc)
- `faction`: Thế lực / mạch phái (`clanLeader / chiFaction / moFaction / neutral / outsider`)
- `role`: Vai trò / chức vụ
- `personality`: Tính cách cốt lõi để AI nhập vai đúng chất
- `goals`: Mục tiêu, động cơ hiện tại
- `locationId`: Mã địa điểm hiện tại
- `*schedule`: Lịch trình thường xuất hiện `{ shichenRange, locationId, activity }`
- `bio`: Tiểu sử thật (ẩn khỏi giao diện người chơi)
- `knowledge`:
  - `*paths`: `{ path, mastery }`
  - `*recipes`: `{ recipeId, completeness }`
  - `*killerMoves`: `{ moveId, proficiency }`
- `*ownedGu`: `{ guId, isVital }` (nối trực tiếp bảng Cổ trùng)
- `inventory`: `{ capacity, primevalStones, *items: { itemId, quantity } }`
- `publicImage`:
  - `appearance`: Mô tả ngoại hình
  - `apparentRank`: `0–20`
  - `apparentAptitude`: `0–100`
  - `*regionRep`: `{ regionTier, regionName, publicBio, rep: 0–100 }`

### 10.3. Dữ liệu NPC Tiên giới (mở rộng tương lai)
- `npcId`, `name`, `rank` (`21–24`: 6–9 chuyển), `locationId`, `status` (`Alive / Missing / Dead`)
- `currentEssence`, `essenceCapacity`, `essenceRegeneration` (tiên nguyên)
- `immortalAperture`: `{ area, production, *daoMarks: { path, count } }`
- `personality`, `goals`, `bio`
- `knowledge`: `{ *paths, *recipes, *killerMoves }`
- `*ownedGu`: `{ guId, isVital }`
- `publicImage`: `{ appearance, apparentRank: 0–24, apparentAptitude: 0–100, *regionRep }`

### 10.4. Dữ liệu Cổ trùng (`gu`)
- `guId`: Mã cổ trùng
- `name`: Tên cổ trùng
- `rank`: `1–9` (số chuyển)
- `path`: Lưu phái
- `category`: `Attack / Defense / Movement / Investigation / Healing / Control / Support / Storage / Refinement`
- `effect`: Mô tả công dụng, phạm vi và điều kiện/giới hạn sử dụng (bao gồm hiệu quả thụ động/vĩnh viễn nếu có)
- `essenceCost`: `{ amount, baseRank }` (số "thành" tiêu hao chuẩn ở tiểu cảnh giới `baseRank` `1–20`; `amount = 0` nếu là cổ tiêu hao/lực đạo thụ động)
- `food`: `{ itemId, quantityPerFeed }` (thức ăn nối sang bảng Vật phẩm)
- `feedingCycleDays`: Chu kỳ cần cho ăn tính theo **ngày**
- `basePrice`: Giá thị trường tham khảo (nguyên thạch)
- `refinementNote`: Ghi chú nguồn gốc tự nhiên hoặc lộ tuyến hợp luyện

### 10.5. Dữ liệu Cổ phương (`recipes`)
- `recipeId`: Mã cổ phương
- `name`: Tên cổ phương
- `resultGuId`: Mã cổ trùng tạo thành
- `rank`: `1–9` (số chuyển của cổ trùng kết quả)
- `path`: Lưu phái
- `*requiredGu`: `{ guId, quantity }`
- `*materials`: `{ itemId, quantity }` (nối sang bảng Vật phẩm)
- `baseDifficulty`: `1–100` (độ khó nền theo chuẩn `targetDC` — càng nhỏ càng dễ; thực tế điều chỉnh theo cảnh giới Luyện đạo, `completeness` và `dice100`)
- `essenceRequirement`: `{ amount, baseRank }` (tổng chân nguyên yêu cầu để hợp luyện, tính bằng `essenceCalc`)
- `timeRequiredShichen`: Thời gian hợp luyện tính theo **canh giờ**
- `failurePenalty`: Hậu quả khi thất bại (mất nguyên liệu, cổ phụ liệu nổ chết, phản phệ thương tích — **lưu ý:** Bản Mệnh Cổ không chết, chỉ chuyển `condition = Injured`)
- `sourceNote`: Nguồn gốc (gia tộc lưu truyền, bí phương, tàn phương...)

### 10.6. Dữ liệu Sát chiêu (`killerMoves`)
- `moveId`: Mã sát chiêu
- `name`: Tên sát chiêu
- `rank`: `1–9` (số chuyển sát chiêu)
- `path`: Lưu phái chính
- `category`: `Attack / Defense / Movement / Investigation / Healing / Control / Support`
- `coreGuId`: Mã cổ trùng hạch tâm
- `*supportGuIds`: Danh sách mã cổ trùng phụ trợ
- `effect`: Mô tả uy lực, phạm vi và nhược điểm
- `essenceCost`: `{ amount, baseRank }` (tổng mức tiêu hao tính qua `essenceCalc`)
- `activationTime`: Thời gian thúc giục (tức thời hay cần vài nhịp thở chuẩn bị)
- `baseDifficulty`: `1–100` (độ khó nền theo chuẩn `targetDC`, giảm dần theo `proficiency`)
- `backlash`: Hậu quả phản phệ khi thúc giục thất bại

### 10.7. Dữ liệu Vật phẩm (`items`)
- `itemId`: Mã vật phẩm
- `name`: Tên vật phẩm
- `type`: `Food / Material / Consumable / KeyItem / Misc`
- `description`: Mô tả công dụng ngắn
- `size`: Độ chiếm chỗ trong `inventory.capacity`
- `basePrice`: Giá tham khảo bằng nguyên thạch

### 10.8. Dữ liệu Địa điểm & Phân phối tài nguyên (`locations`)
- `locationId`: Mã địa điểm
- `name`: Tên địa điểm (Cổ Nguyệt Sơn Trại / Thanh Mao Sơn)
- `regionName`: Khu vực trực thuộc (nối với `regionRep`)
- `coordinates`: `{ x, y, z }` — tọa độ cố định đồng bộ với [ban_do_2d_thanh_mao_son.md](file:///d:/qoder/CoChanNhanRolePlay/ban_do_2d_thanh_mao_son.md) (`z = -1` hầm ngầm Động Hoa Tửu/Lăng Mộ; `z = 0` chân núi; `z = 1` sườn núi/Sơn trại; `z = 2` vách đá; `z = 3` đỉnh núi)
- `description`: Mô tả ngắn cảnh quan, không khí
- `dangerLevel`: `0–100` (quyết định xác suất tung dice biến cố mỗi canh giờ trong `timeTick`)
- `*connectedLocations`: `{ targetLocationId, travelMinutes }` (thời gian di chuyển cơ bản tính thống nhất bằng **phút**)
- `*resourceNodes`: Điểm tài nguyên/cơ duyên cố định (không random):
  - `nodeId`: Mã điểm tài nguyên
  - `name`: Tên tài nguyên, cổ hoang, dã thú hoặc cơ duyên/truyền thừa
  - `resourceType`: `Gu / Material / Herb / Beast / Inheritance / Service`
  - `refId`: Mã liên kết tùy chọn tới `guId` / `itemId` / `recipeId` (giúp `updateState` tự động cộng vào túi đồ)
  - `isUnique`: `true / false`
  - `isTaken`: `true / false` (đã bị người chơi hoặc NPC như Phương Nguyên lấy chưa)
  - `takenBy`: `player` hoặc `npcId` (dùng để suy diễn phản ứng mạch truyện)
  - `respawnDays`: Số ngày hồi lại (`0` nếu `isUnique = true`)
  - `hiddenDifficulty`: `0–100` (độ khó tìm ra theo chuẩn `targetDC`; có kiến thức nguyên tác và kế hoạch rõ sẽ được giảm mạnh độ khó)

### 10.9. Dữ liệu Thế giới, Thời gian & Ký ức (`worldState`)
- `currentDay`: `1–365`
- `currentShichen`: `1–12` (Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi; mỗi canh giờ = 120 phút)
- `currentTime`: `0–119` (số phút đã trôi qua trong canh giờ hiện tại)
- `timeOfDay`: `Morning / Noon / Afternoon / Evening / Night` (suy ra từ `currentShichen`)
- `season`: `Spring / Summer / Autumn / Winter`
- `*worldFlags`: `{ flagId, description, createdDay }`
- `*memoryLog`: `{ day, summary, *involvedNpcIds }`
- `*activeRumors`: Danh sách tin đồn đang lan truyền (chi tiết ở mục 10.10)

### 10.10. Dữ liệu Tin đồn (`activeRumors`)
- `rumorId`: Mã tin đồn
- `content`: Nội dung tin đồn lan truyền trong dân gian/sơn trại
- `truthNote`: Sự thật gốc ngắn gọn để AI biết tin đồn bị lệch đi chỗ nào
- `originLocationId`: Địa điểm phát sinh
- `regionName`: Khu vực lan truyền (nối với `regionRep`)
- `spreadLevel`: `0–100` (tăng/giảm dần theo ngày; đạt `>= 70` sẽ kết tinh vào `publicBio`)
- `createdDay`: `1–365`
- `*involvedIds`: Mã người chơi và các NPC liên quan trực tiếp
- `*knownByNpcIds`: Danh sách `npcId` đã được `spreadRumor` xác định là đã nghe tin đồn (tránh mâu thuẫn khi gặp lại cùng 1 NPC)

### 10.11. Dữ liệu Nghĩa vụ & Lịch trình Gia tộc (`obligations`)
- `obligationId`: Mã nghĩa vụ (vd: điểm danh học đường, nhận trợ cấp tuần, nhiệm vụ gia tộc...)
- `name`: Tên nghĩa vụ
- `locationId`: Địa điểm cần có mặt
- `frequency`: `Daily / Weekly / OneTime`
- `requiredDays`: Các ngày áp dụng (vd: thứ trong tuần hoặc ngày cụ thể)
- `shichenRange`: Khung canh giờ bắt buộc có mặt (vd: `5–6`, giờ Thìn–Tỵ)
- `maxMissedAllowed`: Số buổi vắng không phép tối đa trước khi kích hoạt ngắt Nhóm 3
- `missedCount`: Số buổi đã vắng liên tiếp
- `isExcused`: `true / false` (đã xin giấy phép ra trại hay chưa)
- `penaltyNote`: Hậu quả khi vi phạm (cử người đi tìm, trừ `clanContribution`/`factionRep`, phạt nguyên thạch, sinh tin đồn)

### 10.12. Dữ liệu Sự kiện trong năm (`timelineEvents`)
- `eventId`: Mã sự kiện
- `name`: Tên sự kiện (vd: nhận Bản Mệnh Cổ ngày 7, phát trợ cấp **3 nguyên thạch/tuần**, khảo hạch bắn bia thảo nhân, Thương đội Cổ Phú, Niên Mạt Khảo Hạch...)
- `triggerDay`: `1–365` (hoặc quy tắc lặp `recurrenceDays` như mỗi 7 ngày)
- `isMajor`: `true / false`
- `condition`: Điều kiện kích hoạt hoặc điều kiện rẽ nhánh dựa trên `worldFlags`
- `summary`: Nội dung cốt lõi để AI dẫn truyện
- `*worldEffects`: Các thay đổi dữ liệu tự động khi sự kiện kích hoạt nếu người chơi chưa can thiệp (vd: đánh dấu `resourceNode.isTaken = true, takenBy = "npc_phuong_nguyen"`, mở khóa địa điểm, cập nhật vị trí NPC, cộng trợ cấp tuần)
- `status`: `Pending / Active / Completed / Altered`


---

## 11. Kiến trúc Triển khai (Ngôn ngữ, Cơ sở dữ liệu & Danh sách Chương trình)

### 11.1. Ngôn ngữ lập trình sử dụng trong dự án
- **Ngôn ngữ duy nhất:** **TypeScript** (chạy trên trình duyệt với **React + Vite**).
- **Lý do tối ưu cho yêu cầu của game:**
  - **Đồng nhất 1 ngôn ngữ toàn bộ dự án:** Cả Game Engine (`dice100`, `essenceCalc`, `timeTick`, `updateState`...), lớp kết nối Gemini API lẫn giao diện Web đều viết bằng TypeScript — không phải chia đôi Backend Python + Frontend JS hay đồng bộ schema hai nơi.
  - **An toàn kiểu dữ liệu tuyệt đối (Static Typing):** Game có 9 bảng JSON liên kết khóa ngoại, 1 file Save Delta và JSON Structured Output từ Gemini API; TypeScript bắt lỗi sai tên trường/sai kiểu ngay lúc lập trình.
  - **Thuần Client-side chuẩn BYOK:** Chạy hoàn toàn cục bộ trên trình duyệt, lưu API key và `save.json` ngay trên máy người chơi (`localStorage`/`IndexedDB`), gọi trực tiếp Google AI Studio API không cần server trung gian, và có thể xuất bản miễn phí lên GitHub Pages để mở link chơi ngay.
  - **Hiệu năng mượt:** Vòng lặp `timeTick` xử lý hàng trăm canh giờ trong chưa tới 1ms và hỗ trợ tốt vẽ bản đồ 2D theo tầng `Z` tương tác trực tiếp.

### 11.2. Các cơ sở dữ liệu cần tạo
Sử dụng mô hình **Static Database (Read-only) + 1 File Save Động (Delta/Overlay)** để tuyệt đối không làm biến đổi dữ liệu gốc sau mỗi lượt chơi:

**A. 9 file cơ sở dữ liệu tĩnh trong `database/` (chỉ đọc, tạo theo thứ tự phụ thuộc khóa ngoại):**
1. `database/game_rules.json` — Hằng số cân bằng (`essenceCalc`, hồi chân nguyên, `fatigue`, `hunger`, `luck`), danh mục mẫu `statusEffects` chuẩn, khung khởi tạo nhân vật & danh sách Cổ Thất khởi đầu.
2. `database/items.json` — Vật phẩm (thức ăn cổ trùng, nguyên liệu luyện cổ, thảo dược, vật phẩm tiêu hao, vật phẩm cốt truyện).
3. `database/gu.json` — Danh mục Cổ trùng Nhất chuyển, Nhị chuyển (và cổ cốt cán Tam/Tứ chuyển của Gia Lão/Tộc trưởng), liên kết `items.json` qua `food.itemId`.
4. `database/recipes.json` — Cổ phương hợp luyện, liên kết `gu.json` và `items.json`.
5. `database/killer_moves.json` — Sát chiêu phàm đạo, liên kết `gu.json`.
6. `database/locations.json` — Bản đồ cố định 3 trục `{ x, y, z }`, kết nối `travelMinutes`, `dangerLevel`, và `resourceNodes` cố định (liên kết `gu.json`, `items.json`, `recipes.json`).
7. `database/npcs.json` — Hồ sơ NPC (Tộc trưởng, 5 Gia lão cốt cán, Hội đồng gia lão 4 phe, học viên cùng khóa, tiền bối, thương đội, phàm nhân), tách dữ liệu thật với `publicImage` và `schedule`.
8. `database/obligations.json` — Lịch học đường, điểm danh, trợ cấp 3 nguyên thạch/tuần, quy định xin giấy phép ra trại (nuôi Nhóm ngắt 3 của `timeTick`).
9. `database/timeline_events.json` — Biên niên sự kiện 4 mùa Năm 1 kèm `condition` và `worldEffects` tự động.

**B. 1 cấu trúc file Save động (`save.json` — 1 slot lưu duy nhất, sinh mới khi New Game):**
- Chỉ lưu phần thay đổi (Delta): `player`, `worldState`, `npcStates`, `nodeStates`, `eventStates`, `obligationStates`, và `recentTurns` (`6–10` lượt gần nhất). Hỗ trợ xuất/nhập 1 file `.json` duy nhất và ghi kiểu transaction an toàn.

### 11.3. Các chương trình (Module) cần tạo

**Tầng 1 — Dữ liệu & Lưu trữ (Data Layer):**
1. `dbLoader`: Nạp 9 file `database/*.json`, kiểm tra toàn vẹn khóa ngoại và cache dạng chỉ đọc trên RAM.
2. `saveManager`: Khởi tạo `save.json` khi New Game, lưu transaction sau mỗi lượt hoàn tất, xóa save chơi lại, và xuất/nhập file `.json`.
3. `stateResolver`: Ghép dữ liệu tĩnh từ `dbLoader` với phần delta trong `save.json` trên RAM để cung cấp trạng thái đầy đủ của NPC, địa điểm, cổ trùng và tài nguyên.

**Tầng 2 — Lõi Luật Chơi (Game Engine — Code thuần, không tốn API):**
4. `dice100`: Nhận `baseDC` từ AI → tự áp modifier từ `luck`, `fatigue`, `statusEffects` → chốt `targetDC` → tung `1–100` → trả `{ roll, targetDC, margin, isCritSuccess, isCritFail }`.
5. `essenceCalc`: Quy đổi và kiểm tra tiêu hao chân nguyên cho 1 cổ trùng, sát chiêu hoặc tổ hợp nhiều cổ trong 1 hiệp chiến đấu; tính hồi phục chân nguyên tự nhiên và từ nguyên thạch.
6. `timeTick`: Cộng phút (`currentTime`), mô phỏng từng canh giờ (`fatigue`, hồi chân nguyên, `hunger`, `statusEffects`, hồi sinh tài nguyên, chạy `worldEffects`) và kiểm tra 3 nhóm điều kiện ngắt quãng.
7. `cultivationAndGu`: Xử lý ôn dưỡng tăng `cultivationProgress`, đột phá cảnh giới, luyện hóa cổ mới (`isRefined`), cho cổ ăn (`feedGu`) và hợp luyện theo `recipes.json` (bảo vệ đặc quyền bất tử của Bản Mệnh Cổ).
8. `spreadRumor`: Quản lý `activeRumors`, cập nhật `spreadLevel` theo ngày, kiểm tra/lưu `knownByNpcIds` khi gặp NPC, và kết tinh sang `publicBio` khi `spreadLevel >= 70`.
9. `updateState`: Xác thực mọi `stateUpdates` từ AI, áp thay đổi vào bản nháp state và kiểm tra điều kiện Game Over / kết thúc Năm 1.

**Tầng 3 — Điều phối AI & Gemini API (AI Layer):**
10. `contextLoader`: Lọc địa điểm hiện tại, NPC đang có mặt, tin đồn liên quan, nghĩa vụ sắp tới, `memoryLog` nén và `6–10` lượt chat gần nhất để tối ưu token.
11. `geminiClient`: Kết nối Gemini API (BYOK), chọn model (Flash/Pro), tách System Prompt cố định (Context Caching), ép Structured Output JSON, ước lượng token và xử lý lỗi mạng / rate limit (`429`).
12. `turnOrchestrator`: Điều phối trọn vẹn 1 lượt chơi (1 bước gọi AI với hành động thường ngày; tối đa 2 bước với hành động tung dice/chiến đấu) rồi ghi state qua `saveManager`.

**Tầng 4 — Giao diện Người chơi (UI Layer):**
13. Màn hình Thiết lập API & Khởi tạo nhân vật.
14. Màn hình Chơi chính (bố cục, phong cách và thành phần chi tiết sẽ thiết kế theo thảo luận cụ thể trước khi lập trình).
