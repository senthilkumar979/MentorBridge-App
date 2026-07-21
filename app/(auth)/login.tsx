import { Link } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoginVerificationStep } from "@/features/auth/LoginVerificationStep";
import {
  useGoogleSignIn,
  useWarmUpBrowser,
} from "@/features/auth/useGoogleSignIn";
import { useLoginFlow } from "@/features/auth/useLoginFlow";

export default function LoginScreen() {
  useWarmUpBrowser();

  const {
    email,
    setEmail,
    password,
    setPassword,
    code,
    setCode,
    codeStrategy,
    needsCode,
    error,
    loading,
    onSignIn,
    onVerifyCode,
    onResendCode,
    onBackToCredentials,
  } = useLoginFlow();

  const google = useGoogleSignIn();
  const formError = error || google.error;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-10"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-10 items-center">
            <BrandLogo height={72} showSubtitle />
          </View>

          <Text className="mb-6 text-center text-base text-muted-foreground">
            {needsCode
              ? codeStrategy === "totp"
                ? "Enter the code from your authenticator app"
                : "Enter the verification code sent to your email"
              : ""}
          </Text>

          {!needsCode ? (
            <View className="gap-4">
              <Button
                title="Continue with Google"
                variant="outline"
                loading={google.loading}
                disabled={loading}
                onPress={() => {
                  google.setError(null);
                  void google.onGoogleSignIn();
                }}
              />

              <View className="flex-row items-center gap-3 py-1">
                <View className="h-px flex-1 bg-border" />
                <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  or email
                </Text>
                <View className="h-px flex-1 bg-border" />
              </View>

              <Input
                label="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                placeholder="admin@mentorbridge.in"
              />
              <Input
                label="Password"
                secureTextEntry
                autoComplete="password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
              />
              {formError ? (
                <Text
                  className="text-sm text-error"
                  accessibilityLiveRegion="polite"
                >
                  {formError}
                </Text>
              ) : null}
              <Button
                title="Sign In"
                onPress={onSignIn}
                loading={loading}
                disabled={google.loading}
              />
            </View>
          ) : (
            <LoginVerificationStep
              code={code}
              codeStrategy={codeStrategy}
              error={error}
              loading={loading}
              onChangeCode={setCode}
              onVerify={onVerifyCode}
              onResend={onResendCode}
              onBack={onBackToCredentials}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
