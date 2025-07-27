// Types
export interface Photo {
  id: number;
  src: string;
  alt: string;
  date: string;
  favorite: boolean;
  location: string;
  size: number; // in bytes
  dimensions: {
    width: number;
    height: number;
  };
  metadata: {
    camera?: string;
    iso?: number;
    aperture?: string;
    shutterSpeed?: string;
  };
  tags: string[];
  albumIds: number[];
  isArchived: boolean;
  isTrashed: boolean;
  expiresOn?: string;
  trashedDate?: string;
  archivedDate?: string;
}

export interface Album {
  id: number;
  name: string;
  description?: string;
  cover: string;
  photoIds: number[];
  count: number;
  createdDate: string;
  updatedDate: string;
  isShared: boolean;
  sharedWith: string[];
  type: "user" | "system" | "shared";
}

export interface SharedAlbum {
  id: number;
  albumId: number;
  sharedBy: string;
  sharedWith: string[];
  permissions: "view" | "contribute" | "edit";
  sharedDate: string;
  inviteLink?: string;
}

export interface Memory {
  id: number;
  title: string;
  description: string;
  cover: string;
  photoIds: number[];
  date: string;
  type: "anniversary" | "trip" | "event" | "seasonal";
}

export interface Category {
  id: number;
  name: string;
  cover: string;
  photoIds: number[];
  type: "people" | "places" | "things" | "animals" | "food" | "events";
}

// Sample locations
const locations = [
  "Mountain View, CA",
  "San Francisco, CA",
  "New York, NY",
  "Seattle, WA",
  "Chicago, IL",
  "Los Angeles, CA",
  "Miami, FL",
  "Austin, TX",
  "Portland, OR",
  "Denver, CO",
];

// Sample camera data
const cameras = [
  "iPhone 14 Pro",
  "Canon EOS R5",
  "Sony A7 IV",
  "Nikon D850",
  "Google Pixel 7",
  "Samsung Galaxy S23",
];

// Sample tags
const tags = [
  "sunset",
  "portrait",
  "landscape",
  "nature",
  "city",
  "food",
  "travel",
  "family",
  "friends",
  "beach",
  "mountain",
  "winter",
  "summer",
  "birthday",
  "wedding",
  "vacation",
  "selfie",
  "art",
  "architecture",
  "street",
];

// Generate photos data
export const photos: Photo[] = Array.from({ length: 200 }, (_, i) => {
  const date = new Date(
    2024,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  );
  const isRecent = i < 50;
  const isTrashed = i >= 180 && i < 190;
  const isArchived = i >= 190 && i < 195;

  return {
    id: i + 1,
    src: `https://picsum.photos/seed/photo${i}/800/600`,
    alt: `Photo ${i + 1}`,
    date: date.toISOString(),
    favorite: Math.random() > 0.85,
    location: locations[Math.floor(Math.random() * locations.length)],
    size: Math.floor(Math.random() * 5000000) + 1000000, // 1-6MB
    dimensions: {
      width: 800 + Math.floor(Math.random() * 400),
      height: 600 + Math.floor(Math.random() * 400),
    },
    metadata: {
      camera:
        Math.random() > 0.3
          ? cameras[Math.floor(Math.random() * cameras.length)]
          : undefined,
      iso:
        Math.random() > 0.5
          ? Math.floor(Math.random() * 3200) + 100
          : undefined,
      aperture:
        Math.random() > 0.5
          ? `f/${(Math.random() * 5 + 1).toFixed(1)}`
          : undefined,
      shutterSpeed:
        Math.random() > 0.5
          ? `1/${Math.floor(Math.random() * 1000) + 10}`
          : undefined,
    },
    tags: Array.from(
      { length: Math.floor(Math.random() * 4) + 1 },
      () => tags[Math.floor(Math.random() * tags.length)]
    ).filter((tag, index, arr) => arr.indexOf(tag) === index),
    albumIds: [], // Will be populated when creating albums
    isArchived,
    isTrashed,
    expiresOn: isRecent ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    trashedDate: isTrashed
      ? new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString()
      : undefined,
    archivedDate: isArchived
      ? new Date(
          Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
        ).toISOString()
      : undefined,
  };
});

// Get active photos (not trashed or archived)
export const activePhotos = photos.filter(
  (photo) => !photo.isTrashed && !photo.isArchived
);

// Get favorite photos
export const favoritePhotos = activePhotos.filter((photo) => photo.favorite);

// Get trashed photos
export const trashedPhotos = photos.filter((photo) => photo.isTrashed);

// Get archived photos
export const archivedPhotos = photos.filter((photo) => photo.isArchived);

// Albums data
export const albums: Album[] = [
  {
    id: 1,
    name: "Favorites",
    description: "Your favorite photos",
    cover:
      favoritePhotos[0]?.src || "https://picsum.photos/seed/album1/400/400",
    photoIds: favoritePhotos.map((p) => p.id),
    count: favoritePhotos.length,
    createdDate: "2024-01-01T00:00:00Z",
    updatedDate: new Date().toISOString(),
    isShared: false,
    sharedWith: [],
    type: "system",
  },
  {
    id: 2,
    name: "Travel Adventures",
    description: "Photos from amazing trips around the world",
    cover: "https://picsum.photos/seed/travel/400/400",
    photoIds: activePhotos
      .filter((p) => p.tags.includes("travel"))
      .map((p) => p.id),
    count: activePhotos.filter((p) => p.tags.includes("travel")).length,
    createdDate: "2024-02-15T00:00:00Z",
    updatedDate: "2024-03-20T00:00:00Z",
    isShared: true,
    sharedWith: ["friend1@email.com", "family@email.com"],
    type: "user",
  },
  {
    id: 3,
    name: "Family Moments",
    description: "Precious family memories",
    cover: "https://picsum.photos/seed/family/400/400",
    photoIds: activePhotos
      .filter((p) => p.tags.includes("family"))
      .map((p) => p.id),
    count: activePhotos.filter((p) => p.tags.includes("family")).length,
    createdDate: "2024-01-10T00:00:00Z",
    updatedDate: "2024-07-15T00:00:00Z",
    isShared: false,
    sharedWith: [],
    type: "user",
  },
  {
    id: 4,
    name: "Nature & Landscapes",
    description: "Beautiful natural scenery",
    cover: "https://picsum.photos/seed/nature/400/400",
    photoIds: activePhotos
      .filter((p) => p.tags.includes("nature") || p.tags.includes("landscape"))
      .map((p) => p.id),
    count: activePhotos.filter(
      (p) => p.tags.includes("nature") || p.tags.includes("landscape")
    ).length,
    createdDate: "2024-03-05T00:00:00Z",
    updatedDate: "2024-06-30T00:00:00Z",
    isShared: false,
    sharedWith: [],
    type: "user",
  },
  {
    id: 5,
    name: "Food & Dining",
    description: "Delicious meals and culinary experiences",
    cover: "https://picsum.photos/seed/food/400/400",
    photoIds: activePhotos
      .filter((p) => p.tags.includes("food"))
      .map((p) => p.id),
    count: activePhotos.filter((p) => p.tags.includes("food")).length,
    createdDate: "2024-04-12T00:00:00Z",
    updatedDate: "2024-07-20T00:00:00Z",
    isShared: true,
    sharedWith: ["foodie@email.com"],
    type: "user",
  },
  {
    id: 6,
    name: "Special Events",
    description: "Birthdays, weddings, and celebrations",
    cover: "https://picsum.photos/seed/events/400/400",
    photoIds: activePhotos
      .filter((p) => p.tags.includes("birthday") || p.tags.includes("wedding"))
      .map((p) => p.id),
    count: activePhotos.filter(
      (p) => p.tags.includes("birthday") || p.tags.includes("wedding")
    ).length,
    createdDate: "2024-05-01T00:00:00Z",
    updatedDate: "2024-07-25T00:00:00Z",
    isShared: false,
    sharedWith: [],
    type: "user",
  },
];

// Update photo album associations
activePhotos.forEach((photo) => {
  albums.forEach((album) => {
    if (album.photoIds.includes(photo.id)) {
      photo.albumIds.push(album.id);
    }
  });
});

// Shared albums data
export const sharedAlbums: SharedAlbum[] = [
  {
    id: 1,
    albumId: 2,
    sharedBy: "you@email.com",
    sharedWith: ["friend1@email.com", "family@email.com"],
    permissions: "contribute",
    sharedDate: "2024-02-20T00:00:00Z",
    inviteLink: "https://photos.app/shared/abc123",
  },
  {
    id: 2,
    albumId: 5,
    sharedBy: "you@email.com",
    sharedWith: ["foodie@email.com"],
    permissions: "view",
    sharedDate: "2024-04-15T00:00:00Z",
    inviteLink: "https://photos.app/shared/def456",
  },
  {
    id: 3,
    albumId: 7, // Received shared album
    sharedBy: "friend@email.com",
    sharedWith: ["you@email.com"],
    permissions: "contribute",
    sharedDate: "2024-06-01T00:00:00Z",
  },
];

// Add received shared album
albums.push({
  id: 7,
  name: "John's Vacation",
  description: "Shared album from John's recent trip",
  cover: "https://picsum.photos/seed/shared1/400/400",
  photoIds: activePhotos.slice(50, 70).map((p) => p.id),
  count: 20,
  createdDate: "2024-05-25T00:00:00Z",
  updatedDate: "2024-06-10T00:00:00Z",
  isShared: true,
  sharedWith: ["you@email.com"],
  type: "shared",
});

// Memories data
export const memories: Memory[] = [
  {
    id: 1,
    title: "This Day Last Year",
    description: "Photos from exactly one year ago",
    cover: "https://picsum.photos/seed/memory1/600/400",
    photoIds: activePhotos.slice(0, 12).map((p) => p.id),
    date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    type: "anniversary",
  },
  {
    id: 2,
    title: "Summer Memories",
    description: "Your best summer moments",
    cover: "https://picsum.photos/seed/summer/600/400",
    photoIds: activePhotos
      .filter((p) => p.tags.includes("summer"))
      .slice(0, 25)
      .map((p) => p.id),
    date: "2024-08-15T00:00:00Z",
    type: "seasonal",
  },
  {
    id: 3,
    title: "Weekend Trip to Mountains",
    description: "Adventure in the great outdoors",
    cover: "https://picsum.photos/seed/mountain/600/400",
    photoIds: activePhotos
      .filter((p) => p.tags.includes("mountain"))
      .slice(0, 18)
      .map((p) => p.id),
    date: "2024-06-20T00:00:00Z",
    type: "trip",
  },
  {
    id: 4,
    title: "Birthday Celebration",
    description: "Special moments from the birthday party",
    cover: "https://picsum.photos/seed/birthday/600/400",
    photoIds: activePhotos
      .filter((p) => p.tags.includes("birthday"))
      .slice(0, 15)
      .map((p) => p.id),
    date: "2024-03-10T00:00:00Z",
    type: "event",
  },
];

// Categories data for explore section
export const categories: Category[] = [
  {
    id: 1,
    name: "People",
    cover: "https://picsum.photos/seed/people/300/300",
    photoIds: activePhotos
      .filter((p) => p.tags.includes("portrait") || p.tags.includes("selfie"))
      .map((p) => p.id),
    type: "people",
  },
  {
    id: 2,
    name: "Places",
    cover: "https://picsum.photos/seed/places/300/300",
    photoIds: activePhotos
      .filter((p) => p.tags.includes("city") || p.tags.includes("travel"))
      .map((p) => p.id),
    type: "places",
  },
  {
    id: 3,
    name: "Things",
    cover: "https://picsum.photos/seed/things/300/300",
    photoIds: activePhotos
      .filter((p) => p.tags.includes("art") || p.tags.includes("architecture"))
      .map((p) => p.id),
    type: "things",
  },
  {
    id: 4,
    name: "Animals",
    cover: "https://picsum.photos/seed/animals/300/300",
    photoIds: activePhotos
      .filter((_, i) => i % 8 === 0)
      .slice(0, 25)
      .map((p) => p.id), // Random selection
    type: "animals",
  },
  {
    id: 5,
    name: "Food",
    cover: "https://picsum.photos/seed/food-cat/300/300",
    photoIds: activePhotos
      .filter((p) => p.tags.includes("food"))
      .map((p) => p.id),
    type: "food",
  },
  {
    id: 6,
    name: "Events",
    cover: "https://picsum.photos/seed/events-cat/300/300",
    photoIds: activePhotos
      .filter((p) => p.tags.includes("wedding") || p.tags.includes("birthday"))
      .map((p) => p.id),
    type: "events",
  },
];

// Utility functions
export const getPhotoById = (id: number): Photo | undefined => {
  return photos.find((photo) => photo.id === id);
};

export const getAlbumById = (id: number): Album | undefined => {
  return albums.find((album) => album.id === id);
};

export const getPhotosByAlbumId = (albumId: number): Photo[] => {
  const album = getAlbumById(albumId);
  if (!album) return [];
  return photos.filter((photo) => album.photoIds.includes(photo.id));
};

export const getPhotosByCategory = (
  categoryType: Category["type"]
): Photo[] => {
  const category = categories.find((cat) => cat.type === categoryType);
  if (!category) return [];
  return photos.filter((photo) => category.photoIds.includes(photo.id));
};

export const groupPhotosByDate = (photos: Photo[]) => {
  const groups: Record<string, Photo[]> = {};

  photos.forEach((photo) => {
    const date = new Date(photo.date);
    const monthYear = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }

    groups[monthYear].push(photo);
  });

  return Object.entries(groups)
    .map(([date, photos]) => ({
      date,
      photos: photos.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    }))
    .sort(
      (a, b) =>
        new Date(b.photos[0].date).getTime() -
        new Date(a.photos[0].date).getTime()
    );
};

export const searchPhotos = (query: string): Photo[] => {
  const searchTerm = query.toLowerCase();
  return activePhotos.filter(
    (photo) =>
      photo.alt.toLowerCase().includes(searchTerm) ||
      photo.location.toLowerCase().includes(searchTerm) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
      photo.metadata.camera?.toLowerCase().includes(searchTerm)
  );
};

// Export all data as default
export default {
  photos,
  activePhotos,
  favoritePhotos,
  trashedPhotos,
  archivedPhotos,
  albums,
  sharedAlbums,
  memories,
  categories,
  getPhotoById,
  getAlbumById,
  getPhotosByAlbumId,
  getPhotosByCategory,
  groupPhotosByDate,
  searchPhotos,
};
