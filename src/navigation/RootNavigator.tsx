import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAuthStore } from '../hooks/useAuthStore';
import AuthScreen from '../screens/AuthScreen';
import MainTabs from './MainTabs';
import BookDetailScreen from '../screens/BookDetailScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import UsernameSetupScreen from '../screens/UsernameSetupScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const needsUsernameSetup = useAuthStore((s) => s.needsUsernameSetup);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          {needsUsernameSetup && (
            <Stack.Screen name="UsernameSetup" component={UsernameSetupScreen} />
          )}
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="BookDetail"
            component={BookDetailScreen}
            options={{ headerShown: true, title: 'Detalle' }}
          />
          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
            options={{ headerShown: true, title: 'Quiz' }}
          />
          <Stack.Screen
            name="QuizResult"
            component={QuizResultScreen}
            options={{ headerShown: true, title: 'Resultado' }}
          />
          <Stack.Screen
            name="UserProfile"
            component={UserProfileScreen}
            options={{ headerShown: true, title: 'Perfil' }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
}
