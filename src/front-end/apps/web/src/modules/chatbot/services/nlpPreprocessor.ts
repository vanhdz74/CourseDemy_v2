import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

// Định nghĩa các intent có thể có
export type UserIntent = 
  | "search_course"      // Tìm khóa học
  | "search_by_teacher"  // Tìm khóa học theo giáo viên
  | "ask_definition"     // Hỏi định nghĩa/khái niệm
  | "ask_recommendation" // Hỏi đề xuất/gợi ý
  | "ask_tutorial"       // Hỏi hướng dẫn/cách làm
  | "ask_comparison"     // So sánh
  | "ask_roadmap"        // Hỏi lộ trình học
  | "ask_weather"        // Hỏi thời tiết
  | "ask_statistics"     // Hỏi thống kê website
  | "greeting"           // Chào hỏi
  | "general_question"   // Câu hỏi chung
  | "unknown";           // Không xác định

// Kết quả phân tích NLP
export interface NLPAnalysis {
  // Intent chính
  primaryIntent: UserIntent;
  // Độ tin cậy (0-1)
  confidence: number;
  // Các entity được trích xuất
  entities: {
    courseTopic?: string;        // Chủ đề khóa học: "Python", "React", "Machine Learning"
    teacherName?: string;        // Tên giáo viên
    technology?: string;         // Công nghệ được đề cập
    skill?: string;              // Kỹ năng muốn học
    location?: string;           // Địa điểm (cho thời tiết)
    comparisonItems?: string[];  // Các item cần so sánh
    purpose?: string;            // Mục đích: "làm web", "làm app", "AI"
  };
  // Câu hỏi đã được chuẩn hóa
  normalizedQuery: string;
  // Ngôn ngữ của câu hỏi
  language: "vi" | "en" | "mixed";
  // Sentiment
  sentiment: "positive" | "neutral" | "negative";
  // Keywords quan trọng
  keywords: string[];
  // Câu hỏi gốc
  originalQuery: string;
}

// Cache để tránh gọi API nhiều lần cho cùng một câu hỏi
const analysisCache = new Map<string, NLPAnalysis>();
const CACHE_MAX_SIZE = 100;

// Hàm chính để phân tích ngôn ngữ đầu vào
export async function preprocessQuery(query: string): Promise<NLPAnalysis> {
  // Kiểm tra cache
  const cacheKey = query.toLowerCase().trim();
  if (analysisCache.has(cacheKey)) {
    return analysisCache.get(cacheKey)!;
  }

  // Nếu không có API key, dùng fallback
  if (!API_KEY) {
    return fallbackAnalysis(query);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.1,  // Rất thấp để đảm bảo chính xác
        topP: 0.8,
        topK: 20,
        maxOutputTokens: 1024,
      }
    });

    const prompt = `Bạn là hệ thống NLP chuyên phân tích câu hỏi người dùng cho website học trực tuyến CourseDemy.

NHIỆM VỤ: Phân tích câu hỏi và trả về JSON với thông tin chi tiết.

CÁC INTENT CÓ THỂ:
- search_course: Tìm/mua/đăng ký khóa học cụ thể
- search_by_teacher: Tìm khóa học theo tên giáo viên
- ask_definition: Hỏi "X là gì?", giải thích khái niệm
- ask_recommendation: Hỏi nên học gì, dùng công nghệ gì, đề xuất
- ask_tutorial: Hỏi cách làm, hướng dẫn từng bước
- ask_comparison: So sánh 2+ công nghệ/framework
- ask_roadmap: Hỏi lộ trình học, path học tập
- ask_weather: Hỏi thời tiết
- ask_statistics: Hỏi thống kê website (bao nhiêu khóa học, học viên...)
- greeting: Chào hỏi đơn giản
- general_question: Câu hỏi khác không thuộc các loại trên

CÂU HỎI: "${query}"

TRẢ VỀ JSON (CHỈ JSON, KHÔNG TEXT KHÁC):
{
  "primaryIntent": "intent_name",
  "confidence": 0.0-1.0,
  "entities": {
    "courseTopic": "chủ đề nếu có",
    "teacherName": "tên giáo viên nếu có",
    "technology": "công nghệ được đề cập",
    "skill": "kỹ năng muốn học",
    "location": "địa điểm nếu hỏi thời tiết",
    "comparisonItems": ["item1", "item2"] nếu so sánh,
    "purpose": "mục đích làm gì"
  },
  "normalizedQuery": "câu hỏi đã chuẩn hóa, rõ ràng hơn",
  "language": "vi/en/mixed",
  "sentiment": "positive/neutral/negative",
  "keywords": ["từ khóa quan trọng"]
}

VÍ DỤ:
Input: "có khoá nào về react ko"
Output: {"primaryIntent":"search_course","confidence":0.95,"entities":{"courseTopic":"React","technology":"React"},"normalizedQuery":"Tìm khóa học về React","language":"vi","sentiment":"neutral","keywords":["React","khóa học"]}

Input: "react là j vậy"
Output: {"primaryIntent":"ask_definition","confidence":0.98,"entities":{"technology":"React"},"normalizedQuery":"React là gì?","language":"vi","sentiment":"neutral","keywords":["React","định nghĩa"]}

Input: "muốn làm app điện thoại thì học gì"
Output: {"primaryIntent":"ask_recommendation","confidence":0.95,"entities":{"purpose":"làm app điện thoại","skill":"mobile development"},"normalizedQuery":"Nên học gì để làm ứng dụng di động?","language":"vi","sentiment":"neutral","keywords":["mobile","app","học"]}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Parse JSON từ response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      const analysis: NLPAnalysis = {
        primaryIntent: parsed.primaryIntent || "general_question",
        confidence: parsed.confidence || 0.5,
        entities: {
          courseTopic: parsed.entities?.courseTopic || undefined,
          teacherName: parsed.entities?.teacherName || undefined,
          technology: parsed.entities?.technology || undefined,
          skill: parsed.entities?.skill || undefined,
          location: parsed.entities?.location || undefined,
          comparisonItems: parsed.entities?.comparisonItems || undefined,
          purpose: parsed.entities?.purpose || undefined,
        },
        normalizedQuery: parsed.normalizedQuery || query,
        language: parsed.language || "vi",
        sentiment: parsed.sentiment || "neutral",
        keywords: parsed.keywords || [],
        originalQuery: query,
      };

      // Lưu vào cache
      if (analysisCache.size >= CACHE_MAX_SIZE) {
        const firstKey = analysisCache.keys().next().value;
        if (firstKey) analysisCache.delete(firstKey);
      }
      analysisCache.set(cacheKey, analysis);

      return analysis;
    }
  } catch (error) {
    console.error("NLP preprocessing error:", error);
  }

  // Fallback nếu có lỗi
  return fallbackAnalysis(query);
}

// Fallback analysis khi không có API hoặc lỗi
function fallbackAnalysis(query: string): NLPAnalysis {
  const lowerQuery = query.toLowerCase().trim();
  
  let primaryIntent: UserIntent = "general_question";
  let confidence = 0.6;
  const entities: NLPAnalysis["entities"] = {};
  
  // Detect intent bằng patterns
  if (/thời tiết|weather|nhiệt độ|temperature/i.test(query)) {
    primaryIntent = "ask_weather";
    confidence = 0.9;
    const locationMatch = query.match(/(?:thời tiết|weather)\s+(?:ở\s+)?([A-Za-zÀ-ỹ\s]+)/i);
    if (locationMatch) entities.location = locationMatch[1].trim();
  } else if (/thống kê|bao nhiêu.*(học viên|giáo viên|khóa học|danh mục)/i.test(query)) {
    primaryIntent = "ask_statistics";
    confidence = 0.9;
  } else if (/lộ trình|roadmap|path\s+học/i.test(query)) {
    primaryIntent = "ask_roadmap";
    confidence = 0.9;
    const skillMatch = query.match(/(?:lộ trình|roadmap)\s+(?:học\s+)?([A-Za-zÀ-ỹ\s]+)/i);
    if (skillMatch) entities.skill = skillMatch[1].trim();
  } else if (/(?:thầy|cô|giáo viên|giảng viên)\s+([A-Za-zÀ-ỹ\s]+)/i.test(query)) {
    primaryIntent = "search_by_teacher";
    confidence = 0.85;
    const teacherMatch = query.match(/(?:thầy|cô|giáo viên|giảng viên)\s+([A-Za-zÀ-ỹ\s]+)/i);
    if (teacherMatch) entities.teacherName = teacherMatch[1].trim();
  } else if (/là\s+(?:gì|j)|what\s+is|nghĩa là|định nghĩa/i.test(query)) {
    primaryIntent = "ask_definition";
    confidence = 0.9;
    const techMatch = query.match(/([A-Za-z0-9\+\#\.]+)\s+là\s+(?:gì|j)/i);
    if (techMatch) entities.technology = techMatch[1];
  } else if (/so sánh|compare|khác nhau|vs\b/i.test(query)) {
    primaryIntent = "ask_comparison";
    confidence = 0.85;
    const items = query.match(/([A-Za-z0-9\+\#]+)\s+(?:và|vs|or|với)\s+([A-Za-z0-9\+\#]+)/i);
    if (items) entities.comparisonItems = [items[1], items[2]];
  } else if (/nên\s+(?:học|dùng|chọn)|học\s+gì|dùng\s+gì|công nghệ\s+nào/i.test(query)) {
    primaryIntent = "ask_recommendation";
    confidence = 0.85;
    const purposeMatch = query.match(/(?:để|cho|làm)\s+([A-Za-zÀ-ỹ\s]+?)(?:\?|$)/i);
    if (purposeMatch) entities.purpose = purposeMatch[1].trim();
  } else if (/cách\s+(?:làm|tạo|cài)|hướng dẫn|how\s+to|làm\s+(?:thế nào|sao)/i.test(query)) {
    primaryIntent = "ask_tutorial";
    confidence = 0.85;
  } else if (/tìm\s+khóa|có\s+khóa|muốn\s+học|đăng\s+ký|khóa\s+học/i.test(query)) {
    primaryIntent = "search_course";
    confidence = 0.8;
    // Extract course topic
    const topicMatch = query.match(/(?:khóa học|học|tìm)\s+(?:về\s+)?([A-Za-z0-9\+\#\s]+)/i);
    if (topicMatch) entities.courseTopic = topicMatch[1].trim();
  } else if (/^(?:xin chào|hello|hi|hey|chào|alo)/i.test(query)) {
    primaryIntent = "greeting";
    confidence = 0.95;
  }

  // Extract technology keywords
  const techKeywords = [
    "python", "javascript", "typescript", "react", "vue", "angular", "node",
    "java", "spring", "kotlin", "swift", "flutter", "dart", "go", "rust",
    "c++", "c#", "php", "laravel", "django", "fastapi", "nextjs", "nuxt",
    "mongodb", "mysql", "postgresql", "redis", "docker", "kubernetes",
    "aws", "azure", "gcp", "ai", "ml", "machine learning", "deep learning"
  ];
  
  const foundKeywords = techKeywords.filter(kw => lowerQuery.includes(kw.toLowerCase()));
  if (foundKeywords.length > 0 && !entities.technology) {
    entities.technology = foundKeywords[0];
  }

  // Detect language
  const hasVietnamese = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(query);
  const hasEnglish = /\b(the|is|are|what|how|why|when|where|can|do|does|will|would|should)\b/i.test(query);
  
  let language: "vi" | "en" | "mixed" = "vi";
  if (hasVietnamese && hasEnglish) language = "mixed";
  else if (!hasVietnamese && hasEnglish) language = "en";

  return {
    primaryIntent,
    confidence,
    entities,
    normalizedQuery: query,
    language,
    sentiment: "neutral",
    keywords: foundKeywords,
    originalQuery: query,
  };
}

// Hàm kiểm tra xem có cần dùng AI preprocessing không
export function shouldUseAIPreprocessing(query: string): boolean {
  // Các trường hợp cần AI:
  // - Câu hỏi phức tạp
  // - Có typo/viết tắt
  // - Ngữ cảnh không rõ ràng
  
  const complexPatterns = [
    /\b(hay|hoặc|vs|versus)\b/i,  // Có so sánh
    /\?.*\?/,                      // Nhiều câu hỏi
    /.{100,}/,                     // Câu dài
    /[^a-zA-ZÀ-ỹ0-9\s\.\,\?\!]/,  // Có ký tự đặc biệt
  ];
  
  const simplePatterns = [
    /^(?:hi|hello|xin chào|chào)\s*[!.]?$/i,  // Chào đơn giản
    /^thời tiết\s+[A-Za-zÀ-ỹ\s]+$/i,          // Thời tiết đơn giản
    /^thống kê\s*$/i,                          // Thống kê đơn giản
  ];
  
  // Nếu là câu đơn giản, không cần AI
  for (const pattern of simplePatterns) {
    if (pattern.test(query)) return false;
  }
  
  // Nếu có patterns phức tạp, cần AI
  for (const pattern of complexPatterns) {
    if (pattern.test(query)) return true;
  }
  
  // Mặc định dùng AI cho độ chính xác cao
  return true;
}

// Hàm chuyển đổi NLPAnalysis sang format cũ để tương thích
export function convertToLegacyFormat(analysis: NLPAnalysis) {
  return {
    isSearchingCourse: analysis.primaryIntent === "search_course",
    courseKeyword: analysis.entities.courseTopic || analysis.entities.technology,
    originalQuery: analysis.originalQuery,
    isGeneralQuestion: analysis.primaryIntent === "general_question",
    isSearchingByTeacher: analysis.primaryIntent === "search_by_teacher",
    teacherName: analysis.entities.teacherName,
    isAskingDefinition: analysis.primaryIntent === "ask_definition",
    // Thông tin mở rộng
    nlpAnalysis: analysis,
  };
}

// Export để clear cache khi cần
export function clearNLPCache() {
  analysisCache.clear();
}
