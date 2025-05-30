import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 10
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10
  },
  section: {
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    width: 150,
    fontWeight: 'bold'
  },
  value: {
    flex: 1
  },
  total: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  priceTable: {
    width: '100%',
    marginTop: 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderCollapse: 'collapse'
  },
  priceRow: {
    flexDirection: 'row'
  },
  priceCell: {
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    width: '25%'
  },
  priceHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0'
  }
});

const InvoicePDF = ({ reservation, total }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>FACTURA DE RESERVACIÓN</Text>
        <Text style={styles.subtitle}>Código: {reservation.reservationCode}</Text>
        <Text style={styles.subtitle}>Fecha: {reservation.reservationDate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos de la Actividad</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>{reservation.activity.type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ubicación:</Text>
          <Text style={styles.value}>{reservation.activity.location}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos del Cliente</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{reservation.client.firstName} {reservation.client.lastName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Cédula:</Text>
          <Text style={styles.value}>{reservation.client.idNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{reservation.client.phone}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalles de Pago</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Método de Pago:</Text>
          <Text style={styles.value}>{reservation.paymentMethod}</Text>
        </View>
        
        <View style={styles.priceTable}>
          <View style={[styles.priceRow, styles.priceHeader]}>
            <View style={styles.priceCell}><Text>Moneda</Text></View>
            <View style={styles.priceCell}><Text>Precio</Text></View>
            <View style={styles.priceCell}><Text>Tasa (Bs)</Text></View>
            <View style={styles.priceCell}><Text>Total (Bs)</Text></View>
          </View>
          
          <View style={styles.priceRow}>
            <View style={styles.priceCell}><Text>USD</Text></View>
            <View style={styles.priceCell}><Text>{reservation.activity.price.USD.toFixed(2)}</Text></View>
            <View style={styles.priceCell}><Text>36.50</Text></View>
            <View style={styles.priceCell}><Text>{reservation.activity.price.VES.toFixed(2)}</Text></View>
          </View>
        </View>
      </View>

      <View style={styles.total}>
        <Text>TOTAL A PAGAR: {reservation.activity.price.VES.toFixed(2)} Bs</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;