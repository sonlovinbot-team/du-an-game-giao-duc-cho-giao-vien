# Hệ thiết kế Hạt Mầm

**Đối tượng:** Giáo viên tiểu học Việt Nam, sử dụng chuột trên máy chiếu hoặc chạm trên điện thoại. Tác vụ chính: tìm trò phù hợp → hiểu mục tiêu → chơi.

**Hướng mỹ thuật:** Một ngôi làng học tập; nền sáng xanh kem, xanh lá chủ đạo, minh hoạ gợi vật thật trong từng trò. Không dùng biểu đồ quản trị, số liệu người dùng hay chứng thực giả.

- Nunito Sans: chữ có dấu rõ ràng, tiêu đề 800, nội dung 400/600.
- Màu nhấn `#26745d`, chữ chính `#273b32`; chữ phụ thiết yếu dùng các tông xanh đủ đậm.
- Card 12px, hero 17px, dialog 20px; nút 7–8px; nút biểu tượng lưu dạng tròn.
- 4 cột trên màn hình lớn, 3 cột tablet rộng, 2 cột điện thoại.
- Minh hoạ gốc SVG trong thư viện; cảnh Three.js thực trong màn chơi 3D.
- Chuyển động chỉ phục vụ trạng thái, tiến độ và tương tác mô hình. Tôn trọng reduced motion.
- Tách trò chơi khỏi thư viện khi chơi; thanh tiêu đề có quay lại, âm thanh, chơi lại và toàn màn hình.
- Các nhóm Toán, Tiếng Việt, Khoa học, Văn hoá Việt, Tư duy phản ánh mục tiêu học, không chỉ bối cảnh hình ảnh.

Kiểm tra thiết kế bằng ảnh chụp desktop 1440px, mobile 390px và chơi thực tế. Ưu tiên tương phản chữ, không tràn ngang, không mất focus sau mỗi nhịp đồng hồ.
