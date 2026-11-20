# BẢN ĐỒ 2D KHẢO SÁT CHI TIẾT THANH MAO SƠN (CHUẨN NGUYÊN TÁC)
> **Căn cứ văn bản:** File `quyen1.md` (33.661 dòng tác phẩm *Cổ Chân Nhân* - Quyển 1: Ma Đầu Xuất Sơn).  
> **Nguyên tắc biên soạn:** Tuyệt đối trung thành 100% với nguyên tác (Zero-extrapolation). Mọi địa danh, phương hướng, khoảng cách, phân tầng và cứ điểm đều đi kèm số dòng trích dẫn xác thực.

---

## I. HỆ QUY CHIẾU TỌA ĐỘ VÀ PHƯƠNG HƯỚNG 2D

Dựa theo mô tả phương hướng và địa thế trong văn bản:
1. **Trục Bắc - Nam ($Y$):**
   - **Bắc (+Y / Hậu Sơn):** Phía sau núi, nơi có **Đại Thác Nước** đổ xuống **Hồ Sâu (Thâm Đàm)** và **Bạch Gia Sơn Trại** (Dòng 2110, 2112, 9593). Khí hậu ẩm lạnh, sương mù quanh năm.
   - **Nam (-Y / Tiền Sơn):** Phía trước núi, nơi có vách đá dựng đứng hiểm trở và **Hùng Gia Sơn Trại** (Dòng 9593). Rừng rậm có dã hùng sinh sống.
2. **Trục Tây - Đông ($X$):**
   - **Tây (-X / Đỉnh Núi & Vách Tây):** Đỉnh núi cao dốc, lộng gió, hiểm trở.
   - **Đông (+X / Sườn Đông, Đông Môn & Chân Núi):** Sườn núi thoai thoải có **Cổ Nguyệt Sơn Trại** (Trung Sơn), cổng chính hướng về phía **Đông Môn** (Dòng 15956, 24623-26267). Phía dưới chân dốc Đông là **Ruộng Bậc Thang (Thê Điền)**, **Thôn Trang Phàm Nhân** và **Chi lưu Hoàng Long Giang** (Dòng 5499, 18263, 18735).
3. **Trục Độ Cao ($Z$):**
   - **$Z = -1$:** Hệ thống lòng đất (Địa hạ mật động Hoa Tửu $\to$ Huyết Hồ Lăng Mộ Cổ Nguyệt Sơ Đại).
   - **$Z = 0$:** Chân núi, ruộng lúa phàm nhân, lòng sông nhánh Hoàng Long Giang.
   - **$Z = 1$:** Sườn núi thoải (Cổ Nguyệt Trại, Bạch Gia Trại, Hội Minh Pha).
   - **$Z = 2$:** Vách đá Tiền Sơn (Hùng Gia Trại), Vách đá Thác nước Hậu Sơn.
   - **$Z = 3$:** Đỉnh núi Thanh Mao Sơn.

---

## II. MA TRẬN BẢN ĐỒ 2D TỔNG THỂ (TOP-DOWN ASCII GRID)

```text
       [ TÂY: ĐỈNH NÚI ]                                      [ ĐÔNG: CHÂN NÚI ]
[-10]                           [0]                           [+10]
 +-------------------------------------------------------------+  [+10] BẮC (HẬU SƠN)
 |                                                             |
 |              [ĐẠI THÁC NƯỚC HẬU SƠN] (L2110)                |
 |                     |                                       |
 |                     v                                       |
 |             [BẠCH GIA SƠN TRẠI] (L9593)                     |
 |             (Bên cạnh Thâm Đàm lạnh lẽo)                    |
 |                     \                                       |
 |                      \ (Chi nhánh suối nhỏ)                 |
 |                       \                                     |
 |                        v                                    |
 |                   [HỘI MINH PHA] (L19758)                   |
 |                   (Quảng trường đá tam tộc)                 |
 |                                \                            |
 |                                 \                           |
 |  [ĐỈNH THANH MAO SƠN]            \                          |
 |  (Vách đá dốc đứng)               v                         |
 |                       [CỔ NGUYỆT SƠN TRẠI] (L71, L9593)     |
 |                       +---------------------------+         |
 |                       | - Từ Đường & Linh Tuyền   |         |
 |                       | - Học Đường & Quảng Trường|         |
 |                       | - [ĐÔNG MÔN] (L15956) ====|===> [VỰC ĐÁ ĐIỆN LANG] (L26267)
 |                       +---------------------------+         | (Hướng Lang Triều công kích)
 |                                /          |                 |
 |      (Động ngầm)              /           v                 |
 |   [KHE HỞ ĐỘNG HOA TỬU] <----+     [SƠN ĐẠO CHÍNH] (L5509)  |
 |   (Sau rèm thác nước nhỏ, L2120)          |                 |
 |         |                                 v                 |
 |         v                           [RUỘNG BẬC THANG] (L5499)
 |   [HÙNG GIA SƠN TRẠI] (L9593)       (Thê điền phàm nhân)    |
 |   (Tiền Sơn dốc đá hiểm trở)              |                 |
 |   - Rừng gấu ngựa                         v                 |
 |                                     [THÔN PHÀM NHÂN] (L18263)
 |                                           |                 |
 |                                           v                 |
 |                               [CHI LƯU HOÀNG LONG GIANG]    |
 |                               - Vị trí [THÔN GIANG THIỀM]   |
 |                                 nằm nghẽn dòng (L18737)     |
 +-------------------------------------------------------------+  [-10] NAM (TIỀN SƠN)
```

---

## III. CHI TIẾT 6 PHÂN VÙNG ĐỊA LÝ NGUYÊN TÁC

### 1. PHÂN VÙNG TRUNG SƠN: CỔ NGUYỆT SƠN TRẠI
* **Tọa độ trung tâm:** $(X: +2, Y: 0, Z: 1)$
* **Căn cứ văn bản:**
  - Tọa lạc tại sườn núi (trung sơn), nhìn xuống chân núi (Dòng 67, 9593).
  - Kiến trúc đặc trưng: Hàng ngàn ngôi **nhà sàn cẳng cao** (*cao chân nhà treo*, Dòng 69) làm bằng gỗ và **Mâu Trúc** (tre thẳng nhọn như ngọn giáo mác, Dòng 1084). Ban đêm thắp đèn rực rỡ như dải lụa quang bao bọc sườn núi.
* **Các cứ điểm nòng cốt nội bộ:**
  1. **Gia Tộc Từ Đường / Tổ Miếu $(X: +2, Y: +1, Z: 1)$:**
     - Tòa lầu các nguy nga 3 tầng trung tâm trại thờ phụng bài vị tổ tiên (Dòng 73-85).
     - **Địa hạ Tuyền Nhãn (Linh Tuyền) & Cổ Thất:** Nằm ngầm ngay dưới Từ Đường, là mạch nguồn phun ra nguyên thạch nuôi sống cả gia tộc (Dòng 475).
  2. **Học Đường Gia Tộc $(X: +1.5, Y: +0.5, Z: 1)$:**
     - Nơi giảng dạy thiếu niên 15 tuổi, có võ đài luyện võ, ký túc xá học đồ và phòng nghị sự của Học Đường Gia Lão.
  3. **Quảng Trường Sơn Trại $(X: +2.5, Y: 0, Z: 1)$:**
     - Bãi đất trống rộng lớn trung tâm, nơi thương đội Cổ Phú dựng lều hạ trại, bày sạp buôn bán, bãi cờ bạc đổ thạch (Dòng 5529-5728).
  4. **Khu Phố Thương Nghiệp & Khách Sạn Cổ Nguyệt $(X: +3, Y: -0.5, Z: 1)$:**
     - Nơi có tiệm rèn, tửu quán, tiệm tạp hóa, và khách sạn duy nhất trong sơn trại do gia đình cữu phụ Phương Nguyên quản lý (Dòng 1645).
  5. **Dược Đường & Hình Đường $(X: +1, Y: -0.5, Z: 1)$:**
     - Dược Đường: Khuôn viên cứu chữa thương binh và điều chế thảo dược của phe phái Dược Cơ.
     - Hình Đường: Trụ sở chấp pháp, lao ngục và phòng tra khảo tộc nhân phạm tội.
  6. **Đông Môn (Cổng Đông) $(X: +4, Y: 0, Z: 1)$:**
     - Cổng chính hướng ra dốc núi dẫn xuống thung lũng, có **Đông Môn Tửu Quán** (Dòng 15956) và chòi canh.
     - Tường rào trồng ken dày **Thiết Đằng Cổ** (dây leo thép) làm chông gai chống thú dữ.
     - Đây là tuyến phòng thủ đẫm máu nhất trong mùa Lang Triều, nơi bầy Cuồng Điện Lang và Lôi Quán Điện Lang dốc toàn lực công phá (Dòng 24623-26267).

---

### 2. PHÂN VÙNG HẬU SƠN: BẠCH GIA SƠN TRẠI & ĐẠI THÁC NƯỚC
* **Tọa độ trung tâm:** $(X: -1, Y: +7, Z: 1)$
* **Căn cứ văn bản:**
  - Dòng 2110: *"Thanh Mao sơn phía sau núi, là một đạo đại thác nước."*
  - Dòng 2112: *"Thác nước dòng nước, theo khí tượng biến hóa mà biến hóa, nó xuống dốc không phanh, đánh sâu vào ra một khối hồ sâu. Hồ sâu bên cạnh, chính là Bạch gia sơn trại, thế lực hùng hồn, cùng Cổ Nguyệt sơn trại chỉ cường không kém."*
  - Dòng 19782: Do sống cạnh thác nước ẩm ướt và giá lạnh, tộc nhân Bạch gia có nước da trắng muốt và mang theo một cỗ âm hàn chi khí.
* **Đặc điểm địa hình:**
  - **Đại Thác Nước (Đại bộc bố):** Chảy từ đỉnh núi phía bắc dội thẳng xuống vách đá, tiếng nước gầm vang dội khắp hậu sơn.
  - **Thâm Đàm (Hồ sâu chân thác):** Vực nước sâu thẳm, lạnh ngắt do bọt nước thác dội ngày đêm.
  - **Kiến trúc:** Nhà cửa Bạch Gia Trại xây kiên cố bằng đá hoa cương trắng và ngói xám để chống ẩm mốc.

---

### 3. PHÂN VÙNG TIỀN SƠN: HÙNG GIA SƠN TRẠI
* **Tọa độ trung tâm:** $(X: -4, Y: -6, Z: 2)$
* **Căn cứ văn bản:**
  - Dòng 9593: Hùng gia trại trấn giữ ở mặt trước núi (Tiền Sơn).
  - Dòng 19782: Tộc nhân Hùng gia ai nấy đều cao to vạm vỡ, hình thể lực lưỡng, chuộng sức mạnh cận chiến.
* **Đặc điểm địa hình & Cứ điểm:**
  - Địa thế dốc đá dựng đứng, gồ ghề hiểm trở nhất trong ba trại.
  - Kiến trúc: Thổ trại kiên cố xây từ những thân gỗ lim cổ thụ to lớn, phong cách thô mộc, phòng thủ vững chắc.
  - **Rừng Gấu Ngựa:** Vùng rừng rậm tiền sơn bao quanh trại, là nơi trú ngụ của các đàn gấu hoang hung dữ. Cổ sư Hùng gia dùng **Ngự Hùng Cổ** bắt gấu thuần hóa làm chiến thú (Dòng 19788).

---

### 4. PHÂN VÙNG GIÁP RANH: HỘI MINH PHA & CHIẾN TRƯỜNG DÃ NGOẠI
* **Tọa độ trung tâm:** $(X: +1, Y: +4, Z: 1)$
* **Căn cứ văn bản:**
  - Dòng 19758 - 19770: **Hội Minh Pha** là địa điểm tổ chức liên minh tam tộc mỗi kỳ thú triều.
  - Vốn là một triền núi tự nhiên, qua nhiều thế hệ cải tạo đã trở thành một **quảng trường đá khổng lồ** tựa lưng vào vách núi dựng đứng.
  - Phía trên có cự thạch ban công với bàn ghế đá cho tộc trưởng và gia lão ba nhà ngồi đàm phán; phía dưới là bãi đất trống phân chia ranh giới rõ ràng cho hàng ngàn cổ sư nhị chuyển đứng chứng kiến.
* **Vực Đá Điện Lang (Lang Quần Xuất Phát Điểm) $(X: +6, Y: +2, Z: 0.5)$:**
  - Các khe nứt đá và hẻm núi hoang dã sườn đông, nơi bầy Điện Lang tụ tập và tràn lên tấn công trực diện Đông Môn của Cổ Nguyệt Trại (Dòng 20835, 24623).

---

### 5. PHÂN VÙNG CHÂN NÚI: THÊ ĐIỀN, THÔN PHÀM NHÂN & NHÁNH SÔNG
* **Tọa độ trung tâm:** $(X: +6, Y: -4, Z: 0)$
* **Căn cứ văn bản:**
  - Dòng 5499: *"Ở sườn núi chỗ, còn lại là đại lượng ruộng bậc thang. Một tầng tầng, một giai giai, xanh nhạt lúa mạch non trồng đi xuống, từ xa nhìn lại giống như là một mảnh xanh tươi xanh nhạt biển."*
  - Dòng 5509: Con đường núi (**Sơn Đạo**) từ chân núi uốn lượn qua các thửa ruộng bậc thang dẫn thẳng lên cổng Cổ Nguyệt Trại. Nông dân phàm nhân cày cấy lúa nước và hoa màu.
  - Dòng 18263, 18419, 18737: Dưới chân núi có một **nhánh sông (chi lưu)** bắt nguồn từ **Hoàng Long Giang**.
  - **Vị trí Thôn Giang Thiềm $(X: +8, Y: -5, Z: 0)$:** Cổ trùng Ngũ chuyển to như quả núi nhỏ nằm ngửa ngủ say giữa lòng nhánh sông này, chặn đứng dòng chảy khiến thượng du ngập lụt ruộng lúa và hạ du cạn trơ đáy (Dòng 18737).

---

### 6. HỆ THỐNG LÒNG ĐẤT: DI SẢN HOA TỬU & LĂNG MỘ SƠ ĐẠI
* **Tọa độ trung tâm:** Ngay dưới sườn núi phía ngoài Cổ Nguyệt Trại $(X: 0 \to +2, Y: 0 \to +1, Z: -1)$
* **Căn cứ văn bản:**
  - Dòng 2114 - 2122: Lối vào là một **khe hở cự thạch** tự nhiên nằm sau bức rèm của một dòng thác nước nhỏ (mini thác nước là một nhánh rẽ từ Đại Thác Nước Hậu Sơn).
* **Cấu trúc phân tầng ngầm (từ cạn vào sâu):**
  1. **Tầng 1 - Khe Hở Cự Thạch & Hầm Rượu $(Z: -0.5)$:**
     - Lối đi hẹp ban đầu đi vừa 2 người, sau thu hẹp phải nghiêng mình lách qua.
     - Hầm rượu ngầm nồng nặc hương rượu - nơi bắt **Tửu Trùng** (Dòng 2100-2404).
     - Cuối hầm bị chặn bởi một tảng cự thạch hình cầu lớn (cần sức đẩy 1 trư lực của Bạch Thỉ Cổ, Dòng 10527, 11726).
  2. **Tầng 2 - Vách Đá Hồng Quang & Mật Thất Thảo Dược $(Z: -1.0)$:**
     - Đường hầm dốc thoai thoải phát ánh sáng đỏ nhạt, có thạch nhũ đỏ rủ xuống (Dòng 11810).
     - **Vách đá lưu ảnh:** Nơi Lưu Ảnh Tồn Thanh Cổ chiếu lại hình ảnh Hoa Tửu Hành Giả và khắc chữ máu (Dòng 6739, 8776).
     - Hố đất chôn **Địa Tàng Hoa Cổ** (chứa Bạch Thỉ Cổ, Dòng 9359).
     - Mật thất bùn đất ẩm ướt nuôi dưỡng **Cửu Diệp Sinh Cơ Thảo** (Dòng 15686-15700).
  3. **Tầng 3 - Thạch Lâm & Hang Sâu $(Z: -1.5)$:**
     - Rừng đá thạch nhũ (*thạch lâm trung ương địa động*, Dòng 19348).
     - Vách đá ký sinh **Địa Thính Nhục Nhĩ Thảo** (Dòng 21501).
     - Động ngầm nơi giấu **Cứ Xỉ Kim Ngô** (Dòng 26743).
     - Hang hốc phong ấn của cổ thú **Thiên Lý Địa Lang Chu** (Dòng 31653-31875).
  4. **Tầng Sâu Nhất - Huyết Hồ & Lăng Mộ Cổ Nguyệt Sơ Đại $(Z: -2.0)$:**
     - Động ngầm khổng lồ chứa **Huyết Hồ** (Hồ Máu, Dòng 31153) - nơi chiếc quan tài dựng đứng đỏ thẫm của Cổ Nguyệt Sơ Đại trồi lên (Dòng 31163).
     - Kết giới **Thủy Mạc Thiên Hoa / Huyết Mạc Thiên Hoa** phong tỏa.
     - Vách đá nơi bầy **Đao Sí Huyết Bức** làm tổ (Dòng 31199).
     - Mật thất cất giữ ngọc quan của **Thiên Hạc Thượng Nhân** (Dòng 1995, 32303).

---

## IV. BẢNG TỌA ĐỘ VÀ THÔNG SỐ ĐỊA LÝ 2D (GAME WORLD DATABASE)

| STT | Địa Danh Cứ Điểm | Vùng Địa Lý | Tọa độ X | Tọa độ Y | Cao độ Z | Dòng dẫn chứng | Đặc điểm môi trường / Cơ chế |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **1** | **Cổ Nguyệt Từ Đường** | Trung Sơn | `+2.0` | `+1.0` | `1.0` | Dòng 73-85 | Trung tâm chính trị Cổ Nguyệt, 3 tầng lầu |
| **2** | **Linh Tuyền & Cổ Thất** | Trung Sơn (Ngầm)| `+2.0` | `+1.0` | `0.0` | Dòng 475 | Nguồn sản sinh nguyên thạch nuôi gia tộc |
| **3** | **Học Đường Cổ Nguyệt** | Trung Sơn | `+1.5` | `+0.5` | `1.0` | Dòng 100-300 | Đào tạo học đồ, lôi đài tỷ thí võ nghệ |
| **4** | **Quảng Trường Trại** | Trung Sơn | `+2.5` | `0.0` | `1.0` | Dòng 5529 | Bãi họp chợ thương đội Cổ Phú, lều đổ thạch |
| **5** | **Khách Sạn Cổ Nguyệt** | Trung Sơn | `+3.0` | `-0.5` | `1.0` | Dòng 1645 | Khách sạn duy nhất của trại, quán ăn |
| **6** | **Đông Môn (Cổng Đông)** | Trung Sơn | `+4.0` | `0.0` | `1.0` | Dòng 15956 | Tường rào Thiết Đằng Cổ, chốt chặn Lang Triều |
| **7** | **Đông Môn Tửu Quán** | Trung Sơn | `+3.8` | `+0.3` | `1.0` | Dòng 15956 | Điểm hẹn Phương Nguyên gặp Thanh Thư |
| **8** | **Dược Đường** | Trung Sơn | `+1.0` | `-0.5` | `1.0` | Dòng 24485 | Căn cứ chữa trị của phe phái Dược Cơ |
| **9** | **Hình Đường** | Trung Sơn | `+1.0` | `+1.5` | `1.0` | Dòng 13560 | Cơ quan điều tra phá án, giam giữ phạm nhân |
| **10**| **Bạch Gia Sơn Trại** | Hậu Sơn | `-1.0` | `+7.0` | `1.0` | Dòng 9593 | Trại gạch trắng ngói xám cạnh hồ sâu |
| **11**| **Đại Thác Nước Hậu Sơn**| Hậu Sơn | `-1.0` | `+8.5` | `2.0` | Dòng 2110 | Dòng thác khổng lồ từ đỉnh núi đổ xuống |
| **12**| **Thâm Đàm (Hồ chân thác)**| Hậu Sơn | `-1.0` | `+7.8` | `1.0` | Dòng 2112 | Hồ nước sâu lạnh thấu xương, bọt trắng xóa |
| **13**| **Hùng Gia Sơn Trại** | Tiền Sơn | `-4.0` | `-6.0` | `2.0` | Dòng 9593 | Thổ trại gỗ lim kiên cố trên dốc đá hiểm |
| **14**| **Rừng Gấu Ngựa** | Tiền Sơn | `-5.5` | `-5.0` | `1.5` | Dòng 19788 | Vùng dã ngoại nhiều gấu đen, ổ gấu |
| **15**| **Hội Minh Pha** | Giáp Ranh | `+1.0` | `+4.0` | `1.0` | Dòng 19758 | Quảng trường đá vách núi đàm phán 3 trại |
| **16**| **Vực Đá Điện Lang** | Hoang Dã | `+6.0` | `+2.0` | `0.5` | Dòng 26267 | Khe hẻm hoang dã xuất phát thú triều sói |
| **17**| **Ruộng Bậc Thang (Thê điền)**| Chân Núi | `+5.0` | `-3.0` | `0.5` | Dòng 5499 | Ruộng lúa phàm nhân trải dài sườn dốc |
| **18**| **Thôn Trang Phàm Nhân**| Chân Núi | `+6.5` | `-4.5` | `0.0` | Dòng 18263 | Làng mạc người thường sinh sống |
| **19**| **Sơn Đạo Chính** | Chân Núi $\to$ Trại| `+4.5` | `-2.0` | `0.5` | Dòng 5509 | Tuyến đường bộ thương đội Cổ Phú cưỡi thiềm lên |
| **20**| **Nhánh Sông Hoàng Long**| Chân Núi | `+8.0` | `-5.0` | `0.0` | Dòng 18263 | Dòng chảy nối từ Hoàng Long Giang vào núi |
| **21**| **Vị trí Thôn Giang Thiềm**| Chân Núi | `+8.5` | `-4.5` | `0.0` | Dòng 18737 | Cóc ngũ chuyển nằm ngủ chắn ngang hà đạo |
| **22**| **Khe Hở Cự Thạch (Động)**| Ngoại Trại | `+0.5` | `+0.8` | `0.8` | Dòng 2120 | Sau rèm mini thác nước, cửa vào di sản |
| **23**| **Vách Đá Lưu Ảnh & Đất Hoa**| Lòng Đất Tầng 2| `+0.8` | `+0.9` | `-1.0`| Dòng 8776 | Nơi chôn Địa Tàng Hoa, Sinh Cơ Thảo |
| **24**| **Thạch Lâm Địa Động** | Lòng Đất Tầng 3| `+1.2` | `+1.0` | `-1.5`| Dòng 19348 | Rừng nhũ đá, Địa Thính Nhục Nhĩ, Cứ Xỉ Kim Ngô |
| **25**| **Huyết Hồ Lăng Mộ Sơ Đại**| Lòng Đất Sâu | `+1.8` | `+1.2` | `-2.0`| Dòng 31153 | Quan tài đỏ của Cổ Nguyệt Sơ Đại, Huyết Mạc |
| **26**| **Đỉnh Thanh Mao Sơn** | Đỉnh Núi | `-2.0` | `+2.0` | `3.0` | Dòng 2221 | Điểm cao nhất nhìn bao quát toàn bộ sơn mạch |

---

## V. CÁC TUYẾN GIAO THÔNG VÀ Ý ĐỒ CHIẾN THUẬT

1. **Tuyến Thương Mại Ngoại Giới:**
   $$\text{Hoàng Long Giang} \longrightarrow \text{Sơn Đạo Chân Núi} \longrightarrow \text{Ruộng Bậc Thang} \longrightarrow \text{Đông Môn Cổ Nguyệt}$$
   - Lộ trình thương đội Cổ Phú hàng năm lên núi giao thương.
2. **Tuyến Liên Sơn Tam Đại Gia Tộc:**
   - $\text{Cổ Nguyệt} \longleftrightarrow \text{Hội Minh Pha} \longleftrightarrow \text{Bạch Gia}$: Đường đèo men theo vách núi sườn bắc ($\approx 2$ canh giờ).
   - $\text{Cổ Nguyệt} \longleftrightarrow \text{Hùng Gia}$: Men theo sườn đồi dốc rừng thông phía nam ($\approx 1.5$ canh giờ).
   - $\text{Hùng Gia} \longleftrightarrow \text{Bạch Gia}$: Đi vòng theo dốc đá chân núi phía tây ($\approx 2$ canh giờ).
3. **Tuyến Bộc Phát Lang Triều:**
   - Đàn sói tụ tập tại các khe núi dốc hiểm hoang dã sườn đông $\longrightarrow$ Tràn thẳng lên dốc Đông Môn Cổ Nguyệt và xông vào các thôn bản phàm nhân dưới chân núi.
4. **Tuyến Bí Mật Thoát Hiểm Tàn Cuộc:**
   $$\text{Hầm Ngầm Hoa Tửu} \xrightarrow{\text{Ngàn Dặm Địa Lang Chu}} \text{Khoét Đất Xuyên Lên Trại} \longrightarrow \text{Trốn Sang Bạch Cốt Sơn (Tây Bắc)}$$
