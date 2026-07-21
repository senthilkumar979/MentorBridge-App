import { useWindowDimensions } from 'react-native'
import RenderHTML, {
  defaultSystemFonts,
  type MixedStyleDeclaration,
} from 'react-native-render-html'

import { colors } from '@/theme/colors'

interface HtmlContentProps {
  html?: string | null
  baseStyle?: MixedStyleDeclaration
}

const tagsStyles: Record<string, MixedStyleDeclaration> = {
  body: { color: colors.foreground, margin: 0, padding: 0 },
  p: { marginTop: 0, marginBottom: 10, lineHeight: 22 },
  a: { color: colors.primary, textDecorationLine: 'underline' },
  strong: { fontWeight: '700', color: colors.foreground },
  b: { fontWeight: '700', color: colors.foreground },
  em: { fontStyle: 'italic' },
  ul: { marginBottom: 8, paddingLeft: 16 },
  ol: { marginBottom: 8, paddingLeft: 16 },
  li: { marginBottom: 4, color: colors.foreground },
  h1: { fontSize: 20, fontWeight: '700', marginBottom: 8, color: colors.foreground },
  h2: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: colors.foreground },
  h3: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: colors.foreground },
  br: { height: 8 },
}

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value)
}

/** Renders DB HTML (about / experience) similar to web dangerouslySetInnerHTML. */
export const HtmlContent = ({ html, baseStyle }: HtmlContentProps) => {
  const { width } = useWindowDimensions()
  const content = html?.trim()
  if (!content) return null

  const sourceHtml = looksLikeHtml(content)
    ? content
    : `<p>${content.replace(/\n/g, '<br/>')}</p>`

  return (
    <RenderHTML
      contentWidth={width - 64}
      source={{ html: sourceHtml }}
      systemFonts={[...defaultSystemFonts]}
      baseStyle={{
        color: colors.foreground,
        fontSize: 15,
        lineHeight: 22,
        ...baseStyle,
      }}
      tagsStyles={tagsStyles}
      defaultTextProps={{ selectable: true }}
    />
  )
}
