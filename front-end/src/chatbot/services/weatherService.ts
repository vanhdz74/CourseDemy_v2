export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  visibility: number;
  pressure: number;
  sunrise: string;
  sunset: string;
  updatedAt: Date;
}

export interface WeatherForecast {
  date: string;
  dayName: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
}

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5";

// Map icon code to emoji
function getWeatherEmoji(iconCode: string): string {
  const iconMap: Record<string, string> = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "❄️",
    "13n": "❄️",
    "50d": "🌫️",
    "50n": "🌫️",
  };
  return iconMap[iconCode] || "🌡️";
}

// Translate weather description to Vietnamese
function translateWeatherDescription(description: string): string {
  const translations: Record<string, string> = {
    "clear sky": "Trời quang",
    "few clouds": "Ít mây",
    "scattered clouds": "Mây rải rác",
    "broken clouds": "Nhiều mây",
    "overcast clouds": "U ám",
    "shower rain": "Mưa rào",
    "rain": "Mưa",
    "light rain": "Mưa nhẹ",
    "moderate rain": "Mưa vừa",
    "heavy intensity rain": "Mưa to",
    "thunderstorm": "Dông",
    "snow": "Tuyết",
    "mist": "Sương mù",
    "fog": "Sương mù dày",
    "haze": "Mù",
    "smoke": "Khói",
    "dust": "Bụi",
    "sand": "Cát",
    "tornado": "Lốc xoáy",
  };
  return translations[description.toLowerCase()] || description;
}

// Format time from Unix timestamp
function formatTime(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

// Get city coordinates
async function getCoordinates(
  city: string
): Promise<{ lat: number; lon: number; name: string; country: string } | null> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        city
      )}&limit=1&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Không thể tìm thành phố");
    }

    const data = await response.json();
    if (data.length === 0) {
      return null;
    }

    return {
      lat: data[0].lat,
      lon: data[0].lon,
      name: data[0].local_names?.vi || data[0].name,
      country: data[0].country,
    };
  } catch (error) {
    console.error("Lỗi khi lấy tọa độ:", error);
    return null;
  }
}

// Get current weather by city name
export async function getCurrentWeather(city: string): Promise<WeatherData | null> {
  if (!WEATHER_API_KEY) {
    console.error("Weather API key chưa được cấu hình");
    return null;
  }

  try {
    const coords = await getCoordinates(city);
    if (!coords) {
      return null;
    }

    const response = await fetch(
      `${WEATHER_API_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${WEATHER_API_KEY}&units=metric&lang=vi`
    );

    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu thời tiết");
    }

    const data = await response.json();

    return {
      city: coords.name,
      country: coords.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: translateWeatherDescription(data.weather[0].description),
      icon: getWeatherEmoji(data.weather[0].icon),
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      visibility: Math.round(data.visibility / 1000), // Convert m to km
      pressure: data.main.pressure,
      sunrise: formatTime(data.sys.sunrise, data.timezone),
      sunset: formatTime(data.sys.sunset, data.timezone),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Lỗi khi lấy thời tiết:", error);
    return null;
  }
}

// Get weather by user's current location
export async function getWeatherByLocation(): Promise<WeatherData | null> {
  if (!WEATHER_API_KEY) {
    console.error("Weather API key chưa được cấu hình");
    return null;
  }

  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `${WEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=vi`
          );

          if (!response.ok) {
            throw new Error("Không thể lấy dữ liệu thời tiết");
          }

          const data = await response.json();

          resolve({
            city: data.name,
            country: data.sys.country,
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            description: translateWeatherDescription(data.weather[0].description),
            icon: getWeatherEmoji(data.weather[0].icon),
            windSpeed: Math.round(data.wind.speed * 3.6),
            visibility: Math.round(data.visibility / 1000),
            pressure: data.main.pressure,
            sunrise: formatTime(data.sys.sunrise, data.timezone),
            sunset: formatTime(data.sys.sunset, data.timezone),
            updatedAt: new Date(),
          });
        } catch (error) {
          console.error("Lỗi khi lấy thời tiết:", error);
          resolve(null);
        }
      },
      () => {
        resolve(null);
      },
      { timeout: 10000 }
    );
  });
}

// Format weather data to message
export function formatWeatherMessage(weather: WeatherData): string {
  return `${weather.icon} Thời tiết tại ${weather.city}, ${weather.country}`;
}

// Extract city name from user query
export function extractCityFromQuery(query: string): string | null {
  const lowerQuery = query.toLowerCase();

  // Common patterns to extract city name
  const patterns = [
    /thời tiết (?:ở|tại|của|thành phố|tp\.?|tp)?\s*([^\?\.\!]+)/i,
    /weather (?:in|at|of)?\s*([^\?\.\!]+)/i,
    /(?:ở|tại|của)\s*([^\?\.\!]+)\s*(?:thời tiết|weather)/i,
    /nhiệt độ (?:ở|tại)?\s*([^\?\.\!]+)/i,
    /trời (?:ở|tại)?\s*([^\?\.\!]+)\s*(?:như thế nào|thế nào|ntn)/i,
  ];

  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      // Clean up the city name
      const cityName = match[1]
        .trim()
        .replace(/\?|\.|!|,$/g, "")
        .replace(/như thế nào|thế nào|ntn|hôm nay|ngày mai|bây giờ/gi, "")
        .trim();

      if (cityName.length > 1) {
        return cityName;
      }
    }
  }

  // Check for direct city name mentions (common Vietnamese cities)
  const vietnamCities = [
    "hà nội",
    "hồ chí minh",
    "đà nẵng",
    "hải phòng",
    "cần thơ",
    "biên hòa",
    "nha trang",
    "huế",
    "đà lạt",
    "vũng tàu",
    "quy nhơn",
    "buôn ma thuột",
    "thanh hóa",
    "nam định",
    "vinh",
    "hạ long",
    "sapa",
    "phú quốc",
    "phan thiết",
    "mỹ tho",
  ];

  for (const city of vietnamCities) {
    if (lowerQuery.includes(city)) {
      return city;
    }
  }

  // Check for international cities
  const internationalCities = [
    "tokyo",
    "seoul",
    "beijing",
    "shanghai",
    "bangkok",
    "singapore",
    "kuala lumpur",
    "jakarta",
    "manila",
    "hong kong",
    "taipei",
    "new york",
    "london",
    "paris",
    "sydney",
    "los angeles",
    "tokyo",
    "dubai",
  ];

  for (const city of internationalCities) {
    if (lowerQuery.includes(city)) {
      return city;
    }
  }

  return null;
}

// Check if query is asking about weather
export function isWeatherQuery(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  const weatherKeywords = [
    "thời tiết",
    "weather",
    "nhiệt độ",
    "temperature",
    "trời",
    "nắng",
    "mưa",
    "độ ẩm",
    "humidity",
    "gió",
    "wind",
    "dự báo",
    "forecast",
    "bao nhiêu độ",
    "nóng",
    "lạnh",
    "mây",
    "cloud",
  ];

  return weatherKeywords.some((keyword) => lowerQuery.includes(keyword));
}
