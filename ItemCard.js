import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius } from '../theme';

export function isLowStock(item) {
  return item.qty <= (item.lowThreshold ?? 5);
}

export default function ItemCard({ item, onPress }) {
  const low = isLowStock(item);
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.card, low && styles.cardLow]}
    >
      <View style={[styles.stub, { backgroundColor: low ? colors.red : colors.green }]} />
      <View style={styles.body}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.meta} numberOfLines={1}>
            {(item.sku || 'NO-SKU')} · {(item.category || 'Uncategorized')}
          </Text>
        </View>
        <View style={styles.qtyWrap}>
          <Text style={[styles.qtyNum, low && { color: colors.red }]}>{item.qty}</Text>
          <Text style={styles.qtyUnit}>units</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: 10,
  },
  cardLow: {
    borderColor: 'rgba(224,85,90,0.5)',
  },
  stub: {
    width: 8,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 15,
  },
  meta: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 3,
    fontFamily: 'monospace',
  },
  qtyWrap: {
    alignItems: 'flex-end',
  },
  qtyNum: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  qtyUnit: {
    color: colors.muted,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
