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
  },
  calculation: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5
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
          
          <View style={styles.calculation}>
            <Text>Precio base: {reservation.activity.price.USD.toFixed(2)} USD</Text>
            <Text>Tasa de cambio aplicada:</Text>
            <Text>- EUR: 1 USD = 0.85 EUR</Text>
            <Text>- COP: 1 USD = 3800 COP</Text>
            <Text>- VES: 1 USD = 36.50 VES (BCV)</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Método de Pago:</Text>
            <Text style={styles.value}>{reservation.paymentMethod}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Total a Pagar:</Text>
            <Text style={styles.value}>
              {total.toFixed(2)} {reservation.paymentMethod}
              {reservation.paymentMethod !== 'USD' && (
                <Text> ({reservation.activity.price.USD.toFixed(2)} USD)</Text>
              )}
            </Text>
          </View>
        </View>
    </Page>
  </Document>
);

export default InvoicePDF;