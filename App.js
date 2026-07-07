import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import { colors, radius } from './src/theme';
import { loadItems, saveItems, loadLogs, saveLogs, uid } from './src/storage';
import ItemCard, { isLowStock } from './src/components/ItemCard';
import AddItemModal from './src/components/AddItemModal';
import ItemDetailModal from './src/components/ItemDetailModal';
import AdjustStockModal from './src/components/AdjustStockModal';
import ScannerModal from './src/components/ScannerModal';

export default function App() {
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [detailItemId, setDetailItemId] = useState(null);

  const [adjustVisible, setAdjustVisible] = useState(false);
  const [adjustMode, setAdjustMode] = useState('in');

  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanTarget, setScanTarget] = useState(null); // 'form' | 'search'
  const [scannedCode, setScannedCode] = useState(null);

  useEffect(() => {
    (async () => {
      const [i, l] = await Promise.all([loadItems(), loadLogs()]);
      setItems(i);
      setLogs(l);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) saveItems(items);
  }, [items, loaded]);

  useEffect(() => {
    if (loaded) saveLogs(logs);
  }, [logs, loaded]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category).filter(Boolean))),
    [items]
  );

  const filteredItems = useMemo(() => {
    let list = items;
    if (activeCategory === 'low') list = list.filter(isLowStock);
    else if (activeCategory !== 'all') list = list.filter((i) => i.category === activeCategory);
    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter((i) =>
        (i.name + ' ' + (i.sku || '') + ' ' + (i.category || '') + ' ' + (i.supplier || ''))
          .toLowerCase()
          .includes(q)
      );
    }
    return [...list].sort((a, b) => (isLowStock(b) - isLowStock(a)) || a.name.localeCompare(b.name));
  }, [items, activeCategory, search]);

  const totalUnits = items.reduce((s, i) => s + Number(i.qty || 0), 0);
  const totalValue = items.reduce((s, i) => s + Number(i.qty || 0) * Number(i.cost || 0), 0);
  const lowCount = items.filter(isLowStock).length;

  const detailItem = items.find((i) => i.id === detailItemId) || null;

  // ---- Handlers ----
  const openAddModal = (item) => { setEditingItem(item || null); setAddModalVisible(true); };
  const closeAddModal = () => { setAddModalVisible(false); setScannedCode(null); };

  const handleSaveItem = (data) => {
    if (editingItem) {
      setItems((prev) => prev.map((i) => (i.id === editingItem.id ? { ...i, ...data } : i)));
    } else {
      const newItem = { id: uid(), createdAt: Date.now(), ...data };
      setItems((prev) => [...prev, newItem]);
      if (data.qty > 0) {
        setLogs((prev) => [...prev, { id: uid(), itemId: newItem.id, type: 'in', qty: data.qty, note: 'Initial stock', ts: Date.now() }]);
      }
    }
    closeAddModal();
  };

  const handleDeleteItem = () => {
    setItems((prev) => prev.filter((i) => i.id !== detailItemId));
    setLogs((prev) => prev.filter((l) => l.itemId !== detailItemId));
    setDetailItemId(null);
  };

  const openAdjust = (mode) => { setAdjustMode(mode); setAdjustVisible(true); };

  const handleConfirmAdjust = (qty, note) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== detailItemId) return i;
        const newQty = adjustMode === 'in' ? i.qty + qty : Math.max(0, i.qty - qty);
        return { ...i, qty: newQty };
      })
    );
    setLogs((prev) => [...prev, { id: uid(), itemId: detailItemId, type: adjustMode, qty, note, ts: Date.now() }]);
    setAdjustVisible(false);
  };

  const openScanner = (target) => { setScanTarget(target); setScannerVisible(true); };

  const handleScanned = (code) => {
    setScannerVisible(false);
    if (scanTarget === 'form') {
      setScannedCode(code);
    } else {
      setSearch(code);
      const match = items.find((i) => i.sku === code);
      if (match) setDetailItemId(match.id);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.brandTitle}>Stockroom</Text>
          <Text style={styles.brandTag}>{items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'}</Text>
        </View>
        <View style={styles.statsRow}>
          <StatChip num={totalUnits.toLocaleString()} label="Total units" />
          <StatChip num={`£${totalValue.toFixed(0)}`} label="Stock value" />
          <StatChip num={lowCount} label="Low stock" low />
        </View>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Text style={{ color: colors.muted }}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search name, SKU, or barcode..."
            placeholderTextColor={colors.muted}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ gap: 6 }}>
        <Chip label="All" active={activeCategory === 'all'} onPress={() => setActiveCategory('all')} />
        <Chip label="Low stock" active={activeCategory === 'low'} onPress={() => setActiveCategory('low')} />
        {categories.map((c) => (
          <Chip key={c} label={c} active={activeCategory === c} onPress={() => setActiveCategory(c)} />
        ))}
      </ScrollView>

      <FlatList
        data={filteredItems}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ItemCard item={item} onPress={() => setDetailItemId(item.id)} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyBig}>{items.length === 0 ? 'No items yet' : 'Nothing matches'}</Text>
            <Text style={styles.emptySmall}>
              {items.length === 0 ? 'Tap + to add your first item' : 'Try a different search or filter'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.scanFab} onPress={() => openScanner('search')}>
        <Text style={styles.scanFabIcon}>▤</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.fab} onPress={() => openAddModal(null)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <AddItemModal
        visible={addModalVisible}
        item={editingItem}
        onClose={closeAddModal}
        onSave={handleSaveItem}
        onScanRequest={() => openScanner('form')}
        scannedCode={scannedCode}
      />

      <ItemDetailModal
        visible={!!detailItem}
        item={detailItem}
        logs={logs}
        onClose={() => setDetailItemId(null)}
        onEdit={() => { openAddModal(detailItem); setDetailItemId(null); }}
        onDelete={handleDeleteItem}
        onStockIn={() => openAdjust('in')}
        onStockOut={() => openAdjust('out')}
      />

      <AdjustStockModal
        visible={adjustVisible}
        mode={adjustMode}
        onClose={() => setAdjustVisible(false)}
        onConfirm={handleConfirmAdjust}
      />

      <ScannerModal
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScanned={handleScanned}
      />
    </SafeAreaView>
  );
}

function StatChip({ num, label, low }) {
  return (
    <View style={styles.statChip}>
      <Text style={[styles.statNum, low && { color: colors.red }]}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingTop: StatusBar.currentHeight || 0 },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 6 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  brandTitle: { color: colors.text, fontSize: 22, fontWeight: '700' },
  brandTag: { color: colors.muted, fontSize: 11, fontFamily: 'monospace', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  statChip: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 10, padding: 10 },
  statNum: { color: colors.text, fontSize: 20, fontWeight: '700', fontFamily: 'monospace' },
  statLabel: { color: colors.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 3 },
  searchWrap: { paddingHorizontal: 16, paddingTop: 12 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 15 },
  filterRow: { paddingHorizontal: 16, marginTop: 10, flexGrow: 0 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
    borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.amber, borderColor: colors.amber },
  chipText: { color: colors.muted, fontSize: 12, fontFamily: 'monospace' },
  chipTextActive: { color: '#12151A', fontWeight: '700' },
  list: { padding: 16, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 20 },
  emptyBig: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySmall: { color: colors.muted, fontSize: 14 },
  fab: {
    position: 'absolute', right: 18, bottom: 24, width: 56, height: 56, borderRadius: 16,
    backgroundColor: colors.amber, alignItems: 'center', justifyContent: 'center',
    elevation: 6, shadowColor: colors.amber, shadowOpacity: 0.4, shadowRadius: 10,
  },
  fabIcon: { fontSize: 28, fontWeight: '700', color: '#12151A' },
  scanFab: {
    position: 'absolute', right: 84, bottom: 24, width: 56, height: 56, borderRadius: 16,
    backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line,
    alignItems: 'center', justifyContent: 'center',
  },
  scanFabIcon: { fontSize: 22, color: colors.text },
});
