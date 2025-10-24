import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";

interface DropdownProps {
  onSelect?: (option: string) => void;
}

export default function BestSellerDropdown({ onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Best Seller");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;

  const options = ["Best Seller", "Newest", "Price: Low to High", "Price: High to Low"];

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    onSelect?.(option);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: isOpen ? 0 : -10,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  return (
    <View className="px-5 mt-8 relative self-start">
      {/* Filter Icon + Label with underline */}
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="flex-row items-center border-b border-gray-300 pb-1 w-fit"
      >
        <MaterialCommunityIcons
          name={isOpen ? "chevron-up" : "filter-menu"}
          size={20}
          color="#9ca3af"
        />
        <Text className="ml-2 text-base font-semibold text-gray-800">
          {selected}
        </Text>
      </Pressable>

      {/* Dropdown List */}
      {isOpen && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="absolute top-10 left-5 bg-white rounded-lg shadow-lg border border-gray-100 z-10 w-52"
        >
          {options.map((option, index) => (
            <Pressable
              key={index}
              onPress={() => handleSelect(option)}
              className="px-4 py-3 border-b border-gray-100 active:bg-gray-100"
            >
              <Text
                className={`${
                  selected === option
                    ? "text-primary font-semibold"
                    : "text-gray-700"
                }`}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </Animated.View>
      )}
    </View>
  );
}
