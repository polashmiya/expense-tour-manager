import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

const TourScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tour Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 24,
  },
});

export default TourScreen
