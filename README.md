Tên trò chơi: Cổ nguyệt sơn trại
Bối cảnh:
- địa điểm:    thanh mao sơn - cổ nguyệt sơn trại trong tác phẩm "Cổ Chân Nhân"
- thời gian:   sau 1 đêm sau khi nhân vật chính trong truyện Phương Nguyên (đây không phải là nhân vật chính trò chơi) chính là khai khiếu đại điển
- nội dung:    người chơi nhập vai thành 1 trong những thiếu niên thành công khai khiếu và mở ra con đường tu hành của mình.
- thời lượng:  game hiện có thời lượng là 1 năm thời gian trong game, kết thúc sau đại hội sát hạch
Lối chơi:
- bạn viết ra quyết định của mình và để quản trò AI kể về diễn biến tiếp theo sau hành động của bạn.
  quyết định của bạn có tính khả thi như thế nào sẽ được AI tính thành điểm từ 1-100 và sau đó AI gọi lệnh tung dice 100 mặt và so sánh giá trị chênh lệch để quyết định bạn thành công (chênh lệch điểm là 0 đến 99, trong đó 0 là thành công suýt soát) hay thất bại (chênh lệch điểm là -99 đến -1), sau đó quản trò AI suy diễn ra mức độ ảnh hưởng của hành động ấy đối với bạn và với thế giới.
- với những hành động sinh hoạt bình thường, không có rủi ro hay xung đột (đi lại trong trại, trò chuyện xã giao, xem túi đồ, mua bán đúng giá...) thì quản trò AI không cần tung dice để giữ nhịp truyện và tiết kiệm lượt gọi AI.

---
Yêu cầu đối với quản trò AI:
- kể chuyện với văn phong tác phẩm "Cổ Chân Nhân"
- tính điểm d100 bạn cần đạt để hành động bạn đưa ra thành công
- suy luận tầm ảnh hưởng của hành động của bạn và ghi điều đó vào dữ liệu game
- không tự ý nói, suy nghĩ hay quyết định hành động thay cho người chơi
- bám sát dữ liệu hiện có của thế giới và nhân vật (không tự bịa ra cổ trùng, nguyên thạch hay thông tin mà nhân vật không có cách nào biết)

---
Các chương trình hỗ trợ AI:
- dice100: lấy điểm d100 quản trò AI đưa ra (đã tính ảnh hưởng từ luck) sau đó tung dice random 1-100 và trả về cho quản trò giá trị chênh lệch (kèm cờ đặc biệt nếu tung ra 1 hoặc 100)
- timeTick: cộng thời gian sau hành động, tự động giảm hunger của cổ trùng, hồi phục chân nguyên theo tư chất, và kiểm tra các sự kiện trong năm đến hạn kích hoạt
- updateState: cập nhật chỉ số người chơi, túi đồ, cổ trùng, thương tích, vị trí, quan hệ NPC và kiểm tra điều kiện hợp lệ (không trừ âm nguyên thạch/chân nguyên, không vượt giới hạn)
- spreadRumor: ghi nhận tin đồn vào publicBio và tính toán mức độ lan truyền theo thời gian/khu vực mà không cần AI phải đọc ghi toàn bộ danh sách NPC
- contextLoader: trước mỗi lượt chỉ nạp dữ liệu địa điểm hiện tại, NPC đang có mặt, sự kiện gần nhất và tóm tắt ký ức liên quan để giảm lượng token gửi cho AI

---
Các vấn đề gặp phải và cách giải quyết:
- tính khả thi được chuyển thành điểm như thế nào?
   - vì sao có vấn đề này?:
   1 việc ở 1 hoàn cảnh khác nhau sẽ có tính khả thi khác nhau nên cách tính điểm khả thi không thể là 1 cách quy đổi cứng nhắc mà phải là 1 cách phân tích các yêu cầu cần có để hoàn thành việc ấy
   - phương pháp mà người phát triển nghĩ:
   trước khi chốt 1 con số từ 1-100, quản trò AI phải tự phân tích nhanh theo 4 lớp điều kiện thực tế:
      - tương quan thực lực: chênh lệch rank, cổ trùng đang sở hữu, lượng chân nguyên còn lại, thương tích hiện có
      - độ hợp lý của kế hoạch: lời nói có thuyết phục không, có nắm đúng điểm yếu đối phương không, có chuẩn bị trước hay làm liều
      - bối cảnh xung quanh: địa hình, thời điểm, có người chứng kiến hay không, lợi thế từ danh tiếng hoặc quan hệ với NPC
      - yếu tố khí vận (luck): chương trình hỗ trợ dựa trên chỉ số luck (-50 đến 50) để cộng hoặc trừ một biên độ nhỏ vào điểm khả thi cần đạt
      - khung điểm tham khảo để AI đỡ định giá cảm tính: thuận lợi (20-35), trung bình (40-55), khó (60-75), rất khó (80-92), tuyệt cảnh (93-99), bất khả thi (100)
      - quy tắc biên: tung được 100 vẫn có cơ hội tạo kỳ tích suýt soát ở việc cực khó; tung ra 1 luôn phát sinh biến cố bất lợi dù việc rất dễ

- ảnh hưởng của hành động người chơi đối với thế giới như thế nào:
   - giải thích câu hỏi:
   mỗi hành động của ta đều tác động ít hoặc nhiều đến thế giới và trong game điều đó nghĩa là mỗi tác động của ta đều ảnh hưởng đến dữ liệu game. và bởi vì dữ liệu thay đổi trong quá trình chơi là ngẫu nhiên, không cố định nên phải để AI đánh giá cái gì cần thay đổi cái gì không. nếu 1 lần hành động mà thay đổi toàn bộ dữ liệu game thì quả là 1 thảm họa với ví tiền của người chơi nên ta phải tìm cách để đảm bảo thế giới trong game được điều chỉnh hợp lý mà ví tiền của người chơi vẫn an toàn
   - phương pháp mà người phát triển nghĩ:
   hành động của người chơi sẽ ảnh hưởng đến 2 mục tiêu là npc và mạch truyện vì vậy quản trò AI phải xét được mức độ ảnh hưởng của hành động người chơi với npc và hành động đấy ảnh hưởng đến mạch truyện
      - để biết mức ảnh hưởng với npc ta có 2 cơ chế: tin đồn và truyền người này sang người nọ
      tin đồn xuất hiện khi người chơi điều khiển nhân vật làm gì đó đáng chú ý, quản trò xử lý như sau:
      - chỉ ghi vào publicBio của người chơi về việc người chơi có tin đồn về sự kiện này (khi người chơi làm việc đáng chú ý 1 mình nhưng không vượt qua được điểm khả thi của việc giấu kín không để ai phát hiện)
      - ghi vào publicBio của người chơi và các npc tham gia sự kiện rằng họ có tin đồn về sự kiện này (khi có npc trực tiếp chứng kiến, tham gia vào sự kiện và sự việc đủ lớn để gây chú ý trong sơn trại)
      - cơ chế truyền người này sang người nọ (tiết kiệm token):
      không cập nhật hàng loạt cho toàn bộ npc ngay trong lượt đó. thay vào đó, mỗi tin đồn gắn với 1 khu vực và mức độ lan rộng; khi thời gian trôi qua hoặc khi người chơi gặp 1 npc khác cùng khu vực/cùng phe phái, chương trình hỗ trợ sẽ xét xem npc đó đã nghe phong phanh tin đồn này chưa rồi mới nạp vào ngữ cảnh cho AI (tin đồn truyền qua nhiều người có thể bị lệch bớt chi tiết so với sự thật)
      - cơ chế ảnh hưởng đến mạch truyện:
      không viết lại toàn bộ kịch bản mà dùng danh sách cờ trạng thái (worldFlags) và trạng thái sống/chết/thái độ của npc quan trọng. nếu hành động người chơi làm thay đổi 1 mắt xích quan trọng (ví dụ làm mất lòng gia lão, giết 1 npc, lấy mất tài nguyên trước thời hạn) thì AI chỉ cần ghi thêm 1 dòng ngắn vào worldFlags; khi tới mốc sự kiện trong năm, AI đọc các cờ này để tự rẽ nhánh diễn biến

- chơi suốt 1 năm thì lịch sử hội thoại rất dài, làm sao để AI không quên mà vẫn tiết kiệm tiền API?:
   - giải thích câu hỏi:
   1 năm trong game có thể kéo dài hàng trăm lượt chơi, nếu gửi toàn bộ nội dung chat từ đầu tới cuối cho AI thì chi phí tăng vọt và AI dễ bị nhiễu thông tin cũ
   - phương pháp mà người phát triển nghĩ:
   chỉ gửi nguyên văn vài lượt hội thoại gần nhất cho AI, còn các diễn biến cũ sẽ được nén thành từng dòng tóm tắt ngắn trong memoryLog (chỉ giữ lại các sự kiện quan trọng, bí mật, lời hứa, ân oán) và nạp kèm dữ liệu của địa điểm hiện tại

---
Người chơi không thể làm gì:
- không thể tự quyết định kết quả hành động (tự tuyên bố mình đánh thắng, thuyết phục thành công) hoặc tự điều khiển lời nói, hành động của NPC thay quản trò AI
- không thể tự tạo ra cổ trùng, nguyên thạch, cổ phương, sát chiêu hay tài sản không có trong dữ liệu nhân vật
- không thể thực hiện hành động trái hoàn toàn quy luật thế giới Cổ Chân Nhân (phàm nhân chống lại cổ sư, dùng cổ khi cạn chân nguyên, vượt giới hạn không khiếu...)
- không thể nhìn thấy thông tin thật (rank, aptitude, bio) của NPC đang che giấu; chỉ thấy phần publicImage trừ khi dùng thủ đoạn trinh sát hoặc điều tra thành công

---
Điều kiện kết thúc trò chơi:
- hoàn thành 1 năm: vượt qua đại hội sát hạch cuối năm, hệ thống tổng kết chặng đường tu hành (cảnh giới đạt được, cổ trùng sở hữu, danh tiếng, những dấu ấn đã tạo ra tại Cổ Nguyệt sơn trại)
- kết thúc sớm (thất bại): nhân vật tử vong (health về 0), bị phế không khiếu, hoặc phạm trọng tội bị gia tộc xử tử

---
Thiết kế dữ liệu người chơi
- name: (tên)
- age: 15/16 (tuổi)
- rank: 1-8 (từ 1 chuyển sơ giai đến 2 chuyển đỉnh phong)
- aptitude: 20-79% (có thể tu luyện nhưng tư chất không đến giáp đẳng)
- currentEssence: 0-100% (lượng chân nguyên hiện có trong không khiếu, trần tối đa phụ thuộc aptitude)
- cultivationProgress: 0-100% (tiến độ ôn dưỡng không khiếu để đột phá lên rank tiếp theo)
- health: 0-100% (thể trạng hiện tại, chết khi xuống 0)
- *statusEffects: (trạng thái cơ thể đang chịu: trúng độc, trọng thương, suy yếu...)
- luck: -50 - 50 (có 1 cơ chế thêm hoặc giảm điểm khả thi với luck)
- locationId: (mã địa điểm hiện tại đang đứng)
- clanContribution: (điểm cống hiến gia tộc)
- bio: (tiểu sử)
- knowledge: (tri thức)
   - *paths: (các lưu phái)
      - path: (tên lưu phái)
      - mastery: Ordinary/Master/Grandmaster/Great Grandmaster/Supreme Grandmaster (cảnh giới lưu phái)
   - *recipes: (cổ phương)
      - recipeId: (mã cổ phương)
      - recipeName: (tên cổ phương)
      - materials: (nguyên liệu)
   - *killerMoves: (sát chiêu)
      - moveName: (tên sát chiêu)
      - moveRank: (bậc sát chiêu)
      - requiredGu: (cổ trùng cần thiết)
         - *nameGu: (tên cổ trùng)
- ownedGu: (danh sách cổ trùng sở hữu)
   - *gu: (cổ)
      - guId: (mã cổ trùng, nối với bảng cổ trùng)
      - nameGu: (tên cổ)
      - pathGu: (lưu phái)
      - isVital: True/False (cổ bản mệnh)
      - hunger: 0 - 100% (độ đói, chết đói khi xuống 0)
- inventory: (túi đồ)
   - capacity: (sức chứa)
   - primevalStones: (số nguyên thạch)
   - *item: (vật phẩm)
- *relationships: (quan hệ riêng với từng NPC - tách biệt với hình ảnh công khai)
   - npcId: (mã NPC)
   - attitude: -100 - 100 (thù hận - trung lập - tin cậy)
   - knownSecrets: (bí mật riêng tư NPC này biết về người chơi)
   - note: (ghi chú ngắn về ân oán / ấn tượng gần nhất)
- publicImage: (hình ảnh bên ngoài)
   - appearance: (mô tả ngoại hình)
   - apparentRank: 1-8 (cảnh giới biểu hiện bên ngoài)
   - apparentAptitude: 20-100% (tư chất biểu hiện bên ngoài ----- chuẩn bị nếu tương lai mở rộng)
   - *regionRep: (danh tiếng theo khu vực - chuẩn bị nếu tương lai mở rộng)
      - regionTier: Clan-Province-Region-Realm (cấp độ khu vực)
      - regionName: (tên khu vực)
      - publicBio: (sự tích công khai mọi người biết)
      - rep: 0-100 (vô danh - không ai không biết)

---
Thiết kế dữ liệu npc phàm giới
- npcId: (mã định danh NPC)
- name: (tên)
- rank: 0-20 (phàm nhân - 5 chuyển đỉnh phong)
- health: 0-100% (thể trạng hiện tại)
- status: Alive/Injured/Missing/Dead (trạng thái hiện tại)
- faction: (thế lực / mạch phái trong sơn trại)
- role: (vai trò / chức vụ)
- personality: (tính cách cốt lõi để AI nhập vai đúng chất)
- goals: (mục tiêu, động cơ hiện tại)
- currentLocation: (địa điểm hiện tại hoặc lịch trình thường xuất hiện)
- bio: (tiểu sử)
- knowledge: (tri thức)
   - *paths: (các lưu phái)
      - path: (tên lưu phái)
      - mastery: Ordinary/Master/Grandmaster/Great Grandmaster/Supreme Grandmaster (cảnh giới lưu phái)
   - *recipeId: (mã cổ phương)
   - *killerMovesName: (sát chiêu)
- *nameGu: (tên cổ)
- inventory: (túi đồ)
   - capacity: (sức chứa)
   - primevalStones: (số nguyên thạch)
   - *item: (vật phẩm)
- publicImage: (hình ảnh bên ngoài)
   - appearance: (mô tả ngoại hình)
   - apparentRank: 0-20 (cảnh giới biểu hiện bên ngoài)
   - apparentAptitude: 20-100% (tư chất biểu hiện bên ngoài ----- chuẩn bị nếu tương lai mở rộng)
   - *regionRep: (danh tiếng theo khu vực - chuẩn bị nếu tương lai mở rộng)
      - regionTier: Clan-Province-Region-Realm (cấp độ khu vực)
      - regionName: (tên khu vực)
      - publicBio: (sự tích công khai mọi người biết)
      - rep: 0-100 (vô danh - không ai không biết)

---
Thiết kế npc tiên giới (tương lai phát triển thêm)
- npcId: (mã định danh NPC)
- name: (tên)
- rank: 21-24 (6-9 chuyển)
- currentEssence: (số lượng tiên nguyên)
- essenceCapacity: (sức chứa tiên nguyên)
- essenceRegeneration: (tốc độ sản sinh tiên nguyên)
- immortalAperture: (tiên khiếu)
   - area: (kích thước tính theo mẫu)
   - production: (sản lượng tài nguyên)
   - *daoMarks: (các chủng đạo ngân)
      - path: (lưu phái)
      - count: (số lượng đạo ngân)
- personality: (tính cách cốt lõi)
- goals: (mục tiêu, động cơ)
- bio: (tiểu sử)
- knowledge: (tri thức)
   - *paths: (các lưu phái)
      - path: (tên lưu phái)
      - mastery: Ordinary/Master/Grandmaster/Great Grandmaster/Supreme Grandmaster (cảnh giới lưu phái)
   - *recipeId: (mã cổ phương)
   - *killerMovesName: (sát chiêu)
- *nameGu: (tên cổ)
- publicImage: (hình ảnh bên ngoài)
   - appearance: (mô tả ngoại hình)
   - apparentRank: 0-24 (cảnh giới biểu hiện bên ngoài - có thể giả làm phàm nhân hoặc cổ tiên)
   - apparentAptitude: 20-100% (tư chất biểu hiện bên ngoài ----- chuẩn bị nếu tương lai mở rộng)
   - *regionRep: (danh tiếng theo khu vực - chuẩn bị nếu tương lai mở rộng)
      - regionTier: Clan-Province-Region-Realm (cấp độ khu vực)
      - regionName: (tên khu vực)
      - publicBio: (sự tích công khai mọi người biết)
      - rep: 0-100 (vô danh - không ai không biết)

---
Thiết kế dữ liệu cổ trùng
- guId: (mã cổ trùng)
- nameGu: (tên cổ trùng)
- rank: 1-9 (1 chuyển - 9 chuyển)
- path: (lưu phái)
- category: Attack/Defense/Movement/Investigation/Healing/Support/Storage (nhóm công năng)
- effect: (mô tả công dụng và điều kiện/giới hạn sử dụng)
- essenceCost: (mức hao phí chân nguyên mỗi lần kích hoạt)
- food: (thức ăn của cổ trùng)
- feedingCycleDays: (chu kỳ cần cho ăn theo ngày, dùng để tính tốc độ tụt hunger)
- basePrice: (giá tham khảo bằng nguyên thạch)
- refinementNote: (ghi chú cách thu được hoặc hợp luyện)

---
Thiết kế dữ liệu thế giới và thời gian
- currentDay: 1-365 (ngày hiện tại trong năm)
- timeOfDay: Morning/Noon/Afternoon/Evening/Night (buổi trong ngày)
- season: Spring/Summer/Autumn/Winter (mùa hiện tại)
- *worldFlags: (các cờ trạng thái thể hiện tác động của người chơi lên mạch truyện)
   - flagId: (mã cờ)
   - description: (mô tả ngắn biến cố hoặc thay đổi đã xảy ra)
- *memoryLog: (nhật ký tóm tắt các sự kiện quan trọng đã qua để tiết kiệm token)
   - day: (ngày xảy ra)
   - summary: (tóm tắt 1-2 câu)
   - *involvedNpcIds: (mã các NPC liên quan)

---
Thiết kế dữ liệu địa điểm
- locationId: (mã địa điểm)
- name: (tên địa điểm trong Cổ Nguyệt sơn trại / Thanh Mao sơn)
- regionName: (thuộc khu vực nào, nối với regionRep)
- description: (mô tả ngắn cảnh quan, không khí)
- dangerLevel: 0-100 (mức độ nguy hiểm)
- *connectedLocations: (mã các địa điểm liền kề có thể di chuyển tới)
- *availableResources: (tài nguyên, dịch vụ hoặc điểm đáng chú ý tại đây)

---
Thiết kế dữ liệu sự kiện trong năm
- eventId: (mã sự kiện)
- name: (tên sự kiện: phát nguyên thạch hàng tháng, khảo hạch học đường, đại hội sát hạch...)
- triggerDay: 1-365 (ngày dự kiến xảy ra)
- isMajor: True/False (sự kiện lớn cố định hay sự kiện nhỏ/phụ)
- condition: (điều kiện kích hoạt hoặc điều kiện rẽ nhánh dựa trên worldFlags)
- summary: (nội dung cốt lõi của sự kiện để AI dẫn truyện)
- status: Pending/Active/Completed/Altered (trạng thái sự kiện)
