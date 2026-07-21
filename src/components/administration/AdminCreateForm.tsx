import { Pressable, Text, View } from 'react-native'

import type { AdminFormField } from '@/components/administration/adminModuleConfig'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { colors } from '@/theme/colors'

interface AdminCreateFormProps {
  fields: AdminFormField[]
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  onCancel: () => void
  onSubmit: () => void
  loading?: boolean
  categoryOptions?: Array<{ id: string; name: string }>
}

export const AdminCreateForm = ({
  fields,
  values,
  onChange,
  onCancel,
  onSubmit,
  loading,
  categoryOptions,
}: AdminCreateFormProps) => (
  <View className="mx-4 mb-4 gap-3 rounded-2xl border border-border bg-surface p-4">
    <Text className="text-sm font-semibold text-foreground">Create new</Text>
    {fields.map((field) => {
      if (field.key === 'award_category_id' && categoryOptions?.length) {
        return (
          <View key={field.key} className="gap-1.5">
            <Text className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Category
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {categoryOptions.map((opt) => {
                const active = values.award_category_id === opt.id
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => onChange('award_category_id', opt.id)}
                    className="rounded-full border px-3 py-1.5"
                    style={{
                      backgroundColor: active ? colors.primary : colors.surface,
                      borderColor: active ? colors.primary : colors.border,
                    }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{
                        color: active ? colors.primaryForeground : colors.mutedForeground,
                      }}
                    >
                      {opt.name}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>
        )
      }

      return (
        <Input
          key={field.key}
          label={field.label}
          value={values[field.key] ?? ''}
          onChangeText={(v) => onChange(field.key, v)}
          placeholder={field.placeholder}
          keyboardType={field.keyboardType}
          autoCapitalize={
            field.keyboardType === 'email-address' ? 'none' : 'sentences'
          }
          multiline={field.multiline}
          style={field.multiline ? { minHeight: 88, textAlignVertical: 'top' } : undefined}
        />
      )
    })}
    <View className="flex-row gap-2">
      <Button title="Cancel" variant="ghost" className="flex-1" onPress={onCancel} />
      <Button title="Save" className="flex-1" loading={loading} onPress={onSubmit} />
    </View>
  </View>
)
