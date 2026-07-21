import { Redirect } from 'expo-router'

/** Events list lives in the tab bar; keep this route for deep links. */
export default function StudentEventsIndexRedirect() {
  return <Redirect href="/(student)/(tabs)/events" />
}
