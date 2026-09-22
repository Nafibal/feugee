/**
 * The work module's public interface: one card mapper shared by every card
 * surface, plus the Asset-level visual helpers those surfaces and the
 * Work Detail hero consume. Everything else (the guard chain, the
 * video/poster discrimination, the aspect fallbacks) is implementation.
 */
export { toCardWork, type CardWork } from "./cardWork";
export {
  asAssetsSelect,
  asClientsSelect,
  asWorkSelect,
  cardAssetSelect,
  clientsSelect,
  listingWorksSelect,
  otherWorksSelect,
  selectedWorksSelect,
  type SelectShape,
} from "./cardSelect";
export {
  sizedUrlOf,
  VIDEO_ASPECT_FALLBACK,
  videoPosterOf,
  workFeatureVisualOf,
  workThumbnailOf,
  type AssetSizeName,
  type CardVisual,
} from "./visual";
