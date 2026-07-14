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
    height: 900,
  },
  socialLink: {
    position: "absolute",
    top: 826,
    width: 40,
    height: 40,
    color: "transparent",
    textDecoration: "none",
  },
  github: { left: 559 },
  linkedin: { left: 609 },
  mail: { left: 659 },
});

export function DoodlePortraitDocument({ portraitCard }: { portraitCard: Buffer }) {
  return (
    <Document title={`${profile.name} — doodle portrait`} author={profile.name}>
      <Page size={[720, 900]} style={styles.page} wrap={false}>
        {/* react-pdf's Image is not a DOM image and does not support alt. */}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image src={{ data: portraitCard, format: "png" }} style={styles.artwork} cache={false} />
        <Link src={profile.github} style={[styles.socialLink, styles.github]}>GitHub</Link>
        <Link src={profile.linkedin} style={[styles.socialLink, styles.linkedin]}>LinkedIn</Link>
        <Link src={`mailto:${profile.email}`} style={[styles.socialLink, styles.mail]}>Email</Link>
      </Page>
    </Document>
  );
}
