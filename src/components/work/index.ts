/**
 * The work module's public interface: one card mapper shared by every card
 * surface, plus the Asset-level thumbnail helpers those surfaces and the
 * Work Detail hero consume. Everything else (the guard chain, the
 * video/poster discrimination, the aspect fallbacks) is implementation.
 */
export { toCardWork, type CardWork } from "./cardWork";
export {
  VIDEO_ASPECT_FALLBACK,
  videoPosterOf,
  workThumbnailOf,
  type WorkThumbnail,
} from "./thumbnail";
