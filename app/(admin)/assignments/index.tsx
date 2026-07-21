import { Redirect } from 'expo-router'

/** Assignments list lives in the tab bar; keep this route for deep links. */
export default function AssignmentsIndexRedirect() {
  return <Redirect href="/(admin)/(tabs)/assignments" />
}
