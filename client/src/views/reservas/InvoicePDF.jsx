import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30
  },
  section: {
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center'
  }
});

const InvoicePDF = ({ reservation, total }) => {
  // Asegurarse de que reservation tenga valores por defecto
  const safeReservation = reservation || {
    reservationCode: '',
    client: { firstName: '', lastName: '', idNumber: '' },
    activity: { type: '', description: '' },
    reservationDate: '',
    paymentMethod: 'USD'
  };

  // Asegurarse de que total sea un número válido
  const safeTotal = typeof total === 'number' ? total : 0;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Factura #{safeReservation.reservationCode}</Text>
          
          <Text>Cliente: {safeReservation.client.firstName} {safeReservation.client.lastName}</Text>
          <Text>Cédula: {safeReservation.client.idNumber}</Text>
          
          <Text>Actividad: {safeReservation.activity.type}</Text>
          <Text>Descripción: {safeReservation.activity.description}</Text>
          
          <Text>Fecha: {safeReservation.reservationDate}</Text>
          <Text>Método de pago: {safeReservation.paymentMethod}</Text>
          
          {/* Línea corregida - usando safeTotal en lugar de total directamente */}
          <Text>Total: {safeTotal.toFixed(2)} {safeReservation.paymentMethod}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;