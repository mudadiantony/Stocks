import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius } from '../theme';

export function isLowStock(item) {
  const threshold = item.lowThreshold ?? 5;
  return item.qty <= threshold;
}

export default function ItemCard({ item, onPress }) {
  const low = isLowStock(item);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.metaRow}>
          {item.sku ? <Text style={styles.sku}>{item.sku}</Text> : null}
          {item.category ? <Text style={styles.category}>{item.category}</Text> : null}
        </View>
      </View>

      <View style={[styles.qtyPill, low && styles.qtyPillLow]}>
        <Text style={[styles.qtyText, low && styles.qtyTextLow]}>{item.qty}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  sku: {
    color: colors.muted,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  category: {
    color: colors.muted,
    fontSize: 11,
  },
  qtyPill: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  qtyPillLow: {
    backgroundColor: 'rgba(224,85,90,0.15)',
    borderColor: 'rgba(224,85,90,0.4)',
  },
  qtyText: {
    color: colors.text,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  qtyTextLow: {
    color: colors.red,
  },
});
