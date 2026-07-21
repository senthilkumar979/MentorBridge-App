import { Briefcase, ExternalLink, Github, Linkedin, Shield, Sparkles } from 'lucide-react-native'
import { Linking, Pressable, Text, View } from 'react-native'

import { Card, MutedText, SectionLabel } from '@/components/ui/Card'
import { HtmlContent } from '@/components/ui/HtmlContent'
import { colors } from '@/theme/colors'
import type { Experience, ISocialLinks, MentorBridgeExp } from '@/types/student'

export const StudentExperienceCard = ({
  experience,
}: {
  experience?: Experience[]
}) => {
  if (!experience?.length) return null
  return (
    <Card className="mx-4">
      <SectionLabel>Experience</SectionLabel>
      <View className="gap-5">
        {experience.map((exp, index) => (
          <View key={`${exp.company}-${index}`} className="flex-row gap-3">
            <View className="mt-1 h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <Briefcase size={16} color={colors.primary} />
            </View>
            <View className="min-w-0 flex-1 gap-1">
              <Text className="text-base font-semibold text-foreground">
                {exp.role}
              </Text>
              <Text className="text-sm text-primary">{exp.company}</Text>
              {exp.summary ? <HtmlContent html={exp.summary} /> : null}
            </View>
          </View>
        ))}
      </View>
    </Card>
  )
}

export const StudentMentorBridgeCard = ({
  exp,
}: {
  exp?: MentorBridgeExp | null
}) => {
  if (!exp?.role && !exp?.company && !exp?.summary) return null
  return (
    <Card className="mx-4 border-primary/30 bg-primary/5">
      <SectionLabel>MentorBridge</SectionLabel>
      <Text className="text-base font-semibold text-foreground">
        {exp.role || 'Member'}
      </Text>
      <Text className="mt-0.5 text-sm text-primary">
        {exp.company || 'MentorBridge'}
      </Text>
      {exp.summary ? (
        <View className="mt-2">
          <HtmlContent html={exp.summary} />
        </View>
      ) : null}
    </Card>
  )
}

export const StudentInspirationsCard = ({
  inspirations,
}: {
  inspirations?: string[]
}) => {
  if (!inspirations?.length) return null
  return (
    <Card className="mx-4">
      <SectionLabel>Inspirations</SectionLabel>
      <View className="gap-2">
        {inspirations.map((item) => (
          <View key={item} className="flex-row items-center gap-2">
            <Sparkles size={14} color={colors.warning} />
            <Text className="flex-1 text-sm text-foreground">{item}</Text>
          </View>
        ))}
      </View>
    </Card>
  )
}

export const StudentGuardianCard = ({
  fatherGuardianDetails,
  motherDetails,
}: {
  fatherGuardianDetails?: string
  motherDetails?: string
}) => {
  const father = fatherGuardianDetails?.trim()
  const mother = motherDetails?.trim()
  if (!father && !mother) return null

  return (
    <Card className="mx-4 border-warning/30 bg-warning/5">
      <View className="mb-3 flex-row items-center gap-2">
        <Shield size={16} color={colors.warning} />
        <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-warning">
          Guardian details
        </Text>
      </View>
      <MutedText>Admin-only · do not share externally</MutedText>
      {father ? (
        <View className="mt-3 gap-1">
          <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Father / Guardian
          </Text>
          <Text className="text-[15px] leading-6 text-foreground">{father}</Text>
        </View>
      ) : null}
      {mother ? (
        <View className="mt-3 gap-1">
          <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Mother
          </Text>
          <Text className="text-[15px] leading-6 text-foreground">{mother}</Text>
        </View>
      ) : null}
    </Card>
  )
}

function openUrl(url?: string) {
  if (!url?.trim()) return
  const href = url.startsWith('http') ? url : `https://${url}`
  void Linking.openURL(href)
}

export const StudentSocialCard = ({
  socialLinks,
  resumeLink,
  mediumUsername,
  compact = false,
}: {
  socialLinks?: ISocialLinks
  resumeLink?: string
  mediumUsername?: string
  compact?: boolean
}) => {
  const links = [
    {
      key: 'linkedin',
      label: 'LinkedIn',
      url: socialLinks?.linkedIn,
      icon: Linkedin,
    },
    {
      key: 'github',
      label: 'GitHub',
      url: socialLinks?.gitHub,
      icon: Github,
    },
    {
      key: 'website',
      label: 'Website',
      url: socialLinks?.website,
      icon: ExternalLink,
    },
    {
      key: 'resume',
      label: 'Resume',
      url: resumeLink,
      icon: ExternalLink,
    },
    {
      key: 'medium',
      label: 'Medium',
      url: mediumUsername
        ? `https://medium.com/@${mediumUsername.replace(/^@/, '')}`
        : undefined,
      icon: ExternalLink,
    },
  ].filter((l) => l.url?.trim())

  if (!links.length) return null

  const chips = (
    <View className={`flex-row flex-wrap ${compact ? 'justify-center gap-2' : 'gap-2'}`}>
      {links.map((link) => {
        const Icon = link.icon
        return (
          <Pressable
            key={link.key}
            onPress={() => openUrl(link.url)}
            className="flex-row items-center gap-2 rounded-xl border border-border bg-surface-elevated/90 px-3 py-2.5 active:opacity-80"
          >
            <Icon size={16} color={colors.primary} />
            <Text className="text-sm font-medium text-foreground">{link.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )

  if (compact) return chips

  return (
    <Card className="mx-4">
      <SectionLabel>Links</SectionLabel>
      {chips}
    </Card>
  )
}
