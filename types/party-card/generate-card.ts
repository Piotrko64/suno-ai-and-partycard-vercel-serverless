import { z } from "zod";

const ColorWithGradient = z
  .string()
  .describe(
    `HEX (np. "#FFFFFF") lub gradient (np. "linear-gradient(110deg, rgb(255, 0, 0) 0%, rgb(188, 16, 231) 50%, rgb(94, 146, 208) 100%)"). Jeśli isGradient=true, użyj gradientu.`
  );

const NamesFont = z.enum([
  "Oswald",
  "Noto Serif",
  "Aboreto",
  "Jost",
  "Kaushan",
  "Playfair",
]);

const SafeFont = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  return val;
}, NamesFont.default("Oswald"));

const SingleText = z.object({ id: z.string(), content: z.string() });
const ListTexts = z.array(SingleText);

const TagCloudType = z.object({
  name: z.literal("tagCloud"),
  id: z.string(),
  texts: ListTexts,
  color: z.string(),
  font: SafeFont,
});
const WallWishType = z.object({
  name: z.literal("wishWall"),
  id: z.string(),
  texts: ListTexts,
  color: z.string(),
  font: SafeFont,
});
const ImageURLType = z.object({
  name: z.literal("imageURL"),
  id: z.string(),
  isBorder: z.boolean(),
  backgroundColor: z.string(),
  url: z.string(),
});
const GifSectionType = z.object({
  name: z.literal("gif"),
  id: z.string(),
  url: z.string(),
});
const TextType = z.object({
  name: z.literal("text"),
  id: z.string(),
  size: z.enum(["normal", "medium", "theBiggest"]),
  text: z.string(),
  isFullWidth: z.boolean(),
  color: ColorWithGradient,
  backgroundColor: z.string(),
  font: SafeFont,
  marginTop: z.number(),
  marginBottom: z.number(),
  isGradient: z.boolean(),
});

const UnionWishElements = z.union([
  TagCloudType,
  WallWishType,
  ImageURLType,
  GifSectionType,
  TextType,
]);

const HeaderSection = z.object({
  isActive: z.boolean(),
  name: z.object({
    isActive: z.boolean(),
    text: z.string(),
    color: ColorWithGradient,
    isGradient: z.boolean(),
    isStrokeColor: z.boolean(),
    strokeColor: z.string(),
    font: SafeFont,
  }),
  supriseCard: z.object({
    isActive: z.boolean(),
    isShowCard: z.boolean(),
    text: z.string(),
    color: z.string(),
    backgroundColor: z.string(),
    font: SafeFont,
  }),
  textAboveName: z.object({
    isActive: z.boolean(),
    text: z.string(),
    color: ColorWithGradient,
    font: SafeFont,
    isGradient: z.boolean(),
  }),
  textUnderName: z.object({
    isActive: z.boolean(),
    text: z.string(),
    color: ColorWithGradient,
    font: SafeFont,
    isGradient: z.boolean(),
  }),
  gif: z.object({ isShow: z.boolean(), url: z.string() }),
  endText: z.object({
    isActive: z.boolean(),
    font: SafeFont,
    text: z.string(),
    color: z.string(),
  }),
});

const BackgroundStore = z.object({
  background: z.object({ color: z.string() }),
  confetti: z.object({
    onStart: z.boolean(),
    buttonConfetti: z.boolean(),
    amountConfetti: z.number(),
    isActive: z.boolean(),
  }),
  backgroundDecorations: z.object({
    isDecorations: z.boolean(),
    kindDecorations: z.string(),
    color: z.string(),
  }),
  fireworks: z.object({
    isFireworks: z.boolean(),
    intensity: z.number(),
  }),
});

export const GeneratedJsonSchema = z.object({
  idAuthor: z.string(),
  nameAuthor: z.string(),
  date: z.string(),
  headerSection: HeaderSection,
  backgroundSection: BackgroundStore,
  wishesSection: z.array(UnionWishElements),
});
