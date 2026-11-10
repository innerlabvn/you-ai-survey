# Innerlab Courses — Website giới thiệu và đăng ký quan tâm khóa học

Đây là trang web tĩnh responsive của Innerlab, xây dựng để chạy bằng **GitHub Pages**. Phần mã nguồn hiện được lưu thử tại \`course/\` trong repository \`innerlabvn/you-ai-survey\` để xem trước.

## Đường dẫn chính thức mong muốn

\`https://innerlabvn.github.io/course/\`

GitHub Pages sẽ cung cấp đường dẫn này khi chủ tài khoản **innerlabvn** tạo một repository PUBLIC tên chính xác \`course\` và đưa toàn bộ nội dung của thư mục này vào gốc repository mới (bao gồm \`index.html\`, \`styles.css\`, \`app.js\`, \`assets/\`).

1. Tạo repository ở https://github.com/new?name=course với Owner **innerlabvn**, repository **course**, Public, Add README tùy chọn.
2. Đưa nội dung của thư mục \`course/\` vào **root** repo mới. Không đặt nguyên thư mục \`course\` vào repo mới, vì như vậy sẽ thành \`/course/course/\`.
3. Vào Settings > Pages > Build and deployment > **Deploy from a branch** > branch \`main\` và folder \`/(root)\`, sau đó Save.
4. URL cần kiểm tra: https://innerlabvn.github.io/course/ .

Trong thời gian chờ repo riêng, bản xem thử (khi triển khai thành công) ở:
\`https://innerlabvn.github.io/you-ai-survey/course/\`.

## Tính năng

- Header có logo Innerlab và liên kết sang khảo sát đã hoạt động.
- 6 **chủ đề/chương trình minh họa** có thể lọc theo nhóm, tìm theo từ khóa, xem nội dung chi tiết.
- Responsive cho điện thoại, máy tính bảng, desktop; hỗ trợ bàn phím và reduce motion.
- Mẫu đăng ký quan tâm: tên, số điện thoại/Zalo, chương trình, mong đợi, đồng ý liên hệ.
- Khi **chưa kết nối** Google Sheets, form chỉ **sao chép** thông tin đăng ký vào clipboard để người dùng tự lưu; **không** lưu lead và **không** báo đã gửi thành công.
- Chưa có học phí, lịch học, tên giảng viên, thanh toán trực tuyến. Không nên thông báo mở bán trước khi có thông tin chính thức.

## Kết nối nhận thông tin đăng ký với Google Sheets

Để kích hoạt thu lead tự động:
1. Tạo một **Google Sheet riêng** cho Innerlab Courses, quyền chia sẻ riêng tư.
2. Trong Sheet: Extensions > Apps Script; dán mã từ \`Code.gs\` vào.
3. Thay \`COURSE_SPREADSHEET_ID\` bằng ID của bảng Sheet mới (không phải mã Web App).
4. Chạy \`testConnection\` và cấp quyền nếu Google yêu cầu.
5. Deploy > New deployment > Web app (Execute as: Me; Access: Anyone) và lấy URL \`/exec\`.
6. Đặt URL đó trong \`const COURSE_API_URL = '...';\` ở \`app.js\`, lưu GitHub.
7. Gửi một đơn quan tâm thử và kiểm tra hàng mới trong tab \`CourseLeads\` trước khi công bố.

**Quan trọng:** Gửi theo chế độ \`no-cors\` không cho phép website xác thực kết quả từ Google Sheets. Cần kiểm tra trực tiếp. Apps Script công khai có rủi ro spam; dùng giải pháp có xác minh máy chủ nếu bắt đầu kinh doanh quy mô lớn.

## Quản trị danh mục

Mở \`app.js\`, tìm biến \`COURSES\` ở đầu file để đổi:
- \`title\`: tên chương trình
- \`category\`: \`self\`, \`skill\`, \`ai\`
- \`short\`: mô tả thẻ
- \`topics\`: nội dung dự kiến, sẽ hiển thị trong modal
- \`audience\`: đối tượng quan tâm

Chỉ công bố giá, giảng viên, thời lượng và lịch học khi được xác nhận.
