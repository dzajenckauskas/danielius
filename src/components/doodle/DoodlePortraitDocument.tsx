import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
} from "@react-pdf/renderer";
import { profile } from "@/data/profile";

export function DoodlePortraitDocument({
  portraitCard,
  aspect,
}: {
  portraitCard: Buffer;
  aspect: number;
}) {
  // Size the page from the card's own aspect ratio so a resized portrait keeps
  // its proportions instead of being stretched to a fixed page.
  const pageWidth = 720;
  const pageHeight = Math.round(pageWidth / (aspect || 900 / 1070));

  const styles = StyleSheet.create({
    page: {
      position: "relative",
      backgroundColor: "#faf9f6",
    },
    artwork: {
      width: pageWidth,
      height: pageHeight,
    },
    websiteLink: {
      position: "absolute",
      top: pageHeight - 34,
      right: 14,
      width: 170,
      height: 26,
      color: "transparent",
      textDecoration: "none",
    },
  });

  return (
    <Document title={`${profile.name} — doodle portrait`} author={profile.name}>
      <Page size={[pageWidth, pageHeight]} style={styles.page} wrap={false}>
        {/* react-pdf's Image is not a DOM image and does not support alt. */}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image src={{ data: portraitCard, format: "jpg" }} style={styles.artwork} cache={false} />
        <Link src="https://zajenckauskas.lt" style={styles.websiteLink}>zajenckauskas.lt</Link>
      </Page>
    </Document>
  );
}
