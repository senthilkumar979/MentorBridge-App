import * as Haptics from 'expo-haptics'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { BookOpen, ExternalLink } from 'lucide-react-native'
import { Linking, Pressable, Text, View } from 'react-native'

import { colors } from '@/theme/colors'

export interface BlogListItem {
  id?: string | null
  title?: string | null
  author_name?: string | null
  published_date?: string | null
  cover_image_url?: string | null
  link?: string
  username?: string | null
}

function formatDate(value?: string | null) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface BlogListCardProps {
  blog: BlogListItem
}

export const BlogListCard = ({ blog }: BlogListCardProps) => {
  const title = blog.title?.trim() || 'Untitled article'
  const author = blog.author_name || blog.username || 'Author'
  const date = formatDate(blog.published_date)

  return (
    <Pressable
      onPress={() => {
        void Haptics.selectionAsync()
        if (blog.link) void Linking.openURL(blog.link)
      }}
      className="mx-4 mb-3 overflow-hidden rounded-2xl border border-border active:opacity-90"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="h-40 w-full bg-muted">
        {blog.cover_image_url ? (
          <Image
            source={{ uri: blog.cover_image_url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <LinearGradient
            colors={['#fce7f3', '#f1f5f9']}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <BookOpen size={32} color={colors.primary} />
          </LinearGradient>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(15,23,42,0.72)']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 72,
            justifyContent: 'flex-end',
            paddingHorizontal: 14,
            paddingBottom: 10,
          }}
        >
          <Text className="text-base font-bold text-foreground" numberOfLines={2}>
            {title}
          </Text>
        </LinearGradient>
      </View>

      <View className="flex-row items-center justify-between gap-3 px-4 py-3">
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-medium text-primary" numberOfLines={1}>
            {author}
          </Text>
          {date ? (
            <Text className="mt-0.5 text-xs text-muted-foreground">{date}</Text>
          ) : null}
        </View>
        <View className="flex-row items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1">
          <ExternalLink size={12} color={colors.primary} />
          <Text className="text-xs font-semibold text-primary">Read</Text>
        </View>
      </View>
    </Pressable>
  )
}
