import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  Button,
  TextInput,
  ScrollView,
  View,
  Switch,
  Alert,
} from 'react-native';
import {AsyncStorage, Storage} from 'react-native-storage';
import axios from 'axios';
import {
  requestReadSMSPermission,
  startReadSMS,
} from 'react-native-sms-receiver/Receiver';
import DeviceInfo from 'react-native-device-info';
import {storage} from './InitStroe';
import SelectDropdown from 'react-native-select-dropdown';
const Separator = () => <View style={styles.separator} />;
const Separator1 = () => <View style={styles.separator1} />;
export default function App() {
  const [data, setData] = useState();
  const [token, setToken] = useState(null);
  const [pulse, setPulse] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [flagStart, setFlagStart] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [linetoken, setLinetoken] = useState('');
  const [device_id, setDevice_id] = useState();
  const [device_tel, setDevice_tel] = useState();
  const [device_state, setDevice_state] = useState();
  const [device_onoff, setDevice_onoff] = useState(0);
  const [device_bath, setDevice_bath] = useState();
  const [txtsms, setTxtsms] = useState('');
  var aaaaa = '';
  const [tel1, setTel1] = useState('');
  const [amount, setAmount] = useState('');
  const readMess = mes => {
    console.log('mes = ' + mes);
    console.log('phoneNumber = ' + aaaaa);
  };
  const startReadingMessages = async () => {
    try {
      const hasPermission = await requestReadSMSPermission();
      if (hasPermission) {
        startReadSMS((status, sms, error) => {
          if (status == 'success') {
            const mes = JSON.parse(sms).message;
            // readMess(mes);
            // console.log("device_onoff = ");
            if (phoneNumber.length > 9) {
              console.log('https://api.pcdservice.info/device/' + phoneNumber);
              axios
                .get('https://api.pcdservice.info/device/' + phoneNumber)
                .then(res => {
                  if (res.data.data[0].device_onoff == 1) {
                    if (mes.indexOf('เงินเข้า') != -1) {
                      const index1 = mes.indexOf('เงินเข้า') + 8;
                      const index2 = mes.indexOf('.', index1) + 3;
                      console.log(mes.substring(index1, index2));
                      const bath = mes.substring(index1, index2);

                      setAmount('ครั้งล่าสุด : ' + bath + ' บาท');
                      console.log(
                        mes.substring(
                          mes.indexOf('เงินเข้า') + 8,
                          mes.indexOf('คงเหลือ') - 4,
                        ),
                      );
                      setTxtsms(mes);
                      axios.put('https://api.pcdservice.info/device', {
                        device_id: res.data.data[0].device_id,
                        device_state: 1,
                        device_onoff: res.data.data[0].device_onoff,
                        device_tel: res.data.data[0].device_tel,
                        device_bath: bath,
                      });
                      setTimeout(() => {
                        setTxtsms('');
                      }, 10000);
                    } else if (mes.indexOf('รับโอนจาก') != -1) {
                      
              const index1 = mes.indexOf('รับโอนจาก');
              const index2 = mes.indexOf(' ', index1) + 1;
              const index3 = mes.indexOf('.', index2) + 3;
              const bath = mes.substring(index2,index3);
                      setAmount('ครั้งล่าสุด : ' + bath + ' บาท');
                      console.log(
                        mes.substring(
                          mes.indexOf(' ', index1) + 1,
                          mes.indexOf('คงเหลือ') - 5,
                        ),
                      );
                      setTxtsms(mes);
                      axios.put('https://api.pcdservice.info/device', {
                        device_id: res.data.data[0].device_id,
                        device_state: 1,
                        device_onoff: res.data.data[0].device_onoff,
                        device_tel: res.data.data[0].device_tel,
                        device_bath: bath,
                      });
                      setTimeout(() => {
                        setTxtsms('');
                      }, 10000);
                    }
                  }
                }); // axios.get
            }
          }
        });
      }
    } catch {}
  };

  useEffect(() => {
    // console.log("123"+phoneNumber.length);
    // if(phoneNumber.length != 0)
    startReadingMessages();
  }, [phoneNumber]);

  // useEffect(() => {
  //   DeviceInfo.getPhoneNumber().then((getPhoneNumber) => {
  //     console.log(getPhoneNumber);
  //     let model = DeviceInfo.getModel();
  //     console.log(model);

  //     setPhoneNumber(getPhoneNumber);
  //     axios.get("https://api.pcdservice.info/device/0620243887").then((res) => {
  //       console.log(res.data.data[0].device_state);
  //       setLinetoken(res.data.linetoken);
  //       setDevice_id(res.data.data[0].device_id);
  //       setDevice_tel(res.data.data[0].device_tel);
  //       setDevice_state(res.data.data[0].device_state);
  //       setDevice_onoff(res.data.data[0].device_onoff);
  //       setDevice_bath(res.data.data[0].device_bath);
  //   });
  //   });
  // }, [])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log('This will run every second!');
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   try{
  //     const  messageread = data.substring(data.indexOf("message")+11,data.length-2);
  //     const  coins = data.substring(data.indexOf("เงินเข้า")+8,data.indexOf("คงเหลือ")-3);
  //     writePulse(coins)
  //     console.log(coins);
  //   }catch{
  //   }

  // }, [data])
  /** // <View style={styles.container}>
    {/* <StatusBar barStyle="light-content"/>
    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Phone Number : {phoneNumber}</Text>
      <Text>device_state : {device_state}</Text>
      <Text>device_onoff : {device_onoff}</Text>
      <Switch/>
    <TextInput
          style={styles.input2}
          // onChangeText={setToken}
          value={linetoken}
          keyboardType="default"
        />
    </SafeAreaView> } */

  const countries = [];
  const [down, setDown] = useState();
  const [flagFetch, setFlagFetch] = useState(false);
  useEffect(() => {
    // storage.save({
    //   key: 'loginState', // Note: Do not use underscore("_") in key!
    //   data: {
    //     from: 'some other site',
    //     userid: 'some userid',
    //     token: 'some token'
    //   },
    //   expires: 1000 * 3600
    // });
    try {
      setFlagFetch(false);
      axios.get('https://api.pcdservice.info/device').then(res => {
        res.data.data.map((data, key) => {
          console.log(data.device_tel);
          countries.push(data.device_tel);
          setDown(countries);
        });
        setTimeout(() => {
          setFlagFetch(true);
          console.log(countries);
          // fetchData();
        }, 2000);
      });
    } catch {}
  }, []);

  const updateLineToken = () => {
    try {
      console.log(linetoken);
      axios
        .put('https://api.pcdservice.info/config', {
          config_name: 'linetoken',
          config_value: linetoken,
        })
        .then(res => {
          fetchData();
          Alert.alert('แจ้งเตือน', 'อัพเดทข้อมูลสำเร็จ');
        });
    } catch {}
  };

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    console.log(!isEnabled);
    axios
      .put('https://api.pcdservice.info/device', {
        device_id: device_id,
        device_state: 0,
        device_onoff: !isEnabled == true ? 1 : 0,
        device_tel: device_tel,
        device_bath: device_bath,
      })
      .then(res => {
        fetchData();
        Alert.alert('แจ้งเตือน', 'อัพเดทข้อมูลสำเร็จ');
      });
  };

  const fetchData = () => {
    try {
      axios
        .get('https://api.pcdservice.info/device/' + phoneNumber)
        .then(res => {
          console.log(res.data.data[0].device_onoff);
          setLinetoken(res.data.linetoken);
          setDevice_id(res.data.data[0].device_id);
          setDevice_tel(res.data.data[0].device_tel);
          setDevice_onoff(res.data.data[0].device_onoff);
          setIsEnabled(res.data.data[0].device_onoff == 1 ? true : false);
          setDevice_bath(res.data.data[0].device_bath);
        });
    } catch {}
  };

  const updatePhonenumber = () => {
    console.log(phoneNumber);
    setTel1(phoneNumber);
    aaaaa = phoneNumber;
    // setPhoneNumber
  };

  return (
    <SafeAreaView style={styles.container}>
      {flagFetch == true ? (
        <SelectDropdown
          data={down}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
            setPhoneNumber(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
        />
      ) : null}

      {/* <Button title="SET Phone number" color="#31AF00" onPress={updatePhonenumber} /> */}

      <Button title="READ DATA" color="#31AF00" onPress={fetchData} />

      {/* <TextInput
          value={linetoken}
          keyboardType="default"
          onChangeText={setLinetoken}
          style={styles.input}
      />
      <Button title="UPDATE LINE TOKEN" color="#31AF00" onPress={updateLineToken} /> */}
      <TextInput
        value={device_tel}
        keyboardType="number-pad"
        onChangeText={setDevice_tel}
        style={styles.input}
        maxLength={10}
      />
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        style={styles.input}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <Text>{txtsms}</Text>
      <Text>{amount}</Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ECF0F1',
  },
  buttonsContainer: {
    padding: 10,
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
