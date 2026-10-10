# Kiểm tra bàn giao — 10/10/2026

## Kết quả thực tế

- `npm run build`: thành công sau thay đổi cuối cùng.
- `PW_CHANNEL=chrome npm test`: **30/30 PASS**, 2,3 phút, gồm toàn bộ đường hoàn thành 20 game và các luồng ứng dụng.
- Sau đó bổ sung sửa âm thanh tắt ngay cả các nốt đang chờ trong giai điệu: `PW_CHANNEL=chrome npx playwright test tests/audio.spec.js --workers=1`: **1/1 PASS**, 6,5 giây. Tổng bộ hiện tại có 31 bài kiểm thử; build lại thành công.
- `npm audit --omit=dev`: 0 lỗ hổng được báo cáo.
- Quét gói nguồn được đưa vào Git: 0 vấn đề, 0 cảnh báo. Không đưa node_modules, dist hay dữ liệu thử nghiệm vào repo.
- Bản build mở dưới `/hat-mam/`: đủ 20 thẻ; vào nông trại, chọn hạt và trồng cây, quay về thư viện; không có lỗi trang hoặc HTTP >=400 được ghi nhận.

## Phạm vi đã chạy

| Nhóm         | Kiểm tra                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| 10 game 2D   | Chơi thật đến màn hoàn thành, kiểm tra kết quả, phản hồi và chơi lại                                            |
| 10 game 3D   | Chơi thật đến hoàn thành, có canvas WebGL, chơi lại và xoá trạng thái kết quả                                   |
| Nông trại 3D | Chọn qua raycast, kéo không kích hoạt nhầm, xoay/thu phóng, khôi phục góc nhìn, thao tác trên khung 390px       |
| Thư viện     | Tìm không dấu, lọc 2D/3D, môn học, khối lớp; lưu và đọc lại sau reload; trạng thái không có kết quả             |
| Tiết học     | Tạo, lưu, đọc lại, bắt đầu và đi qua danh sách trò chơi                                                         |
| Bàn phím     | Menu mobile giữ focus, Escape đóng; đồng hồ không làm mất focus; dialog có tên và hoàn trả focus                |
| Lưu cục bộ   | Dữ liệu cũ sai cấu trúc không làm hỏng trang; lỗi lưu có thông báo                                              |
| Âm thanh     | Tắt giai điệu đang chạy ngăn các nốt đang chờ; bật lại có tiếng                                                 |
| Màn hình nhỏ | Thư viện/soạn bài ở 390×844; tất cả 10 game 2D ở 390×844 và 844×390, không tràn ngang; điều khiển tiếp cận được |
| Lỗi thực thi | Ghi nhận pageerror trong các bộ game và luồng ứng dụng                                                          |

Ảnh chụp trong `screenshots/` được lấy từ website đang chạy, không phải bản thiết kế giả. Đã xem trực tiếp bố cục thư viện, nông trại 3D, ô ăn quan và mê cung điện thoại.

## Giới hạn xác minh

Trình duyệt kiểm tra là Chrome trên macOS với khung nhìn mô phỏng mobile và WebGL phần mềm trong automation. Chưa kiểm tra thiết bị Android/iOS thật, Safari, máy chiếu thực hay phiên chơi nhiều giờ. Nội dung và khối lớp là gợi ý hoạt động lớp học, chưa có thẩm định chương trình giáo dục. Không tuyên bố đã đánh giá dashboard đối chiếu phía sau đăng nhập.
