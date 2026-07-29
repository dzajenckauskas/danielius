import path from "node:path";
import {
  Circle,
  Defs,
  Document,
  Font,
  Image,
  Link,
  Page,
  Path,
  RadialGradient,
  Stop,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  education,
  experience,
  interests,
  languages,
  profile,
  skillGroups,
} from "@/data/profile";
import { projects } from "@/data/projects";

const publicPath = (...parts: string[]) => path.join(process.cwd(), "public", ...parts);

Font.register({
  family: "Neris",
  fonts: [
    { src: publicPath("fonts", "neris", "Neris-Light.otf"), fontWeight: 300 },
    { src: publicPath("fonts", "neris", "Neris-SemiBold.otf"), fontWeight: 600 },
    { src: publicPath("fonts", "neris", "Neris-Black.otf"), fontWeight: 900 },
    {
      src: publicPath("fonts", "neris", "Neris-LightItalic.otf"),
      fontWeight: 300,
      fontStyle: "italic",
    },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const colors = {
  paper: "#f8f6f3",
  text: "#181a1c",
  muted: "#55595d",
  subtle: "#84888b",
  ink: "#527770",
  inkStrong: "#3d5d57",
  sage: "#e5ede7",
  lilac: "#eee8f2",
  sand: "#eee4cf",
  rose: "#e3c3cd",
  ochre: "#dcc394",
  surface: "#fdfcfb",
  border: "#dfdcd6",
};

const styles = StyleSheet.create({
  page: {
    position: "relative",
    minHeight: 841.89,
    flexShrink: 0,
    paddingTop: 38,
    paddingRight: 42,
    paddingBottom: 34,
    paddingLeft: 42,
    backgroundColor: colors.paper,
    color: colors.text,
    fontFamily: "Neris",
    fontSize: 8.2,
    fontWeight: 300,
    lineHeight: 1.38,
  },
  pageAtmosphere: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 595.28,
    height: 841.89,
  },
  header: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.7,
    borderBottomColor: colors.border,
    paddingBottom: 18,
    marginBottom: 20,
  },
  headerIdentity: { flexDirection: "row", alignItems: "center", width: 355 },
  photoWrap: {
    position: "relative",
    width: 104,
    height: 104,
    marginRight: 15,
  },
  portraitAtmosphere: {
    position: "absolute",
    left: -78,
    top: -17,
    width: 206,
    height: 145,
  },
  portraitGreenBlob: {
    position: "absolute",
    left: -15,
    top: -45,
    width: 200,
    height: 260,
  },
  portraitHighlight: {
    position: "absolute",
    left: -20,
    top: 7,
    width: 73,
    height: 73,
  },
  photo: {
    position: "relative",
    width: 104,
    height: 104,
    borderRadius: 6,
    objectFit: "cover",
  },
  name: {
    fontSize: 23.5,
    fontWeight: 900,
    letterSpacing: 3.1,
    lineHeight: 1.02,
  },
  role: {
    marginTop: 7,
    color: colors.inkStrong,
    fontSize: 8.2,
    fontWeight: 600,
    letterSpacing: 0.55,
  },
  roleLocationRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  headerContact: { position: "relative", width: 150, alignItems: "flex-end", alignSelf: "flex-start" },
  contactBlob: { position: "absolute", right: -126, top: -148, width: 420, height: 320 },
  contactRow: { flexDirection: "row", alignItems: "center", marginBottom: 3.5 },
  contactIcon: { marginRight: 3 },
  contactLink: {
    color: colors.text,
    fontSize: 7,
    textDecoration: "none",
  },
  headerLocation: { color: colors.subtle, fontSize: 6.5, letterSpacing: 0.5 },
  columns: { flexDirection: "row", alignItems: "flex-start" },
  sidebar: {
    width: 158,
    height: 590,
    marginRight: 23,
  },
  main: { width: 330 },
  sectionLabel: {
    marginBottom: 9,
    color: colors.inkStrong,
    fontSize: 8.2,
    fontWeight: 900,
    letterSpacing: 2.35,
    lineHeight: 1,
    textTransform: "uppercase",
  },
  sidebarSection: {
    borderTopWidth: 0.55,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginBottom: 26,
  },
  sidebarFirstSection: {
    paddingTop: 0,
    marginBottom: 26,
  },
  languageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  languageName: { fontSize: 7.9, fontWeight: 600 },
  languageLevel: { color: colors.subtle, fontSize: 7.35 },
  capability: { marginBottom: 9.5 },
  capabilityTitle: { marginBottom: 2.8, fontSize: 7.7, fontWeight: 600 },
  capabilityItems: { color: colors.muted, fontSize: 6.9, lineHeight: 1.42 },
  availability: {
    position: "relative",
    marginTop: "auto",
    paddingTop: 12,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 12,
  },
  availabilityBlob: {
    position: "absolute",
    left: -120,
    top: -100,
    width: 320,
    height: 250,
  },
  availabilityTitle: { marginBottom: 4, color: colors.inkStrong, fontSize: 6.8, fontWeight: 600 },
  availabilityText: { color: colors.muted, fontSize: 7, lineHeight: 1.45 },
  summaryLead: {
    marginBottom: 9,
    fontSize: 11.7,
    fontWeight: 600,
    lineHeight: 1.28,
  },
  summaryParagraph: { marginBottom: 7.5, color: colors.muted, fontSize: 8, lineHeight: 1.48 },
  mainSection: { marginBottom: 36 },
  experienceEntry: {
    position: "relative",
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingLeft: 12,
    marginBottom: 15,
  },
  experienceDot: {
    position: "absolute",
    top: 2,
    left: -3.5,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.ink,
  },
  entryHeader: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  experienceTitle: { fontSize: 9.1, fontWeight: 600 },
  entryPeriod: { color: colors.subtle, fontSize: 6.5, fontStyle: "italic" },
  experienceText: { marginTop: 5, color: colors.muted, fontSize: 7.45, lineHeight: 1.46 },
  metricStrip: {
    flexDirection: "row",
    borderWidth: 0.6,
    borderColor: colors.border,
    borderRadius: 11,
    backgroundColor: colors.surface,
  },
  metric: { flexGrow: 1, width: 110, paddingTop: 9, paddingBottom: 10, alignItems: "center" },
  metricBorder: { borderLeftWidth: 0.6, borderLeftColor: colors.border },
  metricValue: { color: colors.inkStrong, fontSize: 14, fontWeight: 900 },
  metricLabel: { marginTop: 7, color: colors.subtle, fontSize: 5.5 },
  pageFooter: {
    position: "absolute",
    right: 42,
    bottom: 22,
    color: colors.subtle,
    fontSize: 6.2,
    letterSpacing: 0.8,
  },
  pageTwoHeader: {
    position: "relative",
    borderBottomWidth: 0.7,
    borderBottomColor: colors.border,
    paddingBottom: 13,
    marginBottom: 8,
  },
  pageTwoContact: { position: "absolute", top: 0, right: 0, width: 150, alignItems: "flex-end" },
  pageTwoEyebrow: {
    marginBottom: 4,
    color: colors.inkStrong,
    fontSize: 7,
    fontWeight: 600,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  pageTwoTitle: {
    fontSize: 20.5,
    fontWeight: 900,
    letterSpacing: -0.2,
    lineHeight: 1.14,
  },
  pageTwoIntro: { marginTop: 6, color: colors.muted, fontSize: 7.6 },
  projectEntry: {
    borderBottomWidth: 0.55,
    borderBottomColor: colors.border,
    paddingTop: 6,
    paddingBottom: 6,
  },
  projectHeader: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  projectName: { color: colors.text, fontSize: 9.3, fontWeight: 600, textDecoration: "none" },
  projectMeta: { color: colors.subtle, fontSize: 6.4 },
  projectSummary: { marginTop: 3, color: colors.muted, fontSize: 7.2, lineHeight: 1.36 },
  projectEvidence: { marginTop: 3, color: colors.text, fontSize: 6.9, lineHeight: 1.34 },
  projectEvidenceLabel: { color: colors.inkStrong, fontWeight: 600 },
  projectDetails: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: 3.5,
  },
  projectStack: { color: colors.inkStrong, fontSize: 6.35 },
  projectUrl: {
    marginLeft: 10,
    color: colors.inkStrong,
    fontSize: 6.35,
    fontWeight: 600,
    textDecoration: "none",
  },
  supportingGrid: { flexDirection: "row", marginTop: 18 },
  supportingColumn: { width: 245 },
  supportingColumnRight: { width: 245, marginLeft: 21 },
  supportEntry: { marginBottom: 17 },
  supportTitle: { marginBottom: 2.2, fontSize: 7.9, fontWeight: 600 },
  supportMeta: { marginBottom: 3, color: colors.subtle, fontSize: 6.35, fontStyle: "italic" },
  educationMeta: { marginBottom: 1.25 },
  supportBody: { color: colors.muted, fontSize: 7, lineHeight: 1.42 },
  inlineText: { color: colors.muted, fontSize: 7.2, lineHeight: 1.55 },
  footerContact: {
    position: "absolute",
    right: 42,
    bottom: 21,
    left: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderTopWidth: 0.55,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  footerPage: { color: colors.subtle, fontSize: 6.2, letterSpacing: 0.8 },
});

function PageAtmosphere({ page }: { page: 1 | 2 }) {
  return (
    <Svg style={styles.pageAtmosphere} viewBox="0 0 595 842">
      <Defs>
        <RadialGradient id={`green-wash-${page}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#dbe7d9" stopOpacity="0.62" />
          <Stop offset="48%" stopColor="#e8efe5" stopOpacity="0.34" />
          <Stop offset="100%" stopColor={colors.paper} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id={`lilac-wash-${page}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#e8e2f0" stopOpacity="0.55" />
          <Stop offset="52%" stopColor="#f0ecf4" stopOpacity="0.3" />
          <Stop offset="100%" stopColor={colors.paper} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id={`rose-wash-${page}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#e6c9d2" stopOpacity="0.5" />
          <Stop offset="65%" stopColor="#eedde2" stopOpacity="0.22" />
          <Stop offset="100%" stopColor={colors.paper} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id={`ochre-wash-${page}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#ddc296" stopOpacity="0.46" />
          <Stop offset="35%" stopColor="#e6d3ac" stopOpacity="0.28" />
          <Stop offset="100%" stopColor={colors.paper} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id={`sage-wash-${page}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#cddccb" stopOpacity="0.4" />
          <Stop offset="55%" stopColor="#dbe6d8" stopOpacity="0.2" />
          <Stop offset="100%" stopColor={colors.paper} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      {page === 1 ? (
        <>
          <Circle cx="486" cy="116" r="176" fill="url(#green-wash-1)" />
          <Circle cx="475" cy="688" r="205" fill="url(#lilac-wash-1)" />
          <Circle cx="10" cy="480" r="155" fill="url(#rose-wash-1)" />
          <Circle cx="90" cy="840" r="115" fill="url(#ochre-wash-1)" />
          <Circle cx="345" cy="770" r="95" fill="url(#sage-wash-1)" />
        </>
      ) : (
        <>
          <Circle cx="456" cy="70" r="174" fill="url(#green-wash-2)" />
          <Circle cx="48" cy="635" r="184" fill="url(#lilac-wash-2)" />
          <Circle cx="580" cy="480" r="165" fill="url(#rose-wash-2)" />
          <Circle cx="55" cy="110" r="105" fill="url(#ochre-wash-2)" />
          <Circle cx="510" cy="810" r="125" fill="url(#sage-wash-2)" />
        </>
      )}
    </Svg>
  );
}

function MailIcon() {
  return (
    <Svg style={styles.contactIcon} width={7.5} height={7.5} viewBox="0 0 16 16">
      <Path
        d="M1.5 3.5 H14.5 V12.5 H1.5 Z M1.5 3.5 L8 9 L14.5 3.5"
        fill="none"
        stroke={colors.ink}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LinkIcon() {
  return (
    <Svg style={styles.contactIcon} width={7.5} height={7.5} viewBox="0 0 16 16">
      <Path
        d="M6.2 3 H13 V9.8"
        fill="none"
        stroke={colors.ink}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13 3 L3 13"
        fill="none"
        stroke={colors.ink}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ContactBlob() {
  return (
    <Svg style={styles.contactBlob} viewBox="0 0 420 320">
      <Defs>
        <RadialGradient id="contact-rose" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#e3c3cd" stopOpacity="0.6" />
          <Stop offset="60%" stopColor="#eedde2" stopOpacity="0.4" />
          <Stop offset="100%" stopColor={colors.paper} stopOpacity="0" />
        </RadialGradient>
        {/* <RadialGradient id="contact-sage" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#cddccb" stopOpacity="0.46" />
          <Stop offset="60%" stopColor="#e2ebe0" stopOpacity="0.38" />
          <Stop offset="100%" stopColor={colors.paper} stopOpacity="0" />
        </RadialGradient> */}
      </Defs>
      <Circle cx="250" cy="150" r="115" fill="url(#contact-rose)" />
      <Circle cx="110" cy="160" r="75" fill="url(#contact-sage)" />
    </Svg>
  );
}

function AvailabilityBlob() {
  return (
    <Svg style={styles.availabilityBlob} viewBox="0 0 320 250">
      <Defs>
        <RadialGradient id="availability-sage" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#b7cfb0" stopOpacity="0.95" />
          <Stop offset="55%" stopColor="#d3e2cd" stopOpacity="0.7" />
          <Stop offset="100%" stopColor={colors.paper} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="availability-lilac" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#d4c3e2" stopOpacity="0.75" />
          <Stop offset="60%" stopColor="#e6d9ee" stopOpacity="0.45" />
          <Stop offset="100%" stopColor={colors.paper} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx="155" cy="148" r="118" fill="url(#availability-sage)" />
      <Circle cx="230" cy="170" r="75" fill="url(#availability-lilac)" />
    </Svg>
  );
}

function PinIcon() {
  return (
    <Svg style={styles.contactIcon} width={7.5} height={7.5} viewBox="0 0 16 16">
      <Path
        d="M8 1.6 C4.8 1.6 2.4 4.1 2.4 7.1 C2.4 11.2 8 14.7 8 14.7 C8 14.7 13.6 11.2 13.6 7.1 C13.6 4.1 11.2 1.6 8 1.6 Z"
        fill="none"
        stroke={colors.subtle}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <Circle cx="8" cy="7.1" r="1.9" fill="none" stroke={colors.subtle} strokeWidth="1.1" />
    </Svg>
  );
}

function HeaderCallout() {
  return (
    <Svg style={{ position: "absolute", left: 0, top: 14, width: 511, height: 92 }} viewBox="0 0 511 92">
      <Path
        d="M72 61 C81.7 54.2 110.3 20.5 130 20 C149.7 19.5 170 56 190 58 C210 60 230 32.5 250 32 C270 31.5 291.7 54.5 310 55 C328.3 55.5 345.8 42.5 360 35 C374.2 27.5 389.2 14.2 395 10"
        fill="none"
        stroke={colors.ink}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <Path
        d="M391 20 L395 10 L384 10"
        fill="none"
        stroke={colors.ink}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.65"
      />
    </Svg>
  );
}

function PageOne() {
  const relevantExperience = experience.slice(0, 2);

  return (
    <Page size="A4" style={styles.page} wrap={false}>
      <PageAtmosphere page={1} />

      <View style={styles.header}>
        <HeaderCallout />
        <View style={styles.headerIdentity}>
          <View style={styles.photoWrap}>
            <Svg style={styles.portraitGreenBlob} viewBox="0 0 260 260">
              <Defs>
                <RadialGradient id="portrait-green" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#6f9183" stopOpacity="0.6" />
                  <Stop offset="55%" stopColor="#91aaa0" stopOpacity="0.35" />
                  <Stop offset="100%" stopColor={colors.paper} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Path
                d="M218.8,130 C218.8,107.8 188.8,77.8 165.4,63.7 C141.7,49.6 98.5,35.2 78.7,46 C58.6,57.1 44.5,103.6 45.4,130 C46.3,156.4 63.7,193.9 83.8,205 C103.6,216.1 142.9,208.9 165.4,196.3 C187.6,183.7 218.8,152.2 218.8,130 Z"
                fill="url(#portrait-green)"
              />
            </Svg>
            {/* react-pdf's Image is not a DOM image and does not support alt. */}
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image style={styles.photo} src={publicPath("avatar.png")} />
            <Svg style={styles.portraitAtmosphere} viewBox="0 0 130 136">
              <Defs>
                <RadialGradient id="portrait-sage" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#ecdd8e" stopOpacity="0.5" />
                  <Stop offset="52%" stopColor="#f5edc0" stopOpacity="0.28" />
                  <Stop offset="100%" stopColor={colors.paper} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Circle cx="34" cy="36" r="28" fill="url(#portrait-sage)" />
            </Svg>
            <Svg style={styles.portraitHighlight} viewBox="0 0 24 24">
              <Defs>
                <RadialGradient id="portrait-light" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#f0a9c4" stopOpacity="0.5" />
                  <Stop offset="55%" stopColor="#f3bcd2" stopOpacity="0.26" />
                  <Stop offset="100%" stopColor="#f3bcd2" stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Circle cx="12" cy="12" r="12" fill="url(#portrait-light)" />
            </Svg>
          </View>
          <View>
            <Text style={styles.name}>DANIELIUS</Text>
            <Text style={styles.name}>ZAJENČKAUSKAS</Text>
            <Text style={styles.role}>{profile.role.toUpperCase()}</Text>
            <View style={styles.roleLocationRow}>
              <PinIcon />
              <Text style={styles.headerLocation}>{profile.location.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerContact}>
          <ContactBlob />
          <View style={styles.contactRow}>
            <MailIcon />
            <Link style={styles.contactLink} src={`mailto:${profile.email}`}>{profile.email}</Link>
          </View>
          <View style={[styles.contactRow, { marginBottom: 0 }]}>
            <LinkIcon />
            <Link style={styles.contactLink} src="https://zajenckauskas.lt">zajenckauskas.lt</Link>
          </View>
        </View>
      </View>

      <View style={styles.columns}>
        <View style={styles.sidebar}>
          <View style={styles.sidebarFirstSection}>
            <Text style={styles.sectionLabel}>Capabilities</Text>
            {skillGroups.map((group) => (
              <View key={group.label} style={styles.capability}>
                <Text style={styles.capabilityTitle}>{group.label}</Text>
                <Text style={styles.capabilityItems}>{group.items.join(" · ")}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sidebarSection}>
            <Text style={styles.sectionLabel}>Languages</Text>
            {languages.map((language) => (
              <View key={language.name} style={styles.languageRow}>
                <Text style={styles.languageName}>{language.name}</Text>
                <Text style={styles.languageLevel}>{language.level}</Text>
              </View>
            ))}
          </View>

          <View style={styles.availability}>
            <AvailabilityBlob />
            <Text style={styles.availabilityTitle}>CURRENT FOCUS</Text>
            <Text style={styles.availabilityText}>
              Product engineering roles involving complex workflows, shared systems and long-term product quality.
            </Text>
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.mainSection}>
            <Text style={styles.sectionLabel}>Profile</Text>
            <Text style={styles.summaryLead}>{profile.tagline}</Text>
            {profile.about.slice(0, 2).map((paragraph) => (
              <Text key={paragraph} style={styles.summaryParagraph}>{paragraph}</Text>
            ))}
          </View>

          <View style={styles.mainSection}>
            <Text style={styles.sectionLabel}>Relevant experience</Text>
            {relevantExperience.map((entry) => (
              <View key={`${entry.title}-${entry.org}`} style={styles.experienceEntry}>
                <View style={styles.experienceDot} />
                <View style={styles.entryHeader}>
                  <Text style={styles.experienceTitle}>{entry.title}{entry.org ? ` · ${entry.org}` : ""}</Text>
                  <Text style={styles.entryPeriod}>{entry.period.split(" · ")[0]}</Text>
                </View>
                {entry.description && <Text style={styles.experienceText}>{entry.description}</Text>}
              </View>
            ))}
          </View>

          <View>
            <Text style={styles.sectionLabel}>Engineering scope</Text>
            <View style={styles.metricStrip}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>35</Text>
                <Text style={styles.metricLabel}>ENTERPRISE APPS</Text>
              </View>
              <View style={[styles.metric, styles.metricBorder]}>
                <Text style={styles.metricValue}>12</Text>
                <Text style={styles.metricLabel}>SHARED PACKAGES</Text>
              </View>
              <View style={[styles.metric, styles.metricBorder]}>
                <Text style={styles.metricValue}>7</Text>
                <Text style={styles.metricLabel}>SELECTED CASE STUDIES</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.pageFooter}>01 / 02</Text>
    </Page>
  );
}

function PageTwo() {
  const otherExperience = experience.slice(2);

  return (
    <Page size="A4" style={styles.page} wrap={false}>
      <PageAtmosphere page={2} />

      <View style={styles.pageTwoHeader}>
        <Text style={styles.pageTwoEyebrow}>Selected work</Text>
        <Text style={styles.pageTwoTitle}>Products built around real workflows.</Text>
        <Text style={styles.pageTwoIntro}>Challenge, contribution and technical evidence from commercial and independent products.</Text>
        <View style={styles.pageTwoContact}>
          <ContactBlob />
          <View style={styles.contactRow}>
            <MailIcon />
            <Link style={styles.contactLink} src={`mailto:${profile.email}`}>{profile.email}</Link>
          </View>
          <View style={[styles.contactRow, { marginBottom: 0 }]}>
            <LinkIcon />
            <Link style={styles.contactLink} src="https://zajenckauskas.lt">zajenckauskas.lt</Link>
          </View>
        </View>
      </View>

      <View>
        {projects.map((project) => (
          <View key={project.slug} style={styles.projectEntry}>
            <View style={styles.projectHeader}>
              {project.url ? (
                <Link style={styles.projectName} src={project.url}>{project.name}</Link>
              ) : (
                <Text style={styles.projectName}>{project.name}</Text>
              )}
              <Text style={styles.projectMeta}>{project.year} · {project.role}</Text>
            </View>
            <Text style={styles.projectSummary}>{project.summary}</Text>
            <Text style={styles.projectEvidence}>
              <Text style={styles.projectEvidenceLabel}>Evidence: </Text>
              {project.contribution[0]}
            </Text>
            <View style={styles.projectDetails}>
              <Text style={styles.projectStack}>{project.stack.slice(0, 5).join("  ·  ")}</Text>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                {project.url && (
                  <Link style={styles.projectUrl} src={project.url}>{project.domain} ↗</Link>
                )}
                {project.repository && (
                  <Link style={styles.projectUrl} src={project.repository}>Code ↗</Link>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.supportingGrid}>
        <View style={styles.supportingColumn}>
          <Text style={styles.sectionLabel}>Education</Text>
          {education.map((entry) => (
            <View key={`${entry.title}-${entry.org}`} style={styles.supportEntry}>
              <Text style={styles.supportTitle}>{entry.org || entry.title}</Text>
              <Text style={[styles.supportMeta, styles.educationMeta]}>{entry.period}</Text>
              <Text style={styles.supportBody}>{entry.org ? entry.title : entry.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.supportingColumnRight}>
          <Text style={styles.sectionLabel}>Additional experience</Text>
          {otherExperience.map((entry) => (
            <View key={`${entry.title}-${entry.org}`} style={styles.supportEntry}>
              <Text style={styles.supportTitle}>{entry.title}{entry.org ? ` · ${entry.org}` : ""}</Text>
              <Text style={styles.supportMeta}>{entry.period}</Text>
              {entry.description && <Text style={styles.supportBody}>{entry.description}</Text>}
            </View>
          ))}

          <Text style={[styles.sectionLabel, { marginTop: 5 }]}>Beyond work</Text>
          <Text style={styles.inlineText}>{interests.join("  ·  ")}</Text>
        </View>
      </View>

      <View style={styles.footerContact}>
        <Text style={styles.footerPage}>02 / 02</Text>
      </View>
    </Page>
  );
}

export function ResumeDocument() {
  return (
    <Document
      title={`${profile.name} — Resume`}
      author={profile.name}
      subject="Front-end Engineer Resume"
      keywords="Front-end Engineer, Product Engineering, React, Next.js, TypeScript, Accessibility, Web Performance"
    >
      <PageOne />
      <PageTwo />
    </Document>
  );
}
