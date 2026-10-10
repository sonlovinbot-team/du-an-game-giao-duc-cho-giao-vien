# Nghiên cứu và quyết định thiết kế Hạt Mầm

Ngày kiểm tra: 10/10/2026. Phạm vi: giao diện phía người dùng, không đăng ký, đăng nhập hay cơ sở dữ liệu.

## Các nguồn đã quan sát

- [Giáo viên Đổi mới — trang được cung cấp](https://giaoviendoimoi.com/dashboard): mở bằng trình duyệt thực tế chuyển hướng sang `/login`. Trang công khai giới thiệu công cụ tương tác, AI, mô phỏng 2D/3D và quản lý lớp. Không đăng nhập, không chấp thuận điều khoản, không đọc được dashboard. Vì vậy không đưa ra khẳng định về thiết kế, số trò chơi hoặc chất lượng bên trong dashboard. Đây là giới hạn quan sát, không phải đánh giá tiêu cực sản phẩm.
- [Wordwall — Features](https://wordwall.net/features): tài liệu chính thức mô tả hoạt động theo mẫu, thay đổi mẫu trên cùng nội dung, sử dụng trên thiết bị có trình duyệt và dạy cả lớp, cùng lựa chọn thời gian/độ khó. Bài học áp dụng: tách nội dung bài học khỏi cơ chế trò chơi; đưa thông tin và hướng dẫn ngắn trước khi chơi; có vùng chơi riêng tập trung.
- [Toy Theater — trang chủ](https://toytheater.com/): trang công khai phân loại Toán, Ngôn ngữ, Nghệ thuật/Âm nhạc, Giải đố và Công cụ giáo viên. Bài học áp dụng: phân loại theo nhu cầu bài dạy; trò chơi ngắn có thể dùng trên màn hình lớp học; hình ảnh trực quan để giáo viên chọn nhanh.

Các nhận định về nguồn dựa trên nội dung công khai đã đọc. Không sao chép ảnh, mã nguồn, thương hiệu hoặc nội dung trả phí của các nền tảng.

## Hướng thiết kế

Đọc yêu cầu như một thư viện trò chơi cho giáo viên tiểu học Việt Nam: thân thiện, rõ ràng, giàu hình ảnh, đủ bình tĩnh để giáo viên tìm công cụ nhanh. Nhóm nghiên cứu/đồ hoạ đề xuất và trao đổi với nhóm tích hợp: thanh điều hướng yên tĩnh, cảnh làng học tập làm điểm nhận diện, bộ lọc môn học ngay trên thư viện, ảnh trò chơi chiếm phần lớn thẻ, hướng dẫn và thao tác giáo viên nằm trong màn chơi. Không dùng số người dùng, lời chứng thực hoặc thành tích giả.

Bảng màu giấy ấm, xanh lá và đất nung gợi sân trường, vườn quê; nền pastel khác nhau giúp phân biệt các trò chơi. Minh hoạ SVG nguyên bản trong mã nguồn: ô ăn quan có bàn và sỏi, nông trại có luống rau, ghép chữ có khối chữ, Hệ Mặt Trời có quỹ đạo, phân số có bánh chia phần. Trò 3D có minh hoạ phối cảnh trong thư viện, nhưng nhãn 3D phải được xác thực bằng cảnh WebGL tương tác trong màn chơi, không chỉ dựa vào ảnh bìa.

## Cấu trúc 20 trò chơi

Danh mục mặc định xen kẽ 2D/3D, gồm 10 trò mỗi loại. Năm nhóm: Toán học, Tiếng Việt, Khoa học, Văn hoá Việt, Tư duy. Dữ liệu tên, mô tả, hướng dẫn và mục tiêu học tập nằm trong `src/catalog.js`. Mỗi trò có `gradeMin`, `gradeMax` và nhãn lớp riêng dựa trên mức đọc hiểu, tính toán và suy luận của các câu hỏi thực tế; đây là phạm vi đề xuất cho giáo viên lựa chọn, không phải tuyên bố đã thẩm định chương trình giáo dục. Thời lượng cũng là gợi ý, phụ thuộc cách tổ chức lớp.

| 2D                 | 3D                  |
| ------------------ | ------------------- |
| Ô ăn quan          | Nông trại tí hon    |
| Vườn chữ diệu kỳ   | Du hành vũ trụ      |
| Lật thẻ trí nhớ    | Kỹ sư xây cầu       |
| Bếp bánh phân số   | Xưởng khối hình     |
| Đuổi hình bắt chữ  | Đua thuyền ngày hội |
| Đường về nhà       | Phòng pha màu       |
| Nhịp điệu vui      | Truy tìm hóa thạch  |
| Biệt đội phân loại | Dọc miền đất Việt   |
| Sudoku sắc màu     | Thành phố xanh      |
| Mật mã kho báu     | Phố đèn lồng        |

## Giới hạn cần giữ rõ

- Đây là sản phẩm phía trình duyệt; không có đồng bộ tài khoản hoặc quản lý học sinh trên máy chủ.
- Điểm/lượt chơi dùng phản hồi học tập; không phải đánh giá năng lực được chuẩn hoá.
- Văn hoá Việt dùng làm ngữ cảnh trò chơi và bài học, tránh đồng nhất một hình minh hoạ với toàn bộ truyền thống địa phương.
- Các cảnh 3D giáo dục là mô hình trực quan đơn giản; không thay thế mô phỏng khoa học có đơn vị, dữ liệu đo và độ chính xác đã kiểm định.

## Đối chiếu bản triển khai

Đã đọc cả hai bộ máy `Games2D.jsx` và `Games3D.jsx` để điều chỉnh danh mục theo trò thực tế. Nông trại ghép cây với điều kiện sống; xây cầu ghép chiều dài; khối hình đếm vật thể; bếp bánh tô miếng theo phân số; khảo cổ tìm cặp hình; đèn lồng tiếp tục quy luật màu. Đua thuyền ôn phép cộng, không kiểm tra kiến thức lễ hội. Nhịp điệu dùng bốn nốt tổng hợp và tín hiệu sáng, không chứa nhạc dân gian. Pha màu dùng mô hình RYB giản lược, không phải thí nghiệm hoá học. Ô ăn quan nêu rõ luật lớp học rút gọn. Sa bàn hành tinh không đúng tỉ lệ, sa bàn vùng miền không phải bản đồ địa lý. Đã bỏ nhãn “Được yêu thích” vì chưa có dữ liệu sử dụng.
