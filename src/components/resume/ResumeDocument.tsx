import path from "node:path";
import {
  Circle,
  Document,
  Font,
  Image,
  Link,
  Page,
  Path,
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
  text: "#191a1c",
  muted: "#5b5e62",
  subtle: "#8b8e92",
  ink: "#4f736e",
  border: "#ddd9d2",
  lilac: "#eee6f2",
  sage: "#e8eee4",
  rose: "#f1e5ea",
};

const styles = StyleSheet.create({
  page: {
    position: "relative",
    paddingTop: 38,
    paddingRight: 42,
    paddingBottom: 32,
    paddingLeft: 42,
    backgroundColor: colors.paper,
    color: colors.text,
    fontFamily: "Neris",
    fontSize: 9,
    fontWeight: 300,
    lineHeight: 1.45,
  },
  blobTop: {
    position: "absolute",
    top: -70,
    right: -50,
    width: 245,
    height: 185,
    borderRadius: 90,
    backgroundColor: colors.sage,
    opacity: 0.72,
  },
  blobLeft: {
    position: "absolute",
    top: 116,
    left: -90,
    width: 190,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.lilac,
    opacity: 0.72,
  },
  header: {
    position: "relative",
    height: 164,
    flexDirection: "row",
    alignItems: "center",
  },
  photoWrap: { width: 132, height: 132, marginRight: 30 },
  photo: { width: 132, height: 132, objectFit: "cover" },
  identity: { flexGrow: 1, paddingTop: 5 },
  contactRow: {
    marginBottom: 18,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  contactLink: {
    marginRight: 13,
    marginBottom: 3,
    color: colors.muted,
    fontSize: 7.5,
    textDecoration: "none",
  },
  name: {
    fontSize: 25,
    fontWeight: 900,
    letterSpacing: 4.2,
    lineHeight: 1.05,
  },
  role: {
    marginTop: 9,
    color: colors.muted,
    fontSize: 10.5,
    letterSpacing: 0.4,
  },
  section: { position: "relative", marginTop: 18 },
  sectionLabel: {
    marginBottom: 9,
    fontSize: 8.5,
    fontWeight: 900,
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
  summary: { width: "88%", color: colors.muted, fontSize: 9.2, lineHeight: 1.58 },
  columns: { marginTop: 22, flexDirection: "row" },
  sidebar: { width: "35%", paddingRight: 24 },
  mainColumn: {
    width: "65%",
    paddingLeft: 26,
    borderLeftWidth: 0.7,
    borderLeftColor: colors.border,
  },
  skillGroup: { marginBottom: 9 },
  smallLabel: {
    marginBottom: 3,
    color: colors.subtle,
    fontSize: 6.5,
    fontWeight: 900,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  skillText: { color: colors.muted, fontSize: 7.7, lineHeight: 1.45 },
  languageRow: {
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  languageLevel: { color: colors.subtle },
  timelineItem: { position: "relative", paddingLeft: 18, paddingBottom: 14 },
  timelineLine: {
    position: "absolute",
    top: 4,
    bottom: -4,
    left: 3,
    width: 0.7,
    backgroundColor: colors.border,
  },
  timelineDot: {
    position: "absolute",
    top: 3,
    left: 0,
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1.3,
    borderColor: colors.ink,
    backgroundColor: colors.paper,
  },
  period: {
    color: colors.subtle,
    fontSize: 6.7,
    fontWeight: 600,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  itemTitle: { marginTop: 2, fontSize: 10.5, fontWeight: 600 },
  itemOrg: { marginTop: 1, color: colors.ink, fontSize: 8.5, fontWeight: 600 },
  itemDescription: { marginTop: 4, color: colors.muted, fontSize: 7.6, lineHeight: 1.45 },
  pageTitle: { marginTop: 16, fontSize: 25, fontWeight: 900, letterSpacing: 2.7, lineHeight: 1 },
  pageIntro: { marginTop: 14, width: "70%", color: colors.muted, fontSize: 9, lineHeight: 1.45 },
  projectList: { marginTop: 24 },
  project: {
    position: "relative",
    paddingTop: 13,
    paddingRight: 14,
    paddingBottom: 13,
    paddingLeft: 14,
    borderTopWidth: 0.7,
    borderTopColor: colors.border,
  },
  projectTop: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  projectName: { fontSize: 11, fontWeight: 600 },
  projectPeriod: { color: colors.subtle, fontSize: 6.7, letterSpacing: 0.5 },
  projectSummary: { width: "82%", marginTop: 4, color: colors.muted, fontSize: 7.6 },
  tags: { marginTop: 6, flexDirection: "row", flexWrap: "wrap" },
  tag: {
    marginRight: 4,
    marginBottom: 3,
    paddingTop: 2.2,
    paddingRight: 5,
    paddingBottom: 2.2,
    paddingLeft: 5,
    borderWidth: 0.55,
    borderColor: colors.border,
    borderRadius: 8,
    color: colors.muted,
    fontSize: 5.8,
  },
  lowerColumns: { marginTop: 20, flexDirection: "row" },
  lowerLeft: { width: "58%", paddingRight: 28 },
  lowerRight: { width: "42%", paddingLeft: 25, borderLeftWidth: 0.7, borderLeftColor: colors.border },
  educationItem: { marginBottom: 8 },
  educationTitle: { fontSize: 8.5, fontWeight: 600 },
  educationMeta: { color: colors.subtle, fontSize: 6.8 },
  interestText: { color: colors.muted, fontSize: 7.8, lineHeight: 1.6 },
  footer: {
    position: "absolute",
    right: 42,
    bottom: 19,
    left: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    color: colors.subtle,
    fontSize: 6.5,
  },
});

function PageFooter({ page }: { page: number }) {
  return (
    <View style={styles.footer} fixed>
      <Text>danielius.dev</Text>
      <Text>{page}/2</Text>
    </View>
  );
}

function HeaderDoodle() {
  return (
    <Svg style={{ position: "absolute", top: 59, left: 118, width: 245, height: 76 }} viewBox="0 0 245 76">
      <Path
        d="M2 17 C38 3 69 8 88 26 C108 45 129 48 154 30 C179 12 199 13 218 28 C228 36 235 39 243 34"
        fill="none"
        stroke={colors.ink}
        strokeWidth="0.7"
        opacity="0.62"
      />
      <Path
        d="M139 31 C148 14 162 12 169 26 C176 41 165 54 152 48 C141 43 138 35 139 31"
        fill="none"
        stroke={colors.ink}
        strokeWidth="0.65"
        opacity="0.54"
      />
    </Svg>
  );
}

export function ResumeDocument() {
  const engineeringExperience = experience.slice(0, 3);
  const additionalExperience = experience[3];

  return (
    <Document
      title={`${profile.name} — Resume`}
      author={profile.name}
      subject="Front-End Developer Resume"
      keywords="Front-End Developer, React, Next.js, TypeScript"
    >
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.blobTop} />
        <View style={styles.blobLeft} />
        <HeaderDoodle />

        <View style={styles.header}>
          <View style={styles.photoWrap}>
            <Image style={styles.photo} src={publicPath("avatar.jpg")} />
          </View>
          <View style={styles.identity}>
            <View style={styles.contactRow}>
              <Link style={styles.contactLink} src={`mailto:${profile.email}`}>{profile.email}</Link>
              <Link style={styles.contactLink} src={profile.linkedin}>LinkedIn</Link>
              <Link style={styles.contactLink} src={profile.github}>GitHub</Link>
              <Text style={styles.contactLink}>{profile.location}</Text>
            </View>
            <Text style={styles.name}>DANIELIUS</Text>
            <Text style={styles.name}>ZAJENČKAUSKAS</Text>
            <Text style={styles.role}>{profile.role}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Professional profile</Text>
          <Text style={styles.summary}>{profile.about[0]}</Text>
          <Text style={[styles.summary, { marginTop: 7 }]}>{profile.about[1]}</Text>
        </View>

        <View style={styles.columns}>
          <View style={styles.sidebar}>
            <Text style={styles.sectionLabel}>Core expertise</Text>
            {skillGroups.map((group) => (
              <View key={group.label} style={styles.skillGroup}>
                <Text style={styles.smallLabel}>{group.label}</Text>
                <Text style={styles.skillText}>{group.items.join(" · ")}</Text>
              </View>
            ))}

            <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Languages</Text>
            {languages.map((language) => (
              <View key={language.name} style={styles.languageRow}>
                <Text>{language.name}</Text>
                <Text style={styles.languageLevel}>{language.level}</Text>
              </View>
            ))}
          </View>

          <View style={styles.mainColumn}>
            <Text style={styles.sectionLabel}>Experience</Text>
            {engineeringExperience.map((entry, index) => (
              <View key={entry.title} style={styles.timelineItem}>
                <View style={styles.timelineLine} />
                <View style={styles.timelineDot} />
                <Text style={styles.period}>{entry.period}</Text>
                <Text style={styles.itemTitle}>{entry.title}</Text>
                {entry.org && <Text style={styles.itemOrg}>{entry.org}</Text>}
                {entry.description && <Text style={styles.itemDescription}>{entry.description}</Text>}
                {index === engineeringExperience.length - 1 ? null : <View />}
              </View>
            ))}
          </View>
        </View>

        <PageFooter page={1} />
      </Page>

      <Page size="A4" style={styles.page} wrap={false}>
        <View style={[styles.blobTop, { backgroundColor: colors.lilac, opacity: 0.58 }]} />
        <Svg style={{ position: "absolute", right: 35, bottom: 42, width: 105, height: 90 }} viewBox="0 0 105 90">
          <Path
            d="M100 5 C89 17 92 34 76 40 C59 46 57 63 42 69 C29 74 18 75 5 84 M5 84 L15 83 M5 84 L10 74"
            fill="none"
            stroke={colors.ink}
            strokeWidth="0.75"
            opacity="0.55"
          />
          <Circle cx="91" cy="14" r="9" fill="none" stroke={colors.ink} strokeWidth="0.6" opacity="0.4" />
        </Svg>

        <Text style={styles.sectionLabel}>Selected work</Text>
        <Text style={styles.pageTitle}>PROJECTS</Text>
        <Text style={styles.pageIntro}>
          Commercial platforms and independent products spanning e-commerce,
          healthcare, real estate and international relocation.
        </Text>

        <View style={styles.projectList}>
          {projects.map((project) => (
            <View key={project.slug} style={styles.project}>
              <View style={styles.projectTop}>
                <Link src={project.url} style={[styles.projectName, { color: colors.text, textDecoration: "none" }]}>
                  {project.name}
                </Link>
                <Text style={styles.projectPeriod}>{project.period}</Text>
              </View>
              <Text style={styles.projectSummary}>{project.summary}</Text>
              <View style={styles.tags}>
                {project.stack.slice(0, 6).map((item) => <Text key={item} style={styles.tag}>{item}</Text>)}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.lowerColumns}>
          <View style={styles.lowerLeft}>
            <Text style={styles.sectionLabel}>Education</Text>
            {education.map((entry) => (
              <View key={entry.title} style={styles.educationItem}>
                <Text style={styles.educationTitle}>{entry.title}</Text>
                <Text style={styles.educationMeta}>{entry.org} · {entry.period}</Text>
              </View>
            ))}
          </View>

          <View style={styles.lowerRight}>
            {additionalExperience && (
              <View>
                <Text style={styles.sectionLabel}>Earlier experience</Text>
                <Text style={styles.educationTitle}>{additionalExperience.title}</Text>
                <Text style={styles.educationMeta}>{additionalExperience.org} · {additionalExperience.period}</Text>
              </View>
            )}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Beyond code</Text>
            <Text style={styles.interestText}>{interests.join(" · ")}</Text>
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Contact</Text>
            <Link style={styles.contactLink} src={`mailto:${profile.email}`}>{profile.email}</Link>
            <Link style={styles.contactLink} src={profile.linkedin}>linkedin.com/in/danielius-zajenckauskas</Link>
            <Link style={styles.contactLink} src={profile.github}>github.com/dzajenckauskas</Link>
          </View>
        </View>

        <PageFooter page={2} />
      </Page>
    </Document>
  );
}
