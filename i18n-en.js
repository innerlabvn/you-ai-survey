'use strict';
/* English presentation layer for the Innerlab survey.
   Values submitted to Google Sheets remain in their original Vietnamese form. */
(() => {
  const translations = new Map(Object.entries({
    "Khám phá · Hiểu mình · Phát triển": "Discover · Understand · Grow",
    "Bạn muốn": "What would you like to",
    "phát triển điều gì": "develop",
    "trong thời đại AI?": "in the age of AI?",
    "Khám phá nhu cầu, kỹ năng và hành trình phát triển bản thân của bạn.": "Explore your goals, skills, and personal growth journey.",
    "Hiểu mình": "Understand yourself",
    "sâu hơn": "more deeply",
    "Phát triển": "Build",
    "kỹ năng thiết thực": "practical skills",
    "Thiết kế hành trình": "Create your own",
    "phát triển riêng": "growth journey",
    "Bắt đầu khám phá": "Start exploring",
    "BƯỚC 1 / 4": "STEP 1 / 4",
    "25% hoàn thành": "25% complete",
    "← Quay lại": "← Back",
    "Tiếp tục →": "Continue →",
    "Hoàn thành khảo sát 🎁": "Finish survey 🎁",
    "🔒 Khảo sát phục vụ tổng hợp nhu cầu phát triển bản thân. Đăng ký nhận quà và để lại thông tin liên hệ hoàn toàn tự nguyện.": "🔒 This survey helps us understand personal development needs. Claiming a gift and sharing your contact information are completely optional.",

    "Một chút về bạn": "A little about you",
    "Chúng mình muốn hiểu bạn đang ở giai đoạn nào.": "We'd love to understand where you are in life.",
    "Bạn thuộc nhóm tuổi nào?": "What is your age group?",
    "Dưới 18": "Under 18",
    "Trên 45": "Over 45",
    "Hiện tại bạn đang làm gì?": "What best describes your current situation?",
    "Học sinh / Sinh viên": "Student",
    "Đang đi làm": "Employed",
    "Tự kinh doanh / Freelancer": "Self-employed / Freelancer",
    "Đang tìm việc": "Looking for work",
    "Khác": "Other",
    "Bạn đang ưu tiên điều gì trong cuộc sống?": "What are your current priorities in life?",
    "Hiểu rõ bản thân": "Understanding myself better",
    "Phát triển nghề nghiệp": "Career development",
    "Cải thiện các mối quan hệ": "Improving relationships",
    "Học kỹ năng mới": "Learning new skills",
    "Cân bằng cuộc sống": "Work–life balance",
    "Chưa xác định rõ": "Still figuring it out",
    "Bạn và trí tuệ nhân tạo": "You and artificial intelligence",
    "AI đang hiện diện thế nào trong đời sống của bạn?": "How is AI showing up in your daily life?",
    "Bạn sử dụng công cụ AI với tần suất nào?": "How often do you use AI tools?",
    "Mỗi ngày": "Every day",
    "Vài lần mỗi tuần": "A few times a week",
    "Thỉnh thoảng": "Occasionally",
    "Đã thử nhưng ít dùng": "I've tried them but rarely use them",
    "Chưa từng sử dụng": "Never",
    "Bạn dùng hoặc muốn dùng AI cho việc gì?": "What do you use, or want to use, AI for?",
    "Học tập / Nghiên cứu": "Learning / Research",
    "Công việc / Tăng năng suất": "Work / Productivity",
    "Sáng tạo nội dung": "Content creation",
    "Định hướng bản thân / Sự nghiệp": "Personal / Career direction",
    "Giải trí / Khám phá": "Entertainment / Exploration",
    "Chưa biết bắt đầu từ đâu": "Not sure where to start",
    "Bạn cảm thấy thế nào trước sự phát triển nhanh của AI?": "How do you feel about AI developing so quickly?",
    "Hào hứng và tò mò": "Excited and curious",
    "Lạc quan nhưng cần học thêm": "Optimistic, but I need to learn more",
    "Vừa hào hứng vừa lo lắng": "Both excited and concerned",
    "Áp lực vì sợ bị tụt lại": "Worried about falling behind",
    "Chưa quan tâm nhiều": "Not very interested yet",
    "Nhu cầu phát triển bản thân": "Your personal growth needs",
    "Điều gì quan trọng nhất với bạn lúc này?": "What matters most to you right now?",
    "Bạn muốn phát triển những kỹ năng nào?": "Which skills would you like to develop?",
    "Tự nhận thức và quản lý cảm xúc": "Self-awareness and emotional regulation",
    "Giao tiếp / Thuyết trình": "Communication / Public speaking",
    "Tư duy phản biện và sáng tạo": "Critical and creative thinking",
    "Ứng dụng AI hiệu quả": "Using AI effectively",
    "Quản lý thời gian / Kỷ luật cá nhân": "Time management / Self-discipline",
    "Định hướng nghề nghiệp": "Career direction",
    "Học tập hiệu quả": "Effective learning",
    "Xây dựng sự tự tin": "Building confidence",
    "Điều gì đang cản trở việc phát triển của bạn?": "What is holding back your development?",
    "Thiếu thời gian": "Not enough time",
    "Thiếu động lực / Kỷ luật": "Lack of motivation / Discipline",
    "Không biết bắt đầu từ đâu": "Not knowing where to start",
    "Chi phí học tập": "Cost of learning",
    "Thiếu người đồng hành": "Lack of support",
    "Sợ thất bại / Thiếu tự tin": "Fear of failure / Low confidence",
    "Chưa nhận thấy trở ngại rõ ràng": "No clear obstacle at the moment",
    "Nếu cải thiện được một điều trong 6 tháng tới, bạn muốn đó là gì?": "If you could improve one thing in the next six months, what would it be?",
    "Chia sẻ suy nghĩ của bạn (không bắt buộc)...": "Share your thoughts (optional)...",
    "Trải nghiệm bạn mong đợi": "The experience you're looking for",
    "Giúp chúng mình thiết kế hoạt động phù hợp hơn.": "Help us design activities that work for you.",
    "Chủ đề nào khiến bạn muốn tham gia nhất?": "Which topics would most inspire you to join?",
    "Hiểu bản thân trong thời đại AI": "Understanding yourself in the age of AI",
    "Kỹ năng ứng dụng AI thực tế": "Practical AI skills",
    "Khám phá thế mạnh và định hướng tương lai": "Discovering strengths and future direction",
    "Phát triển giọng nói và giao tiếp": "Voice and communication development",
    "Quản lý cảm xúc và sự tự tin": "Emotional regulation and confidence",
    "Tư duy sáng tạo / Giải quyết vấn đề": "Creative thinking / Problem solving",
    "Hình thức nào phù hợp nhất với bạn?": "Which learning format suits you best?",
    "Workshop trải nghiệm trực tiếp": "In-person workshop",
    "Lớp thực hành nhóm nhỏ": "Small-group practical class",
    "Buổi chia sẻ / Talkshow": "Sharing session / Talkshow",
    "Online tương tác": "Interactive online session",
    "Coaching 1:1": "1:1 coaching",
    "Bạn muốn Innerlab đồng hành cùng bạn theo cách nào?": "How would you like Innerlab to support you?",
    "Đăng ký khóa học phát triển bản thân": "Enroll in a personal development course",
    "Nhận tư vấn chọn khóa học phù hợp": "Get help choosing a suitable course",
    "Tìm hiểu voucher ưu đãi khóa học": "Explore course voucher offers",
    "Khác (vui lòng ghi rõ lý do)": "Other (please explain)",
    "Bạn muốn chia sẻ lý do hoặc nhu cầu khác?": "Would you like to share another reason or need?",
    "Viết lý do hoặc nhu cầu của bạn...": "Tell us what you are looking for...",
    "Bạn thường thuận tiện tham gia khi nào?": "When are you usually available?",
    "Tối các ngày trong tuần": "Weekday evenings",
    "Cuối tuần buổi sáng": "Weekend mornings",
    "Cuối tuần buổi chiều": "Weekend afternoons",
    "Cuối tuần buổi tối": "Weekend evenings",
    "Linh hoạt theo lịch": "Flexible schedule",
    "Có thể chọn nhiều đáp án": "Select all that apply",
    "Hành trình bắt đầu từ bạn": "Your journey starts with you",
    "Cùng AI mở rộng khả năng": "Expand your potential with AI",
    "Học hỏi và lớn lên mỗi ngày": "Learn and grow every day",
    "Mở ra một chương mới": "Turn to a new chapter",
    "Minh họa hành trình phát triển": "Illustration of a personal growth journey",
    "Vui lòng hoàn thành những câu có dấu * trước khi tiếp tục.": "Please answer all required (*) questions before continuing.",
    "Vui lòng điền lý do hoặc nhu cầu khác.": "Please explain your other reason or need.",

    "Hoàn thành rồi! 🎉": "You did it! 🎉",
    "Chọn một trong ba hộp quà để khám phá món quà Innerlab dành tặng bạn.": "Choose one of the three gift boxes to reveal your surprise from Innerlab.",
    "HỘP 01": "BOX 01",
    "HỘP 02": "BOX 02",
    "HỘP 03": "BOX 03",
    "Điều bất ngờ dành cho bạn!": "A surprise just for you!",
    "Innerlab gửi tặng bạn trọn bộ hai món quà:": "Innerlab has two gifts for you:",
    "VOUCHER KHÓA HỌC": "COURSE VOUCHER",
    "Giá trị 199.000đ · Áp dụng theo điều kiện chương trình": "Value: 199,000 VND · Subject to program terms",
    "+ 01 buổi tham vấn miễn phí": "+ 01 free consultation session",
    "Khám phá chủ đề bạn quan tâm:": "Explore a topic you care about:",
    "Tarot · Thần số học · Chiêm tinh học · Tử vi · Khám phá tính cách": "Tarot · Numerology · Astrology · Vietnamese astrology · Personality discovery",
    "MÃ NHẬN QUÀ CỦA BẠN · 5 CHỮ SỐ": "YOUR 5-DIGIT GIFT CODE",
    "Hãy lưu lại mã để đối chiếu. Mã chỉ được xác nhận khi đăng ký của bạn được Innerlab ghi nhận.": "Save this code for reference. It becomes valid only after Innerlab confirms your registration.",
    "📋 Sao chép mã": "📋 Copy code",
    "✓ Đã sao chép": "✓ Copied",
    "Chọn và sao chép mã phía trên": "Select and copy the code above",
    "Voucher không phải tiền mặt. Điều kiện sử dụng và lịch gặp gỡ sẽ được xác nhận khi đăng ký.": "The voucher cannot be exchanged for cash. Terms and session schedule will be confirmed after registration.",
    "Nhận quà ngay →": "Claim your gift →",
    "Đăng ký nhận quà 🎁": "Register to claim your gift 🎁",
    "Chọn chủ đề bạn muốn khám phá và để lại số điện thoại / Zalo để chúng mình liên hệ trao quà.": "Choose a topic and leave your phone / Zalo number so we can arrange your gift.",
    "Mã nhận quà:": "Gift code:",
    "Họ và tên": "Full name",
    "Tên của bạn": "Your name",
    "Số điện thoại / Zalo": "Phone number / Zalo",
    "Ví dụ: 0912 345 678": "e.g. 0912 345 678",
    "Ưu tiên số điện thoại có Zalo để Innerlab thuận tiện gửi thông tin nhận quà.": "A phone number with Zalo is preferred for arranging your gift.",
    "Bạn muốn khám phá chủ đề nào trong buổi gặp 1:1?": "Which topic would you like to explore in your 1:1 session?",
    "Thần số học": "Numerology",
    "Chiêm tinh học": "Astrology",
    "Tử vi": "Vietnamese astrology",
    "Khám phá tính cách": "Personality discovery",
    "Khóa học bạn quan tâm": "Course area you're interested in",
    "Chọn lĩnh vực học": "Choose an area of study",
    "Hiểu và khám phá bản thân": "Self-understanding and discovery",
    "Giao tiếp và sự tự tin": "Communication and confidence",
    "Định hướng tương lai": "Future direction",
    "Ứng dụng AI": "Practical AI",
    "Khác / Chưa xác định": "Other / Not sure yet",
    "Tôi đồng ý để Innerlab liên hệ qua số điện thoại / Zalo tôi cung cấp nhằm gửi voucher, sắp xếp buổi gặp 1:1 và giới thiệu các khóa học liên quan. Tôi có thể từ chối các liên hệ quảng bá sau đó.": "I agree that Innerlab may contact me via the phone / Zalo number I provide to send the voucher, arrange a 1:1 session, and share relevant course information. I can opt out of promotional messages later.",
    "Đăng ký nhận quà ✦": "Register for my gift ✦",
    "Không nhận quà, chỉ hoàn tất khảo sát": "Skip the gift and finish the survey",
    "Cảm ơn bạn đã chia sẻ!": "Thank you for sharing!",
    "Khảo sát đã được ghi nhận. Innerlab sẽ liên hệ bạn trong thời gian sớm nhất.": "Your request has been submitted. Innerlab will contact you soon.",
    "MÃ NHẬN QUÀ": "GIFT CODE",
    "Hãy lưu mã này để đối chiếu. Chỉ có hiệu lực khi Innerlab xác nhận.": "Keep this code for reference. It is valid only after Innerlab confirms it.",
    "Làm khảo sát mới": "Start a new survey",
    "Vui lòng nhập họ tên, số điện thoại / Zalo, chọn lĩnh vực và đồng ý nhận liên hệ để đăng ký quà.": "Please enter your name, phone / Zalo number, choose a topic, and agree to be contacted to claim your gift.",
    "Vui lòng nhập số di động Việt Nam hợp lệ (ví dụ 0912 345 678 hoặc +84 912 345 678).": "Please enter a valid Vietnamese mobile number (e.g. 0912 345 678 or +84 912 345 678).",
    "Đang gửi đăng ký...": "Submitting your registration...",
    "Không thể gửi. Vui lòng thử lại.": "Could not submit. Please try again.",
    "Chưa cấu hình Google Sheets. Người quản trị cần thêm đường dẫn Apps Script để lưu đăng ký.": "The Google Sheets receiver has not been configured. Please contact the organizer.",
    "Bật hiệu ứng âm thanh": "Enable sound effects",
    "Tắt hiệu ứng âm thanh": "Disable sound effects",
    "♫ Âm thanh: Bật": "♫ Sound: On",
    "♪ Bật âm thanh": "♪ Enable sound",
    "Truy cập trang khóa học Innerlab": "Explore Innerlab courses",
    "Đến Innerlabvn Courses": "Explore Innerlabvn Courses",
    "Mở hộp quà xanh ngọc": "Open the mint gift box",
    "Mở hộp quà tím": "Open the lavender gift box",
    "Mở hộp quà vàng": "Open the golden gift box",
    "Chọn ngôn ngữ": "Choose language"
  }));
  function english(text) {
    if (!text) return text;
    const raw = String(text), trim = raw.trim();
    if (!trim) return raw;
    let translated = translations.get(trim);
    if (!translated) {
      translated = trim.replace(/^◉ KHÁM PHÁ · /, '◉ EXPLORE · ')
                       .replace(/^KHÁM PHÁ · /, 'EXPLORE · ')
                       .replace(/^BƯỚC (\d+) \/ (\d+) · (\d+)%$/, 'STEP $1 / $2 · $3%');
      if (translated === trim) return raw;
    }
    return raw.replace(trim, translated);
  }
  function translate(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      const updated = english(root.nodeValue);
      if (updated !== root.nodeValue) root.nodeValue = updated;
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE) {
      // A select option without a value would otherwise lose its Vietnamese data key.
      if (root.matches('option') && !root.hasAttribute('value'))
        root.setAttribute('value', root.textContent.trim());
      for (const attr of ['placeholder', 'aria-label', 'title']) {
        const value = root.getAttribute(attr);
        if (value) {
          const updated = english(value);
          if (updated !== value) root.setAttribute(attr, updated);
        }
      }
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    const elements = [];
    let node;
    while ((node = walker.nextNode())) elements.push(node);
    for (const item of elements) {
      if (item.nodeType === Node.ELEMENT_NODE) {
        if (item.matches('option') && !item.hasAttribute('value')) item.setAttribute('value',item.textContent.trim());
        for (const attr of ['placeholder','aria-label','title']) {
          const val = item.getAttribute(attr);
          if (val) {
            const en = english(val);
            if (en !== val) item.setAttribute(attr,en);
          }
        }
      } else if (item.nodeType === Node.TEXT_NODE) {
        const en = english(item.nodeValue);
        if (en !== item.nodeValue) item.nodeValue = en;
      }
    }
  }
  // Translate immediately and each subsequently rendered survey step / gift state.
  document.documentElement.lang='en';
  translate(document.body);
  const watcher = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') translate(record.target);
      for (const node of record.addedNodes) translate(node);
    }
  });
  watcher.observe(document.body,{childList:true,subtree:true,characterData:true});
})();