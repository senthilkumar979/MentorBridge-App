import { Text, View } from 'react-native'

import { Card, SectionLabel } from '@/components/ui/Card'
import { HtmlContent } from '@/components/ui/HtmlContent'

interface StudentStatsRowProps {
  skills: number
  experience: number
  inspirations: number
  hasResume: boolean
}

const Stat = ({ value, label }: { value: string | number; label: string }) => (
  <View className="min-w-[22%] flex-1 items-center gap-1 rounded-xl border border-border bg-surface px-2 py-3">
    <Text className="text-xl font-bold text-foreground">{value}</Text>
    <Text className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </Text>
  </View>
)

export const StudentStatsRow = ({
  skills,
  experience,
  inspirations,
  hasResume,
}: StudentStatsRowProps) => (
  <View className="gap-2 px-4">
    <SectionLabel>At a glance</SectionLabel>
    <View className="flex-row gap-2">
      <Stat value={skills} label="Skills" />
      <Stat value={experience} label="Roles" />
      <Stat value={inspirations} label="Muses" />
      <Stat value={hasResume ? 'Yes' : '—'} label="Resume" />
    </View>
  </View>
)

export const StudentAboutCard = ({
  summary,
  selfIntro,
}: {
  summary?: string
  selfIntro?: string
}) => {
  if (!summary && !selfIntro) return null
  return (
    <Card className="mx-4">
      <SectionLabel>About</SectionLabel>
      {summary ? <HtmlContent html={summary} /> : null}
      {selfIntro ? (
        <View className="mt-3 border-l-2 border-primary/40 pl-3">
          <HtmlContent
            html={selfIntro}
            baseStyle={{ fontStyle: 'italic', color: '#9ca3af', fontSize: 14 }}
          />
        </View>
      ) : null}
    </Card>
  )
}

export const StudentSkillsCard = ({ skills }: { skills?: string[] }) => {
  if (!skills?.length) return null
  return (
    <Card className="mx-4">
      <SectionLabel>Skills</SectionLabel>
      <View className="flex-row flex-wrap gap-2">
        {skills.map((skill) => (
          <View
            key={skill}
            className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5"
          >
            <Text className="text-xs font-medium text-primary">{skill}</Text>
          </View>
        ))}
      </View>
    </Card>
  )
}
