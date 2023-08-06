import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Logic/AuthContext';
import { TextInput } from 'react-native-gesture-handler';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [onLogin, onRegister] = useAuth();

  //TEST
  useEffect(()=>{
    const testCall = async() => {
      const result = await axios.get(`${API_URL}/users`);

      console.log("result: ", result);
    }
    testCall();
  }, []);

  const login = async () => {
    const result = await onLogin!(email, password);
    if(result && result.error) alert(result.msg);
  };

  const register = async () => {
    const result = await onRegister!(email, password);
    if(result && result.error) alert(result.msg);
    else login();
  };

  return (
    <View> 
      <View>
        <TextInput placeholder='Email' onChangeText={(text: string)=> setEmail(text)} value = {email}/>
        <TextInput placeholder='Password' secureTextEntry={true} onChangeText={(text: string) => setPassword(text)} value = {password}/>
        <Button onPress={login} title='Sign in'/>
        <Button onPress={register} title='Create Account'/>
      </View>
    </View>
  )
}

export default LoginForm

const styles = StyleSheet.create({
  image: {
  width: '50%',
  height: '50%',
  resizeMode: 'contain'
  },
  form: {
  gap: 10,
  width: '60%'
  },
  input: {
  height: 44,
  borderWidth: 1,
  borderRadius: 4,
  padding: 10,
  backgroundColor: '#fff'
  },
  container: {
  alignItems: 'center’',
  width: '100%'
  }})