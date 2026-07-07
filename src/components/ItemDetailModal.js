import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { colors, radius } from '../theme';
import { isLowStock } from './ItemCard';

export default function ItemDetailModal({ visible, item, logs, onClose, onEdit, onDelete, onStockIn, onStockOut }) {
  if (!item) return null;
  const low = isLowStock(item);
  const itemLogs = logs
    .filter((l) => l.itemId === item.id)
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 30);

  const confirmDelete = () => {
    Alert.alert(
      'Delete item?',
      `${item.name} and its stock history will be permanently removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  const fmtMoney = (n) => `£${(Number(n) || 0).toFixed(2)}`;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.sku}>{item.sku || 'No SKU'}</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeX}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.qtyHero, low && styles.qtyHeroLow]}>
              <Text style={[styles.qtyNum, low && { color: colors.red }]}>{item.qty}</Text>
              <Text style={styles.qtyLabel}>units in stock</Text>
            </View>

            <View style={styles.adjustRow}>
              <TouchableOpacity style={[styles.adjustBtn, styles.outBtn]} onPress={onStockOut}>
                <Text style={[styles.adjustBtnText, { color: colors.red }]}>− Stock out</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.adjustBtn, styles.inBtn]} onPress={onStockIn}>
                <Text style={[styles.adjustBtnText, { color: colors.green }]}>+ Stock in</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoGrid}>
              <InfoCell label="Category" value={item.category || '—'} />
              <InfoCell label="Supplier" value={item.supplier || '—'} />
              <InfoCell label="Cost price" value={item.cost ? fmtMoney(item.cost) : '—'} />
              <InfoCell label="Selling price" value={item.price ? fmtMoney(item.price) : '—'} />
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={onEdit}>
                <Text style={[styles.btnText, { color: colors.text }]}>Edit details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={confirmDelete}>
                <Text style={[styles.btnText, { color: colors.red }]}>Delete</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.logTitle}>Stock history</Text>
            {itemLogs.length === 0 ? (
              <Text style={styles.noLogs}>No stock movements yet</Text>
            ) : (
              itemLogs.map((l) => {
                const isOut = l.type === 'out';
                const dotColor = isOut ? colors.red : (l.type === 'adjust' ? colors.amber : colors.green);
                const date = new Date(l.ts);
                const dateStr = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) +
                  ' · ' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                return (
                  <View key={l.id} style={styles.logRow}>
                    <View style={styles.logLeft}>
                      <View style={[styles.logDot, { backgroundColor: dotColor }]} />
                      <View>
                        <Text style={styles.logNote}>{l.note || (isOut ? 'Stock out' : 'Stock in')}</Text>
                        <Text style={styles.logTime}>{dateStr}</Text>
                      </View>
                    </View>
                    <Text style={[styles.logQty, { color: isOut ? colors.red : colors.green }]}>
                      {isOut ? '-' : '+'}{l.qty}
                    </Text>
                  </View>
                );
              })
            )}
            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function InfoCell({ label, value }) {
  return (
    <View style={styles.infoCell}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(10,12,15,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    maxHeight: '92%',
    padding: 18,
    paddingTop: 8,
  },
  handle: { width: 36, height: 4, backgroundColor: colors.line, borderRadius: 2, alignSelf: 'center', marginVertical: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { color: colors.text, fontSize: 20, fontWeight: '700' },
  sku: { color: colors.muted, fontSize: 12, fontFamily: 'monospace', marginTop: 4 },
  closeX: { color: colors.muted, fontSize: 26, lineHeight: 26, paddingHorizontal: 4 },
  qtyHero: {
    alignItems: 'center', padding: 18, marginVertical: 14,
    backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line,
  },
  qtyHeroLow: { borderColor: 'rgba(224,85,90,0.4)' },
  qtyNum: { color: colors.text, fontSize: 44, fontWeight: '700', fontFamily: 'monospace' },
  qtyLabel: { color: colors.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 6 },
  adjustRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  adjustBtn: { flex: 1, padding: 14, borderRadius: radius.md, alignItems: 'center', borderWidth: 1 },
  outBtn: { backgroundColor: 'rgba(224,85,90,0.15)', borderColor: 'rgba(224,85,90,0.3)' },
  inBtn: { backgroundColor: 'rgba(79,174,122,0.15)', borderColor: 'rgba(79,174,122,0.3)' },
  adjustBtnText: { fontWeight: '700', fontSize: 15 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  infoCell: {
    width: '48%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.sm, padding: 12,
  },
  infoLabel: { color: colors.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'monospace' },
  infoValue: { color: colors.text, fontSize: 14, fontWeight: '600', marginTop: 3 },
  btnRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  btn: { flex: 1, padding: 14, borderRadius: radius.md, alignItems: 'center' },
  btnSecondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  btnDanger: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(224,85,90,0.4)' },
  btnText: { fontWeight: '700', fontSize: 15 },
  logTitle: { color: colors.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, marginVertical: 12, fontFamily: 'monospace' },
  noLogs: { color: colors.muted, fontSize: 13, paddingVertical: 8 },
  logRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  logLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logDot: { width: 8, height: 8, borderRadius: 4 },
  logNote: { color: colors.text, fontSize: 13 },
  logTime: { color: colors.muted, fontSize: 11, fontFamily: 'monospace' },
  logQty: { fontWeight: '700', fontSize: 14, fontFamily: 'monospace' },
});

