export type PostType = {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  bloggerID: number;
  bloggerName?: string;
};

export type BloggerType = {
  id: number;
  name: string;
  youtubeURI: string;
};

export const bloggers: BloggerType[] = [
  {
    id: 1,
    name: "Blogger-01",
    youtubeURI: "https://www.youtube.com/Blogger-01",
  },
  {
    id: 2,
    name: "Blogger-02",
    youtubeURI: "https://www.youtube.com/Blogger-02",
  },
  {
    id: 3,
    name: "Blogger-03",
    youtubeURI: "https://www.youtube.com/Blogger-03",
  },
  {
    id: 4,
    name: "Blogger-04",
    youtubeURI: "https://www.youtube.com/Blogger-04",
  },
  {
    id: 5,
    name: "Blogger-05",
    youtubeURI: "https://www.youtube.com/Blogger-05",
  },
];

export const posts: PostType[] = [
  {
    id: 1,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 1,
  },
  {
    id: 2,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 2,
  },
  {
    id: 3,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 3,
  },
  {
    id: 4,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 4,
  },
  {
    id: 5,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 5,
  },
  {
    id: 6,
    title: "Post-02",
    shortDescription: "Second post of Blogger-01",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 1,
  },
  {
    id: 7,
    title: "Post-02",
    shortDescription: "Second post of Blogger-02",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 2,
  },
  {
    id: 8,
    title: "Post-02",
    shortDescription: "Second post of Blogger-03",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 3,
  },
  {
    id: 9,
    title: "Post-02",
    shortDescription: "Second post of Blogger-04",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 4,
  },
  {
    id: 10,
    title: "Post-02",
    shortDescription: "Second post of Blogger-05",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 5,
  },
];
