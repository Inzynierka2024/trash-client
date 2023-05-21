import React, { useContext } from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image
  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from "../../../theme/theme";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, SocialIcon } from "react-native-elements";
import GoogleSVG from '../../../../assets/google.png';
import FacebookSVG from '../../../../assets/facebook.png';
import TwitterSVG from '../../../../assets/twitter.png';
import InputField from '../../Utils/InputField';

export const LoginForm = () => {

  const themeFromContext = useContext(ThemeContext);
  

    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
          <View style={{paddingHorizontal: 25}}>
        
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                fontSize: 28,
                fontWeight: '500',
                color: '#333',
                marginBottom: 30,
              }}>
              
            </Text>
    
             <InputField
                    label={'Email ID'}
                    icon={<MaterialIcons
                        name="alternate-email"
                        size={20}
                        color="#666"
                        style={{ marginRight: 5 }} />} inputType="text" fieldButtonLabel={""} fieldButtonFunction={() =>{}}/>
    
    <InputField
              label={'Password'}
              icon={
                <Ionicons
                name="ios-lock-closed-outline"
                size={20}
                color="#666"
                style={{marginRight: 5}}
              />
              }
              inputType="password"
              fieldButtonLabel={"Forgot?"}
              fieldButtonFunction={() => {}}
            />
            
            <Button title="Login"/>
    
            <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>
              Or, login with ...
            </Text>
    
             <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                 marginBottom: 30,
              }}
                >
              <TouchableOpacity
                
                style={{
                  borderColor: '#ddd',
                  borderWidth: 2,
                  borderRadius: 10,
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                }}>

                <Image source={require('../../../../assets/google.png')} style ={styles.FacebookStyle}/>
              </TouchableOpacity>
               <TouchableOpacity
                
                style={{
                    borderColor: '#ddd',
                    borderWidth: 2,
                    borderRadius: 10,
                    paddingHorizontal: 30,
                    paddingVertical: 10,
                  }}>
                <Image source={require('../../../../assets/facebook.png')} style ={styles.FacebookStyle}/>
              </TouchableOpacity>
              <TouchableOpacity
                
                style={{
                  borderColor: '#ddd',
                  borderWidth: 2,
                  borderRadius: 10,
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                }}>
                <Image source={require('../../../../assets/twitter.png')} style ={styles.FacebookStyle}/>
                
              </TouchableOpacity>
        </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                 marginBottom: 30,
              }}>
              <Text>New to the app?</Text>
              <TouchableOpacity>
                <Text style={{color: '#0599FD', fontWeight: '700'}}> Register</Text>
              </TouchableOpacity>
            </View> 
          </View>
        </SafeAreaView>
      );
};

export default LoginForm;

const styles = StyleSheet.create({
    FacebookStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    
    height: 24,
    width:24,
    
    margin: 5
  }
});


