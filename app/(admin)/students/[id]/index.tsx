import * as Haptics from 'expo-haptics'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView, View } from 'react-native'

import {
  StudentExperienceCard,
  StudentGuardianCard,
  StudentInspirationsCard,
  StudentMentorBridgeCard,
} from '@/components/students/StudentDetailCards'
import { StudentHero } from '@/components/students/StudentHero'
import {
  StudentAboutCard,
  StudentSkillsCard,
  StudentStatsRow,
} from '@/components/students/StudentProfileSections'
import { Button } from '@/components/ui/Button'
import { ErrorState, LoadingState } from '@/components/ui/Card'
import { useStudent } from '@/hooks/useQueries'

function hasMentorBridgeExp(exp: unknown): boolean {
  if (!exp || typeof exp !== 'object') return false
  const e = exp as Record<string, unknown>
  return !!(e.role || e.company || e.summary)
}

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { data, isLoading, isError, error } = useStudent(id)

  if (isLoading) return <LoadingState variant="detail" />
  if (isError || !data)
    return <ErrorState message={error?.message ?? 'Student not found'} />

  const skills = data.skillSets ?? []
  const experience = data.experience ?? []
  const inspirations = data.inspirations ?? []
  const showMb = hasMentorBridgeExp(data.mentorBridgeExp)

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <StudentHero student={data} />

      <View className="mt-5 gap-4">
        <StudentStatsRow
          skills={skills.length}
          experience={experience.length}
          inspirations={inspirations.length}
          hasResume={!!data.resumeLink}
        />

        <StudentAboutCard summary={data.summary} selfIntro={data.selfIntro} />
        <StudentSkillsCard skills={skills} />
        <StudentExperienceCard experience={experience} />
        {showMb ? <StudentMentorBridgeCard exp={data.mentorBridgeExp} /> : null}
        <StudentInspirationsCard inspirations={inspirations} />
        <StudentGuardianCard
          fatherGuardianDetails={data.fatherGuardianDetails}
          motherDetails={data.motherDetails}
        />

        <View className="mx-4 gap-3 pt-2">
          <Button
            title="Edit profile"
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              router.push(`/(admin)/students/${id}/edit`)
            }}
          />
        </View>
      </View>
    </ScrollView>
  )
}
