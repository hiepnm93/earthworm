export function createStatement(courseId: string) {
  return {
    order: 1,
    vietnamese: "Xin chào",
    english: "hi",
    soundmark: "/hi/",
    courseId,
  };
}

export function createMultipleStatement(courseId: string) {
  return [
    {
      order: 1,
      vietnamese: "Tôi",
      english: "I",
      soundmark: "/aɪ/",
      courseId,
    },
    {
      order: 2,
      vietnamese: "thích",
      english: "like",
      soundmark: "/laɪk/",
      courseId,
    },
  ];
}
