import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // could send to analytics in the future
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, onRetry }) {
  const { width } = useWindowDimensions();
  const isDark = false; // Detect from props or context if needed
  const bgColor = isDark ? '#121212' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#121212';
  const subTextColor = isDark ? '#9CA3AF' : '#6B7280';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#EF4444" />
      <Text style={[styles.title, { color: textColor }]}>Something went wrong</Text>
      <Text style={[styles.message, { color: subTextColor }]}>{error?.message || 'An unexpected error occurred'}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
        <MaterialCommunityIcons name="refresh" size={20} color="#FFFFFF" />
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  title: { fontSize: 20, fontWeight: '700', marginTop: 16 },
  message: { fontSize: 14, marginTop: 8, textAlign: 'center', lineHeight: 20 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EF4444', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 24, gap: 8 },
  retryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});

export default ErrorBoundary;
