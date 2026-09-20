import Ionicons from '@react-native-vector-icons/ionicons';
import { useRouter } from 'expo-router';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearAllHistory } from '../../lib/db/queries';
import { useTheme } from '../../lib/theme/ThemeContext';

const PRIVACY_POLICY_URL = 'https://ramogi4960.github.io/'; // replace once hosted
const FEEDBACK_EMAIL = 'ramogikevin2025@gmail.com'; // replace with your real address
const APP_VERSION = '1.0.0';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface SettingsRow {
  key: string;
  label: string;
  icon: IoniconName;
  onPress: () => void;
  destructive?: boolean;
}

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  function handleClearHistory() {
    Alert.alert(
      'Clear all history?',
      'This permanently deletes every scanned and generated record. Saved photos are not affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearAllHistory();
            Alert.alert('Done', 'History cleared.');
          },
        },
      ]
    );
  }

  function handleFeedback() {
    Linking.openURL(`mailto:${FEEDBACK_EMAIL}?subject=QR App Feedback`);
  }

  function handlePrivacyPolicy() {
    Linking.openURL(PRIVACY_POLICY_URL);
  }

  const rows: SettingsRow[] = [
    { key: 'profile', label: 'Profile', icon: 'person-outline', onPress: () => router.push('../settings/profile') },
    { key: 'appearance', label: 'Appearance', icon: 'color-palette-outline', onPress: () => router.push('../settings/appearance') },
    { key: 'clear', label: 'Clear History', icon: 'trash-outline', onPress: handleClearHistory, destructive: true },
    { key: 'privacy', label: 'Privacy Policy', icon: 'shield-checkmark-outline', onPress: handlePrivacyPolicy },
    { key: 'feedback', label: 'Send Feedback', icon: 'mail-outline', onPress: handleFeedback },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Text style={[styles.heading, { color: colors.text }]}>Settings</Text>
      <View style={[styles.list, { backgroundColor: colors.surfaceAlt }]}>
        {rows.map((row) => (
          <TouchableOpacity
            key={row.key}
            style={[styles.row, { borderBottomColor: colors.border }]}
            onPress={row.onPress}
          >
            <Ionicons
              name={row.icon}
              size={20}
              color={row.destructive ? colors.destructive : colors.text}
            />
            <Text style={[styles.rowLabel, { color: row.destructive ? colors.destructive : colors.text }]}>
              {row.label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={[styles.version, { color: colors.textMuted }]}>Version {APP_VERSION}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  list: { borderRadius: 14, overflow: 'hidden', backgroundColor: '#f9fafb' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e7eb',
  },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  destructiveLabel: { color: '#dc2626' },
  version: { textAlign: 'center', color: '#9ca3af', fontSize: 13, marginTop: 20 },
});