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

  const countries = [];
  const [down, setDown] = useState();
  const [flagFetch, setFlagFetch] = useState(false);

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
            console.log('mes = ' + mes);
            if (mes.indexOf('เงินเข้า') != -1) {
              const index1 = mes.indexOf('เงินเข้า') + 8;
              const index2 = mes.indexOf('.', index1) + 3;
              console.log(mes.substring(index1, index2));
              const bath = mes.substring(index1, index2);
              setAmount('ครั้งล่าสุด : ' + bath + ' บาท');
              setTxtsms(mes);
              axios
                .get(
                  'https://api.pcdservice.info/device3/' +
                    phoneNumber +
                    '/' +
                    bath,
                )
                .then(res1 => {
                  if (res1.data.data.device3_onoff == '1') {
                    axios.put('https://api.pcdservice.info/device3', {
                      device3_onoff: 1,
                      device3_state: 1,
                      device3_amount: bath,
                      device3_tel: phoneNumber,
                    });
                  }
                  setTimeout(() => {
                    setTxtsms('');
                  }, 10000);
                });
            } else if (mes.indexOf('รับโอนจาก') != -1) {
              const index1 = mes.indexOf('รับโอนจาก');
              const index2 = mes.indexOf(' ', index1) + 1;
              const index3 = mes.indexOf('.', index2) + 3;
              const bath = mes.substring(index2, index3);

              setAmount('ครั้งล่าสุด : ' + bath + ' บาท');
              setTxtsms(mes);

              axios
                .get(
                  'https://api.pcdservice.info/device3/' +
                    phoneNumber +
                    '/' +
                    bath,
                )
                .then(res1 => {
                  if (res1.data.data.device3_onoff == '1') {
                    axios.put('https://api.pcdservice.info/device3', {
                      device3_onoff: '1',
                      device3_state: '1',
                      device3_amount: bath,
                      device3_tel: phoneNumber,
                    });
                  }
                });

              setTimeout(() => {
                setTxtsms('');
              }, 10000);
            }
          }
        });
      }
    } catch {}
  };

  useEffect(() => {
    startReadingMessages();
  }, [phoneNumber]);
  // useEffect(() => {
  //   try {
  //     setFlagFetch(false);
  //     axios.get('https://api.pcdservice.info/device').then(res => {
  //       res.data.data.map((data, key) => {
  //         console.log(data.device_tel);
  //         countries.push(data.device_tel);
  //         setDown(countries);
  //       });
  //       setTimeout(() => {
  //         setFlagFetch(true);
  //         console.log(countries);
  //         // fetchData();
  //       }, 2000);
  //     });
  //   } catch {}
  // }, []);

  // const updateLineToken = () => {
  //   try {
  //     console.log(linetoken);
  //     axios
  //       .put('https://api.pcdservice.info/config', {
  //         config_name: 'linetoken',
  //         config_value: linetoken,
  //       })
  //       .then(res => {
  //         fetchData();
  //         Alert.alert('แจ้งเตือน', 'อัพเดทข้อมูลสำเร็จ');
  //       });
  //   } catch {}
  // };

  // const toggleSwitch = () => {
  //   setIsEnabled(previousState => !previousState);
  //   console.log(!isEnabled);
  //   axios
  //     .put('https://api.pcdservice.info/device', {
  //       device_id: device_id,
  //       device_state: 0,
  //       device_onoff: !isEnabled == true ? 1 : 0,
  //       device_tel: device_tel,
  //       device_bath: device_bath,
  //     })
  //     .then(res => {
  //       fetchData();
  //       Alert.alert('แจ้งเตือน', 'อัพเดทข้อมูลสำเร็จ');
  //     });
  // };

  // const fetchData = () => {
  //   try {
  //     axios
  //       .get('https://api.pcdservice.info/device/' + phoneNumber)
  //       .then(res => {
  //         console.log(res.data.data[0].device_onoff);
  //         setLinetoken(res.data.linetoken);
  //         setDevice_id(res.data.data[0].device_id);
  //         setDevice_tel(res.data.data[0].device_tel);
  //         setDevice_onoff(res.data.data[0].device_onoff);
  //         setIsEnabled(res.data.data[0].device_onoff == 1 ? true : false);
  //         setDevice_bath(res.data.data[0].device_bath);
  //       });
  //   } catch {}
  // };

  // const updatePhonenumber = () => {
  //   console.log(phoneNumber);
  //   setTel1(phoneNumber);
  //   aaaaa = phoneNumber;
  //   // setPhoneNumber
  // };

  const [device3, setDevice3] = useState([]);
  useEffect(() => {
    axios.get('https://api.pcdservice.info/device3').then(res => {
      // setDevice3(res.data.data);
      // console.log(res.data.data);
      res.data.data.map((data, key) => {
        console.log(data.device3_tel);
        countries.push(data.device3_tel);
        setDown(countries);
      });
      setFlagFetch(true);
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>PCD SERVICE 3</Text>
      <Text style={styles.statusText}>Status : Ready</Text>

      <Text tyle={styles.textStyle}>{txtsms}</Text>
      <Text tyle={styles.textStyle}>{amount}</Text>
      {flagFetch == true ? (
        <SelectDropdown
          data={down}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
            setPhoneNumber(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ECF0F1',
    textAlign: 'center',
  },
  buttonsContainer: {
    padding: 10,
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
  },
  statusText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'green',
  },
});
