import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors, radius } from '../theme';

export default function ScannerModal({ visible, onClose, onScanned }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);

  const handleScan = (result) => {
    if (locked) return;
    setLocked(true);
    onScanned(result.data);
    setTimeout(() => setLocked(false), 800);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.topbar}>
          <Text style={styles.title}>SCAN BARCODE</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeX}>×</Text>
          </TouchableOpacity>
        </View>

        {!permission ? (
          <View style={styles.fallback}>
            <Text style={styles.fallbackText}>Checking camera permission...</Text>
          </View>
        ) : !permission.granted ? (
          <View style={styles.fallback}>
            <Text style={styles.fallbackText}>Stockroom needs camera access to scan barcodes.</Text>
            <TouchableOpacity style={styles.btn} onPress={requestPermission}>
              <Text style={styles.btnText}>Grant camera access</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={onClose}>
              <Text style={[styles.btnText, { color: colors.text }]}>Enter code manually</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
              }}
              onBarcodeScanned={handleScan}
            />
            <View style={styles.frame} pointerEvents="none" />
            <Text style={styles.hint}>Align barcode within the frame</Text>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topbar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    zIndex: 2,
  },
  title: { color: '#fff', fontFamily: 'monospace', fontSize: 12, letterSpacing: 1 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeX: { color: '#fff', fontSize: 22, lineHeight: 22 },
  frame: {
    position: 'absolute',
    top: '38%', left: '11%', right: '11%',
    height: 160,
    borderWidth: 2,
    borderColor: colors.amber,
    borderRadius: radius.lg,
  },
  hint: {
    position: 'absolute',
    bottom: 50, left: 0, right: 0,
    textAlign: 'center',
    color: '#fff',
    opacity: 0.8,
    fontSize: 13,
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  fallbackText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: colors.amber,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.md,
    marginTop: 10,
    width: '100%',
  },
  btnSecondary: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  btnText: {
    color: '#12151A',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 15,
  },
});
