import type { Room } from "@repo/shared/schemas/rooms.schema";

export const roomImages = ["/room1.webp", "/room2.webp", "/room3.webp", "/room4.webp"];

export function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getRoomSlug(room: Room, allRooms: Room[]) {
  const baseSlug = slugify(room.name);
  const sameNameRooms = allRooms.filter((item) => slugify(item.name) === baseSlug);
  if (sameNameRooms.length < 2) return baseSlug;
  return `${baseSlug}-${sameNameRooms.findIndex((item) => item.id === room.id) + 1}`;
}
