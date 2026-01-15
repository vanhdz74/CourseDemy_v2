// Các thông báo phản hồi ngẫu nhiên để tránh lặp lại

// Helper function để chọn ngẫu nhiên một item từ mảng
function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Thông báo lỗi khi không tìm thấy khóa học
export function getNoCoursesFoundMessage(keyword: string): string {
  const messages = [
    `Xin lỗi, tôi không tìm thấy khóa học nào liên quan đến "${keyword}". Bạn có thể thử với từ khóa khác không? 🔍`,
    `Hmm, không có khóa học "${keyword}" trong hệ thống. Thử tìm kiếm với từ khóa khác nhé! 📚`,
    `Rất tiếc, tôi chưa tìm thấy khóa học về "${keyword}". Bạn muốn tìm chủ đề nào khác? 🤔`,
    `Chưa có kết quả cho "${keyword}" rồi. Để tôi giúp bạn tìm khóa học khác nhé! ✨`,
    `Tôi đã tìm nhưng không thấy khóa học "${keyword}". Hãy thử từ khóa tương tự xem sao! 🎯`,
  ];
  return getRandomItem(messages);
}

// Thông báo lỗi khi không tìm thấy khóa học theo giảng viên
export function getNoTeacherCoursesMessage(teacherName: string): string {
  const messages = [
    `Xin lỗi, tôi không tìm thấy khóa học nào của giảng viên "${teacherName}". Bạn có thể thử với tên khác không? 👨‍🏫`,
    `Hmm, chưa có khóa học nào của "${teacherName}" trong hệ thống. Thử kiểm tra lại tên giảng viên nhé! 🔍`,
    `Rất tiếc, không tìm thấy giảng viên "${teacherName}". Bạn muốn tìm giảng viên khác không? 🤔`,
    `Chưa có kết quả cho giảng viên "${teacherName}". Có thể họ chưa có khóa học trên hệ thống! 📚`,
    `Tôi không thấy khóa học của "${teacherName}". Hãy thử nhập đúng tên đầy đủ nhé! 👀`,
  ];
  return getRandomItem(messages);
}

// Thông báo lỗi khi không lấy được thời tiết
export function getWeatherErrorMessage(cityName?: string): string {
  if (cityName) {
    const messages = [
      `Xin lỗi, tôi không thể tìm thấy thông tin thời tiết cho "${cityName}". Vui lòng kiểm tra lại tên thành phố! 🌍`,
      `Hmm, không có dữ liệu thời tiết cho "${cityName}". Thử với thành phố khác nhé! ⛅`,
      `Rất tiếc, không tìm được thời tiết "${cityName}". Bạn có thể thử lại với tên tiếng Anh? 🌤️`,
      `Chưa có thông tin cho "${cityName}". Đảm bảo viết đúng tên thành phố nhé! 🔍`,
    ];
    return getRandomItem(messages);
  }
  
  const messages = [
    "Xin lỗi, tôi không thể lấy thông tin thời tiết. Hãy cho tôi biết tên thành phố bạn muốn xem! 🌍",
    "Tôi cần biết thành phố để xem thời tiết. Ví dụ: 'Thời tiết Hà Nội' hoặc 'Weather in Tokyo' ⛅",
    "Bạn muốn xem thời tiết ở đâu? Hãy nói tên thành phố nhé! Ví dụ: 'Thời tiết TP.HCM' 🌤️",
  ];
  return getRandomItem(messages);
}

// Thông báo lỗi khi không lấy được thống kê
export function getStatisticsErrorMessage(): string {
  const messages = [
    "Xin lỗi, tôi không thể lấy thống kê website lúc này. Vui lòng thử lại sau! 📊",
    "Hmm, có lỗi khi tải thống kê. Bạn thử hỏi lại sau vài giây nhé! 🔄",
    "Rất tiếc, hệ thống đang bận. Thử lại để xem thống kê nhé! ⏳",
    "Chưa lấy được dữ liệu thống kê. Hãy thử lại sau một chút! 📈",
  ];
  return getRandomItem(messages);
}

// Thông báo lỗi khi không tạo được lộ trình
export function getRoadmapErrorMessage(skill: string): string {
  const messages = [
    `Xin lỗi, tôi không thể tạo lộ trình cho "${skill}" lúc này. Vui lòng thử lại sau! 🗺️`,
    `Hmm, có vấn đề khi tạo roadmap "${skill}". Thử lại sau vài giây nhé! 🔄`,
    `Rất tiếc, chưa tạo được lộ trình "${skill}". Hãy thử lại sau! 📍`,
    `Tạm thời chưa tạo được lộ trình cho "${skill}". Thử lại sau một chút nhé! ⏳`,
  ];
  return getRandomItem(messages);
}

// Thông báo lỗi chung khi xử lý câu hỏi
export function getGeneralErrorMessage(): string {
  const messages = [
    "Xin lỗi, tôi gặp lỗi khi xử lý câu hỏi của bạn. Vui lòng thử lại sau! 🙏",
    "Ops! Có lỗi xảy ra rồi. Bạn thử hỏi lại nhé! 🔄",
    "Hmm, tôi gặp trục trặc nhỏ. Hãy thử lại câu hỏi của bạn! ⚡",
    "Rất tiếc, có lỗi không mong muốn. Vui lòng thử lại sau vài giây! 🙏",
    "Tôi gặp chút vấn đề. Bạn thử hỏi lại xem sao nhé! 💫",
  ];
  return getRandomItem(messages);
}

// Thông báo khi hệ thống quá tải
export function getOverloadedMessage(): string {
  const messages = [
    "Xin lỗi, hệ thống đang quá tải. Vui lòng thử lại sau! 🙏",
    "Hệ thống đang bận. Bạn chờ một chút rồi thử lại nhé! ⏳",
    "Quá nhiều người đang sử dụng. Thử lại sau vài giây! 🔄",
    "Tạm thời quá tải rồi. Hãy thử lại sau một chút nhé! 💫",
  ];
  return getRandomItem(messages);
}

// Thông báo gợi ý khi hỏi lộ trình không rõ ràng
export function getRoadmapHelpMessage(): string {
  const examples = [
    ["Lộ trình học Frontend Developer", "Roadmap Python từ zero", "Bắt đầu học React như thế nào"],
    ["Lộ trình học Backend với Java", "Roadmap Data Science", "Muốn trở thành Mobile Developer"],
    ["Lộ trình Full Stack Developer", "Roadmap Machine Learning", "Bắt đầu học DevOps thế nào"],
    ["Lộ trình học UI/UX Design", "Roadmap Blockchain", "Muốn học Cyber Security"],
  ];
  
  const selectedExamples = getRandomItem(examples);
  
  const intros = [
    "Bạn muốn xem lộ trình học cho kỹ năng gì? 🤔",
    "Hãy cho tôi biết bạn muốn học gì nhé! 📚",
    "Bạn quan tâm đến lĩnh vực nào? 🎯",
    "Tôi có thể tạo lộ trình cho nhiều kỹ năng! 🗺️",
  ];
  
  return `${getRandomItem(intros)}\n\nVí dụ:\n• "${selectedExamples[0]}"\n• "${selectedExamples[1]}"\n• "${selectedExamples[2]}"`;
}
