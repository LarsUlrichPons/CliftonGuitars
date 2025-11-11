import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
  Linking, // ⭐️ Import Linking API
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



const CONTACT_INFO = [
  { 
    label: "Call us", 
    value: "+639455279009", // Cleaned number for tel: link
    icon: "call-outline", 
    library: Ionicons 
  },
  { 
    label: "Email us", 
    value: "cliftonuitars123@Gmail.com", 
    icon: "mail-outline", 
    library: Ionicons 
  },
  { 
    label: "Facebook", 
    value: "CliftonGuitars", // Just the page handle
    icon: "logo-facebook", 
    library: Ionicons 
  },
];

const ContactUs = () => {
  const router = useRouter();
  
  // Dynamic top padding calculation for header consistency
  const HEADER_TOP_PADDING = Platform.OS === 'android' ? (StatusBar.currentHeight || 50) + 10 : 60;
  
  // ⭐️ UPDATED: Function to handle deep linking for external apps
  const handleAction = async (label: string, value: string) => {
    let url = '';

    switch (label) {
      case "Call us":
        url = `tel:${value}`;
        break;
      case "Email us":
        url = `mailto:cliftonguitars123@gmail.com`;
        break;
      case "Facebook":
        // Use the Facebook URL scheme or fallback to HTTPS link
        url = `https://web.facebook.com/CliftonGuitars`;
        break;
      default:
        return;
    }

    try {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else if (label === "Facebook") {
            // Fallback for Facebook if app scheme isn't supported (e.g., if app is not installed)
            await Linking.openURL(`https://www.facebook.com/${value}`);
        } else {
            alert(`Cannot open link for ${label}.`);
        }
    } catch (error) {
        console.error("Failed to open URL:", error);
        alert(`An error occurred while trying to open ${label}.`);
    }
  };

  const ContactLink = ({ label, value, icon, library: IconComponent }: any) => (
    <TouchableOpacity
      className="flex-row items-center justify-between bg-white px-4 py-4 border-b border-gray-100 last:border-b-0"
      onPress={() => handleAction(label, value)}
    >
      <View className="flex-row items-center">
        <View className="p-2 mr-4 rounded-full bg-gray-100">
            <IconComponent name={icon} size={24} color="#1A1A1A" />
        </View>
        <View>
            <Text className="text-base font-semibold text-black">{label}</Text>
            <Text className="text-sm text-gray-600">{value}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="flex-1 bg-gray-200">
        
        {/* === HEADER (Consistent Style) === */}
        <View 
          style={{ paddingTop: HEADER_TOP_PADDING }} 
          className="flex-row items-center justify-start bg-white px-4 py-4 border-b border-gray-200 shadow-md" 
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 mr-3" 
          >
            <MaterialCommunityIcons name="chevron-left" size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
        
        <ScrollView className="flex-1 pt-4">
          
          {/* === Main Contact Card === */}
          <View className="bg-white mx-4 p-4 rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <Text className="text-2xl font-bold text-gray-800 mb-2">Contact Us</Text>
            <Text className="text-xs text-gray-600 mb-6">
              Dont hesitate to contact us whether you have a suggestion on our improvement, a complaint to discuss or an issue to solve.
            </Text>

            {/* Contact Links */}
            {CONTACT_INFO.map((item, index) => (
                <ContactLink
                    key={index}
                    label={item.label}
                    value={item.value}
                    icon={item.icon}
                    library={item.library}
                />
            ))}
            
            {/* Customer Support Hours */}
            <View className="mt-6">
                <Text className="text-sm font-semibold text-black mb-1">Customer Support Hours</Text>
                <Text className="text-sm text-red-600 font-bold">
                    Mon-Sat: 8AM-6PM | Sun: Closed
                </Text>
            </View>

          </View>
          
          <View className="h-20" /> 
        </ScrollView>
        
      </View>
    </SafeAreaView>
  );
};

export default ContactUs;