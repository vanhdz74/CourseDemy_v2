import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = "gemini-2.5-flash";

export async function analyzeQuery(query: string): Promise<{
  isSearchingCourse: boolean;
  courseKeyword?: string;
  originalQuery: string;
  isGeneralQuestion?: boolean;
}> {
  if (!API_KEY) {
    return {
      isSearchingCourse: false,
      originalQuery: query,
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Bạn là một trợ lý AI cho một website học trực tuyến. 
Nhiệm vụ của bạn là phân tích câu hỏi của người dùng và xác định:
1. Người dùng có đang tìm kiếm khóa học CỤ THỂ không?
2. Nếu có, trích xuất TỪ KHÓA CHÍNH của khóa học (loại bỏ các từ như "khóa học", "ngôn ngữ", "tìm", "cần", "muốn học")
3. Nếu câu hỏi quá chung chung (như "muốn học kỹ năng", "muốn học thêm"), đánh dấu isGeneralQuestion = true

Câu hỏi của người dùng: "${query}"

Hãy trả lời theo định dạng JSON sau:
{
  "isSearchingCourse": true/false,
  "courseKeyword": "từ khóa chính" (chỉ điền nếu isSearchingCourse = true và có từ khóa cụ thể, nếu không thì để null),
  "isGeneralQuestion": true/false (true nếu câu hỏi quá chung chung, cần hỏi lại),
  "reason": "lý do ngắn gọn"
}

QUAN TRỌNG: 
- courseKeyword phải là từ khóa CHÍNH, ngắn gọn, loại bỏ các từ không cần thiết
- isGeneralQuestion = true khi câu hỏi quá chung chung, không có từ khóa cụ thể

Ví dụ:
- "Tôi muốn học lập trình Python" → {"isSearchingCourse": true, "courseKeyword": "Python", "isGeneralQuestion": false, "reason": "Người dùng muốn tìm khóa học về Python"}
- "mình cần tìm khóa học ngôn ngữ python" → {"isSearchingCourse": true, "courseKeyword": "python", "isGeneralQuestion": false, "reason": "Người dùng tìm khóa học Python"}
- "tôi muốn học thêm nhiều kĩ năng hơn" → {"isSearchingCourse": false, "courseKeyword": null, "isGeneralQuestion": true, "reason": "Câu hỏi quá chung chung, cần hỏi lại kỹ năng cụ thể"}
- "muốn học kỹ năng" → {"isSearchingCourse": false, "courseKeyword": null, "isGeneralQuestion": true, "reason": "Câu hỏi chung chung, cần hỏi lại"}
- "Khóa học React có giá bao nhiêu?" → {"isSearchingCourse": true, "courseKeyword": "React", "isGeneralQuestion": false, "reason": "Người dùng hỏi về khóa học React"}
- "Xin chào" → {"isSearchingCourse": false, "courseKeyword": null, "isGeneralQuestion": false, "reason": "Câu chào hỏi thông thường"}

Chỉ trả về JSON, không thêm bất kỳ text nào khác.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        isSearchingCourse: parsed.isSearchingCourse === true,
        courseKeyword: parsed.courseKeyword || undefined,
        originalQuery: query,
        isGeneralQuestion: parsed.isGeneralQuestion === true,
      };
    }
  } catch (error: any) {
    if (error.message?.includes("API key") || error.status === 401 || error.status === 403) {
      console.error("Lỗi API key Gemini:", error.message);
    }
  }

  const lowerQuery = query.toLowerCase();
  
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

export async function getGeminiResponse(
  query: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  if (!API_KEY) {
    return "Xin lỗi, tôi chưa được cấu hình API key. Vui lòng liên hệ quản trị viên.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const systemPrompt = `Bạn là một trợ lý AI thân thiện cho một website học trực tuyến tên là "CourseDemy".
Nhiệm vụ của bạn là trả lời các câu hỏi của người dùng một cách hữu ích và thân thiện.
Nếu người dùng hỏi về khóa học, hãy hướng dẫn họ tìm kiếm bằng từ khóa cụ thể.
Trả lời bằng tiếng Việt, ngắn gọn và dễ hiểu.`;

    const historyText = conversationHistory
      .slice(-5)
      .map((msg) => `${msg.role === "user" ? "Người dùng" : "Trợ lý"}: ${msg.content}`)
      .join("\n");

    const fullPrompt = `${systemPrompt}

${historyText ? `Lịch sử trò chuyện:\n${historyText}\n\n` : ""}
Người dùng: ${query}
Trợ lý:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    if (error.message?.includes("API key") || error.status === 401 || error.status === 403) {
      console.error("Lỗi API key Gemini:", error.message);
    }
    return "Xin lỗi, tôi gặp lỗi khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.";
  }
}

