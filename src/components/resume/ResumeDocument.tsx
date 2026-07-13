import path from "node:path";
import {
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
    {
      src: publicPath("fonts", "neris", "Neris-SemiBoldItalic.otf"),
      fontWeight: 600,
      fontStyle: "italic",
    },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const colors = {
  paper: "#fbfbfa",
  text: "#101113",
  muted: "#4e5155",
  subtle: "#777b80",
  ink: "#547b76",
  paleInk: "#9ebbb6",
  sage: "#e8eee4",
  lilac: "#f0eaf3",
  surface: "#ffffff",
  border: "#e4e0d9",
};

const styles = StyleSheet.create({
  page: {
    position: "relative",
    width: 595.28,
    height: 841.89,
    backgroundColor: colors.paper,
    color: colors.text,
    fontFamily: "Neris",
    fontSize: 9,
    fontWeight: 300,
    lineHeight: 1.34,
  },
  edgeWash: {
    position: "absolute",
    top: -85,
    right: -70,
    width: 250,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.sage,
    opacity: 0.5,
  },
  edgeWashLilac: {
    position: "absolute",
    right: -90,
    bottom: -95,
    width: 260,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.lilac,
    opacity: 0.36,
  },
  sectionTitle: {
    marginBottom: 9,
    fontSize: 13.5,
    fontWeight: 900,
    letterSpacing: 4.2,
    lineHeight: 1,
    textTransform: "uppercase",
  },
  miniTitle: {
    marginBottom: 2,
    fontSize: 8.3,
    fontWeight: 600,
  },
  meta: {
    marginBottom: 3,
    color: colors.muted,
    fontSize: 6.8,
    fontStyle: "italic",
  },
  body: { color: colors.text, fontSize: 8.65, lineHeight: 1.38 },
  bodyMuted: { color: colors.muted, fontSize: 8.2, lineHeight: 1.4 },
  photo: {
    position: "absolute",
    top: 51,
    left: 49,
    width: 145,
    height: 145,
    objectFit: "cover",
  },
  photoBlob: {
    position: "absolute",
    top: 170,
    left: 143,
    width: 42,
    height: 52,
    borderRadius: 20,
    backgroundColor: colors.ink,
    opacity: 0.72,
  },
  topContact: {
    position: "absolute",
    top: 52,
    right: 51,
    alignItems: "flex-start",
  },
  topLink: {
    marginBottom: 3,
    color: colors.text,
    fontSize: 7.1,
    fontStyle: "italic",
    textDecoration: "none",
  },
  identity: { position: "absolute", top: 137, left: 216, width: 334 },
  name: {
    fontSize: 25.5,
    fontWeight: 900,
    letterSpacing: 4.8,
    lineHeight: 1.06,
  },
  role: { marginTop: 8, color: colors.muted, fontSize: 8.5, letterSpacing: 0.5 },
  sidebar: { position: "absolute", top: 225, left: 49, width: 142 },
  main: { position: "absolute", top: 225, left: 216, width: 334 },
  skillBlock: { marginBottom: 8 },
  skillLabel: { fontSize: 7.7, fontWeight: 600 },
  skillItems: { color: colors.text, fontSize: 7.8, lineHeight: 1.28 },
  statement: { marginBottom: 18 },
  statementParagraph: { marginBottom: 8, color: colors.text, fontSize: 8.55, lineHeight: 1.42 },
  experienceTitle: { marginTop: 1, fontSize: 9.1, fontWeight: 600 },
  experienceEntry: { position: "relative", marginBottom: 10, paddingLeft: 14 },
  experienceLine: {
    position: "absolute",
    top: 4,
    bottom: -11,
    left: 3,
    width: 0.55,
    backgroundColor: colors.border,
  },
  experienceDot: {
    position: "absolute",
    top: 3,
    left: 0,
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1.2,
    borderColor: colors.ink,
    backgroundColor: colors.paper,
  },
  experienceText: { marginTop: 4, color: colors.text, fontSize: 7.8, lineHeight: 1.38 },
  pageNumber: {
    position: "absolute",
    right: 52,
    bottom: 35,
    fontSize: 7,
  },
  pageTwoLeft: { position: "absolute", top: 51, left: 49, width: 145 },
  pageTwoRight: { position: "absolute", top: 51, left: 216, width: 334 },
  educationEntry: { marginBottom: 13 },
  otherEntry: { marginBottom: 18 },
  otherDescription: { marginTop: 4, fontSize: 8.15, lineHeight: 1.38 },
  otherSkills: { position: "absolute", top: 322, left: 49, width: 145 },
  interests: { position: "absolute", top: 322, left: 216, width: 329 },
  simpleList: { color: colors.muted, fontSize: 8.1, lineHeight: 1.55 },
  inlineList: { color: colors.muted, fontSize: 8.1, lineHeight: 1.55 },
  projects: { marginTop: 7 },
  projectGrid: { flexDirection: "row", flexWrap: "wrap" },
  projectCard: {
    width: 160,
    height: 44,
    marginRight: 6,
    marginBottom: 4,
    paddingTop: 4,
    paddingRight: 4,
    paddingBottom: 5,
    paddingLeft: 0,
    borderBottomWidth: 0.55,
    borderColor: colors.border,
  },
  projectName: { color: colors.text, fontSize: 7.6, fontWeight: 600, textDecoration: "none" },
  projectDomain: { marginTop: 1, color: colors.subtle, fontSize: 5.7 },
  projectStack: { marginTop: 4, color: colors.ink, fontSize: 5.4 },
  contact: {
    position: "absolute",
    left: 49,
    bottom: 43,
    width: 235,
  },
  contactTitle: { marginBottom: 14, fontSize: 13.5, fontWeight: 900, letterSpacing: 4.2 },
  contactLink: {
    marginBottom: 5,
    color: colors.text,
    fontSize: 8.2,
    fontStyle: "italic",
    textDecoration: "none",
  },
});

function HeaderThread() {
  return (
    <Svg style={{ position: "absolute", top: 116, left: 178, width: 258, height: 82 }} viewBox="0 0 258 82">
      <Path
        d="M0 14 C27 12 31 41 59 38 C86 35 86 12 117 18 C142 23 132 53 161 54 C190 55 190 18 223 13 C240 10 250 5 258 0"
        fill="none"
        stroke={colors.ink}
        strokeWidth="0.65"
        opacity="0.8"
      />
      <Path
        d="M145 50 L157 59 L151 68"
        fill="none"
        stroke={colors.ink}
        strokeWidth="0.65"
        opacity="0.8"
      />
    </Svg>
  );
}

function ContactArrow() {
  return (
    <Svg style={{ position: "absolute", top: 500, left: 190, width: 275, height: 250 }} viewBox="0 0 275 250">
      <Path
        d="M245 5 C253 61 260 113 226 150 C194 185 151 185 103 185 C65 185 46 184 31 205 C20 219 14 231 5 242"
        fill="none"
        stroke={colors.ink}
        strokeWidth="0.7"
        opacity="0.88"
      />
      <Path
        d="M5 242 L8 228 M5 242 L20 235"
        fill="none"
        stroke={colors.ink}
        strokeWidth="0.7"
        opacity="0.88"
      />
    </Svg>
  );
}

function CircledPageNumber() {
  return (
    <Svg style={{ position: "absolute", right: 43, bottom: 27, width: 35, height: 35 }} viewBox="0 0 35 35">
      <Path
        d="M4 22 C4 9 11 3 21 4 C31 5 34 14 31 23 C28 32 17 34 9 29 C4 26 2 20 4 14"
        fill="none"
        stroke={colors.ink}
        strokeWidth="0.65"
      />
      <Text x="11" y="22" style={{ fontFamily: "Neris", fontSize: 7, fill: colors.text }}>2/2</Text>
    </Svg>
  );
}

export function ResumeDocument() {
  const relevantExperience = experience.slice(0, 2);
  const otherExperience = experience.slice(2);
  const otherSkills = [
    "Pragmatic problem solving",
    "Strong attention to detail",
    "Clear cross-functional communication",
    "Visual hierarchy and UI consistency",
    "Independent delivery and ownership",
  ];

  return (
    <Document
      title={`${profile.name} — Resume`}
      author={profile.name}
      subject="Front-End Developer Resume"
      keywords="Front-End Developer, React, Next.js, TypeScript"
    >
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={{ width: 595.28, height: 841.89 }} />
        <View style={styles.edgeWash} />
        <View style={styles.edgeWashLilac} />
        <View style={styles.photoBlob} />
        <Image style={styles.photo} src={publicPath("avatar.jpg")} />
        <HeaderThread />

        <View style={styles.topContact}>
          <Link style={styles.topLink} src={`mailto:${profile.email}`}>{profile.email}</Link>
          <Link style={styles.topLink} src={profile.linkedin}>linkedin.com/in/danielius-zajenckauskas</Link>
          <Link style={styles.topLink} src={profile.github}>github.com/dzajenckauskas</Link>
        </View>

        <View style={styles.identity}>
          <Text style={styles.name}>DANIELIUS</Text>
          <Text style={styles.name}>ZAJENČKAUSKAS</Text>
          <Text style={styles.role}>{profile.role} · {profile.location}</Text>
        </View>

        <View style={styles.sidebar}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillBlock}>
            <Text style={styles.skillLabel}>Languages</Text>
            <Text style={styles.skillItems}>
              {languages.map((language) => `${language.name} — ${language.level.toLowerCase()}`).join("\n")}
            </Text>
          </View>
          {skillGroups.map((group) => (
            <View key={group.label} style={styles.skillBlock}>
              <Text style={styles.skillLabel}>{group.label}</Text>
              <Text style={styles.skillItems}>{group.items.join("\n")}</Text>
            </View>
          ))}
        </View>

        <View style={styles.main}>
          <View style={styles.statement}>
            <Text style={styles.sectionTitle}>Professional Statement</Text>
            {profile.about.map((paragraph) => (
              <Text key={paragraph} style={styles.statementParagraph}>{paragraph}</Text>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Relevant Experience</Text>
          {relevantExperience.map((entry) => (
            <View key={entry.title} style={styles.experienceEntry}>
              <View style={styles.experienceLine} />
              <View style={styles.experienceDot} />
              <Text style={styles.experienceTitle}>{entry.title}{entry.org ? `, ${entry.org}` : ""}</Text>
              <Text style={styles.meta}>{entry.period}</Text>
              {entry.description && <Text style={styles.experienceText}>{entry.description}</Text>}
            </View>
          ))}

          <View style={styles.projects}>
            <Text style={styles.sectionTitle}>Selected Projects</Text>
            <View style={styles.projectGrid}>
              {projects.map((project) => (
                <View key={project.slug} style={styles.projectCard}>
                  <Link style={styles.projectName} src={project.url}>{project.name}</Link>
                  <Text style={styles.projectDomain}>{project.domain}</Text>
                  <Text style={styles.projectStack}>{project.stack.slice(0, 3).join(" · ")}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.pageNumber}>1/2</Text>
      </Page>

      <Page size="A4" style={styles.page} wrap={false}>
        <View style={{ width: 595.28, height: 841.89 }} />
        <View style={[styles.edgeWash, { opacity: 0.28 }]} />
        <View style={[styles.edgeWashLilac, { left: -100, right: undefined, opacity: 0.3 }]} />

        <View style={styles.pageTwoLeft}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((entry) => (
            <View key={entry.title} style={styles.educationEntry}>
              <Text style={styles.miniTitle}>{entry.org || entry.title}</Text>
              <Text style={styles.meta}>{entry.period}</Text>
              <Text style={styles.bodyMuted}>{entry.org ? entry.title : entry.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.pageTwoRight}>
          <Text style={styles.sectionTitle}>Other Experience</Text>
          {otherExperience.map((entry) => (
            <View key={entry.title} style={styles.otherEntry}>
              <Text style={styles.miniTitle}>{entry.title}{entry.org ? `, ${entry.org}` : ""}</Text>
              <Text style={styles.meta}>{entry.period}</Text>
              {entry.description && <Text style={styles.otherDescription}>{entry.description}</Text>}
            </View>
          ))}
        </View>

        <View style={styles.otherSkills}>
          <Text style={styles.sectionTitle}>Other Skills</Text>
          <Text style={styles.simpleList}>{otherSkills.join("\n")}</Text>
        </View>

        <View style={styles.interests}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <Text style={styles.inlineList}>{interests.join("   ·   ")}</Text>
        </View>

        <ContactArrow />
        <View style={styles.contact}>
          <Text style={styles.contactTitle}>CONTACT ME</Text>
          <Link style={styles.contactLink} src={`mailto:${profile.email}`}>{profile.email}</Link>
          <Link style={styles.contactLink} src={profile.linkedin}>linkedin.com/in/danielius-zajenckauskas</Link>
          <Link style={styles.contactLink} src={profile.github}>github.com/dzajenckauskas</Link>
        </View>
        <CircledPageNumber />
      </Page>
    </Document>
  );
}
