import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Platform, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, { useState, useRef } from 'react'
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const CustomerSupport = () => {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      timestamp: '10:30 AM',
      isUser: false,
      sender: 'Admin'
    }
  ])

  const handleBack = () => router.back()

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newUserMessage = {
      id: messages.length + 1,
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
      sender: 'You'
    }

    setMessages(prev => [...prev, newUserMessage])
    setMessage('')
    scrollToBottom()

    // Mock admin reply after 2 seconds
    setTimeout(() => {
      const adminReply = {
        id: messages.length + 2,
        text: 'Thanks for your message. How can I assist you further?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        sender: 'Admin'
      }
      setMessages(prev => [...prev, adminReply])
      scrollToBottom()
    }, 2000)
  }

  return (
    
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
      {/* Header - Outside KeyboardAvoidingView so it stays fixed */}
      
<View className="flex-row items-center bg-white px-4 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={handleBack} className="p-2 mr-3">
          <MaterialCommunityIcons name="chevron-left" size={30} color="#1a1a1a" /> 
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-black">Customer Support</Text>
          <Text className="text-sm text-green-600">Admin • Online</Text>
        </View>
      </View>
      {/* Only the chat area and input should move with keyboard */}
    <KeyboardAvoidingView
        className="flex-1"
       
        keyboardVerticalOffset={60}
       
      >
        {/* Chat Messages */}
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 bg-gray-100" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16 }}
          onContentSizeChange={scrollToBottom}
        >
          <View className="px-4">
            {messages.map((msg) => (
              <View key={msg.id} className={`mb-4 ${msg.isUser ? 'items-end' : 'items-start'}`}>
                <View 
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.isUser 
                      ? 'bg-sky-400' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <Text className={`text-sm font-medium mb-1 ${msg.isUser ? 'text-blue-100' : 'text-gray-600'}`}>
                    {msg.sender}
                  </Text>
                  <Text className={`text-base ${msg.isUser ? 'text-white' : 'text-gray-800'}`}>
                    {msg.text}
                  </Text>
                  <Text className={`text-xs mt-1 ${msg.isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Message Input */}
        <View className="bg-white border-t border-gray-200 pt-4 px-4 pb-7">
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 border border-gray-300 rounded-full px-4 py-3 mr-2 text-base text-gray-800 bg-white"
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              onFocus={scrollToBottom}
              onSubmitEditing={handleSendMessage}
              blurOnSubmit={false}
            />
            <TouchableOpacity 
              className={`w-12 h-12 rounded-full items-center justify-center ${
                message.trim() ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Feather name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default CustomerSupport