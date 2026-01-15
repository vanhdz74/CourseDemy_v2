import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

// Danh sách model theo thứ tự ưu tiên (fallback khi model chính bị quá tải)
const MODEL_LIST = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

// Hàm helper để gọi API với retry và fallback
async function callGeminiWithRetry(
  prompt: string,
  maxRetries: number = 3
): Promise<string | null> {
  for (const modelName of MODEL_LIST) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error: unknown) {
        const err = error as { message?: string; status?: number };
        const isOverloaded = err.message?.includes("503") || 
                            err.message?.includes("overloaded") ||
                            err.status === 503;
        
        if (isOverloaded) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Model ${modelName} overloaded, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        throw error;
      }
    }
    console.log(`Model ${modelName} failed after ${maxRetries} retries, trying next model...`);
  }
  
  return null;
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  skills: string[];
}

export interface LearningRoadmap {
  skill: string;
  overview: string;
  totalDuration: string;
  steps: RoadmapStep[];
  tips: string[];
}

// Kiểm tra xem người dùng có đang hỏi về lộ trình không
export function isRoadmapQuery(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  const roadmapKeywords = [
    "lộ trình",
    "roadmap",
    "học như thế nào",
    "học thế nào",
    "bắt đầu từ đâu",
    "bắt đầu học",
    "nên học gì",
    "học gì trước",
    "thứ tự học",
    "các bước học",
    "hướng dẫn học",
    "con đường học",
    "pathway",
    "learning path",
    "từ zero",
    "từ đầu",
    "từ cơ bản",
    "người mới",
    "newbie",
    "beginner",
    "muốn trở thành",
    "muốn làm",
    "để trở thành",
  ];

  return roadmapKeywords.some((keyword) => lowerQuery.includes(keyword));
}

// Trích xuất kỹ năng từ câu hỏi về lộ trình
export function extractSkillFromRoadmapQuery(query: string): string | null {
  const lowerQuery = query.toLowerCase();

  // Các pattern để trích xuất kỹ năng
  const patterns = [
    /lộ trình (?:học |để )?(?:trở thành |làm )?(.+?)(?:\?|$|\.)/i,
    /roadmap (?:to |for )?(?:become |learn )?(.+?)(?:\?|$|\.)/i,
    /học (.+?) (?:như thế nào|thế nào|từ đầu|từ zero)/i,
    /bắt đầu học (.+?)(?:\?|$|\.)/i,
    /muốn (?:trở thành|làm) (.+?)(?:\?|$|\.)/i,
    /để trở thành (.+?)(?:\?|$|\.)/i,
    /hướng dẫn học (.+?)(?:\?|$|\.)/i,
  ];

  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      const skill = match[1]
        .trim()
        .replace(/như thế nào|thế nào|từ đầu|từ zero|cho người mới/gi, "")
        .trim();
      if (skill.length > 1) {
        return skill;
      }
    }
  }

  // Kiểm tra các kỹ năng phổ biến
  const commonSkills = [
    { keywords: ["frontend", "front-end", "front end"], skill: "Frontend Developer" },
    { keywords: ["backend", "back-end", "back end"], skill: "Backend Developer" },
    { keywords: ["fullstack", "full-stack", "full stack"], skill: "Fullstack Developer" },
    { keywords: ["react", "reactjs"], skill: "React" },
    { keywords: ["vue", "vuejs"], skill: "Vue.js" },
    { keywords: ["angular"], skill: "Angular" },
    { keywords: ["nodejs", "node.js", "node js"], skill: "Node.js" },
    { keywords: ["python"], skill: "Python" },
    { keywords: ["java "], skill: "Java" },
    { keywords: ["javascript", "js"], skill: "JavaScript" },
    { keywords: ["typescript", "ts"], skill: "TypeScript" },
    { keywords: ["devops"], skill: "DevOps" },
    { keywords: ["data science", "khoa học dữ liệu"], skill: "Data Science" },
    { keywords: ["machine learning", "ml", "học máy"], skill: "Machine Learning" },
    { keywords: ["ai", "artificial intelligence", "trí tuệ nhân tạo"], skill: "AI" },
    { keywords: ["mobile", "ứng dụng di động"], skill: "Mobile Developer" },
    { keywords: ["ios"], skill: "iOS Developer" },
    { keywords: ["android"], skill: "Android Developer" },
    { keywords: ["flutter"], skill: "Flutter" },
    { keywords: ["react native"], skill: "React Native" },
    { keywords: ["ui/ux", "ui ux", "uiux", "thiết kế giao diện"], skill: "UI/UX Design" },
    { keywords: ["web developer", "lập trình web"], skill: "Web Developer" },
    { keywords: ["game developer", "lập trình game"], skill: "Game Developer" },
    { keywords: ["cloud", "điện toán đám mây"], skill: "Cloud Computing" },
    { keywords: ["aws"], skill: "AWS" },
    { keywords: ["docker", "kubernetes", "k8s"], skill: "Container & Orchestration" },
    { keywords: ["sql", "database", "cơ sở dữ liệu"], skill: "Database" },
  ];

  for (const { keywords, skill } of commonSkills) {
    if (keywords.some((kw) => lowerQuery.includes(kw))) {
      return skill;
    }
  }

  return null;
}

// Tạo lộ trình học tập bằng Gemini
export async function generateLearningRoadmap(skill: string): Promise<LearningRoadmap | null> {
  if (!API_KEY) {
    return null;
  }

  try {
    const prompt = `Bạn là một chuyên gia tư vấn học tập. Hãy tạo một lộ trình học tập chi tiết cho kỹ năng: "${skill}"

Trả về JSON theo định dạng sau:
{
  "skill": "Tên kỹ năng",
  "overview": "Tổng quan ngắn gọn về kỹ năng này và tại sao nên học (2-3 câu)",
  "totalDuration": "Thời gian ước tính để hoàn thành (ví dụ: 6-12 tháng)",
  "steps": [
    {
      "step": 1,
      "title": "Tên bước học",
      "description": "Mô tả ngắn về những gì cần học",
      "duration": "Thời gian ước tính (ví dụ: 2-4 tuần)",
      "skills": ["Kỹ năng 1", "Kỹ năng 2"]
    }
  ],
  "tips": ["Mẹo học tập 1", "Mẹo 2", "Mẹo 3"]
}

Yêu cầu:
- Tạo 4-6 bước học hợp lý, từ cơ bản đến nâng cao
- Mỗi bước có 2-4 kỹ năng cụ thể
- Thời gian thực tế cho người học part-time
- 3-4 tips hữu ích
- Viết bằng tiếng Việt
- CHỈ trả về JSON, không thêm text khác`;

    const text = await callGeminiWithRetry(prompt);

    if (text) {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed as LearningRoadmap;
      }
    }
  } catch (error) {
    console.error("Lỗi khi tạo lộ trình:", error);
  }

  return null;
}

// Format lộ trình thành message
export function formatRoadmapMessage(roadmap: LearningRoadmap): string {
  let message = `🎯 **Lộ trình học ${roadmap.skill}**\n\n`;
  message += `📝 ${roadmap.overview}\n`;
  message += `⏱️ Thời gian ước tính: ${roadmap.totalDuration}\n\n`;

  message += `📚 **Các bước học:**\n`;
  roadmap.steps.forEach((step) => {
    message += `\n${step.step}. **${step.title}** (${step.duration})\n`;
    message += `   ${step.description}\n`;
    message += `   🔹 ${step.skills.join(", ")}\n`;
  });

  message += `\n💡 **Mẹo học tập:**\n`;
  roadmap.tips.forEach((tip, index) => {
    message += `${index + 1}. ${tip}\n`;
  });

  return message;
}

// Lấy từ khóa tìm kiếm khóa học từ lộ trình
export function getSearchKeywordsFromRoadmap(roadmap: LearningRoadmap): string[] {
  const keywords: string[] = [roadmap.skill];
  
  // Lấy từ skills của các bước đầu tiên
  roadmap.steps.slice(0, 3).forEach((step) => {
    keywords.push(...step.skills.slice(0, 2));
  });

  // Loại bỏ trùng lặp và giới hạn
  return [...new Set(keywords)].slice(0, 5);
}
