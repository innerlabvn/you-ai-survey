# innerlab.survey

Website khảo sát **Nhu cầu phát triển bản thân trong thời đại AI** — thiết kế tương thích điện thoại và máy tính.

## Website

- 5 bước, có thanh tiến trình và kiểm tra câu hỏi bắt buộc.
- Thông tin liên hệ là tùy chọn. Chỉ lưu thông tin liên hệ nếu người tham gia chọn nhận thông tin.
- Dùng HTML, CSS và JavaScript thuần; không cần cài đặt thư viện.
- **Chưa thu thập được câu trả lời cho đến khi chủ website kết nối Google Sheets.** Website sẽ báo lỗi cấu hình thay vì giả vờ đã gửi thành công.

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
