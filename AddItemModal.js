import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { colors, radius } from '../theme';

export default function AddItemModal({ visible, item, onClose, onSave, onScanRequest, scannedCode }) {
  const [form, setForm] = useState(emptyForm());

  function emptyForm() {
    return { name: '', category: '', supplier: '', sku: '', qty: '', lowThreshold: '5', cost: '', price: '' };
  }

  useEffect(() => {
    if (visible) {
      if (item) {
        setForm({
          name: item.name || '',
          category: item.category || '',
          supplier: item.supplier || '',
          sku: item.sku || '',
          qty: String(item.qty ?? ''),
          lowThreshold: String(item.lowThreshold ?? 5),
          cost: String(item.cost ?? ''),
          price: String(item.price ?? ''),
        });
      } else {
        setForm(emptyForm());
      }
    }
  }, [visible, item]);

  useEffect(() => {
    if (scannedCode) {
      setForm((f) => ({ ...f, sku: scannedCode }));
    }
  }, [scannedCode]);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({
      name: form.name.trim(),
      category: form.category.trim(),
      supplier: form.supplier.trim(),
      sku: form.sku.trim(),
      qty: Math.max(0, parseInt(form.qty) || 0),
      lowThreshold: Math.max(0, parseInt(form.lowThreshold) || 5),
      cost: parseFloat(form.cost) || 0,
      price: parseFloat(form.price) || 0,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>{item ? 'Edit item' : 'New item'}</Text>

              <Field label="Name">
                <TextInput
                  style={styles.input}
                  value={form.name}
                  onChangeText={(v) => update('name', v)}
                  placeholder="e.g. Blue cotton t-shirt, size M"
                  placeholderTextColor={colors.muted}
                />
              </Field>

              <View style={styles.row2}>
                <Field label="Category" flex>
                  <TextInput
                    style={styles.input}
                    value={form.category}
                    onChangeText={(v) => update('category', v)}
                    placeholder="e.g. Apparel"
                    placeholderTextColor={colors.muted}
                  />
                </Field>
                <Field label="Supplier" flex>
                  <TextInput
                    style={styles.input}
                    value={form.supplier}
                    onChangeText={(v) => update('supplier', v)}
                    placeholder="e.g. Acme Ltd"
                    placeholderTextColor={colors.muted}
                  />
                </Field>
              </View>

              <Field label="SKU / Barcode">
                <View style={styles.fieldWithBtn}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={form.sku}
                    onChangeText={(v) => update('sku', v)}
                    placeholder="Scan or type code"
                    placeholderTextColor={colors.muted}
                  />
                  <TouchableOpacity style={styles.miniBtn} onPress={onScanRequest}>
                    <Text style={styles.miniBtnText}>▤</Text>
                  </TouchableOpacity>
                </View>
              </Field>

              <View style={styles.row2}>
                <Field label="Quantity" flex>
                  <TextInput
                    style={styles.input}
                    value={form.qty}
                    onChangeText={(v) => update('qty', v)}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor={colors.muted}
                  />
                </Field>
                <Field label="Low stock below" flex>
                  <TextInput
                    style={styles.input}
                    value={form.lowThreshold}
                    onChangeText={(v) => update('lowThreshold', v)}
                    placeholder="5"
                    keyboardType="numeric"
                    placeholderTextColor={colors.muted}
                  />
                </Field>
              </View>

              <View style={styles.row2}>
                <Field label="Cost price (£)" flex>
                  <TextInput
                    style={styles.input}
                    value={form.cost}
                    onChangeText={(v) => update('cost', v)}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.muted}
                  />
                </Field>
                <Field label="Selling price (£)" flex>
                  <TextInput
                    style={styles.input}
                    value={form.price}
                    onChangeText={(v) => update('price', v)}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.muted}
                  />
                </Field>
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={onClose}>
                  <Text style={[styles.btnText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleSave}>
                  <Text style={styles.btnText}>Save item</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function Field({ label, children, flex }) {
  return (
    <View style={[styles.field, flex && { flex: 1 }]}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(10,12,15,0.6)', justifyContent: 'flex-end' },
  sheetWrap: { width: '100%' },
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
  handle: {
    width: 36, height: 4, backgroundColor: colors.line,
    borderRadius: 2, alignSelf: 'center', marginVertical: 10,
  },
  title: {
    color: colors.text, fontSize: 19, fontWeight: '700', marginBottom: 16,
  },
  field: { marginBottom: 12 },
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
  row2: { flexDirection: 'row', gap: 10 },
  fieldWithBtn: { flexDirection: 'row', gap: 8 },
  miniBtn: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBtnText: { color: colors.text, fontSize: 18 },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 8, marginBottom: 20 },
  btn: { flex: 1, padding: 14, borderRadius: radius.md, alignItems: 'center' },
  btnPrimary: { backgroundColor: colors.amber },
  btnSecondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  btnText: { color: '#12151A', fontWeight: '700', fontSize: 15 },
});
