import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, View } from "react-native";

const SearchBar = ({ placeholder = "Search guitars..." }) => {
  

  return (
    <View className="mt-5 bg-white flex-row items-center rounded-full px-4 py-2 shadow">
      <Ionicons name="search" size={20} color="#9ca3af" />
      <TextInput
        className="flex-1 ml-2 text-gray-800"
        placeholder={placeholder}
        value=""
        onChangeText={() => {}}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );
};

export default SearchBar;
