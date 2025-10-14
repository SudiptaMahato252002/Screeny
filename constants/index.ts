import { VideoCardProps } from "@/components/VideoCard";


export const MAX_VIDEO_SIZE=500*1024*1024
export const MAX_THUMBNAIL_SIZE=10*1024*1024


export const BUNNY={
  STREAM_BASE_URL:"https://video.bunnycdn.com/library",
  EMBED_URL:"https://video.bunnycdn.com/library",
  STORAGE_BASE_URL:"https://storage.bunnycdn.com/screeny",
  CDN_URL:"https://screeny.b-cdn.net",
  TRANSCRIPT_URL:"https://vz-5c48d939-82e.b-cdn.net"
}



export const ICONS={
    record:"/assets/icons/record.svg",
    close:"/assets/icons/close.svg",
    upload:"/assets/icons/upload.svg"
}

export const dummyCards:VideoCardProps[] = [
  {
    id: "1",
    title: "Snapchat Message",
    thumbnail: "/assets/samples/thumbnail (1).png",
    createdAt: new Date("2025-05-01 06:25:54.437"),
    userImg: "/assets/images/jason.png",
    username: "Jason",
    views: 10,
    visibility: "public",
    duration: 156,
  },
  {
    id: "2",
    title: "Instagram Story",
    thumbnail: "/assets/samples/thumbnail (2).png",
    createdAt: new Date("2025-05-03 10:45:12.221"),
    userImg: "/assets/images/jason.png",
    username: "Jason",
    views: 25,
    visibility: "public",
    duration: 132,
  },
  {
    id: "3",
    title: "Morning Vlog",
    thumbnail: "/assets/samples/thumbnail (3).png",
    createdAt: new Date("2025-05-07 09:20:11.114"),
    userImg: "/assets/images/jason.png",
    username: "Jason",
    views: 40,
    visibility: "private",
    duration: 245,
  },
  {
    id: "4",
    title: "Travel Diaries",
    thumbnail: "/assets/samples/thumbnail (4).png",
    createdAt: new Date("2025-05-10 13:12:55.321"),
    userImg: "/assets/images/jason.png",
    username: "Jason",
    views: 88,
    visibility: "public",
    duration: 310,
  },
  {
    id: "5",
    title: "Workout Routine",
    thumbnail: "/assets/samples/thumbnail (5).png",
    createdAt: new Date("2025-05-12 18:40:27.019"),
    userImg: "/assets/images/jason.png",
    username: "Jason",
    views: 63,
    visibility: "public",
    duration: 198,
  },
  {
    id: "6",
    title: "Cooking Challenge",
    thumbnail: "/assets/samples/thumbnail (6).png",
    createdAt: new Date("2025-05-15 15:32:19.983"),
    userImg: "/assets/images/jason.png",
    username: "Jason",
    views: 112,
    visibility: "public",
    duration: 274,
  },
  {
    id: "7",
    title: "Behind The Scenes",
    thumbnail: "/assets/samples/thumbnail (7).png",
    createdAt: new Date("2025-05-18 07:48:51.672"),
    userImg: "/assets/images/jason.png",
    username: "Jason",
    views: 57,
    visibility: "private",
    duration: 156,
  },
  {
    id: "8",
    title: "Music Video Edit",
    thumbnail: "/assets/samples/thumbnail (8).png",
    createdAt: new Date("2025-05-20 20:05:33.527"),
    userImg: "/assets/images/jason.png",
    username: "Jason",
    views: 130,
    visibility: "public",
    duration: 322,
  },
];
