import React, { useEffect,useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  Button,
  TextInput,
  ScrollView,
  View,
} from 'react-native';
import axios from 'axios';
import { requestReadSMSPermission, startReadSMS} from 'react-native-sms-receiver/Receiver';
 
const Separator = () => <View style={styles.separator} />;
const Separator1 = () => <View style={styles.separator1} />;
export default function App() {
  const [data,setData] = useState();
  const [token, setToken] = useState(null);
  const [pulse, setPulse] = useState(null);

  const startReadingMessages = async () => {
    const hasPermission = await requestReadSMSPermission();
    if(hasPermission) {
      startReadSMS((status: any, sms: any, error: any) => {
        if (status == "success") {
          // console.log("Great 🤠 !! you have received new sms:", sms);
          setData(sms);
          try{
            if(sms.indexOf("เงินเข้า") != -1 && sms.indexOf("คงเหลือ") != -1 && sms.indexOf("บ.") == -1 && sms.indexOf("+") == -1){
              const  messageread = sms.substring(sms.indexOf("message")+11,sms.length-2);
              const  coins = sms.substring(sms.indexOf("เงินเข้า")+8,sms.indexOf(".")+3);
              writePulse(coins);
              console.log(sms);
              console.log("กรุงเทพ");
              console.log(sms.indexOf("เงินเข้า"));
              // return;
            } else if(sms.indexOf("รับโอนจาก") != -1 && sms.indexOf("คงเหลือ") != -1){
              const  coins = sms.substring(sms.indexOf(" ",70)+1,sms.indexOf("คงเหลือ")-2);
              writePulse(coins);
              console.log(sms);
              console.log("กสิกร");
              // return;
            } else if(sms.indexOf("เงินเข้า") != -1 && sms.indexOf("+") != -1 && sms.indexOf("บ.") != -1 && sms.indexOf("ใช้ได้") != -1){
              const  coins = sms.substring(sms.indexOf("+")+1,sms.indexOf("บ."));
              writePulse(coins);
              console.log(sms);
              console.log("กรุงไทย");
              // return;
            } else if(sms.indexOf("คงเหลือ") == -1 && sms.indexOf("เหลือ") != -1 && sms.indexOf("(") != -1 && sms.indexOf(")") != -1){
              // const  coins = sms.substring(10,15);
              const  coins = sms.substring(sms.indexOf("xxx")+11,sms.indexOf(".")+3);
              writePulse(coins);
              // console.log(coins);
              console.log("กรุงศรี");
              // return;
            }
            
          }catch{

          }
          
        }
      });
    }
  }
 
  useEffect(() => {
    startReadingMessages();
  }, [])
  // useEffect(() => {
  //   try{
  //     const  messageread = data.substring(data.indexOf("message")+11,data.length-2);
  //     const  coins = data.substring(data.indexOf("เงินเข้า")+8,data.indexOf("คงเหลือ")-3);
  //     writePulse(coins)
  //     console.log(coins);
  //   }catch{
  //   }
    
  // }, [data])
 
  useEffect(() => {
    readToken();
  }, []);

  function readToken() {
    axios
      .get(
        'https://esp32pulse-default-rtdb.asia-southeast1.firebasedatabase.app/.json',
      )
      .then((res) => {
        setToken(res.data.linetoken);
        setPulse(res.data.pulse);
        console.log(res.data.pulse);
      });
  }
  function writeToken() {
    axios.patch(
      'https://esp32pulse-default-rtdb.asia-southeast1.firebasedatabase.app/.json',
      {linetoken: token},
    );
  }

  function writePulse(pulse2) {
    axios.patch(
      'https://esp32pulse-default-rtdb.asia-southeast1.firebasedatabase.app/.json',
      {pulse: pulse2, state: true},
    );
  }
  return (
    <>
    <StatusBar barStyle="dark-content" />
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* <Text>An Example for React Native Foreground Service. </Text>
      <Button title={'Start'} onPress={onStart} />
      <Button title={'Stop'} onPress={onStop} /> */}
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <TextInput
          style={styles.input2}
          onChangeText={setToken}
          value={token}
          keyboardType="default"
        />

        {/* vM2TFPuKJ0Pph9iEL1oID6nsS87dWQz5kdSuQcW5bSK */}
        <Button title="Read Token" onPress={readToken} color="#0072B7" />
        <Separator />
        <Button title="Set Token" onPress={writeToken} color="#03AA00" />
        <Separator1 />
 
        
        {/* <Button
          title={'_onPhoneNumberPressed'}
          onPress={_onPhoneNumberPressed}
          color="#AF0000"
        /> */}
        <Separator />
        
      </ScrollView>
    </SafeAreaView>
  </>
  );
}

const styles = StyleSheet.create({
  input2: {
    height: 40,
    width: 350,
    margin: 12,
    marginTop: 50,
    borderWidth: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  separator: {
    marginVertical: 4,
    borderBottomColor: '#737373',
    // borderBottomWidth: StyleSheet.hairlineWidth,
  },
  separator1: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});