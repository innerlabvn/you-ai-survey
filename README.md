# innerlab.survey

Website khảo sát **Nhu cầu phát triển bản thân trong thời đại AI** — thiết kế tương thích điện thoại và máy tính.

## Website

- 4 phần khảo sát, có thanh tiến trình và kiểm tra câu hỏi bắt buộc.
- Sau khảo sát: chọn 1 trong 3 hộp quà → hộp bung nắp → voucher 199K và 01 buổi tư vấn 1:1 miễn phí hiện cùng lúc → đăng ký nhận quà.
- Các hộp đều có cùng gói quà; không quay số hoặc phân phối phần thưởng ngẫu nhiên.
- Form nhận quà cho chọn Tarot, Thần số học, Chiêm tinh học hoặc Tử vi và khóa học quan tâm.
- Người dùng có thể bỏ qua nhận quà để chỉ hoàn thành khảo sát.
- Thông tin liên hệ là tùy chọn. Chỉ lưu thông tin liên hệ nếu người tham gia chọn nhận thông tin.
- Dùng HTML, CSS và JavaScript thuần; không cần cài đặt thư viện.
- **Chưa thu thập được câu trả lời cho đến khi chủ website kết nối Google Sheets.** Website sẽ báo lỗi cấu hình thay vì giả vờ đã gửi thành công.


## Thiết kế mới (cosmic responsive)

- Toàn bộ website sử dụng phong cách thiên hà tím xanh theo mẫu Innerlab: minh họa người trẻ dưới ánh trăng, cổng ánh sáng, ngôi sao và thẻ khảo sát kính mờ.
- Câu hỏi, lựa chọn và các nút đều là **HTML tương tác thực** (không phải văn bản in sẵn trên ảnh).
- Hình ảnh vector trong `assets/cosmic-hero.svg` và `assets/learning-spark.svg` co giãn sắc nét trên màn hình độ phân giải cao.
- CSS có bố cục linh hoạt cho desktop/tablet/mobile ở các mốc 900px, 700px, 420px; không dùng cố định chiều rộng theo một thiết bị duy nhất.
- 3 hộp quà có hiệu ứng mở hộp và hình voucher hiển thị sau khi chọn; không phải hình chụp tĩnh.
- **Hiển thị không giống hệt từng pixel giữa điện thoại và máy tính**: nội dung tự sắp xếp lại để giữ chữ dễ đọc, nút dễ chạm và tỷ lệ ảnh không bị méo.
- Vào công cụ Developer Tools (Ctrl+Shift+M) trên Chrome để thử kích thước 360, 390, 768, 1024 và 1440 px. Kiểm tra cả Safari iOS và Chrome Android trước khi quảng bá rộng rãi.

## Xuất bản qua GitHub Pages

1. Nếu muốn địa chỉ **https://innerlabvn.github.io/innerlab.survey/**, vào repository **Settings → General → Repository name**, đổi `you-ai-survey` thành `innerlab.survey`.
2. Vào **Settings → Pages → Build and deployment**.
3. Chọn **Source: Deploy from a branch**, **Branch: main**, **Folder: /(root)**, sau đó **Save**.
4. Đợi GitHub Pages xuất bản. Nếu chưa đổi repository thì địa chỉ là **https://innerlabvn.github.io/you-ai-survey/**.
5. Kiểm tra website trên cả điện thoại và máy tính.

## Kết nối Google Sheets

1. Tạo Google Sheet, mở **Extensions → Apps Script**.
2. Dán toàn bộ `Code.gs` vào editor, lưu.
3. Chọn **Deploy → New deployment → Web app**.
4. **Execute as: Me**, **Who has access: Anyone** (nếu được phép), **Deploy**.
5. Copy Web app URL kết thúc bằng `/exec`.
6. Trong repository, mở `index.html`, nhấn Edit (biểu tượng bút chì). Thay:
   ```js
   const GOOGLE_SCRIPT_URL = '';
   ```
   bằng
   ```js
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/MA_DEPLOYMENT/exec';
   ```
   rồi commit thay đổi.
7. Gửi một câu trả lời thử, kiểm tra tab **Responses** trong Google Sheet trước khi chia sẻ đường dẫn rộng rãi.

**Giới hạn kỹ thuật:** Trình duyệt gửi dữ liệu với `mode: 'no-cors'`, vì vậy thông báo cảm ơn chỉ xác nhận rằng trình duyệt đã gửi yêu cầu, **không xác minh được Google Sheet đã ghi thành công**. Cần kiểm tra trực tiếp Google Sheet. Endpoint công khai có nguy cơ spam.

## Quyền riêng tư và vận hành

- Đừng đưa link chỉnh sửa Google Sheet, khóa API hoặc dữ liệu người tham gia vào repository công khai.
- Thêm danh tính đơn vị tổ chức, phương thức liên hệ để yêu cầu xóa dữ liệu, thời hạn lưu dữ liệu trước khi thu thập thông tin cá nhân thực tế.
- Xem xét giới hạn số lượt gửi hoặc dùng backend có chống spam nếu cần triển khai công khai quy mô lớn.
