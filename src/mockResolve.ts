export interface ResolveMediaResponse {
  id: number;
  source_id: string;
  source_type: string;
  title: string;
  artist?: string;
  description?: string;
  duration: number;
  thumbnail_url?: string;
  audio_url: string;
}

export const mockResolveMedia = async (
  url: string
): Promise<{ data: ResolveMediaResponse }> => {
  // if (!url.includes("youtube.com")) {
  //   throw new Error("yt-dlp не смог обработать ссылку");
  // }

  if (url.includes("fail")) {
    throw new Error("yt-dlp не смог обработать ссылку");
  }

  if (url.includes("nodata")) {
    throw new Error("yt-dlp вернул недостаточно данных");
  }

  if (url.includes("noaudio")) {
    throw new Error("yt-dlp не смог извлечь аудиоссылку");
  }

  return {
    data: {
      id: 1,
      source_id: "Nc7pLmCdWgY",
      source_type: "youtube",
      title: "ДЖЕМСАЙД ПРО ГЕРОЕВ В ДЕДЛОК ",
      artist: "DAD LUCK",
      description: "#deadlock #дедлок #deadlockmoments\nНА РАЗВИТИЕ КАНАЛА - https://www.donationalerts.com/r/dadluck\nПрисылайте клипы сюда - clck.ru/3CuoGi\nДЖЕМСАЙД ПРО ГЕРОЕВ В ДЕДЛОК",
      duration: 415,
      thumbnail_url:
        "https://i.ytimg.com/vi/Nc7pLmCdWgY/maxresdefault.jpg",
      audio_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
  };
};
