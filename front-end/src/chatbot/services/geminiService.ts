import { GoogleGenerativeAI } from "@google/generative-ai";
import { getOverloadedMessage, getGeneralErrorMessage } from "./randomMessages";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

// Danh sách model theo thứ tự ưu tiên (fallback khi model chính bị quá tải)
const MODEL_LIST = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

// Xác định loại câu hỏi để điều chỉnh cấu hình phù hợp
type QueryType = "tutorial" | "knowledge" | "recommendation" | "creative" | "general";

function detectQueryType(query: string): QueryType {
  const lowerQuery = query.toLowerCase();
  
  // Câu hỏi đề xuất/gợi ý - cần phân tích và đưa ra lời khuyên
  const recommendationPatterns = [
    /nên\s+(?:học|dùng|chọn|sử dụng)/,
    /(?:học|dùng)\s+(?:gì|cái gì|ngôn ngữ nào|framework nào|công nghệ nào)/,
    /(?:ngôn ngữ|framework|công nghệ|tool|library)\s+(?:nào|gì)\s+(?:tốt|phù hợp|thích hợp|hay|nên)/,
    /(?:phù hợp|thích hợp)\s+(?:cho|để|với)/,
    /(?:gợi ý|đề xuất|recommend|suggest)\s+(?:cho tôi|giúp tôi)?/,
    /(?:muốn|cần)\s+(?:làm|tạo|build|xây dựng).+(?:nên|thì)\s+(?:học|dùng)/,
    /(?:để|cho)\s+(?:làm|tạo|build|xây dựng|phát triển).+(?:cần|nên|phải)\s+(?:học|dùng|biết)/,
    /(?:tốt nhất|best)\s+(?:cho|để|for)/,
    /(?:python|javascript|java|react|vue|angular).+(?:hay|hoặc|or|vs).+(?:tốt hơn|better|nên chọn)/,
    /(?:so sánh|compare).+(?:nên chọn|should choose|tốt hơn)/,
    /(?:lộ trình|roadmap|path)\s+(?:học|để)/,
    /(?:bắt đầu|start)\s+(?:từ đâu|với gì|học gì)/,
    /(?:beginner|người mới|newbie).+(?:nên|should)/,
  ];
  
  // Câu hỏi hướng dẫn/tutorial - cần chính xác cao
  const tutorialPatterns = [
    /cách\s+(?:làm|tạo|viết|sử dụng|cài|thiết lập|config)/,
    /hướng\s*dẫn/,
    /làm\s+(?:thế\s+nào|sao)/,
    /how\s+(?:to|do|can)/,
    /tutorial/,
    /bước\s+(?:để|thực hiện)/,
    /setup|cài\s*đặt|install/,
    /tạo\s+(?:project|dự án|ứng dụng|website|app)/,
    /(?:fix|sửa|giải quyết)\s+(?:lỗi|bug|error|vấn đề)/,
    /implement|triển khai/,
  ];
  
  // Câu hỏi kiến thức - cần chính xác và đầy đủ
  const knowledgePatterns = [
    /là\s+gì|what\s+is/,
    /(?:tại|vì)\s+sao|why/,
    /(?:khi\s+nào|when)/,
    /(?:ở\s+đâu|where)/,
    /(?:giải\s+thích|explain)/,
    /(?:khác\s+nhau|difference|so\s+sánh|compare)/,
    /(?:ưu|nhược)\s+điểm|advantage|disadvantage|pros?\s+(?:and|&)?\s*cons?/,
    /nghĩa\s+là|means?/,
    /định\s+nghĩa|definition/,
  ];
  
  // Câu hỏi sáng tạo - cho phép linh hoạt hơn
  const creativePatterns = [
    /ý\s+tưởng|idea/,
    /(?:viết|tạo)\s+(?:bài|nội dung|content|story)/,
    /brainstorm/,
    /creative/,
    /đặt\s+tên|name\s+for/,
  ];
  
  // Ưu tiên recommendation trước vì thường chứa các từ khóa khác
  for (const pattern of recommendationPatterns) {
    if (pattern.test(lowerQuery)) return "recommendation";
  }
  
  for (const pattern of tutorialPatterns) {
    if (pattern.test(lowerQuery)) return "tutorial";
  }
  
  for (const pattern of knowledgePatterns) {
    if (pattern.test(lowerQuery)) return "knowledge";
  }
  
  for (const pattern of creativePatterns) {
    if (pattern.test(lowerQuery)) return "creative";
  }
  
  return "general";
}

// Lấy cấu hình generation phù hợp với loại câu hỏi
function getGenerationConfig(queryType: QueryType) {
  switch (queryType) {
    case "tutorial":
      return {
        temperature: 0.1,  // Rất thấp để chính xác cao
        topP: 0.85,
        topK: 30,
        maxOutputTokens: 3000,  // Cho phép dài hơn để giải thích đầy đủ
      };
    case "knowledge":
      return {
        temperature: 0.2,
        topP: 0.85,
        topK: 35,
        maxOutputTokens: 2500,
      };
    case "recommendation":
      return {
        temperature: 0.25,  // Thấp để đề xuất chính xác, nhưng linh hoạt hơn knowledge
        topP: 0.85,
        topK: 40,
        maxOutputTokens: 3000,  // Cần dài để giải thích đề xuất
      };
    case "creative":
      return {
        temperature: 0.7,  // Cao hơn để sáng tạo
        topP: 0.9,
        topK: 50,
        maxOutputTokens: 2048,
      };
    default:
      return {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      };
  }
}

// Lấy prompt chuyên biệt theo loại câu hỏi
function getSpecializedPrompt(queryType: QueryType): string {
  switch (queryType) {
    case "tutorial":
      return `BẠN ĐANG TRẢ LỜI CÂU HỎI HƯỚNG DẪN/TUTORIAL.

YÊU CẦU BẮT BUỘC:
1. Trả lời CHÍNH XÁC và ĐẦY ĐỦ các bước thực hiện
2. Mỗi bước phải rõ ràng, cụ thể, có thể thực hiện ngay
3. Nếu liên quan đến code, cung cấp ví dụ code thực tế
4. Giải thích tại sao mỗi bước cần thiết
5. Cảnh báo các lỗi thường gặp và cách khắc phục
6. Sử dụng ngôn ngữ đơn giản, dễ hiểu

CẤU TRÚC TRẢ LỜI:
• Tổng quan ngắn gọn (1-2 câu)
• Các bước chi tiết (đánh số)
• Code ví dụ (nếu cần)
• Lưu ý quan trọng
• Xử lý lỗi thường gặp (nếu có)`;

    case "knowledge":
      return `BẠN ĐANG TRẢ LỜI CÂU HỎI KIẾN THỨC/GIẢI THÍCH.

YÊU CẦU BẮT BUỘC:
1. Trả lời CHÍNH XÁC dựa trên kiến thức đã được xác minh
2. Giải thích rõ ràng từ cơ bản đến nâng cao
3. Sử dụng ví dụ thực tế để minh họa
4. Nếu so sánh, đưa ra bảng so sánh rõ ràng
5. Trích dẫn nguồn đáng tin cậy nếu có

CẤU TRÚC TRẢ LỜI:
• Định nghĩa/Giải thích ngắn gọn
• Phân tích chi tiết
• Ví dụ minh họa
• Kết luận/Tóm tắt`;

    case "recommendation":
      return `BẠN ĐANG TRẢ LỜI CÂU HỎI ĐỀ XUẤT/GỢI Ý CÔNG NGHỆ.

KIẾN THỨC THAM KHẢO VỀ NGÔN NGỮ/CÔNG NGHỆ:

📱 MOBILE APP:
• Native iOS: Swift (hiệu năng cao, trải nghiệm tốt nhất)
• Native Android: Kotlin (modern, an toàn, được Google khuyên dùng)
• Cross-platform: Flutter (Dart), React Native (JavaScript) - tiết kiệm thời gian
• Game mobile: Unity (C#), Unreal Engine (C++)

🌐 WEB DEVELOPMENT:
• Frontend: React, Vue, Angular (JavaScript/TypeScript)
• Backend: Node.js (Express), Python (Django, FastAPI), Java (Spring Boot), Go, Rust
• Fullstack: Next.js, Nuxt.js, Ruby on Rails, Laravel (PHP)

🤖 AI/MACHINE LEARNING:
• Python (bắt buộc): TensorFlow, PyTorch, scikit-learn, Keras
• Xử lý dữ liệu: Pandas, NumPy
• NLP: Hugging Face, spaCy

📊 DATA SCIENCE/ANALYTICS:
• Python: Pandas, NumPy, Matplotlib, Seaborn
• R: cho thống kê chuyên sâu
• SQL: truy vấn database
• BI Tools: Power BI, Tableau

🎮 GAME DEVELOPMENT:
• Unity: C# (phổ biến nhất, đa nền tảng)
• Unreal Engine: C++ (đồ họa AAA)
• Godot: GDScript (nhẹ, miễn phí)
• Web games: Phaser.js (JavaScript)

☁️ DEVOPS/CLOUD:
• Scripting: Bash, Python
• IaC: Terraform, Ansible
• Containers: Docker, Kubernetes
• Cloud: AWS, Azure, GCP

🔒 CYBERSECURITY:
• Python: scripting, automation
• C/C++: low-level, exploit development
• Assembly: reverse engineering

💼 ENTERPRISE/BACKEND:
• Java: Spring Boot (ổn định, scalable)
• C#: .NET (Microsoft ecosystem)
• Go: microservices (hiệu năng cao)

YÊU CẦU BẮT BUỘC:
1. PHÂN TÍCH nhu cầu thực sự của người dùng
2. ĐỀ XUẤT 2-3 lựa chọn phù hợp nhất (không quá nhiều)
3. GIẢI THÍCH rõ tại sao mỗi lựa chọn phù hợp
4. CHỈ RÕ ưu/nhược điểm của từng lựa chọn
5. ĐƯA RA khuyến nghị cuối cùng dựa trên tình huống
6. GỢI Ý lộ trình học nếu phù hợp

CẤU TRÚC TRẢ LỜI:
1. Phân tích nhu cầu (1-2 câu)
2. Đề xuất TOP 2-3 lựa chọn:
   • Tên công nghệ: Lý do phù hợp
   • Ưu điểm / Nhược điểm
3. Khuyến nghị của tôi: [lựa chọn tốt nhất cho trường hợp này]
4. Lộ trình học gợi ý (nếu cần)

VÍ DỤ TRẢ LỜI TỐT:
"Để làm mobile app, tôi đề xuất:

1. Flutter (Dart) 🎯 Khuyên dùng
   • Ưu điểm: 1 code chạy cả iOS và Android, UI đẹp, hiệu năng tốt
   • Nhược điểm: Cần học Dart (nhưng dễ học)
   
2. React Native (JavaScript)
   • Ưu điểm: Dùng JavaScript quen thuộc, cộng đồng lớn
   • Nhược điểm: Hiệu năng thấp hơn Flutter một chút

Khuyến nghị: Nếu bạn mới bắt đầu, hãy chọn Flutter vì dễ học và có tương lai tốt."`;

    case "creative":
      return `BẠN ĐANG TRẢ LỜI CÂU HỎI SÁNG TẠO.

YÊU CẦU:
1. Đưa ra nhiều ý tưởng đa dạng
2. Sáng tạo nhưng vẫn thực tế
3. Giải thích ngắn gọn từng ý tưởng
4. Gợi ý cách thực hiện`;

    default:
      return `Hãy trả lời câu hỏi một cách chính xác, rõ ràng và hữu ích.`;
  }
}

// Hàm loại bỏ markdown formatting để text thuần túy
export function cleanMarkdownText(text: string): string {
  return text
    // Loại bỏ bold và italic: **, *, __, _
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')  // ***text***
    .replace(/\*\*(.+?)\*\*/g, '$1')       // **text**
    .replace(/\*(.+?)\*/g, '$1')           // *text*
    .replace(/___(.+?)___/g, '$1')         // ___text___
    .replace(/__(.+?)__/g, '$1')           // __text__
    .replace(/_(.+?)_/g, '$1')             // _text_
    // Loại bỏ headers: #, ##, ###, etc.
    .replace(/^#{1,6}\s+/gm, '')
    // Loại bỏ code blocks: ```code``` và `code`
    .replace(/```[\s\S]*?```/g, (match) => {
      const content = match.replace(/```\w*\n?/g, '').replace(/```/g, '');
      return content.trim();
    })
    .replace(/`([^`]+)`/g, '$1')
    // Loại bỏ links: [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Loại bỏ bullet points markdown: - item hoặc * item
    .replace(/^[\-\*]\s+/gm, '• ')
    // Loại bỏ numbered list markdown
    .replace(/^\d+\.\s+/gm, '')
    // Loại bỏ blockquotes: > text
    .replace(/^>\s+/gm, '')
    // Loại bỏ horizontal rules: --- hoặc ***
    .replace(/^[\-\*]{3,}$/gm, '')
    // Trim extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Hàm helper để gọi API với retry và fallback
async function callGeminiWithRetry(
  prompt: string,
  maxRetries: number = 3,
  temperature: number = 0.3  // Temperature thấp để tăng độ chính xác
): Promise<string | null> {
  for (const modelName of MODEL_LIST) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: temperature,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 2048,
          }
        });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error: unknown) {
        const err = error as { message?: string; status?: number };
        const isOverloaded = err.message?.includes("503") || 
                            err.message?.includes("overloaded") ||
                            err.status === 503;
        
        if (isOverloaded) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Model ${modelName} overloaded, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // Nếu lỗi khác (không phải 503), throw luôn
        throw error;
      }
    }
    console.log(`Model ${modelName} failed after ${maxRetries} retries, trying next model...`);
  }
  
  return null;
}

export async function analyzeQuery(query: string): Promise<{
  isSearchingCourse: boolean;
  courseKeyword?: string;
  originalQuery: string;
  isGeneralQuestion?: boolean;
  isSearchingByTeacher?: boolean;
  teacherName?: string;
  isAskingDefinition?: boolean;  // Hỏi về thuật ngữ/định nghĩa
}> {
  if (!API_KEY) {
    return {
      isSearchingCourse: false,
      originalQuery: query,
    };
  }

  try {
    const prompt = `Bạn là trợ lý AI phân tích câu hỏi cho website học trực tuyến CourseDemy.

NHIỆM VỤ: Phân biệt RÕ RÀNG giữa:
1. TÌM KHÓA HỌC: Người dùng muốn tìm/mua/đăng ký khóa học trên website
2. HỎI ĐỊNH NGHĨA/KIẾN THỨC: Người dùng muốn hiểu thuật ngữ, khái niệm, công nghệ

DẤU HIỆU TÌM KHÓA HỌC (isSearchingCourse = true):
- "tìm khóa học", "có khóa học nào", "muốn đăng ký khóa", "mua khóa học"
- "cho tôi xem khóa học", "có dạy ... không", "khóa nào về..."
- "đăng ký học", "gợi ý khóa học", "khóa học giá bao nhiêu"
- Mục đích rõ ràng là TÌM SẢN PHẨM trên website

DẤU HIỆU HỎI ĐỊNH NGHĨA/KIẾN THỨC (isAskingDefinition = true):
- "... là gì", "... là cái gì", "what is ...", "định nghĩa của ..."
- "... nghĩa là gì", "... có nghĩa gì", "giải thích ..."
- "... dùng để làm gì", "tại sao lại dùng ...", "khi nào dùng ..."
- "cách hoạt động của ...", "... hoạt động như thế nào"
- "so sánh ... và ...", "khác nhau giữa ... và ..."
- Mục đích là HIỂU KIẾN THỨC, không phải mua khóa học

Câu hỏi: "${query}"

Trả lời JSON:
{
  "isSearchingCourse": true/false,
  "courseKeyword": "từ khóa" (nếu tìm khóa học),
  "isSearchingByTeacher": true/false,
  "teacherName": "tên" (nếu tìm theo giáo viên),
  "isAskingDefinition": true/false,
  "isGeneralQuestion": true/false,
  "reason": "giải thích ngắn"
}

VÍ DỤ:
- "React là gì?" → {"isSearchingCourse": false, "isAskingDefinition": true, "reason": "hỏi định nghĩa React"}
- "Tìm khóa học React" → {"isSearchingCourse": true, "courseKeyword": "React", "isAskingDefinition": false, "reason": "tìm khóa học"}
- "JavaScript dùng để làm gì?" → {"isSearchingCourse": false, "isAskingDefinition": true, "reason": "hỏi mục đích JS"}
- "Có khóa JavaScript nào không?" → {"isSearchingCourse": true, "courseKeyword": "JavaScript", "isAskingDefinition": false, "reason": "tìm khóa học JS"}
- "API là viết tắt của gì?" → {"isSearchingCourse": false, "isAskingDefinition": true, "reason": "hỏi định nghĩa API"}
- "Muốn học API" → {"isSearchingCourse": true, "courseKeyword": "API", "isAskingDefinition": false, "reason": "muốn học = tìm khóa"}
- "So sánh React và Vue" → {"isSearchingCourse": false, "isAskingDefinition": true, "reason": "so sánh công nghệ"}
- "Khóa học của thầy Minh" → {"isSearchingCourse": false, "isSearchingByTeacher": true, "teacherName": "Minh", "isAskingDefinition": false}

CHỈ TRẢ VỀ JSON, KHÔNG THÊM TEXT.`;

    const text = await callGeminiWithRetry(prompt);

    if (text) {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          isSearchingCourse: parsed.isSearchingCourse === true,
          courseKeyword: parsed.courseKeyword || undefined,
          originalQuery: query,
          isGeneralQuestion: parsed.isGeneralQuestion === true,
          isSearchingByTeacher: parsed.isSearchingByTeacher === true,
          teacherName: parsed.teacherName || undefined,
          isAskingDefinition: parsed.isAskingDefinition === true,
        };
      }
    }
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    if (err.message?.includes("API key") || err.status === 401 || err.status === 403) {
      console.error("Lỗi API key Gemini:", err.message);
    }
  }

  const lowerQuery = query.toLowerCase();
  
  // Fallback: Kiểm tra nếu đang hỏi định nghĩa/thuật ngữ
  const definitionPatterns = [
    /(.+?)\s+là\s+(?:gì|cái gì|gì vậy|j)/i,
    /(?:what\s+is|what's)\s+(.+)/i,
    /(.+?)\s+(?:nghĩa là|có nghĩa|means?)/i,
    /(?:định nghĩa|giải thích)\s+(.+)/i,
    /(.+?)\s+(?:dùng để làm gì|để làm gì|hoạt động)/i,
    /(?:tại sao|why)\s+(?:lại|phải)?\s*(?:dùng|sử dụng)\s+(.+)/i,
    /(?:so sánh|compare|khác nhau)\s+(.+?)\s+(?:và|with|and)\s+(.+)/i,
    /(?:ưu|nhược)\s+điểm\s+(?:của\s+)?(.+)/i,
  ];
  
  for (const pattern of definitionPatterns) {
    if (pattern.test(query)) {
      return {
        isSearchingCourse: false,
        originalQuery: query,
        isAskingDefinition: true,
      };
    }
  }
  
  // Kiểm tra nếu đang tìm theo giáo viên (fallback khi không có Gemini)
  const teacherPatterns = [
    /(?:khóa học|khoá học|course).+(?:của|do|by).+(?:thầy|cô|giáo viên|giảng viên|teacher)\s+(.+)/i,
    /(?:thầy|cô|giáo viên|giảng viên|teacher)\s+(.+?)(?:\s+dạy|\s+có|\s+có dạy|$)/i,
    /(?:khóa học|khoá học|course).+(?:thầy|cô|giáo viên|giảng viên)\s+(.+)/i,
    /(?:tìm|xem).+(?:thầy|cô|giáo viên|giảng viên)\s+(.+)/i,
    /(?:thầy|cô)\s+([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+)*)/i,
  ];
  
  for (const pattern of teacherPatterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      const teacherName = match[1].trim()
        .replace(/\s*(dạy|có|không|gì|nào).*$/i, '')
        .trim();
      if (teacherName.length > 1) {
        return {
          isSearchingCourse: false,
          originalQuery: query,
          isSearchingByTeacher: true,
          teacherName: teacherName,
        };
      }
    }
  }
  
  // Kiểm tra các từ khóa về giáo viên đơn giản
  if (lowerQuery.includes("thầy") || lowerQuery.includes("cô") || 
      lowerQuery.includes("giáo viên") || lowerQuery.includes("giảng viên")) {
    // Trích xuất phần sau từ khóa
    const afterTeacher = query.replace(/.*(?:thầy|cô|giáo viên|giảng viên)\s*/i, '').trim();
    const teacherName = afterTeacher.split(/\s+(?:dạy|có|không|của|gì)/i)[0].trim();
    if (teacherName.length > 1) {
      return {
        isSearchingCourse: false,
        originalQuery: query,
        isSearchingByTeacher: true,
        teacherName: teacherName,
      };
    }
  }
  
  const techKeywords = [
    "python", "javascript", "react", "java", "html", "css", "node", "vue", "angular",
    "typescript", "php", "c++", "c#", "go", "rust", "swift", "kotlin", "dart",
    "sql", "mongodb", "mysql", "postgresql", "redis",
    "lập trình", "programming", "code", "web", "app", "mobile", "backend", "frontend"
  ];
  
  const stopWords = [
    "tôi", "mình", "muốn", "học", "có", "không", "là", "gì", "bao", "nhiêu",
    "khóa học", "khoá học", "course", "tìm", "cần", "ngôn ngữ", "lập trình"
  ];
  
  const foundTechKeyword = techKeywords.find(keyword => lowerQuery.includes(keyword));
  
  if (foundTechKeyword) {
    return {
      isSearchingCourse: true,
      courseKeyword: foundTechKeyword,
      originalQuery: query,
    };
  }
  
  const words = query.split(/\s+/);
  const importantWord = words.find(word => {
    const lowerWord = word.toLowerCase();
    return word.length > 2 && 
           !stopWords.includes(lowerWord) &&
           !lowerWord.match(/^(và|hoặc|với|cho|về|từ)$/);
  });
  
  if (importantWord && lowerQuery.includes("khóa học") || lowerQuery.includes("khoá học") || lowerQuery.includes("course") || lowerQuery.includes("học")) {
    return {
      isSearchingCourse: true,
      courseKeyword: importantWord,
      originalQuery: query,
    };
  }
  
  const generalPatterns = [
    /muốn học.*kỹ năng|muốn học.*kĩ năng|muốn học.*skill/i,
    /học thêm.*kỹ năng|học thêm.*kĩ năng/i,
    /cần học.*gì|cần học gì/i,
    /muốn học.*gì|muốn học gì/i,
    /nên học.*gì|nên học gì/i,
  ];
  
  const isGeneral = generalPatterns.some(pattern => pattern.test(query));
  
  return {
    isSearchingCourse: false,
    originalQuery: query,
    isGeneralQuestion: isGeneral,
  };
}

// Streaming response cho real-time display
export async function getGeminiResponseStream(
  query: string,
  conversationHistory: Array<{ role: string; content: string }> = [],
  onChunk: (chunk: string, fullText: string) => void
): Promise<string> {
  if (!API_KEY) {
    const msg = "Xin lỗi, tôi chưa được cấu hình API key. Vui lòng liên hệ quản trị viên.";
    onChunk(msg, msg);
    return msg;
  }

  // Xác định loại câu hỏi để điều chỉnh cấu hình
  const queryType = detectQueryType(query);
  const generationConfig = getGenerationConfig(queryType);
  const specializedPrompt = getSpecializedPrompt(queryType);

  const systemPrompt = getSystemPrompt();
  const historyText = conversationHistory
    .slice(-5)
    .map((msg) => `${msg.role === "user" ? "Người dùng" : "Trợ lý"}: ${msg.content}`)
    .join("\n");

  // Kết hợp system prompt với prompt chuyên biệt cho loại câu hỏi
  const fullPrompt = `${systemPrompt}\n\n${specializedPrompt}\n\n${historyText ? `Lịch sử trò chuyện:\n${historyText}\n\n` : ""}Người dùng: ${query}\nTrợ lý:`;

  console.log(`Query type detected: ${queryType}, temperature: ${generationConfig.temperature}`);

  for (const modelName of MODEL_LIST) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: generationConfig
      });

      const result = await model.generateContentStream(fullPrompt);
      let fullText = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        // Gọi callback với text đã clean markdown
        onChunk(chunkText, cleanMarkdownText(fullText));
      }

      return cleanMarkdownText(fullText);
    } catch (error: unknown) {
      const err = error as { message?: string; status?: number };
      const isOverloaded = err.message?.includes("503") || err.message?.includes("overloaded") || err.status === 503;
      
      if (isOverloaded) {
        console.log(`Model ${modelName} overloaded, trying next...`);
        continue;
      }
      console.error(`Error with model ${modelName}:`, err.message);
    }
  }

  const fallbackMsg = getOverloadedMessage();
  onChunk(fallbackMsg, fallbackMsg);
  return fallbackMsg;
}

// System prompt được tách riêng để dùng chung
function getSystemPrompt(): string {
  return `Bạn là trợ lý AI thông minh, chuyên nghiệp cho website học trực tuyến CourseDemy.

QUY TẮC ĐỊNH DẠNG (BẮT BUỘC):
• KHÔNG sử dụng markdown: không dùng *, **, #, ##, -, >, \`, hay bất kỳ ký tự formatting nào
• Viết văn bản thuần túy, dễ đọc, rõ ràng
• Dùng dấu • nếu cần liệt kê, đánh số 1. 2. 3. cho các bước
• Sử dụng emoji phù hợp để tạo điểm nhấn 😊

QUY TẮC TRẢ LỜI:
• Trả lời CHÍNH XÁC, ĐẦY ĐỦ, CÓ CẤU TRÚC rõ ràng
• Với câu hỏi "cách làm" hoặc "hướng dẫn": liệt kê TỪNG BƯỚC CỤ THỂ, chi tiết
• Với câu hỏi kiến thức: giải thích RÕ RÀNG, có ví dụ minh họa nếu cần
• Với câu hỏi code: viết code hoàn chỉnh, có comment giải thích
• Nếu câu hỏi không rõ: hỏi lại để hiểu đúng ý người dùng
• Nếu không biết hoặc không chắc: NÓI RÕ thay vì đoán bừa

CẤU TRÚC TRẢ LỜI CHO HƯỚNG DẪN:
1. Giới thiệu ngắn gọn về vấn đề
2. Liệt kê các bước thực hiện (đánh số rõ ràng)
3. Lưu ý hoặc mẹo quan trọng (nếu có)
4. Kết luận hoặc gợi ý thêm

KHẢ NĂNG:
• Hướng dẫn chi tiết cách làm bất kỳ việc gì
• Giải thích khái niệm khoa học, công nghệ, lịch sử, văn hóa
• Viết code, debug, giải thích thuật toán
• Giải toán, phân tích bài toán
• Đưa ra lời khuyên thực tế, hữu ích
• Hỗ trợ tìm khóa học phù hợp

PHONG CÁCH: Chuyên nghiệp, thân thiện, chính xác tuyệt đối. Ưu tiên chất lượng hơn tốc độ.`;
}

export async function getGeminiResponse(
  query: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  if (!API_KEY) {
    return "Xin lỗi, tôi chưa được cấu hình API key. Vui lòng liên hệ quản trị viên.";
  }

  try {
    // Xác định loại câu hỏi để điều chỉnh cấu hình
    const queryType = detectQueryType(query);
    const generationConfig = getGenerationConfig(queryType);
    const specializedPrompt = getSpecializedPrompt(queryType);
    
    const systemPrompt = getSystemPrompt();

    const historyText = conversationHistory
      .slice(-5)
      .map((msg) => `${msg.role === "user" ? "Người dùng" : "Trợ lý"}: ${msg.content}`)
      .join("\n");

    // Kết hợp system prompt với prompt chuyên biệt
    const fullPrompt = `${systemPrompt}\n\n${specializedPrompt}\n\n${historyText ? `Lịch sử trò chuyện:\n${historyText}\n\n` : ""}Người dùng: ${query}\nTrợ lý:`;

    console.log(`Query type: ${queryType}, temperature: ${generationConfig.temperature}`);

    const text = await callGeminiWithRetry(fullPrompt, 3, generationConfig.temperature);
    
    if (text) {
      return cleanMarkdownText(text);
    }
    
    return getOverloadedMessage();
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    if (err.message?.includes("API key") || err.status === 401 || err.status === 403) {
      console.error("Lỗi API key Gemini:", err.message);
    }
    return getGeneralErrorMessage();
  }
}

// Export các hàm tiện ích để dùng ở nơi khác nếu cần
export { detectQueryType, getGenerationConfig };

