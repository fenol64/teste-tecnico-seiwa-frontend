import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { DoctorsScreen } from './src/screens/DoctorsScreen';
import { HospitalsScreen } from './src/screens/HospitalsScreen';
import { ProductionsScreen } from './src/screens/ProductionsScreen';
import { RepassesScreen } from './src/screens/RepassesScreen';
import { RepasseDetailScreen } from './src/screens/RepasseDetailScreen';
import { DoctorDetailScreen } from './src/screens/DoctorDetailScreen';
import { DoctorCreateScreen } from './src/screens/DoctorCreateScreen';
import { HospitalCreateScreen } from './src/screens/HospitalCreateScreen';
import { HospitalDetailScreen } from './src/screens/HospitalDetailScreen';
import { ProductionCreateScreen } from './src/screens/ProductionCreateScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
            headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Doctors" component={DoctorsScreen} />
        <Stack.Screen name="DoctorCreate" component={DoctorCreateScreen} />
        <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
        <Stack.Screen name="Hospitals" component={HospitalsScreen} />
        <Stack.Screen name="HospitalCreate" component={HospitalCreateScreen} />
        <Stack.Screen name="HospitalDetail" component={HospitalDetailScreen} />
        <Stack.Screen name="Productions" component={ProductionsScreen} />
        <Stack.Screen name="ProductionCreate" component={ProductionCreateScreen} />
        <Stack.Screen name="Repasses" component={RepassesScreen} />
        <Stack.Screen name="RepasseDetail" component={RepasseDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
