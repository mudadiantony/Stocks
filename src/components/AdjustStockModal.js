import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, radius } from '../theme';

export default function AdjustStockModal({ visible, mode, onClose, onConfirm }) {
  const [qty, setQty] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (visible) { setQty(''); setNote(''); }
  }, [visible]);

  const handleConfirm = () => {
    const n = parseInt(qty);
    if (!n || n <= 0) return;
    onConfirm(n, note.trim());
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.title}>{mode === 'in' ? 'Stock in' : 'Stock out'}</Text>

            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={qty}
              onChangeText={setQty}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={colors.muted}
              autoFocus
            />

            <Text style={[styles.label, { marginTop: 12 }]}>Note (optional)</Text>
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              placeholder="e.g. Delivery from supplier"
              placeholderTextColor={colors.muted}
            />

            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={onClose}>
                <Text style={[styles.btnText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleConfirm}>
                <Text style={styles.btnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
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
    padding: 18,
    paddingTop: 8,
  },
  handle: { width: 36, height: 4, backgroundColor: colors.line, borderRadius: 2, alignSelf: 'center', marginVertical: 10 },
  title: { color: colors.text, fontSize: 19, fontWeight: '700', marginBottom: 16 },
  label: {
    color: colors.muted, fontSize: 11, textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 6, fontFamily: 'monospace',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 12,
    color: colors.text,
    fontSize: 15,
  },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 20, marginBottom: 10 },
  btn: { flex: 1, padding: 14, borderRadius: radius.md, alignItems: 'center' },
  btnPrimary: { backgroundColor: colors.amber },
  btnSecondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  btnText: { color: '#12151A', fontWeight: '700', fontSize: 15 },
});
