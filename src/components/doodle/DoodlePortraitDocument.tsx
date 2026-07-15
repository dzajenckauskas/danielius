import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
} from "@react-pdf/renderer";
import { profile } from "@/data/profile";

const styles = StyleSheet.create({
  page: {
    position: "relative",
    backgroundColor: "#faf9f6",
  },
  artwork: {
    width: 720,
    height: 856,
  },
  websiteLink: {
    position: "absolute",
    top: 816,
    right: 16,
    width: 125,
    height: 28,
    color: "transparent",
    textDecoration: "none",
  },
});

export function DoodlePortraitDocument({ portraitCard }: { portraitCard: Buffer }) {
  return (
    <Document title={`${profile.name} — doodle portrait`} author={profile.name}>
      <Page size={[720, 856]} style={styles.page} wrap={false}>
        {/* react-pdf's Image is not a DOM image and does not support alt. */}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image src={{ data: portraitCard, format: "jpg" }} style={styles.artwork} cache={false} />
        <Link src="https://zajenckauskas.lt" style={styles.websiteLink}>zajenckauskas.lt</Link>
      </Page>
    </Document>
  );
}
