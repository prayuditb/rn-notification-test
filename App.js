/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import firebase from 'react-native-firebase';

class App extends React.Component {

  listenMessages() {
    const channel = new firebase.notifications.Android.Channel('weplayvendor', 'WeplayVendor', firebase.notifications.Android.Importance.Max)
      .setDescription('Weplay vendor notification channel');
    firebase.notifications().android.createChannel(channel);
    firebase.notifications().getInitialNotification().then((notificationOpen) => {
      if (__DEV__) console.log("getInitialNotification", notificationOpen)
      if (notificationOpen) {
        const { notification } = notificationOpen;
        this.processNotification(notification);
      }
    });
    firebase.notifications().onNotificationOpened(({ notification }) => {
      if (__DEV__) console.log("onNotificationOpened", { onNotificationOpened: notification });
      this.processNotification(notification);
    });
  
    firebase.notifications().onNotification(async (notification) => {
      if (__DEV__) console.log("onNotification", { onNotification: notification });
      try {
          const localNotification = this.constructNotification(notification)
          await firebase.notifications().displayNotification(localNotification);
      } catch (e) {
        console.log({ notificationError: e });
      }
    });

    firebase.messaging().onTokenRefresh((fcmToken) => {
      console.log("fcmToken", fcmToken)
    })

    firebase.messaging().getToken().then((fcmToken) => {
      console.log("fcmToken", fcmToken)
    }).catch(() => {})
  }

  async processNotification(notification) {
    let {  notificationId, data = {} } = notification
    console.log("processNotification", notification)
    
    firebase.notifications().removeDeliveredNotification(notificationId);
  }

  constructNotification = (notification) => {
    const localNotification = new firebase.notifications.Notification({ show_in_foreground: true })
      .setNotificationId(notification.notificationId)
      .setTitle(notification.title)
      .setSubtitle(notification.subtitle)
      .setBody(notification.body)
      .setData(notification.data)
      .setSound('default');
    if (Platform.OS === 'android') {
        localNotification.android.setBigText(notification.body)
        .android.setChannelId('weplayvendor')
        .android.setSmallIcon('ic_notification')
        .android.setColor(Colors.header)
        .android.setPriority(firebase.notifications.Android.Priority.High)
        return localNotification
    }
    localNotification.ios.setBadge(notification.ios.badge)
    return localNotification
  }

  componentDidMount() {
    this.listenMessages()
  }

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Step One</Text>
                <Text style={styles.sectionDescription}>
                  Edit <Text style={styles.highlight}>App.js</Text> to change this
                  screen and then come back to see your edits.
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>See Your Changes</Text>
                <Text style={styles.sectionDescription}>
                  <ReloadInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Debug</Text>
                <Text style={styles.sectionDescription}>
                  <DebugInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Learn More</Text>
                <Text style={styles.sectionDescription}>
                  Read the docs to discover what to do next:
                </Text>
              </View>
              <LearnMoreLinks />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}


const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
